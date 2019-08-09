import React, { Component } from 'react';
import './SignUp.css';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../Constants/Routes';
import { Alert } from 'react-bootstrap';
import * as API from '../../ApiController/api';

const SignUp = () => (
  <div className="wrapper">
   
    <SignUpForm />
  </div>
);
class SignUpFormBase  extends Component {
  
    state = {
        username: '',
        email: '',
        passwordOne: '',
        passwordTwo: '',
        error: null
    };


  // ----------------- Fetch user from input, save to local storage for compare later ----------------------------------------

  onSubmit = event => {
    event.preventDefault();
       // confirmpassword: "teamodenA10!"
        const { username, email, passwordOne, passwordTwo } = this.state;

    var user = 
      {
        firstname: username,
        lastname: "obradovikj",
        email,
        password: passwordOne,
        confirmPassword : passwordTwo
      }
    API.registerUser(user)
    .then(responce => {
      if(responce.data.token)
      {
      localStorage.setItem('token', JSON.stringify(responce.data.token))
      this.props.history.push( ROUTES.SETUP );
      } 
      else {
        this.setState({error: responce.data})
      }
    })
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
                                type="text"
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
                              <div className="card-footer colorUpdate">
              <div className="d-flex justify-content-center">
                    <div>
                      <span>Already a member?</span> &nbsp; <span><Link to={ROUTES.SIGN_IN} style={{color:'#489848'}}>Sign In</Link></span>
                      {error &&
      <Alert variant="danger" onClose={() => this.setState({ error:null, username: '', email: '', passwordOne: '', passwordTwo: '' })}>
      <Alert.Heading></Alert.Heading>
                        <p>
                            {error}
                        </p>
                  </Alert>}
                    </div>
                        </div>
                  </div>
          </form>

      </div>


              </div>
          </div>
     </div>
    );
  }
}

const SignUpForm = withRouter(SignUpFormBase);


export default SignUp;
export { SignUpForm };

