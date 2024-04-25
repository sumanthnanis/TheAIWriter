import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import log from './img/log.svg';
import register from './img/register.svg';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate(); 

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'nani' && password === '123') {
      setLoggedIn(true);
      navigate('/home'); 
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form action="#" className={`sign-in-form ${isSignUp ? "hidden" : ""}`} onSubmit={handleLogin}>
            <h2 className="title">Log In</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>
          <form action="#" className={`sign-up-form ${isSignUp ? "" : "hidden"}`}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username" />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" className="btn" value="Sign up" />
          </form>
          {registrationSuccess && <p>User created successfully!</p>}
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here ?</h3>
            <p>
              Come on!!! Join us in this exciting journey of changing the world
              of security and writing research papers
            </p>
            <button className="btn transparent" onClick={toggleSignUp}>Sign up</button>
          </div>
          <img src={log} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us ?</h3>
            <p>
              Come on!!! Join us in this exciting journey of changing the world
              of security and writing research papers
            </p>
            <button className="btn transparent" onClick={toggleSignUp}>Log In</button>
          </div>
          <img src={register} className="image" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Login;
