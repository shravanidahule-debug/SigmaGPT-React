import { useState } from 'react'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from './MyContext.jsx';
import {v1 as uuidV1} from "uuid";
import './App.css';


function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidV1());
  const [prevChats, setPrevChats] = useState([]);//stores all chats of curr thread
  const[newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);


  const providerValues = {
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    prevChats,setPrevChats,
    newChat,setNewChat,
    allThreads,setAllThreads,
  };

  return (
    <div className='main'>
    <MyContext.Provider value={providerValues} >
    <Sidebar></Sidebar>
    <ChatWindow></ChatWindow>
    </MyContext.Provider>
    </div>
  );
}

export default App
