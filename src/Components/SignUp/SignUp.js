import React, { Component } from 'react';
import './SignUp.css';
import { Link, withRouter } from 'react-router-dom';
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
    
    <div className="cont">
        <div className="d-flex justify-content-center h-100">
            <div className="card card-signUp">
                <div className="card-header colorUpdate">
                  <h3>Sign Up</h3>
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
                              <button disabled={visible} type="submit" className="btn signUp_btn">Sign Up</button>
                              </div>
                              {error && <Alert variant="danger" onClose={() => this.setState({ error:null, email: '', password: '' })} dismissible>
                        <Alert.Heading></Alert.Heading>
                            <p>
                                {error.message}
                            </p>
                      </Alert>}
            </form>
            </div>
        <div className="card-footer colorUpdate">
              <div className="d-flex justify-content-center">
                <div>
                <span>Already a member?</span> &nbsp; <span><Link to={ROUTES.SIGN_IN} style={{color:'#489848'}}>Sign In</Link></span>
                </div>
                        </div>
                  </div>
              </div>
          </div>
     </div>
    );
  }
}

const SignUpForm = withRouter(withFirebase(SignUpFormBase));


export default SignUp;
export { SignUpForm };


//  Any component that goes in the withRouter() higher-order component 
// gains access to all the properties of the router, so when passing the 
// enhanced SignUpFormBase component to the withRouter() higher-order component, 
// it has access to the props of the router. The relevant property from the
// router props is the history object, because it allows us to redirect a user
// to another page by pushing a route to it.