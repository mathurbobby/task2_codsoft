import './App.css';
import Home from './Screen/Home';
import Project from './Screen/Project';
import User from './Screen/User';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Routes, Route} from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<User />} />
      <Route path='/user/:userId' element={<Home />} />
      <Route path='/:userId/:pId' element={<Project />} />
    </Routes>
    <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;
