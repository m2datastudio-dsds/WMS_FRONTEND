import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GoogleMapsProvider from './Pages/Gis Map/GoogleMapsProvider';
import Login from './Pages/Login/Login';
import Gis from './Pages/Gis Map/Gis';
import BlockDiagram from './Pages/Block Diagram/BlockDiagram';
import CWPHTABLE from './Pages/Table/cwphtable';
import RWPHTABLE from './Pages/Table/RWPHTABLE';

function App() {
  return (
    <GoogleMapsProvider>
      <Router>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path="/gis-map" element={<Gis />} />
          <Route path="/rwph-table" element={<RWPHTABLE />} />
          <Route path="/cwph-table" element={<CWPHTABLE />} />
          <Route path="/block-diagram" element={<BlockDiagram />} />
          

        </Routes>
      </Router>
    </GoogleMapsProvider>
  );
}

export default App;
