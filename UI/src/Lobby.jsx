import { Button, Container, Heading, Flex } from "@chakra-ui/react"
import { useContext, useState, useEffect } from "react";
import { SocketContext } from "./context/socket";
import Anarchy from './Anarchy'

const Lobby = () => {

  const socket = useContext(SocketContext);

  const [members, setMembers] = useState([])
  const [ident, setIdent] = useState({})

  useEffect(() => {
    socket.on("members", mems => {
      setMembers(mems)
    })

    socket.on("set ident", function (newIdent) {
      setIdent(newIdent)
    })
  }, [])


  function changeMode(newMode) {
    socket.emit("change mode", newMode)
  }
  
  if (ident.mode == "lob") {
    return <Container>
    <Heading size='lg'>RallyChat Lobby ({members.length})</Heading>
    <Flex direction="column">
      <Heading size="md">Hello, {ident.emoji}, {ident.mode}</Heading>
      <Button my="2" onClick={() => changeMode("gc")}>Big 'ol Group Chat</Button>
      <Button my="2" onClick={() => changeMode("11")}>One-on-one Chat</Button>
      <Button my="2" onClick={() => changeMode("ss")}>Secret Surresh</Button>
    </Flex>
  </Container>
  }

  if (ident.mode == "gc") {
    return <Anarchy ident={ident} />
  }

  else {
    return <p>{ident.mode}</p>
  }
}


export default Lobby