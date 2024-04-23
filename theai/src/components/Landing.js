import React, { useEffect,useState } from 'react';
import {NavLink} from 'react-router-dom'
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import logo from './img/logoo.svg';

import './styles.css'

function Landing() {
  const [menuOpen,setMenuOpen] =useState(false)
  useEffect(() => {

    gsap.registerPlugin(ScrollTrigger);

    function videoconAnimation() {
      const videocon = document.querySelector("#page1");
      const playbtn = document.querySelector("#play");

      videocon.addEventListener("mouseenter", function () {
        gsap.to(playbtn, {
          scale: 1,
          opacity: 1,
        });
      });

      videocon.addEventListener("mouseleave", function () {
        gsap.to(playbtn, {
          scale: 0,
          opacity: 0,
        });
      });

      document.addEventListener("mousemove", function (dets) {
        gsap.to(playbtn, {
          left: dets.x - 70,
          top: dets.y - 80,
        });
      });
    }

    function animatePageElements() {
      gsap.to("#nav-part2 #links", {
        transform: "translateY(-100%)",
        opacity: 0,
        scrollTrigger: {
          trigger: "#page1",
          scroller: "#main",
          start: "top 0",
          end: "top -5%",
          scrub: true,
        },
      });

      gsap.from("#page1 h1", {
        scale: 0.9,
        opacity: 0,
        delay: 0.5,
        duration: 0.5,
        stagger: 0.3
      });
    }

    videoconAnimation();
    animatePageElements();
  }, []);


  return (
    <div>
      <div id="nav">
        <img className="logo" src={logo} alt="logo" />
        <div className='menu' onClick={()=>{
          setMenuOpen(!menuOpen)
        }}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div  id="nav-part2">
          <div id="links">
           <ul className={menuOpen ? "open" :""}>
           <li><NavLink to='/login' className="button">Login</NavLink></li>
          <li> <NavLink to='/home' className="button">home</NavLink></li>
            </ul>
          </div>
        </div>
      </div>

      <div id="main">
        <div id="page1">
          <div id="play">Hello</div>
          <h1 className="header">CHANGE</h1>
          <h1 className="header">THE COURSE</h1>
          <div id="about">
          <h1 className="about-section"> What we do</h1>
          <p class="content">"We specialize in providing a secure and efficient platform for accessing research papers 
            through cutting-edge technologies. Our website utilizes Secure Remote Password (SRP) 
            authentication to ensure the confidentiality and integrity of user credentials, offering 
            a robust layer of protection against unauthorized access.

Additionally, we harness the power of artificial intelligence through our proprietary
 Agents of genAI system to generate high-quality research papers. Our AI agents are trained on vast 
 datasets and employ advanced natural language processing techniques to create insightful and coherent
  papers on a wide range of topics</p>
        </div>
        </div>
        
      </div>
    </div>
  );
}

export default Landing;
