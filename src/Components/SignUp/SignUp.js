import React, { Component } from 'react';
import './SignUp.css';
import {  withRouter } from 'react-router-dom';
import * as ROUTES from '../../Constants/Routes';
import { Alert } from 'react-bootstrap';
// passing firebase instance to the SignUpForm
import { withFirebase } from '../Firebase';

const SignUp = () => (
  <div className="wrapper">
   
    <SignUpForm />
  </div>
);

// Now, instead of using the Firebase Context directly in the SignUpPage,
//  which doesn’t need to know about the Firebase instance, 
//  use the higher-order component to wrap your SignUpForm.
//   Afterward, the SignUpForm has access to the Firebase
//    instance via the higher-order component. 
//    It’s also possible to use the SignUpForm as standalone without the
//     SignUpPage, because 
// it is responsible to get the Firebase instance via the higher-order component.
class SignUpFormBase  extends Component {
  
    state = {
        username: '',
        email: '',
        passwordOne: '',
        passwordTwo: '',
        error: null
    };

    // which will pass all the form data to the Firebase authentication API via your 
    // authentication interface in the Firebase class:

  // ----------------- Fetch user from input, save to local storage for compare later ----------------------------------------
  onSubmit = event => {
    
    const { username, email, passwordOne } = this.state;

    this.props.firebase
    .doCreateUserWithEmailAndPassword(email, passwordOne)
    .then(authUser => {
        this.setState({...this.state});
      
      // localStorage.setItem('user', this.state.email);
      let userObj = {name: username, email}
      localStorage.setItem('user', JSON.stringify(userObj));
      console.log(this.props.firebase);
        this.props.history.push( ROUTES.SETUP );
        
    })
    .catch(error => {
        this.setState({ error })
    })
    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name] : event.target.value })
  };

  render() {
     const {
        username,
        email,
        passwordOne,
        passwordTwo,
        error

     } = this.state;

     // validation and button disable.
     const visible = passwordOne !== passwordTwo ||
     passwordOne === '' ||
     email === '' ||
     username === ''


    return (
      // m-5
    <div className="cont">
        <div className="d-flex justify-content-center h-100">
            <div className="card card-signUp">
        <div className="card-header colorUpdate">
          <h3>SignUp</h3>
        </div>
       <div className="card-body colorUpdate">
      <form onSubmit={this.onSubmit}>
       <div className="input-group form-group m-top">
      <div className="input-group-prepend">
        <span className="input-group-text"><i className="fas fa-user"></i></span>
      </div>
        <input 
       className="form-control" 
        name="username"
        value={username}
        onChange={this.onChange}
        type="text"
        placeholder="Full Name" 
        />
       
      </div> 
      <div className="input-group form-group m-top">
      <div className="input-group-prepend">
        <span className="input-group-text"><i className="fas fa-user"></i></span>
      </div>
        <input
        className="form-control" 
        name="email"
        value={email}
        onChange={this.onChange}
        type="email"
        placeholder="Your E-mail"
      
        />
        </div>
        <div className="input-group form-group m-top">
        <div className="input-group-prepend">
            <span className="input-group-text"><i className="fas fa-key"></i></span>
        </div>
        <input
        className="form-control" 
        name="passwordOne"
        value={passwordOne}
        onChange={this.onChange}
        type="password"
        placeholder="Password"
        />
        </div>
        <div className="input-group form-group m-top">
        <div className="input-group-prepend">
            <span className="input-group-text"><i className="fas fa-key"></i></span>
        </div>
        <input
        className="form-control" 
        name="passwordTwo"
        value={passwordTwo}
        onChange={this.onChange}
        type="password"
        placeholder="Confirm Password"
        />
        </div>
        <div className="form-group m-top">
        <button disabled={visible} type="submit" className="btn signUp_btn">SignUp</button>
        </div>
      </form>
      </div>
          <div className="card-footer colorUpdate">
                 <div className="d-flex justify-content-center">
              
          {error && <Alert variant="danger" onClose={() => this.setState({ error:null, username: '', email: '', passwordOne: '', passwordTwo: '' })} dismissible>
                        <Alert.Heading></Alert.Heading>
                           
                                {error.message}
                           
                      </Alert>}
                  </div>
          </div>
      </div>
      </div>
      </div>
     
    );
  }
}



//  Any component that goes in the withRouter() higher-order component 
// gains access to all the properties of the router, so when passing the 
// enhanced SignUpFormBase component to the withRouter() higher-order component, 
// it has access to the props of the router. The relevant property from the
// router props is the history object, because it allows us to redirect a user
// to another page by pushing a route to it.

const SignUpForm = withRouter(withFirebase(SignUpFormBase));


export default SignUp;
export { SignUpForm };

