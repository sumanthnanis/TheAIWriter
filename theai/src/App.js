
import Login from './components/Login'
import Home from './components/Home'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css';
import Landing from './components/Landing';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element={<Home/>} />
    </Routes>
    </BrowserRouter>

  );
}

export default App;
