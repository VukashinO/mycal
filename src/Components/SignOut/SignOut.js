

import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../Constants/Routes';
import { withRouter } from 'react-router-dom';

const SignOutButton = () => {
    return ( 
        <div>
            <SignOutButtonForm />
        </div>
      
     );
}
 

class SignOutButtonBase extends Component {
    
onSignOut = () => {
    this.props.firebase.doSignOut().then(() => {
        this.props.history.push(ROUTES.SIGN_IN);
    })
}
    render() { 
        return ( 
            <button type="button" onClick={this.onSignOut}>
    Sign Out
  </button>
         );
    }
}
 
const SignOutButtonForm = withRouter(withFirebase(SignOutButtonBase));

export default SignOutButton;
export { SignOutButtonForm };

// const SignOutButton = ({ firebase }) => (
//   <button type="button" onClick={firebase.doSignOut}>
//     Sign Out
//   </button>
// );

// export default withFirebase(SignOutButton);