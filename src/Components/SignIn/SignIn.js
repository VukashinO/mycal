import React, { Component } from 'react';
import './SignIn.css';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from '../../Constants/Routes';

// passing firebase instance to the SignUpForm
import { withFirebase } from '../Firebase';


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
        this.props.history.push(ROUTES.HOME);
       
        localStorage.setItem('userEmail',this.state.email)
        })
        .catch(error => {
        this.setState({ error });
        });

    event.preventDefault();
    };

    onChange = event => {
    this.setState({ [event.target.name] : event.target.value })
    };






    render() { 
        console.log(this.state.email)
            const { email, password, error } = this.state;
            const visible = password === '' ||
            email === '';

        return ( 
          <div className="cont">
         <div className="d-flex justify-content-center h-100 m-7">
           <div className="card">
             <div className="card-header">
               <h3>Sign In</h3>

             </div>
             <div className="card-body">
               <form onSubmit={this.onSubmit}>
                 <div className="input-group form-group">
                   <div className="input-group-prepend">
                     <span className="input-group-text"><i className="fas fa-user"></i></span>
                   </div>
                   <input
                   name="email"
                   value={email} 
                   onChange={this.onChange}
                   type="email" 
                   className="form-control" 
                   placeholder="Your E-mail"/>
                  
                 </div>
                 <div className="input-group form-group">
                   <div className="input-group-prepend">
                     <span className="input-group-text"><i className="fas fa-key"></i></span>
                   </div>
                   <input 
                   onChange={this.onChange}
                   name="password"
                   value={password}
                   type="password" 
                   className="form-control"
                   placeholder="password"/>
                 </div>

                 <div className="form-group">
                   <button disabled={visible} type="submit" className="btn float-right login_btn">Sign In</button>
                 </div>
                 {error && <p className="errorMessage">{error.message}</p>}
               </form>
             </div>
            	<div className="card-footer">
				<div className="d-flex justify-content-center links">
					Don't have an account?
                    <p>
                    <Link to={ROUTES.SIGN_UP} >Sign Up</Link>
                    </p>
                  
				</div>
				</div>
			</div>
           </div>
        
        </div>

         );
    }
}


const SignInForm = withRouter(withFirebase(SignInBase));


export default SignIn;
export { SignInForm };
