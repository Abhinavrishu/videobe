import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/socket";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const localVideoRef = useRef(null);
  const [remoteVideos, setRemoteVideos] = useState({});
  const peersRef = useRef({});
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const init = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream;
      setStream(localStream);
    };

    init();

    return () => {
      endCall();
    };
  }, []);

  useEffect(() => {
    if (!stream) return;

    socket.emit("join", { roomId });

    socket.on("all-users", async (users) => {
      for (const userId of users) {
        await createInitiatorPeer(userId);
      }
    });

    socket.on("user-joined", async (userId) => {
      console.log("User joined:", userId);
      // wait for offer
    });

    socket.on("offer", async ({ sdp, sender }) => {
      const peer = await createReceiverPeer(sender);
      await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", { target: sender, sdp: peer.localDescription });
    });

    socket.on("answer", async ({ sdp, sender }) => {
      const peer = peersRef.current[sender];
      if (peer) await peer.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("ice-candidate", async ({ candidate, sender }) => {
      const peer = peersRef.current[sender];
      if (peer && candidate) {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on("user-left", (userId) => {
      if (peersRef.current[userId]) {
        peersRef.current[userId].close();
        delete peersRef.current[userId];
        setRemoteVideos((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    });

    return () => {
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
    };
  }, [stream]);

  const createInitiatorPeer = async (userId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { target: userId, candidate: e.candidate });
      }
    };

    peer.ontrack = (event) => {
      setRemoteVideos((prev) => ({
        ...prev,
        [userId]: event.streams[0],
      }));
    };

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("offer", { target: userId, sdp: offer });
    peersRef.current[userId] = peer;
  };

  const createReceiverPeer = async (userId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { target: userId, candidate: e.candidate });
      }
    };

    peer.ontrack = (event) => {
      setRemoteVideos((prev) => ({
        ...prev,
        [userId]: event.streams[0],
      }));
    };

    peersRef.current[userId] = peer;
    return peer;
  };

  const endCall = () => {
    Object.values(peersRef.current).forEach((peer) => peer.close());
    peersRef.current = {};
    setRemoteVideos({});
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) =>
        track.stop()
      );
      localVideoRef.current.srcObject = null;
    }
  };

  return (
    <div className="video-container">
      <video ref={localVideoRef} autoPlay muted className="local-video" />
      {Object.entries(remoteVideos).map(([id, stream]) => (
        <video
          key={id}
          autoPlay
          playsInline
          ref={(video) => {
            if (video && stream) video.srcObject = stream;
          }}
          className="remote-video"
        />
      ))}
      <button onClick={endCall} className="cut-button">
        End Call
      </button>
    </div>
  );
};

export default VideoCall;
