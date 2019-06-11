import React from 'react';
// import './Tbody.css';

const Tbody = props => {

    // destructure
const {
    food: {
         
            label,
            brand,
            nutrients: {
                ENERC_KCAL,
                PROCNT,
                FAT
            }
          }    
} = props.obj || {}

    let renderBrand = "N/A";
    if(brand)
    {
        renderBrand = brand
    }
    return (

          
            <tr>
                <td onClick={()=>props.click(Math.round(ENERC_KCAL),label)}>{label}</td>
                <td>{renderBrand}</td>
                <td>{Math.round(ENERC_KCAL)}cal</td>
                <td>{Math.round(PROCNT)}g</td>
                <td>fat:{Math.round(FAT)}g</td>
            </tr>
            )
};


export default Tbody;


// select // let arr = props.obj.measures.map((measure,i) => {
//     return <p key={measure.label + i}>{measure.label}</p>
// }) mesures ...