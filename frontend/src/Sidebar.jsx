import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidV1 } from "uuid";

function Sidebar() {

    const { allThreads, setAllThreads, currThreadId, setCurrThreadId, setNewChat, setPrompt, setReply, setPrevChats } = useContext(MyContext);

    const getALLThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filterdata = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            console.log(filterdata);
            setAllThreads(filterdata);
        } catch (err) {
            console.log(err);
        }

    };

    useEffect(() => {
        getALLThreads();

    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidV1());
        setPrevChats([]);
    }

    const changeThread = async (newthreadId) => {
        setCurrThreadId(newthreadId);
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newthreadId}`);
            const res = await response.json();
            console.log(res);
            const threadData = Array.isArray(res) ? res : (res.messages || res.chats || []);
            setPrevChats(threadData);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.log(err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            //updated thread re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId==currThreadId){
                createNewChat();
            }

        } catch (err) {
            console.log(err);
        }
    }


    return (
        <section className="sidebar">
            {/* new chat button*/}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt-logo" className="logo"></img>
                <span> <i class="fa-solid fa-pen-to-square"></i></span>

            </button>


            {/* history */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                         onClick={(e) => changeThread(thread.threadId)}
                         className={thread.threadId === currThreadId ? "highlighted": ""}
                         >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); //stop event bubbling
                                    deleteThread(thread.threadId);
                                }}></i>
                        </li>
                    ))
                }
            </ul>


            {/* sign */}
            <div className="sign">
                <p>By ApnaCollege &hearts;</p>
            </div>

        </section>
    );
}

export default Sidebar;