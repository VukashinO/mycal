import React from 'react';
import './Modal.css';

const modal = (props) => {
    console.log(props.show)
    return ( 
      
        <div className="Modal">
            {props.children}
        </div>
     );
}
 
export default modal;