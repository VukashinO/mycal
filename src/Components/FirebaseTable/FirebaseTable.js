import React from 'react';
import './FirebaseTable.css';


const FirebaseTable = props => {
    let table = null;
    if (props.objForRenderingFirebaseTable) {
     const {
            date,
            meals,
            totalCalories
        } = props.objForRenderingFirebaseTable || {};
        const breakFast = meals.filter(meal => meal.mealType === 0)
            .map((meal, i) => <tr key={meal.name + i}><td><span className="dinamicTableTd">{meal.name}: {meal.calories} calories</span>
            </td></tr>);

        const lunch = meals.filter(meal => meal.mealType === 1)
            .map((meal, i) => <tr key={meal.name + i}><td><span className="dinamicTableTd">{meal.name}: {meal.calories} calories</span>
            </td></tr>);

        const dinner = meals.filter(meal => meal.mealType === 2)
            .map((meal, i) => <tr key={meal.name + i}><td><span className="dinamicTableTd">{meal.name}: {meal.calories} calories</span>
            </td></tr>);

        table = <table className="firebaseTable">
            <thead>
                <tr>
                    <th>date:{date.substring(0, 10)}</th>
                </tr>
                <tr>
                    <th>total Calories: {totalCalories} </th>
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