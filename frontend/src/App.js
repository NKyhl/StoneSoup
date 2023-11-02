import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import "./styles.css";
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";
import PrivateRoutes from './utils/PrivateRoutes';
import { useState } from 'react';

function App() {

  const [userID, setUserID] = useState(1);

  return (  
    <Router>
      <Routes>
        <Route element={<PrivateRoutes userID={userID} />}>
          <Route path="/user" element={<UserPage userID={userID} />}></Route>
          <Route path="/home" element={<HomePage userID={userID} />}></Route>
        </Route>
        <Route path="/login" element={<Login setUserID={setUserID} />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
