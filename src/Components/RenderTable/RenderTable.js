import React from 'react';
import Tbody from '../../Components/Tbody/Tbody';
import './RenderTable.css';
import Auxiliary from '../../Components/myHoc/Auxiliary';

const RenderTable = props => {
    let table = null;
    if (props.foodData) {
        table =
            <table className="containerTable">
                <thead>
                    <tr>
                        <th><h1>food Name</h1></th>
                        <th><h1>Brand</h1></th>
                        <th><h1>Calories</h1><span style={{ color: '#bae0bd' }}>(per 100g)</span></th>
                        <th><h1>Proteins</h1></th>
                        <th><h1>Fat</h1></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.foodData.map((food, i) => <Tbody
                            key={i}
                            obj={food}
                            click={props.click}
                        />)
                    }
                </tbody>
            </table>
    }
    return (
        <Auxiliary>
            {table}
            <div className="containerPagination">
                <ul className="pageNumbers">
                    {props.numPagination}
                </ul>
            </div>
        </Auxiliary>
    )
};

export default RenderTable;