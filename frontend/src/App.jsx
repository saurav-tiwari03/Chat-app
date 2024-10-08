/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

export default function App() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  
  const socket = io('http://localhost:3000', { autoConnect: false });

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to server');
      console.log('Socket data: ' + socket.id);
    });

    socket.on('welcome-message', (message) => {
      console.log(message);
      setReceivedMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('message', (message) => {
      setReceivedMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      console.log('Submit Data: ' + message);

      socket.emit('message', message);

      setReceivedMessages((prevMessages) => [...prevMessages, `You: ${message}`]);

      setMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p className="text-3xl text-center">Chat App</p>
      <div className='flex items-center justify-center my-4'>
        <form className='flex flex-col m-auto gap-4' onSubmit={submitHandler}>
          <Input
            className='text-xl'
            type="text"
            placeholder='Enter message'
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <Button className='m-auto' type='submit'>Submit</Button>
        </form>
      </div>

      <div className="my-6">
        <h3 className="text-center text-2xl">Messages:</h3>
        <ul className="list-disc mt-4 mx-auto w-1/2">
          {receivedMessages.map((msg, idx) => (
            <li key={idx} className="text-lg">{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
