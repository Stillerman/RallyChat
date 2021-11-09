import logo from './logo.svg';
import socketIOClient from "socket.io-client";
import { useEffect, useState } from 'react';

function App() {
  const [hist, setHist] = useState([])
  const [ident, setIdent] = useState("No")
  const [messageContent, setMessageContent] = useState("")
  const [socket, setSocket] = useState()
  const [chatMembers, setChatMemers] = useState([])

  useEffect(() => {
    const socketFresh = socketIOClient();
    setSocket(socketFresh)

    socketFresh.on('chat hist', function (hist) {
      setHist(hist)
    });

    socketFresh.on("members", mems => {
      setChatMemers(mems)
    })

    socketFresh.on("set ident", function(newIdent) {
      setIdent(newIdent)
    })

  }, [])

  function send() {
    socket.emit("chat message", messageContent)
    setMessageContent("")
  }

  function newIdent() {
    socket.emit("new ident")
  }

  return (
    <div className="App">
      <p>{chatMembers.join(", ")}</p>
      <ul id="messages">
        {
          hist.map(entry => <li>
            {entry.user}: {entry.message}
          </li>)
        }
      </ul>
      <form id="form" action="" onSubmit={e => e.preventDefault()}>
        <span id="identity" style={{fontSize: "2rem", padding: "0 0.5rem"}} onClick={newIdent}>{ident}</span>
        <input id="input" autocomplete="off" value={messageContent} onChange={e => setMessageContent(e.target.value)} />
        <button onClick={send}>Send</button>
      </form>
    </div>
  );
}

export default App;
