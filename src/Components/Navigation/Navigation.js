import React from 'react';
import * as ROUTES from '../../Constants/Routes';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut/SignOut';
import { AuthUserContext } from '../Hoc/Hoc';
import Logo from '../../Components/Logo/Logo';

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
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container">
            <div className="row justify-content-between flex-grow-1">
                <div style={{width:'50px',marginLeft:'15px'}}>
                    <Link  to={ROUTES.Landing}> <Logo />
                    </Link> 
                </div>
                <button className="navbar-toggler m-right-15" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon">
                    </span>
                </button>

                <div className="collapse navbar-collapse flex-grow-0 m-right-15" id="navbarSupportedContent">

<ul className="navbar-nav text-right">
    <li className="nav-item active">
        <Link className="nav-link" to={ROUTES.Landing}>Home</Link>
    </li>
    <li className="nav-item active">
        <Link className="nav-link" to={ROUTES.DIET}>Diet</Link>
    </li>
    <li className="nav-item active">
        <Link className="nav-link" to={ROUTES.MYCALENDAR}>MyCalendar</Link>
    </li>
    <li className="nav-item active">
    <SignOutButton />
    </li>
</ul>
</div>
            </div>
        </div>
    </nav>
  );
  const NavigationNonAuth = () => (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-end">
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
        <span className="navbar-toggler-icon"></span>
    </button>
   
    <div className="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent" style={{marginRight:'250px'}}>
        <ul className="navbar-nav text-right">
        
            {/* <li className="nav-item active">
                <Link className="nav-link" to={ROUTES.Landing}>Home</Link>
            </li> */}
            <li className="nav-item active">
                <Link className="nav-link" to={ROUTES.SIGN_IN}>Sign In</Link>
            </li>
            
        </ul>
       
    </div>
    <div style={{position:'absolute', left:'290px',color:'red',width:'50px'}}>
    <Link  to={ROUTES.Landing}> <Logo /></Link> 
   
    </div>
</nav>
  );
 
export default Navigation;