import { SocketContext, socket } from './context/socket';
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import Anarchy from './Anarchy';
import theme from './theme'

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <ChakraProvider theme={theme}>
        <Anarchy />
      </ChakraProvider>
    </SocketContext.Provider>
  );
}

export default App;
