import React from 'react';
import fitnesImg from '../../Components/Assets/images/bg2.jpg';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Constants/Routes';

const landingPage = () => {
    return ( 
        <div className="row">
            <div className="col headerHome">
            <div className="divWrapper">
               <h3>CalorieCounter aplication</h3>
               <h4>do you want to count your daily calories?</h4>
               <h4>make acc if u dont have one</h4>
               <div style={{marginTop:'25px'}}>
               <Link to={ROUTES.SIGN_IN} style={{fontSize:'20px'}}>sign in</Link>
               <Link to={ROUTES.SIGN_UP} style={{marginLeft:'10px', fontSize:'20px'}}>sign up</Link>  
               </div>
            </div>
            </div>
            <div className="col fImg">
               <img src={fitnesImg} alt="fitnessImg" />
            </div>
        </div>
     );
}
 
export default landingPage;