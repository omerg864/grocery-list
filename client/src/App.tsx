import './App.css';
import { ToastContainer } from 'react-toastify';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import List from './pages/List.tsx';
import NavBar from './components/NavBar/NavBar.tsx';
import { useState } from 'react';
import Lists from './pages/Lists.tsx';

function App() {

  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <>
    <ToastContainer theme="colored" />
    <Router>
      <Routes>
        <Route path="/" element={<Lists />} />
        <Route path="/lists/:id" element={<List />} />
      </Routes>
      <NavBar setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
    </Router>
    </>
  )
}

export default App
