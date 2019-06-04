import React from 'react';
import * as ROUTES from '../../Constants/Routes';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut/SignOut';
import { AuthUserContext } from '../Hoc/Hoc';

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
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-end">
    
    <SignOutButton />
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">
        <ul className="navbar-nav text-right">
            <li className="nav-item active">
                <Link className="nav-link" to={ROUTES.Landing}>Home</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to={ROUTES.HOME}>BMI</Link>
            </li>
 
        </ul>
    </div>
    
</nav>
    // <ul>
    //   <li>
    //     <Link to={ROUTES.Landing}>Landing</Link>
    //   </li>
    //   <li>
    //     <Link to={ROUTES.HOME}>Home</Link>
    //   </li>
     
    //   <li>
    //     <SignOutButton />
    //   </li>
    // </ul>
  );
  const NavigationNonAuth = () => (

    //  <ul>
    //    <li>
    //      <Link to={ROUTES.Landing}>Landing</Link>
    //    </li>
    //    <li>
    //      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
        
    //    </li>
    //  </ul>
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-end">
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">
        <ul className="navbar-nav text-right">
            <li className="nav-item active">
                <Link className="nav-link" to={ROUTES.Landing}>Home</Link>
            </li>
            <li className="nav-item active">
                <Link className="nav-link" to={ROUTES.SIGN_IN}>Sign In</Link>
            </li>
        </ul>
    </div>
    
</nav>
  );

// const Navigation = () => {
//     return ( 
//         <div>
//             <ul>
//                 <li>
//                     <Link to={ROUTES.Landing}>Landing</Link>
//                 </li>
//                 <li>
//                     <Link to={ROUTES.SIGN_IN}>Sign in</Link>
//                 </li>
//                 <li>
//                     <Link to={ROUTES.HOME}>Home</Link>
//                 </li>
//                 <li>
//                     <SignOutButton />
//                 </li>
//             </ul>
//         </div>
//      );
// }
 
export default Navigation;