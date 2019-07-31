import React, { Component } from 'react';
import './SignIn.css';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../Constants/Routes';
import { Alert } from 'react-bootstrap';


const SignIn = () => {
  return (
    <div className="wrapper">
      <SignInForm />
    </div>
  );
}

class SignInBase extends Component {
  state = {
    email: '',
    password: '',
    error: null
  };

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...this.state });
        let userObj = { name: "fake", email }
        localStorage.setItem('user', JSON.stringify(userObj));
        
        this.props.history.push(ROUTES.DIET);
        
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  };

  render() {
    const { email, password, error } = this.state;
    const visible = password === '' ||
      email === '';

    return (
      <div className="cont">
        <div className="d-flex justify-content-center h-100">
          <div className="card">
            <div className="card-header colorUpdate">
              <h3>Sign In</h3>

            </div>
            <div className="card-body colorUpdate">
              <form onSubmit={this.onSubmit}>
                <div className="input-group form-group m-top">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                  </div>
                  <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="email"
                    className="form-control"
                    placeholder="Your E-mail" />

                </div>
                <div className="input-group form-group m-top">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                  </div>
                  <input
                    onChange={this.onChange}
                    name="password"
                    value={password}
                    type="password"
                    className="form-control"
                    placeholder="Password" />
                </div>

                <div className="form-group text-right m-top">
                  <button disabled={visible} type="submit" className="btn login_btn">Sign In</button>
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
              <div className="d-flex justify-content-center links">
               <p style={{color: "#489848"}}> Don't have an account?
                   
                  <span style={{fontSize:'20px', marginLeft:'13px'}}><Link to={ROUTES.SIGN_UP}  style={{color:'#489848'}}>Sign Up</Link></span>
                  </p>

              </div>
            </div>
          </div>
        </div>

      </div>

    );
  }
}


const SignInForm = withRouter(SignInBase);


export default SignIn;
export { SignInForm };
