
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SocketProvider } from './providers/socket.jsx'
createRoot(document.getElementById('root')).render(
 <SocketProvider>
    <App />
    </SocketProvider>
 
)
