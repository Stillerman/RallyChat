import { SocketContext, socket } from './context/socket';
import Anarchy from './Anarchy';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <p>Hi</p>
      <Anarchy />
    </SocketContext.Provider>
  );
}

export default App;
