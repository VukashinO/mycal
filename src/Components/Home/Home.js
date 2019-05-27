import React, { Component } from 'react';
import { WithAuthorization } from '../Hoc/Hoc';
import './Home.css';
import * as ROUTES from '../../Constants/Routes';

 class HomePage extends Component {

  state = {
    age: "",
    heightcm: "",
    weightkl: "",
    life: "",
    result: "",
    calories: "",
    formErrors: {
      age: "",
      heightcm: "",
      weightkl: ""
    },
    isSubmited: false
  };

  formValidation = formErrors => {
    let isValid = true;
    Object.values(formErrors).forEach(val => {
      val !== null && (isValid = false);
    })
    return isValid;
  }
  change = e => {

    const { name, value } = e.target;
    let formErrors = this.state.formErrors;
    switch(name) {
      case "age":
      formErrors.age = +value && value > 11 && value < 76 ? null : "enter number from 12 to 75";
      break;
      case "heightcm":
      formErrors.heightcm = +value && value > 119 && value < 211 ? null : "enter number from 120 to 210";
      break;
      case "weightkl":
      formErrors.weightkl = +value && value > 54 && value < 141 ? null : "enter number from 55 to 140";
      break;
      default:
      break;
    }
    this.setState({ formErrors, [name]: value })
  };

   onRadioChange = value => {
    console.log("radio change");
    this.setState({
      gender: value,
      life: value
    });
  }


  onSubmit = e => {
    e.preventDefault();
    //console.log(this.state);
    let bmr = this.state.result;
    let gender = this.state.gender;
    let age = this.state.age;
    let heightcm = this.state.heightcm;
    let weightkl = this.state.weightkl;
    let life = this.state.life;
    if(this.formValidation(this.state.formErrors))
    {
      if (gender && weightkl && heightcm && age && life) {
        if (gender === "male") {
          bmr = 10 * weightkl + 6.25 * heightcm - 5 * age + 5;
        } else if (gender === "female") {
          bmr = 10 * weightkl + 6.25 * heightcm - 5 * age - 161;
        }
      }
    }
  else {
      return window.alert("Please fill in everything correctly");
    }

    let calories = this.state.calories;

    if (life === "sedentary") {
      calories = bmr * 1.53;
    } else if (life === "moderate") {
      calories = bmr * 1.76;
    } else {
      calories = bmr * 2.25;
    }

      //  window.alert(
      //    "Your BMR is: " +
      //      bmr.toFixed(0) +
      //      ". You need about " +
      //     calories.toFixed(0) +
      //      " calories/day to maintain your current weight"
      //  );
     this.setState({result: bmr, calories : calories })
   
      this.props.history.push({
        pathname:ROUTES.DIET,
        state:{
            bmr: bmr.toFixed(0),
            calories:calories.toFixed(0)
         }
       });
  };

  clearhtmlForm = () => {
    this.setState({
      age: "",
      heightcm: "",
      weightkl: "",
      gender: "",
      life: "",
      result: ""
    });
  };
   render() { 
    const { formErrors } = this.state;
    console.log(this.state.result)
    console.log(this.state.age)
    console.log(this.state.isSubmited)
    console.log(this.state.calories)
     return (
    

  <div className="homeContainer">
    
  <form className="formStyle">
  
   <h1>Calculate BMI <span className="span1">(Metric unit)</span></h1>
  <h3>Choose Gender</h3>
  <div className="form-check form-check-inline">
    
      <input
      className="form-check-input "
          type="radio"
          name="gender"
          value="male"
          checked={this.state.gender === "male"}
          onChange={e => this.change(e)}
          id="male"
        />
          <label htmlFor="male" className="form-check-label radioStyle">Male</label>

  </div>
  <div className="form-check form-check-inline">
        <input
         className="form-check-input" 
          type="radio"
          name="gender"
          value="female"
          checked={this.state.gender === "female"}
          onChange={e => this.change(e)}
          id="female"
        />
       <label htmlFor="female" className="form-check-label radioStyle">Female</label>
  </div>
  
       <div className="row">
            <div className="col">
            <div className="form-group">
  <label htmlFor="age"><span className="labelText">enter your Age</span></label>
  <input
            type="text"
            name="age"
            value={this.state.age}
            onChange={e => this.change(e)}
            className={`form-control ${formErrors.age ?'is-invalid': ''}`}
            id="age"
            placeholder="your Age"
          />
          
          <div className='invalid-feedback'>{formErrors.age}</div>
</div>
            </div>
            <div className="col">
    <div className="form-group">
<label htmlFor="heightcm"><span className="labelText">enter your height in cm</span></label>
<input
            type="text"
            name="heightcm"
            value={this.state.heightcm}
            onChange={e => this.change(e)}
            className={`form-control ${formErrors.heightcm ?'is-invalid': ''}`}
            id="heightcm"
            placeholder="your height in cm"
          />
          <small className="form-text text-muted">number from 120 to 210</small>
          <div className='invalid-feedback'>{formErrors.heightcm}</div>
</div>
            </div>
       </div>



       <div className="form-group">
       <label htmlFor="weightkl"><span className="labelText">enter your weight in kg</span></label>
       <input
            type="text"
            name="weightkl"
            value={this.state.weightkl}
            onChange={e => this.change(e)}
            className={`form-control kgsWidth ${formErrors.weightkl ?'is-invalid': ''}`}
            id="weightkl"
            placeholder="your weight in kgs"
          />
          <small className="form-text text-muted">number from 50 to 140</small>
          <div className='invalid-feedback'>{formErrors.weightkl}</div>
       </div>
       
       
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="life"
            id="low"
            value="sedentary"
            checked={this.state.life === "sedentary"}
            onChange={e => this.change(e)}
          />
          <label htmlFor="low" className="form-check-label ">
          <span className="activity">I am sedentary or do light activity (light excersize 1-3 days
          per week to no excersize)</span>
     
          </label>

          </div>
        
          <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="life"
            id="med"
            value="moderate"
            checked={this.state.life === "moderate"}
            onChange={e => this.change(e)}
          />
           <label htmlFor="med" className="form-check-label">
           <span className="activity">
           I am active or moderately active (moderate excersize or sports
          3-5 days per week)
           </span>

          </label>
          </div>
          <div className="form-check">
          <input
           className="form-check-input"
            type="radio"
            name="life"
            id="high"
            value="vigorous"
            checked={this.state.life === "vigorous"}
            onChange={e => this.change(e)}
          />
           <label htmlFor="high" className="form-check-label activity">
           <span className="activity">
           I am super active (very hard excersize or sports 6-7 days per
          week)
           </span>

          </label>
          </div>

     
        <button onClick={e => this.onSubmit(e)}>Calculate BMI</button>
        <button
          type="reset"
          name="clear"
          value="clear"
          onClick={this.clearhtmlForm}
        >
          Clear
        </button>
      </form>
     
      </div>
   
      );
}
}

const condition = authUser => authUser !== null;

export default WithAuthorization(condition)(HomePage);


