import React, { Component } from 'react';
import { WithAuthorization } from '../Hoc/Hoc';
import './Bmr.css';
import * as ROUTES from '../../Constants/Routes';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

// firebaseURL
const firebaseURL = 'https://my-fitness-app-81de2.firebaseio.com';

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
    } 
    if (life === "moderate") { // i ova u funkcija 
      calories = bmr * 1.76;
    } 
    if (life === "vigorous") {
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
          weightkl,
          life,
          gender
      }

    axios.post(`${firebaseURL}/users.json`, post)
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
      // fillCorrect = <MyModal>
      //   <MyCustomError handleCorrectly={this.handleCorrectly} />
      // </MyModal>
      fillCorrect = 
      <Modal show={this.state.isFormValid} onHide={this.handleCorrectly}>
      <Modal.Header closeButton>
        <Modal.Title>Form Handling</Modal.Title>
      </Modal.Header>
      <Modal.Body><p style={{color: 'red'}}>Please fill out every field with correct data!</p></Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={this.handleCorrectly}>
          Close
        </Button>
    
      </Modal.Footer>
    </Modal>
    }


    const retriveObj = JSON.parse(localStorage.getItem('user'));
    console.log((retriveObj.name))

    return (
    <div className="row">
        {fillCorrect}
        <form onSubmit={this.onSubmit} className="formStyle">

            <div className="formHeader">
              <h1>Calculate BMI <span className="span1">(Metric unit)</span></h1>
            </div>
          <div className="row justify-content-end genderHeight m-2 ">
              <label className="col-sm-6 labelField">Gender</label>
            <div className="col-sm-4 " style={{marginRight: '7px'}}>
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
              </div>

              <div>
              <div className="row justify-content-end m-2">
              <label htmlFor="age" className="col-sm-2 labelField">Age</label>
                <div className="col-sm-8 form-group">
                 
                    
                    <input
                      type="text"
                      name="age"
                      value={this.state.age}
                      onChange={e => this.change(e)}
                      className={`${formErrors.age ? 'is-invalid' : ''} form-control`}
                      id="age"
                      placeholder="your Age"
                    />
                    <small className="form-text text-muted text-muted-left">number from 12 to 75</small>
                    {/* conditional rendering */}
                    {/* <div className='invalid-feedback'>{formErrors.age}</div>  */}
                    {formErrors.age && <div className='invalid-feedback'>{formErrors.age}</div>}
    
                
                </div>
                </div>
                <div className="row justify-content-end m-2">
                <label htmlFor="heightcm" className="col-sm-2 labelField">Height</label>
               
                  <div className="col-sm-8 form-group">
                    
                    <input
                      type="text"
                      name="heightcm"
                      value={this.state.heightcm}
                      onChange={e => this.change(e)}
                      className={`${formErrors.heightcm ? 'is-invalid' : ''} form-control`}
                      id="heightcm"
                      placeholder="height in cm"
                    />
                    <small className="form-text text-muted text-muted-left">number from 120 to 210</small>
                    {/* <div className='invalid-feedback'>{formErrors.heightcm}</div> */}
                    {formErrors.heightcm && <div className='invalid-feedback'>{formErrors.heightcm}</div>}
                  </div>
                
                </div>
    
    
    
              <div className="row justify-content-end m-2">
                <label htmlFor="weightkl" className="col-sm-2 labelField">Weight</label>
                <div className="col-sm-8 form-group">
                <input
                  type="text"
                  name="weightkl"
                  value={this.state.weightkl}
                  onChange={e => this.change(e)}
                  className={`${formErrors.weightkl ? 'is-invalid' : ''} form-control`}
                  id="weightkl"
                  placeholder="weight in kgs"               
                />
                <small className="form-text text-muted text-muted-left">number from 50 to 140</small>
                {/* <div className='invalid-feedback'>{formErrors.weightkl}</div> */}
                {formErrors.weightkl && <div className='invalid-feedback'>{formErrors.weightkl}</div>}
                </div>
              </div>
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


