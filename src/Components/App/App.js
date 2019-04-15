

import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import * as ROUTES from '../../Constants/Routes';
import LandingPage from '../LandingPage/LandingPage';
import SignIn from '../SignIn/SignIn';
import  SignUp  from '../SignUp/SignUp';
import Home from '../Home/Home';
import { withFirebase } from '../Firebase';


class App extends Component {
  state = { 

    authUser: null
   
  };


  componentDidMount() {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      },
    );
  }


  componentWillUnmount() {
    this.listener();
  }
  render() { 


    console.log(this.state.authUser)
    return ( 
      <div className="App">
      <Router>
        <Navigation authUser={this.state.authUser}/> 
      
      <Route exact path={ROUTES.Landing} component={LandingPage}/>
      <Route exact path={ROUTES.SIGN_IN} component={SignIn}/>
      <Route exact path={ROUTES.SIGN_UP} component={SignUp}/>
      <Route exact path={ROUTES.HOME} component={Home} />

      </Router>
        
      </div>
     );
  }
}
 
export default withFirebase(App);