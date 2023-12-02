import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import "./styles.css";
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";
import PrivateRoutes from './utils/PrivateRoutes';
import { useState } from 'react';
import Landing from './pages/Landing';

function App() {

  const [userData, setUserData] = useState(1);

  return (  
    <Router>
      <Routes>
        <Route element={<PrivateRoutes userData={userData} />}>
          <Route path="/user" element={<UserPage userData={userData} setUserData={setUserData} />}></Route>
          <Route path="/home" element={<HomePage userData={userData} setUserData={setUserData} />}></Route>
        </Route>
        <Route path="/login" element={<Login setUserData={setUserData} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/" element={<Landing />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
