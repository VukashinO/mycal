import React from 'react';
import Auxiliary from '../../Components/myHoc/Auxiliary';
import './NutritionSummary.css';
import { Button } from 'react-bootstrap';

const NutritionSummary = (props) => {
    let op = null;
    if (props.select2) {
        console.log(props.select2)
        const obj = props.select2.find(obj => obj.food.label === props.name)
        op = obj.measures.map((mes, i) => <option key={mes + i}>{mes.label}</option>)
    }

    const firstLetterUppercase = (string) => {

        if(string.length > 0)
        {
           return string.charAt(0).toUpperCase() + string.slice(1);
        }
        return string.toUpperCase();
    }
    //  console.log(op)
    // hard coded options
    // let options =  props.select.map(opt => <option key={opt}>{opt}</option>)
    return (
        <Auxiliary>
            <h3 style={{color: '#56d37c'}}>food name:{ firstLetterUppercase( props.name )}</h3>
            <div style={{ padding: '10px' }}>

                {/* <h4>how much?</h4> */}

                <div className="row align-items-center m-2">
                    <label htmlFor="inputText" className="col-sm-2 col-form-label">Quantity</label>
                    <div className="col-sm-10">
                        {props.servingError && <p style={{ color: 'red' }}>{props.servingError}</p>}
                        <input type="text" placeholder="1"
                            className={`${props.servingError ? 'error' : ''}`}
                            name="serving" value={props.inputServing}
                            onChange={props.handleInput}
                            id="inputText"
                        />
                    </div>

                </div>
                <div className="row align-items-center m-2">
                    <label htmlFor="selectMesure" className="col-sm-2 col-form-label">Mesure</label>
                    <div className="col-sm-10">
                        <select id="selectMesure" className="form-control" value={props.value} onChange={props.handleChange}>
                            {/* {options}  */}
                            <option>Choose serving</option>

                            {op}
                        </select>
                    </div>
                </div>
                <div className="row align-items-center m-2">
                    <label htmlFor="selectMeal" className="col-sm-2 col-form-label">Meal</label>
                    <div className="col-sm-10">
                        <select id="selectMeal" className="form-control" value={props.valueMeal} onChange={props.handleChangeMeal}>
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                        </select>
                    </div>

                </div>
                <div className="row justify-content-end m-3">
                    <div className="col-sm-10">
                        {/* <button className="addFood" onClick={props.onSubmit}>Add food</button>
                        <button className="onCancel" onClick={props.onCancel}>Cancel</button> */}
                        <Button variant="success m-2" onClick={props.onSubmit}>Add food</Button>
                        <Button variant="secondary" onClick={props.onCancel}>Cancel</Button>
                    </div>
                </div>
            </div>
        </Auxiliary>
    );
}

export default NutritionSummary;







