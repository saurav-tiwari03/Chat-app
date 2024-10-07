import {io} from 'socket.io-client'
export default function App() {
  const socket = io('http://localhost:3000')
  return (
    <div>
      <p className="text-3xl text-center">App start</p>
    </div>
  )
}
