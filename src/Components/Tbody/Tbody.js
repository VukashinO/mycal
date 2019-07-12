import React from 'react';

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
    if (brand) {
        renderBrand = brand
    }
    return (


        <tr onClick={() => props.click(Math.round(ENERC_KCAL), label)}>
            <td >{label}</td>
            <td>{renderBrand}</td>
            <td>{Math.round(ENERC_KCAL)}cal</td>
            <td>{Math.round(PROCNT)}g</td>
            <td>{Math.round(FAT)}g</td>
        </tr>
    )
};


export default Tbody;


