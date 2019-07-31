import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import * as ROUTES from '../../Constants/Routes';
import { withRouter } from 'react-router-dom';
class SignOutButton extends Component {
  render() {
    return (
      <Button variant="success" onClick={() => {
        localStorage.removeItem('token')
        this.props.history.push(ROUTES.SIGN_IN);
      }}>
      Sign Out
    </Button>
    )
  }
}


export default withRouter(SignOutButton);