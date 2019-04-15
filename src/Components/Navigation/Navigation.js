
import React from 'react';
import * as ROUTES from '../../Constants/Routes';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut/SignOut';

const Navigation = ({ authUser }) => (
    <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
  );

  const NavigationAuth = () => (
    <ul>
      <li>
        <Link to={ROUTES.Landing}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
     
      <li>
        <SignOutButton />
      </li>
    </ul>
  );
  const NavigationNonAuth = () => (
    <ul>
      <li>
        <Link to={ROUTES.Landing}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
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