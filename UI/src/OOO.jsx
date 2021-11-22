import { SocketContext } from "./context/socket";
import { useEffect, useState, useContext } from "react";
import {
  Container,
  Input,
  IconButton,
  Button,
  Flex,
  Heading,
  Icon,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
function OOO({ ident }) {
  const [roomNum, setRoomNum] = useState();
  const [oooState, setOOOState] = useState({});
  const [messageContent, setMessageContent] = useState("");
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("ooo:roomnumber", function (roomNum) {
      setRoomNum(roomNum)
      socket.on(roomNum + ":updateState", function(newState) {
        setOOOState(newState)
      })
    });
  }, []);

  function send() {
    socket.emit("ooo:send_msg", messageContent, roomNum);
    setMessageContent("");
  }

  function backToLobby() {
    socket.emit("modeChange", "lobby")
  }

  return (
    <Container>
      <Flex>
        <Button onClick={backToLobby}>Back</Button>
        <Heading size="lg">
          OOO
        </Heading>
      </Flex>
      <div>
        <List spacing={3}>
          {
            oooState?.events?.map(event => {
              return <ListItem textAlign="center">{JSON.stringify(event)}</ListItem>
            })
          }
        </List>

        <Flex>
          <IconButton
            aria-label="Change Icon"
            icon={
              <span style={{ fontSize: "2rem", padding: "0 0.5rem" }}>
                {ident.emoji}
              </span>
            }
          />
          <Input
            flex="1"
            mx="2"
            placeholder="Basic usage"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
          <Button onClick={send}>Send</Button>
        </Flex>
      </div>
    </Container>
  );
}

export default OOO;
