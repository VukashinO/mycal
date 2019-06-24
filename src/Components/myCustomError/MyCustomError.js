import React from 'react';
import Auxiliary from '../../Components/myHoc/Auxiliary';
import './MyCustomError.css';

const MyCustomError = props => {
    return (
        <Auxiliary>
            <h3 onClick={props.handleCorrectly}
                className="fillCorrect">Please fill everything correctly</h3>

        </Auxiliary>
    );
}

export default MyCustomError;