import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {useIdleTimer} from 'react-idle-timer';
import Cookies from 'js-cookie';
import Login from './components/login';
import SignUp from './components/signup.component';
import AppManager from './components/appManager';
import Logout from './components/Logout';

function App() {
 
  //const navigate = useNavigate();

  const handleOnIdle = event => {
    console.log("- idle --");
    console.log('user is idle', event);
    console.log('last active', getLastActiveTime());
    Cookies.remove('state');
    localStorage.clear();
    //navigate('/logout');
    window.location.href = "/logout";
  }

  const {getLastActiveTime} = useIdleTimer({
    timeout: 100 * 60 * 15,
    onIdle: handleOnIdle,
    debounce: 500
  });

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/sign-in'}>
              cloudRocker
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/appManager" element={<AppManager />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}
export default App