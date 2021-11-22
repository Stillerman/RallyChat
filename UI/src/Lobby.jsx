import { Button, Container, Heading, Flex } from "@chakra-ui/react"
import { useContext, useState, useEffect } from "react";
import { SocketContext } from "./context/socket";
import Anarchy from './Anarchy'
import OOO from './OOO'

const Lobby = () => {

  const socket = useContext(SocketContext);

  const [lobState, setLobState] = useState([])
  const [ident, setIdent] = useState({})

  useEffect(() => {
    socket.on("lobby:updateState", newLobState => {
      setLobState(newLobState)
    })

    socket.on("set ident", function (newIdent) {
      setIdent(newIdent)
    })
  }, [])


  function changeMode(newMode) {
    socket.emit("modeChange", newMode)
  }
  
  if (ident.mode == "lobby") {
    return <Container>
    <Heading size='lg'>RallyChat Lobby ({lobState.userCount})</Heading>
    <Flex direction="column">
      <Heading size="md">Hello, {ident.emoji}</Heading>
      <Button my="2" onClick={() => changeMode("anarchy")}>Big 'ol Group Chat</Button>
      <Button my="2" onClick={() => changeMode("ooo")}>One-on-one Chat</Button>
      <Button my="2" onClick={() => changeMode("ss")}>Secret Surresh</Button>
    </Flex>
  </Container>
  }

  if (ident.mode == "anarchy") {
    return <Anarchy ident={ident} />
  }

  if (ident.mode == "ooo") {
    return <OOO ident={ident} />
  }

  else {
    return <p>{ident.mode}</p>
  }
}


export default Lobby