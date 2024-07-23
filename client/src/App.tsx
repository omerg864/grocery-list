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
import Selection from './pages/Selection.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import Bundles from './pages/Bundles.tsx';
import ItemDisplay from './pages/ItemDisplay.tsx';
import ItemEdit from './pages/ItemEdit.tsx';
import ItemNew from './pages/ItemNew.tsx';
import BundleEdit from './pages/BundleEdit.tsx';
import BundleNew from './pages/BundleNew.tsx';
import BundleDisplay from './pages/BundleDisplay.tsx';
import JoinList from './pages/JoinList.tsx';
import ShareBundle from './pages/ShareBundle.tsx';
import ShareItem from './pages/ShareItem.tsx';
import BundleSelect from './pages/BundleSelect.tsx';
import ItemSelect from './pages/ItemSelect.tsx';
import BundleAdd from './pages/BundleAdd.tsx';
import ItemAdd from './pages/ItemAdd.tsx';

function App() {

  const getSelectedTab = () => {
    const path = window.location.pathname.split('/')[1];
    switch(path) {
      case '':
        return 0;
      case 'lists':
          return 0;
      case 'bundles':
        return 2;
      case 'notifications':
        return 3;
      case 'profile':
        return 4;
      case 'items':
        return 1;
      default:
        return 5;
    }
  }

  const [selectedTab, setSelectedTab] = useState<number>(getSelectedTab());

  return (
    <>
    <ToastContainer theme="colored" />
    <Router>
      <Routes>
        {/* lists routes */}
        <Route path="/" element={<Lists />} />
        <Route path="/lists/new" element={<NewList />} />
        <Route path="/lists/:id" element={<List />} />
        <Route path="/lists/:id/item/:item" element={<ItemDisplay />} />
        <Route path="/lists/:id/item/:item/edit" element={<ItemEdit />} />
        <Route path="/lists/:id/select" element={<Selection />} />
        <Route path="/lists/:id/select/bundle" element={<BundleSelect />} />
        <Route path="/lists/:id/select/item" element={<ItemSelect />} />
        <Route path="/lists/:id/add/item/:item" element={<ItemAdd />} />
        <Route path="/lists/:id/new/item" element={<ItemNew />} />
        <Route path="/lists/:id/add/bundle/:bundle" element={<BundleAdd />} />
        {/* items routes */}
        <Route path="/items" element={<Items />} />
        <Route path="/items/new" element={<ItemNew />} />
        <Route path="/items/:id" element={<ItemDisplay />} />
        <Route path="/items/:id/edit" element={<ItemEdit />} />
        {/* bundles routes */}
        <Route path="/bundles" element={<Bundles />} />
        <Route path="/bundles/new" element={<BundleNew />} />
        <Route path="/bundles/new/items" element={<ItemSelect />} />
        <Route path="/bundles/:id" element={<BundleDisplay />} />
        <Route path="/bundles/:id/edit" element={<BundleEdit />} />
        <Route path="/bundles/:id/edit/items" element={<ItemSelect />} />
        <Route path="/bundles/:id/edit/item/:item" element={<ItemDisplay />} />
        <Route path="/bundles/:id/item/:item" element={<ItemDisplay />} />
        {/* share routes */}
        <Route path="/join/:id" element={<JoinList />} />
        <Route path="/share/bundle/:id" element={<ShareBundle />} />
        <Route path="/share/item/:id" element={<ShareItem />} />
        {/* notifications routes */}
        <Route path="/notifications" element={<Notifications />} />
        {/* profile routes */}
        <Route path="/profile" element={<Profile />} />
        {/* authentication routes */}
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
