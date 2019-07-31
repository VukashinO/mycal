import React, { Component } from 'react';
import * as ROUTES from '../../Constants/Routes';
import { Link, NavLink } from 'react-router-dom';
import SignOutButton from '../SignOut/SignOut';
import { withRouter } from 'react-router-dom';
import Logo from '../../Components/Logo/Logo';
import './Navigation.css';


class Navigation extends Component {
    state = {
        isAuth: false
    }
    componentDidMount() {
        if(JSON.parse(localStorage.getItem('token')))
        {
            this.setState({isAuth: true})
        }
    }

    render() {
        return(
            <div>
            {/* {this.state.isAuth ? <NavigationAuth /> : <NavigationNonAuth /> } */}
            {this.props.location.pathname === ROUTES.SIGN_UP 
                ||
                this.props.location.pathname === ROUTES.SIGN_IN
                ||
                this.props.location.pathname == ROUTES.Landing
                ||
                this.props.location.pathname == ROUTES.SETUP
                 ? <NavigationNonAuth /> :<NavigationAuth /> }
            </div>
        )
    }
}


const NavigationAuth = () => (
    <header className="navbar navbar-expand-sm bg-whitesmoke navbar-light">
        <div className="container">
            <div className="row justify-content-between flex-grow-1">
                <div style={{ marginLeft: '15px', paddingTop:'9px' }}>
                    <Link to={ROUTES.Landing}> <Logo />
                    </Link>
                </div>
                <button className="navbar-toggler m-right-15" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon">
                    </span>
                </button>

                <div className="collapse navbar-collapse flex-grow-0 m-right-15" id="navbarSupportedContent">

                    <ul className="navbar-nav text-right">

                        <li className="nav-item active">
                            <NavLink className="nav-link" activeClassName="activeLink" to={ROUTES.DIET}>Diet</NavLink>
                        </li>
                        <li className="nav-item active">
                            <NavLink className="nav-link" activeClassName="activeLink" to={ROUTES.MYCALENDAR}>My Calendar</NavLink>
                        </li>
                        <li className="nav-item active">
                            <NavLink className="nav-link" activeClassName="activeLink" to={ROUTES.MYPROFILE}>My Profile</NavLink>
                        </li>
                            <li>
                             <SignOutButton />
                            </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
);

const NavigationNonAuth = () => {
    return (
       
        <header className="navbar navbar-expand-sm bg-whitesmoke navbar-light">
        <div className="container">
            <div className="row justify-content-between flex-grow-1">
                   <div style={{ marginLeft: '15px', paddingTop:'9px' }}>
                   <Link to={ROUTES.Landing}> <Logo />
                    </Link>
                   </div>
               
                <button className="navbar-toggler m-right-15" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon">
                    </span>
                </button>

                <div className="collapse navbar-collapse flex-grow-0 m-right-15" id="navbarSupportedContent">

                    <ul className="navbar-nav text-right">
                        <li className="nav-item active">
                            <NavLink className="nav-link" activeClassName="activeLink" to={ROUTES.SIGN_IN}>Sign In</NavLink>
                        </li>
                        {/* <li className="nav-item active">
                            <NavLink className="btn btn-success nav-link"  to={ROUTES.SIGN_UP} style={{color:'white'}}>Get started</NavLink>
                        </li> */}
                        
                    </ul>
                </div>
            </div>
        </div>
    </header>
    )
}
    

export default withRouter(Navigation);