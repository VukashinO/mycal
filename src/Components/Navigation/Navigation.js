import React from 'react';
import * as ROUTES from '../../Constants/Routes';
import { Link, NavLink } from 'react-router-dom';
import SignOutButton from '../SignOut/SignOut';
import { AuthUserContext } from '../Hoc/Hoc';
import Logo from '../../Components/Logo/Logo';
import './Navigation.css';
import { Dropdown, ButtonGroup, DropdownButton, Button } from 'react-bootstrap';
// import MyProfile from '../../Components/MyProfile/MyProfile';
const Navigation = () => (
    <div>
        <AuthUserContext.Consumer>
            {authUser =>
                authUser ? <NavigationAuth /> : <NavigationNonAuth />
            }
        </AuthUserContext.Consumer>
    </div>

);

const NavigationAuth = () => (
    <header className="navbar navbar-expand-sm bg-light navbar-light">
        <div className="container">
            <div className="row justify-content-between flex-grow-1">
                <div style={{ width: '50px', marginLeft: '15px' }}>
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
                        <li>
                            <SignOutButton />
                        </li>
                    </li>
     
     
   
 
                      
                        {/* <li className="nav-item active">
                            <SignOutButton />
                        </li> */}
                    </ul>
                </div>
            </div>
        </div>
    </header>
);
const NavigationNonAuth = () => (

    <header className="navbar navbar-expand-sm bg-light navbar-light">
        <div className="container">
            <div className="row justify-content-between flex-grow-1">
                <div style={{ width: '50px', marginLeft: '15px' }}>
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

                    </ul>
                </div>
            </div>
        </div>
    </header>
);

export default Navigation;