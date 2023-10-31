import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import "./styles.css";
import HomePage from './pages/HomePage';
import Login from "./pages/Login";
import UserPage from "./pages/UserPage";

function App() {
  return (  
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/user" element={<UserPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
