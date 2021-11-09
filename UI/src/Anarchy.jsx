import { SocketContext } from './context/socket';
import { useEffect, useState, useContext } from 'react';
import { Container, Input, IconButton, Button, Flex, useColorMode, Heading } from '@chakra-ui/react';

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
    <Container>
      <Flex>
        <Heading size="lg">Big 'ol Groupchat</Heading>
        {
          chatMembers.map(mem => <span style={{ marginLeft: "1", fontSize: "2rem" }}>{mem}</span>)
        }
      </Flex>
      <div>
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

        <Flex>
          <IconButton
            aria-label="Change Icon"
            onClick={newIdent}
            icon={
              <span style={{ fontSize: "2rem", padding: "0 0.5rem" }}>
                {ident}
              </span>
            }
          />
          <Input flex="1" mx="2" placeholder="Basic usage" value={messageContent} onChange={e => setMessageContent(e.target.value)} />
          <Button onClick={send}>Send</Button>
        </Flex>
      </div>
    </Container>
  );
}

export default Anarchy;
