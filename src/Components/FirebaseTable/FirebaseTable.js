import React from 'react';
import './Firebase.css';


const FirebaseTable = props => {
let table = null;
 if(props.dietFromFirebase) {
     const lastIndex = props.dietFromFirebase.length - 1;
     const obj = props.dietFromFirebase[lastIndex];
    
     const {
        date,
        dietSave,
        totalCalories
     } = obj || {};
    
     const breakFast = dietSave.filter(diet => diet.meal === 'Breakfast')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories</span>
      </td></tr>);

    const lunch = dietSave.filter(diet => diet.meal === 'Lunch')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span>{meal.foodName}: {meal.calories}calories</span>
      </td></tr>); 

    const dinner = dietSave.filter(diet => diet.meal === 'Dinner')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span>{meal.foodName}: {meal.calories}calories</span>
      </td></tr>);

    table = <table className="firebaseTable">
        <thead>
            <tr>
                <th>date:{date}</th>
            </tr>
            <tr>
                <th>total Calories: {totalCalories} calories</th>
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

       <div  className="firebaseDiv">
        {table}
       </div>
     );
}
 
export default FirebaseTable;