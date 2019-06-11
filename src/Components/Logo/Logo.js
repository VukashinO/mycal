import React from 'react';
import LogoImg from '../../Components/Assets/images/appLogo.jpg';
import './Logo.css';

const Logo = () => {
    return (
        <div className="imgCont">
        <img src={LogoImg} alt="logoImg"/>
        </div> 
     );
}
 
export default Logo;