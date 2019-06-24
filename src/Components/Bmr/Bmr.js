import React, { Component } from 'react';
import { WithAuthorization } from '../Hoc/Hoc';
import './Bmr.css';
import * as ROUTES from '../../Constants/Routes';
import Modal from '../UI/Modal/Modal';
import MyCustomError from '../myCustomError/MyCustomError';
import axios from 'axios';

class Bmr extends Component {

  state = {
    age: "",
    heightcm: "",
    weightkl: "",
    life: "",
    result: "",
    calories: "",
    gender: "",

    formErrors: {
      age: "",
      heightcm: "",
      weightkl: ""
    },
    isSubmited: false,
    isFormValid: false
  };
  //------------------------ Cheking the values if true or false -------------------
  formValidation = formErrors => {
    let isValid = true;
    Object.values(formErrors).forEach(val => {
      val !== null && (isValid = false);
    })
    return isValid;
  }

  //-------------------------- Handle inputs and cust validation ---------------------------
  change = e => {

    const { name, value } = e.target;
    let formErrors = this.state.formErrors;
    switch (name) {
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

  //-------------------- Handle radio buttons ---------------------------
  onRadioChange = value => {
    console.log("radio change");
    this.setState({
      gender: value,
      life: value
    });
  }

  // -------------------- Handle all inputs and saving on Firebase ----------------------
  onSubmit = e => {
    e.preventDefault();
    //console.log(this.state);
    let bmr = this.state.result;
    let gender = this.state.gender;
    let age = this.state.age;
    let heightcm = this.state.heightcm;
    let weightkl = this.state.weightkl;
    let life = this.state.life;
    if (this.formValidation(this.state.formErrors) && this.state.gender) {
      if (gender && weightkl && heightcm && age && life) {
        if (gender === "male") {
          bmr = 10 * weightkl + 6.25 * heightcm - 5 * age + 5; // funkcija da bide refactor
        } else if (gender === "female") {
          bmr = 10 * weightkl + 6.25 * heightcm - 5 * age - 161;
        }
      }
    }
    else {
      this.setState({ isFormValid: true })
      return;
      // return window.alert("Please fill in everything correctly");
    }

    let calories = this.state.calories;

    if (life === "sedentary") {
      calories = bmr * 1.53;
    } else if (life === "moderate") { // i ova u funkcija 
      calories = bmr * 1.76;
    } else {
      calories = bmr * 2.25;
    }

    this.setState({ result: bmr, calories: calories })
    const retriveObj = JSON.parse(localStorage.getItem('user'));
    const post = {
      user: retriveObj.name,
      email: retriveObj.email,
      bmr: bmr.toFixed(0),
      calories: calories.toFixed(0),
      age,
      heightcm,
      weightkl
    }

    axios.post('https://my-fitness-app-81de2.firebaseio.com/users.json', post)
      .then(res => {
        this.props.history.push(ROUTES.DIET)
      })

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

  handleCorrectly = () => {
    this.setState({ isFormValid: false })
  }

  render() {

    const { formErrors } = this.state;

    //------ Render Modal if form is not correct
    let fillCorrect = null;
    if (this.state.isFormValid) {
      fillCorrect = <Modal>
        <MyCustomError handleCorrectly={this.handleCorrectly} />
      </Modal>
    }


    const retriveObj = JSON.parse(localStorage.getItem('user'));
    console.log((retriveObj.name))

    return (


      <div className="row">
        {fillCorrect}
        <form onSubmit={this.onSubmit} className="formStyle">

          <h1>Calculate BMI <span className="span1">(Metric unit)</span></h1>
          <h3 style={{ textAlign: 'center' }}>Choose Gender</h3>
          <div style={{ textAlign: 'center' }}>
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
                  className={`form-control ${formErrors.age ? 'is-invalid' : ''}`}
                  id="age"
                  placeholder="your Age"
                />
                <small className="form-text text-muted">number from 12 to 75</small>
                {/* conditional rendering */}
                {/* <div className='invalid-feedback'>{formErrors.age}</div>  */}
                {formErrors.age && <div className='invalid-feedback'>{formErrors.age}</div>}

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
                  className={`form-control ${formErrors.heightcm ? 'is-invalid' : ''}`}
                  id="heightcm"
                  placeholder="height in cm"
                />
                <small className="form-text text-muted">number from 120 to 210</small>
                {/* <div className='invalid-feedback'>{formErrors.heightcm}</div> */}
                {formErrors.heightcm && <div className='invalid-feedback'>{formErrors.heightcm}</div>}
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
              className={`form-control kgsWidth ${formErrors.weightkl ? 'is-invalid' : ''}`}
              id="weightkl"
              placeholder="weight in kgs"
              style={{ width: '20%' }}
            />
            <small className="form-text text-muted">number from 50 to 140</small>
            {/* <div className='invalid-feedback'>{formErrors.weightkl}</div> */}
            {formErrors.weightkl && <div className='invalid-feedback'>{formErrors.weightkl}</div>}
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
              <span className="activity">
                <h4>
                  I am sedentary or do light activity (light excersize 1-3 days
                  per week to no excersize)
         </h4>
              </span>

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
                <h4>
                  I am active or moderately active (moderate excersize or sports
                 3-5 days per week)
          </h4>
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
                <h4>
                  I am super active (very hard excersize or sports 6-7 days per
                 week)
          </h4>
              </span>

            </label>
          </div>

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <button type="submit" className="btn btn-success">Calculate BMI</button>
            {/* <button
          className="btn btn-warning"
          type="reset"
          name="clear"
          value="clear"
          onClick={this.clearhtmlForm}
          style={{marginLeft:'20px'}}
        >
          Clear
        </button > */}
          </div>

        </form>

      </div>

    );
  }
}

const condition = authUser => authUser !== null;

export default WithAuthorization(condition)(Bmr);


