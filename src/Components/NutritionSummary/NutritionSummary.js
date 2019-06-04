import React from 'react';
import Auxiliary from '../../Components/myHoc/Auxiliary';
import './NutritionSummary.css';


const NutritionSummary = (props) => {
     let op = null;
     if(props.select2) {
         console.log(props.select2)
        const obj = props.select2.find(obj => obj.food.label === props.name)
        op = obj.measures.map((mes,i) => <option key={mes+i}>{mes.label}</option>)
     }
     console.log(op)
  // let options =  props.select.map(opt => <option key={opt}>{opt}</option>)
    return ( 
        <Auxiliary>
        <h3>food name:{props.name}</h3>
        <h4>how much?</h4>
        {props.servingError && <p style={{color:'red'}}>{props.servingError}</p>}
        <input type="text" placeholder="1"
         className={`${props.servingError ? 'error': ''}`}
         name="serving" value={props.inputServing}
         onChange={props.handleInput}
         /> servings of
       
         <select value={props.value} onChange={props.handleChange}>
        {/* {options} */}
        {op}
        </select>
       <div>
        <h4>to wich meal?</h4>
        <select value={props.valueMeal} onChange={props.handleChangeMeal}>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
        </select>
        </div>
    
        <button onClick={props.onSubmit}>Add food</button>
        <button onClick={props.onCancel}>Cancel</button>
    </Auxiliary>
     );
}
 
export default NutritionSummary;
  

      
    


