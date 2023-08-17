import './App.css';
import { Route,Routes } from 'react-router-dom';
import Home from './components/home/Home';
import AuthContextProvider from './store/AuthContextProvider.js';
import UpdateProfile from './components/profile/UpdateProfile';
import CompleteProfile from './components/profile/CompleteProfile';
import AuthPasswordChange from './components/Auth/AuthPasswordChange';
import Expenses from './components/expenses/Expenses';
import { useContext } from 'react';
import AuthContext from './store/AuthContext';


function App() {
  const authCtx=useContext(AuthContext);


  const isLogin=authCtx.login;
  return (
    <AuthContextProvider >
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path='/expenses' element={<Expenses />} />
        <Route path='/updateprofile' element={<UpdateProfile />} />
        <Route path='/completeprofile' element={<CompleteProfile />} />
        <Route path='/authpasswordchange' element={<AuthPasswordChange />} />
        <Route path='/updateprofile' element={<UpdateProfile />} />
        <Route path='/expenses' element={<Expenses />} />
      </Routes>   
    </AuthContextProvider>
  );
}

export default App;
