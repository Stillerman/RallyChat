import { SocketContext, socket } from './context/socket';
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import Lobby from './Lobby'
import theme from './theme'

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <ChakraProvider theme={theme}>
        <Lobby />
      </ChakraProvider>
    </SocketContext.Provider>
  );
}

export default App;
