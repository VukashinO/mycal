import React, { Component } from 'react';
import './MyProfile.css';
import axios from 'axios';
import * as ROUTES from '../../Constants/Routes';
import { Modal, Button } from 'react-bootstrap';
import * as API from '../../ApiController/api';


class MyProfile extends Component {

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
    isFormValid: false,
    show: false,
    showMessage: false
  };

  //  ------------------------- Check if Route is BMR or EDIT -----------------------------
  componentDidMount() {
      if(this.props.location.pathname === "/setup") return;
      const token = JSON.parse(localStorage.getItem('token'));
      axios.get("http://localhost:55494/api/user/myprofile", {headers:{"Authorization": `Bearer ${token}`}})
      .then(responce => 
         this.setState({ 
        age : responce.data.age, 
        heightcm:responce.data.height, 
        weightkl: responce.data.weight,
        life: responce.data.activity,
        gender: responce.data.gender  
      }))
      .catch(err => console.log(err));
      console.log(this.state.life);
      console.log(this.state.gender);
    }

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

  //---------------------- set time out for BMR and EDIT page ---------------------------
  handleTimeout = () => {
    setTimeout(() => {
      this.props.history.push(ROUTES.DIET);
     }, 6000);
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
    if(this.props.location.pathname === '/myprofile')
    {
      const post = {
        age,
        height: heightcm,
        weight: weightkl,
        activity: life,
        gender
      }
      const token = JSON.parse(localStorage.getItem('token'));
      console.log(token)
      API.editUser(post, token)     
       //axios.put("http://localhost:55494/api/user/edit", post, {headers:{"Authorization": `Bearer ${token}`}})
      .then(res => 
      this.props.history.push(ROUTES.DIET)
  )
   .catch(err => console.log(err))
      this.setState( { show : true} );
      this.handleTimeout();
      return;
    }
    if (this.formValidation(this.state.formErrors) && this.state.gender) {
      
      const post = {
        age,
        height: heightcm,
        weight: weightkl,
        activity: life,
        gender
      }

          const token = JSON.parse(localStorage.getItem('token'));
          API.editUser(post, token)  
      //axios.put("http://localhost:55494/api/user/edit", post, {headers:{"Authorization": `Bearer ${token}`}})
      .then(res => 
        this.props.history.push(ROUTES.DIET)
      )
       .catch(err => console.log(err))
    }
    else {
      this.setState({ isFormValid: true })
      return;
    }
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
    let showUserMessage = null;
    if(this.state.showMessage)
    {
      showUserMessage =
      <Modal show={this.state.showMessage} dialogClassName="modal-">
        <Modal.Header>
          <Modal.Title>Edit Page</Modal.Title>
        </Modal.Header>
        <Modal.Body><p style={{color: 'green'}}>Welcome {retriveObj.name} We've been expecting you.</p></Modal.Body>
        <Modal.Footer>
          &copy; 2019 MyCalorieApp
        </Modal.Footer>
    </Modal> 
    }
    return (
      <div className="row">
        <div className="col">
      {fillCorrect}
    <form onSubmit={this.onSubmit} className="formStyle">
      <div className="formHeader">
      <h1>Calculate BMI <span className="span1">(Metric unit)</span></h1>
      </div>
      <div className="row genderHeight m-2 ">
      <label className="col-sm-2 labelField">Gender</label>
      <div className="col-sm-10">
        <div className="form-check form-check-inline">

          <input
            className="form-check-input "
            type="radio"
            name="gender"
            value="male"
            checked={this.state.gender === "male" || this.state.gender === 0}
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
            checked={this.state.gender === "female" || this.state.gender === 1}
            onChange={e => this.change(e)}
            id="female"
          />
          <label htmlFor="female" className="form-check-label radioStyle">Female</label>
        </div>
  </div>   
      </div>
      <div>
      <div className="row m-2">
      <label htmlFor="age" className="col-sm-2 labelField">Age</label>
        <div className="col-sm-10 form-group">
         
            
            <input
              type="text"
              name="age"
              value={this.state.age}
              onChange={e => this.change(e)}
              className={`${formErrors.age ? 'is-invalid' : ''} form-control`}
              id="age"
              placeholder="Age"
            />
            <small className="form-text text-muted text-muted-left">Age from 12 to 75</small>
            {formErrors.age && <div className='invalid-feedback'>{formErrors.age}</div>}

        
        </div>
        </div>
        <div className="row m-2">
        <label htmlFor="heightcm" className="col-sm-2 labelField">Height</label>
       
          <div className="col-sm-10 form-group">
            
            <input
              type="text"
              name="heightcm"
              value={this.state.heightcm}
              onChange={e => this.change(e)}
              className={`${formErrors.heightcm ? 'is-invalid' : ''} form-control`}
              id="heightcm"
              placeholder="Height"
            />
            <small className="form-text text-muted text-muted-left">Height from 120 to 210</small>
            {formErrors.heightcm && <div className='invalid-feedback'>{formErrors.heightcm}</div>}
          </div>
        
        </div>



      <div className="row m-2">
        <label htmlFor="weightkl" className="col-sm-2 labelField">Weight</label>
        <div className="col-sm-10 form-group">
        <input
          type="text"
          name="weightkl"
          value={this.state.weightkl}
          onChange={e => this.change(e)}
          className={`${formErrors.weightkl ? 'is-invalid' : ''} form-control`}
          id="weightkl"
          placeholder="Weight"               
        />
        <small className="form-text text-muted text-muted-left">Weight from 50 to 140</small>
        {formErrors.weightkl && <div className='invalid-feedback'>{formErrors.weightkl}</div>}
        </div>
      </div>
      </div>

         <div className="divRadio">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="life"
                  id="low"
                  value="sedentary"
                  checked={this.state.life === "sedentary" || this.state.life === 0}
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
                  checked={this.state.life === "moderate" || this.state.life === 1}
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
                  checked={this.state.life === "vigorous" || this.state.life === 2}
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
        </div>

          <div style={{ textAlign: 'center'}}>
            <button type="submit" className="btn btn-success">Save</button>
            { this.props.location.pathname === "/setup"? <button
          className="btn btn-danger"
          type="reset"
          name="clear"
          value="clear"
          onClick={this.clearhtmlForm}
          style={{marginLeft:'20px'}}
        >
          Clear
        </button > : null}
          </div>

        </form>
              <Modal show={this.state.show} dialogClassName="modal-">
                  <Modal.Header>
                    <Modal.Title>Edit Page</Modal.Title>
                  </Modal.Header>
                  <Modal.Body><p style={{color: 'green'}}>Successfully updated your BMR!</p></Modal.Body>
                  <Modal.Footer>
                    &copy; 2019 MyCalorieApp
                  </Modal.Footer>
              </Modal>  
            {showUserMessage}
            </div>
      </div>

    );
  }
}

//const condition = authUser => authUser !== null;
const condition = localStorage.getItem('token') !== null;
//export default WithAuthorization(condition)(MyProfile);
export default MyProfile;


