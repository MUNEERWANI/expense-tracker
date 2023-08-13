import './App.css';
import { Route,Routes } from 'react-router-dom';
import Home from './components/home/Home';
import AuthContextProvider from './store/AuthContextProvider.js';

function App() {
  return (
    <AuthContextProvider >
    <Routes>
        <Route path="/" element={<Home />}/>

      </Routes>
    </AuthContextProvider>
      
  );
}

export default App;
