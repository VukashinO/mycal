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
               <h1 className="marginElements">CalorieCounter</h1>
               <h3 className="marginElements">count your daily calories?</h3>
               <h3 className="marginElements">track and calculate your food</h3>
               <h3 className="marginElements">make acc if u dont have one</h3>
               <div style={{marginTop:'25px'}}>
               <Link to={ROUTES.SIGN_IN} style={{fontSize:'20px',color:'#1e7a7a'}}>sign in</Link>
               <Link to={ROUTES.SIGN_UP} style={{marginLeft:'10px', fontSize:'20px',color:'#1e7a7a'}}>sign up</Link>  
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

