import React from 'react';
 import './MyModal.css';
import { Modal, Button } from 'react-bootstrap';

const MyModal = (props) => {
    return ( 
      
          <div className="Modal">
              {props.children}
          </div>
        
    //     <Modal show={true}>
    //    {props.children}
    //     </Modal>
       
     );
}
 
export default MyModal;