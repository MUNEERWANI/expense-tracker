import './App.css';
import { Route,Routes } from 'react-router-dom';
import Home from './components/home/Home';
import AuthContextProvider from './store/AuthContextProvider.js';
import UpdateProfile from './components/Auth/UpdateProfile';
import CompleteProfile from './components/Auth/CompleteProfile';

function App() {
  return (
    <AuthContextProvider >
    <Routes>
        <Route path="/" element={<Home />}/>
        <Route path='/updateprofile' element={<UpdateProfile />} />
        <Route path='/completeprofile' element={<CompleteProfile />} />

      </Routes>
    </AuthContextProvider>
      
  );
}

export default App;
