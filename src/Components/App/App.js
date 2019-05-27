import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import * as ROUTES from '../../Constants/Routes';
import LandingPage from '../LandingPage/LandingPage';
import SignIn from '../SignIn/SignIn';
import  SignUp  from '../SignUp/SignUp';
import Home from '../Home/Home';
import Diet from '../Diet/Diet';
import { WithAuthentication } from '../Hoc/Hoc';


const App = () => {
  return ( 
    <Router>
    <div className="App">
    <Navigation /> 
  
  <Route exact path={ROUTES.Landing} component={LandingPage}/>
  <Route exact path={ROUTES.SIGN_IN} component={SignIn}/>
  <Route exact path={ROUTES.SIGN_UP} component={SignUp}/>
  <Route exact path={ROUTES.HOME} component={Home} />
  <Route exact path={ROUTES.DIET} component={Diet} />
  </div>
  </Router>
   );
}
 
  

export default WithAuthentication(App);