import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/socket";
import { useParams } from "react-router-dom";

const VideoCall = () => {
  const { roomId } = useParams();
  const { socket } = useSocket();
  const localVideoRef = useRef(null);
  const peersRef = useRef({});
  const [stream, setStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});

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
    return () => endCall();
  }, []);

  useEffect(() => {
    if (!stream || !socket) return;

    socket.emit("join", { roomId });

    socket.on("all-users", async (users) => {
      for (const userId of users) {
        await createOffer(userId);
      }
    });

    socket.on("user-joined", async (userId) => {
      console.log("🔔 User joined:", userId);
    });

    socket.on("offer", async ({ sdp, sender }) => {
      const peer = createPeer(sender);
      await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("answer", { target: sender, sdp: peer.localDescription });
    });

    socket.on("answer", async ({ sdp, sender }) => {
      const peer = peersRef.current[sender];
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      }
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
        setRemoteStreams((prev) => {
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
  }, [stream, socket]);

  const createPeer = (userId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          target: userId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [userId]: event.streams[0],
      }));
    };

    peersRef.current[userId] = peer;
    return peer;
  };

  const createOffer = async (userId) => {
    const peer = createPeer(userId);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket.emit("offer", { target: userId, sdp: offer });
  };

  const endCall = () => {
    Object.values(peersRef.current).forEach((peer) => peer.close());
    peersRef.current = {};
    setRemoteStreams({});
    if (localVideoRef.current?.srcObject) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }
  };

  return (
    <div className="video-container">
      <video ref={localVideoRef} autoPlay muted className="local-video" />
      {Object.entries(remoteStreams).map(([id, stream]) => (
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
