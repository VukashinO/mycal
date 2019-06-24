import React from 'react';
import Auxiliary from '../../Components/myHoc/Auxiliary';
import './NutritionSummary.css';


const NutritionSummary = (props) => {
    let op = null;
    if (props.select2) {
        console.log(props.select2)
        const obj = props.select2.find(obj => obj.food.label === props.name)
        op = obj.measures.map((mes, i) => <option key={mes + i}>{mes.label}</option>)
    }
    //  console.log(op)
    // hard coded options
    // let options =  props.select.map(opt => <option key={opt}>{opt}</option>)
    return (
        <Auxiliary>
            <h3>food name:{props.name}</h3>
            <div style={{ padding: '10px' }}>

                {/* <h4>how much?</h4> */}

                <div className="row align-items-center m-2">
                    <label htmlFor="inputText" className="col-sm-2 col-form-label">how much</label>
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
                    <label htmlFor="selectMesure" className="col-sm-2 col-form-label">serving of</label>
                    <div className="col-sm-10">
                        <select id="selectMesure" className="form-control" value={props.value} onChange={props.handleChange}>
                            {/* {options}  */}
                            <option>Choose serving</option>

                            {op}
                        </select>
                    </div>
                </div>
                <div className="row align-items-center m-2">
                    <label htmlFor="selectMeal" className="col-sm-2 col-form-label">wich meal?</label>
                    <div className="col-sm-10">
                        <select id="selectMeal" className="form-control" value={props.valueMeal} onChange={props.handleChangeMeal}>
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                        </select>
                    </div>

                </div>
                <div className="row justify-content-center m-3">
                    <div className="col-sm-10">
                        <button className="addFood" onClick={props.onSubmit}>Add food</button>
                        <button className="onCancel" onClick={props.onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </Auxiliary>
    );
}

export default NutritionSummary;







