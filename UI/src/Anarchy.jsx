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
function Anarchy({ ident }) {
  const [anarchyState, setAnarchyState] = useState({});
  const [messageContent, setMessageContent] = useState("");
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("anarchy:updateState", function (state) {
      setAnarchyState(state);
    });
  }, []);

  function send() {
    socket.emit("anarchy:send_msg", messageContent);
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
          Big 'ol Groupchat - {anarchyState?.userCount || "..."} user(s)
        </Heading>
      </Flex>
      <div>
        <List spacing={3}>
          {
            anarchyState?.events?.map(event => {
              if (event.type == "user entered") {
                return <ListItem textAlign="center">{event.name} has entered the room.</ListItem>
              }

              if (event.type == "user left") {
                return <ListItem textAlign="center">{event.name} has left the room.</ListItem>
              }

              if (event.type == "message") {
                return <ListItem>{event.user} {event.message}</ListItem>
              }
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

export default Anarchy;
