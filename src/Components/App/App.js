import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import * as ROUTES from '../../Constants/Routes';
import ConditionalLandingPage from '../../Components/ConditionalLandingPage/ConditionalLandingPage';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';
import MyProfile from '../../Components/MyProfile/MyProfile';
import Diet from '../Diet/Diet';
import Footer from '../../Components/Footer/Footer';
import MyCalendar from '../../Components/MyCalendar/MyCalendar';

const App = () => {
  return (
    <Router>
      <Navigation />
          <div className="container main-section">
              <Route exact path={ROUTES.Landing} component={ ConditionalLandingPage } />
              <Route exact path={ROUTES.SIGN_IN} component={ SignIn } />
              <Route exact path={ROUTES.SIGN_UP} component={ SignUp } />
              <Route exact path={ROUTES.SETUP} component={ MyProfile } />
              <Route exact path={ROUTES.DIET} component={ Diet } />
              <Route exact path={ROUTES.MYCALENDAR} component={ MyCalendar } />
              <Route exact path={ROUTES.MYPROFILE} component={ MyProfile }/>
          </div>
      <Footer />
    </Router>
  );
}

export default App;