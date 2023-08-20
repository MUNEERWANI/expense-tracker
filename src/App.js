import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import UpdateProfile from './components/profile/UpdateProfile';
import CompleteProfile from './components/profile/CompleteProfile';
import AuthPasswordChange from './components/Auth/AuthPasswordChange';
import Expenses from './components/expenses/Expenses';
import { useSelector } from 'react-redux';
import Header from './components/navigation/Header';
import { Fragment } from 'react';
 
function App() {
  const darkMode=useSelector(state=>state.darkMode)
  const themeMode=darkMode.isDarkMode
  return (
    <div className={!themeMode?'lightMode':'darkMode'}>
      <Fragment >
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/expenses' element={<Expenses />} />
          <Route path='/updateprofile' element={<UpdateProfile />} />
          <Route path='/completeprofile' element={<CompleteProfile />} />
          <Route path='/authpasswordchange' element={<AuthPasswordChange />} />
          <Route path='/updateprofile' element={<UpdateProfile />} />
          <Route path='/expenses' element={<Expenses />} />
        </Routes>
      </Fragment>
    </div>

  );
}

export default App;
