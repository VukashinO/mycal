import React from 'react';
import './FirebaseTable.css';


const FirebaseTable = props => {
    let table = null;
    if (props.objForRenderingFirebaseTable) {
     const {
            date,
            dietInfo,
            totalCalories
        } = props.objForRenderingFirebaseTable || {};

        const breakFast = dietInfo.filter(diet => diet.meal === 'Breakfast')
            .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories} calories</span>
            </td></tr>);

        const lunch = dietInfo.filter(diet => diet.meal === 'Lunch')
            .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories} calories</span>
            </td></tr>);

        const dinner = dietInfo.filter(diet => diet.meal === 'Dinner')
            .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories} calories</span>
            </td></tr>);

        table = <table className="firebaseTable">
            <thead>
                <tr>
                    <th>Date:{date}</th>
                </tr>
                <tr>
                    <th>total Calories: {totalCalories} Calories</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Breakfast</td>
                </tr>
                {breakFast}
                <tr>
                    <td>Lunch</td>
                </tr>
                {lunch}
                <tr>
                    <td>Dinner</td>
                </tr>
                {dinner}
            </tbody>
        </table>
    }

     return (
        <div className="divDinamicTable">
            {table}
        </div>
    );
}

export default FirebaseTable;