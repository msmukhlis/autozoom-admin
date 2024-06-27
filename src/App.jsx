import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './components/login/Login';
import { ToastContainer } from 'react-toastify';
import 'antd/dist/reset.css';
import Home from './components/pages/home/Home';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
