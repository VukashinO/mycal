import React from 'react';
import fitnesImg from '../../Components/Assets/images/bg2.jpg';
import './LandingPage.css';


const landingPage = () => {
    return ( 
        <div className="landing">
           <img src={fitnesImg} alt="fitnessImg"/>
           <h2>welcome to my fitness App do you have acc?</h2>
        </div>
     );
}
 
export default landingPage;