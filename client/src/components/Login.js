import React, { useState } from "react";
import "./Login.css";
import log from "./img/log.svg";
import register from "./img/register.svg";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  async function registeUser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
        role,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data.status === "ok") {
      navigate("/home", { state: data });
    }
  }

  async function loginuser(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (data.token) {
      navigate("/home", { state: data });
    } else {
      setMessage("Please check your email and password");
    }
  }

  return (
    <div className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form
            onSubmit={loginuser}
            className={`sign-in-form ${isSignUp ? "hidden" : ""}`}
            id="form"
          >
            <h2 className="title">Log In</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {message === "" ? null : <p>{message}</p>}
            <input type="submit" value="Login" className="cbutton solid" />
          </form>
          <form
            id="form"
            onSubmit={registeUser}
            className={`sign-up-form ${isSignUp ? "" : "hidden"}`}
          >
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-field">
              <i className="fas fa-user-tag"></i>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="" disabled>
                  Select a role
                </option>
                <option value="user">User</option>
                <option value="author">Author</option>
              </select>
            </div>
            <input type="submit" className="cbutton" value="Sign up" />
          </form>
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
            <button className="cbutton transparent" onClick={toggleSignUp}>
              Sign up
            </button>
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
            <button className="cbutton transparent" onClick={toggleSignUp}>
              Log In
            </button>
          </div>
          <img src={register} className="image" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
