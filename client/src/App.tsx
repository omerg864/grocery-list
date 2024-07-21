import './App.css';
import { ToastContainer } from 'react-toastify';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import List from './pages/List.tsx';
import NavBar from './components/NavBar/NavBar.tsx';
import { useState } from 'react';
import Lists from './pages/Lists.tsx';
import NewList from './pages/NewList.tsx';
import Notifications from './pages/Notifications.tsx';
import Profile from './pages/Profile.tsx';
import Items from './pages/Items.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import SelectItem from './pages/SelectItem.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';

function App() {

  const getSelectedTab = () => {
    const path = window.location.pathname.split('/')[1];
    switch(path) {
      case '':
        return 0;
      case 'lists':
          return 0;
      case 'notifications':
        return 2;
      case 'profile':
        return 3;
      case 'items':
        return 1;
      default:
        return 4;
    }
  }

  const [selectedTab, setSelectedTab] = useState<number>(getSelectedTab());

  return (
    <>
    <ToastContainer theme="colored" />
    <Router>
      <Routes>
        <Route path="/" element={<Lists />} />
        <Route path="/lists/new" element={<NewList />} />
        <Route path="/lists/:id" element={<List />} />
        <Route path="/lists/:id/selectItem" element={<SelectItem />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/items" element={<Items />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <NavBar setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
    </Router>
    </>
  )
}

export default App
