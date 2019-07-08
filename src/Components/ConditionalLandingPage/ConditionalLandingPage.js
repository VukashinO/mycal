import React from 'react';
import fitnesImg from '../../Components/Assets/images/landing-page-img.png';
import './ConditionalLandingPage.css';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../Constants/Routes';
import { AuthUserContext } from '../Hoc/Hoc';
// import { withRouter } from 'react-router-dom';

const ConditionalLandingPage = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <AuthLandingPage /> : <LandingPage />
            }
        </AuthUserContext.Consumer>
    </div>

);


const LandingPage = () => {
    return (
        <div className="row">
            <div className="col headerHome">
                <div className="divWrapper">
                    <h1>Take control of your goals.</h1>
                    <h1>Track calories.</h1>
                    <p>Count your daily calories wiht Calorie Counter.</p>
                    <p>Track and calculate your food.</p>
                    <p>Make an account if you do not have one. </p>
                    <div style={{textAlign:'left', paddingTop:'15px'}}>
                        <Link className="btn btn-success" to={ROUTES.SIGN_UP} style={{  color: 'white' }}>Get started</Link>
                        <Link className="btn btn-success" to={ROUTES.SIGN_IN} style={{  color: '#28a745', backgroundColor: 'white',marginLeft:'15px' }}>Sign in</Link>
                    </div>
                </div>
                {/* <div className="divWrapper">
                    <h1 className="marginElements">CalorieCounter</h1>
                    <h3 className="marginElements">count your daily calories?</h3>
                    <h3 className="marginElements">track and calculate your food</h3>
                    <h3 className="marginElements">make acc if u dont have one</h3>
                    <div style={{ marginTop: '25px' }}>
                        <Link className="btn btn-success" to={ROUTES.SIGN_IN} style={{ fontSize: '20px', color: 'white' }}>sign in</Link>
                        <Link className="btn btn-success" to={ROUTES.SIGN_UP} style={{ marginLeft: '10px', fontSize: '20px', color: 'white' }}>sign up</Link>
                    </div>
                </div> */}
            </div>
            <div className="col" style={{marginTop:'110px'}}>
                <img src={fitnesImg} alt="fitnessImg" />
            </div>
        </div>
    );
}



const AuthLandingPage = () => {
   
    return (
        <div className="row">
            <div className="col headerHome">
                <div class="divWrapper">
                    <h1 className="marginElements">Take control of your goals. Track calories.</h1>
                    <p>Count your daily calories wiht Calorie Counter.</p>
                    <p>Track and calculate your food.</p>
                    <p>Make an account if you do not have one. </p>
                </div>
  
            </div>
            <div className="col" style={{marginTop:'110px'}}>
                <img src={fitnesImg} alt="fitnessImg" />
            </div>
        </div>
    );
}

export default ConditionalLandingPage;