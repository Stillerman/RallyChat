import { SocketContext } from './context/socket';
import { useEffect, useState, useContext } from 'react';

function Anarchy() {
  const [hist, setHist] = useState([])
  const [ident, setIdent] = useState("No")
  const [messageContent, setMessageContent] = useState("")
  const [chatMembers, setChatMemers] = useState([])

  const socket = useContext(SocketContext);

  useEffect(() => {

    socket.on('chat hist', function (hist) {
      setHist(hist)
    });

    socket.on("members", mems => {
      setChatMemers(mems)
    })

    socket.on("set ident", function (newIdent) {
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
    <div className="App chat">
      <p>{chatMembers.join(", ")}</p>
      <ul id="messages">
        {
          hist.map(entry => <li>
            <div className={(entry.user == ident ? "mine" : "yours") + " messages"}>
              {entry.user}
              <div className="message last">
                {entry.message}
              </div>
            </div>
          </li>)
        }
      </ul>
      <form id="form" action="" onSubmit={e => e.preventDefault()}>
        <span id="identity" style={{ fontSize: "2rem", padding: "0 0.5rem" }} onClick={newIdent}>{ident}</span>
        <input id="input" autocomplete="off" value={messageContent} onChange={e => setMessageContent(e.target.value)} />
        <button onClick={send}>Send</button>
      </form>
    </div>
  );
}

export default Anarchy;
