import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { WithAuthorization } from '../Hoc/Hoc';
import axios from 'axios';
import Spiner from '../../Components/UI/Spiner/Spiner';
import RenderTable from '../../Components/RenderTable/RenderTable';
import Search from '../../Components/Search/Search';
import './Diet.css';
import MyModal from '../../Components/UI/MyModal/MyModal';
import Auxiliary from '../../Components/myHoc/Auxiliary';
import NutritionSummary from '../../Components/NutritionSummary/NutritionSummary';
import * as ROUTES from '../../Constants/Routes';
import Messures from '../../Components/MesuresEnum/MesuresEnum';
import { Modal, Button } from 'react-bootstrap';

//Api's here :

// ---------------- URL to firebase
const getDataFromFirebase = 'https://my-fitness-app-81de2.firebaseio.com';

class Diet extends Component {
  state = {
    bmr: null,
    calories: null,
    showCalories: null,
    foodData: null,
    searchText: '',
    loading: false,
    nutritionFacts: false,

    currentPage: 1,
    itemsPerPage: 4,

    individualCalorie: null,
    //measuresObj: ['choose serving:', 'Cup', 'Gram', 'Ounce', 'Serving', 'Pound', 'Kilogram'],
    foodName: '',

    value: 'Choose serving',
    cup: null,
    gram: null,
    defaultGram: null,
    ounce: null,
    pound: null,
    kilo: null,
    serving: '',
    servingError: '',
    dietData: [],
    valueMeal: 'Breakfast',

    dietFromFirebase: null,

    isBelowZero: false,
    searchFood: false,
    saveError: null,

    user: JSON.parse(localStorage.getItem('user')),
    isCorrect: false,
    isDietSaved: false,
    startCount: 0,
    userFirebase: null,

    show: false,
  }



  // ------------ Load data from FireBase -------------------

  componentDidMount() {

    this.setState({ isFetched: true })

    axios.get(`${getDataFromFirebase}/.json`)
      .then(responce => {
        const users = [];
        for (let key in responce.data.users) {
          users.push({ ...responce.data.users[key], id: key })
        }
        console.log(users)
        console.log(this.state.user.email)
        const userFirebase = users.find(user => user.email === this.state.user.email);
        console.log(userFirebase)
        this.setState({
          bmr: userFirebase.bmr,
          calories: userFirebase.calories,
          showCalories: userFirebase.calories,
          usersFromFirebase: users,
        })
        console.log(this.state.user)
      })
      .catch(err => console.log(err))
  }

  // ------------ Function for Get Current Date to save in Firebase --------------------
  getCurrentDate(separator = '-') {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
  }

  handleCalories = () => {
    this.setState((prevState) => ({ searchFood: !prevState.searchFood }))
  }

  // ----------- Changing state dinamic what user type ----------------------
  onChange = (text) => {
    this.setState(({ searchText: text }))
  }

  // --------------On submit making request to Edamam get Food Data
  handleSubmit = () => {
    if (this.state.searchText) {
      this.setState({ loading: true })
      axios.get(`${API}${this.state.searchText}${API_KEY}`)
        .then(responce => {
          let uniq = {};
          this.setState({
            foodData: responce.data.hints
              .filter(obj => !uniq[obj.food.foodId] && (uniq[obj.food.foodId] = true)), loading: false
          })

        })
        .catch(err => console.log(`something went wrong ${err}`))
    }

  };

  // ------------------- Seting state for Calorie on 100g and food name for the Modal
  handleOnclickNutriton = (individualCalorie, foodName) => {
    this.setState({ nutritionFacts: true, individualCalorie, foodName })
  }

  //--------------  On click to cancel Modal
  handleCancelModal = () => {
    this.setState({ nutritionFacts: false })
  }

  handleClickPagination = (event) => {
    this.setState({ currentPage: +event.target.id })
  }

  //----------------------- Quantity input and validation for the food modal
  handleInput = (event) => {
    let { name, value } = event.target;
    let error = this.state.servingError;
    error = value && value <= 5 ? null : "enter number from 1 to 5";
    this.setState({ servingError: error, [name]: value })
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  }

  handleChangeMeal = event => {
    this.setState({ valueMeal: event.target.value });
  }

  // --------------- Logic for calculating meal mesures
  handleMesures = () => {

    let mesure = this.state.value;

    if (!Messures[mesure]) return;

    let calculateMesure = mesure === "Serving" || mesure === "Steak" || mesure === "Tuna"
      ? Math.round(+ this.state.serving * (Messures[mesure] * this.state.individualCalorie))
      : Math.round(+ this.state.serving * (Messures[mesure] * this.state.individualCalorie) / 100);

    if (this.state.startCount + calculateMesure > this.state.calories) {
      this.setState(
        {
          isBelowZero: true,
          nutritionFacts: false
        })
    }

    this.setState((prevState) => ({
      startCount: prevState.startCount + calculateMesure,
      dietData: prevState.dietData.concat({
        meal: this.state.valueMeal,
        foodName: this.state.foodName,
        calories: calculateMesure
      }), nutritionFacts: false
    }))
  };

  // ------------------- Update the state if Modal i correct or show error message
  handleSubmitModal = () => {

    let cup = this.state.cup;
    let gram = this.state.gram;
    let defaultGram = this.state.defaultGram;
    let ounce = this.state.ounce;
    let pound = this.state.pound;
    let kilo = this.state.kilo;

    if (this.state.servingError === null && this.state.value !== 'Choose serving') {

      this.handleMesures();
      this.setState({ cup, gram, defaultGram, ounce, pound, kilo })
    }
    else {
      return this.setState({ isCorrect: true })
    }
  }

  // ------------------------- Saving Diet to Firebase
  saveDiet = () => {
    let dietCalories = this.state.dietData.map(diet => diet.calories)
      .reduce((acc, curr) => {
        return acc + curr
      }, 0)
    const post = {
      date: this.getCurrentDate(),
      user: this.state.user.email,
      dietInfo: this.state.dietData,
      totalCalories: dietCalories
    }

    if (dietCalories < 1000) {
      // old custom modal : saveError: true
      this.setState({ show: true })
      return;
    }

    this.setState({ loading: true })
    axios.post(`${getDataFromFirebase}/diet.json`, post)
      .then(responce => {
        console.log(responce)
        this.setState({ dietData: [], calories: this.state.showCalories, loading: false, searchFood: false, isDietSaved: true })
      })
      .catch(err => console.log(err))
  }

  //----------------- Delete Food on the dinamic table
  handleDelete = (ind, calories) => {
    const index = this.state.dietData.findIndex(diet => diet.id === ind)
    console.log(index)
    const dietData = [...this.state.dietData]
    dietData.splice(index, 1)
    // code for count from max to zero
    //const cal = this.state.calories 
    //this.setState({ dietData, calories: cal + calories })
    // code for zero to max
    const cal = this.state.startCount;
    this.setState({ dietData, startCount: cal - calories })
  }

  handleChangeError = () => {
    this.setState({ isBelowZero: false })
  }
  handleFillCorrect = () => {
    this.setState({ isCorrect: false })
  }

  onIsDietSaveHandle = () => {
    // this.setState({ isDietSaved:false })
    this.props.history.push(ROUTES.MYCALENDAR);
  }

  handleClose = () => {
    this.setState({ isCorrect: false, show: false });
  }



  render() {
    if (this.state.foodData) {
      (this.state.foodData.forEach(obj => console.log(obj.measures)))
    }


    //--------------------Pagination --------------------------------
    this.state.dietData.forEach((diet, i) => { diet.id = i })
    const pageNumbers = [];
    if (this.state.foodData) {
      for (let i = 1; i <= Math.ceil(this.state.foodData.length / this.state.itemsPerPage); i++) {
        pageNumbers.push(i);
      }
    }
    let indexOfLastFood;
    let indexOfFirstFood;
    let paginationFoods;
    if (this.state.foodData) {
      indexOfLastFood = this.state.currentPage * this.state.itemsPerPage;
      indexOfFirstFood = indexOfLastFood - this.state.itemsPerPage;
      paginationFoods = this.state.foodData.slice(indexOfFirstFood, indexOfLastFood);
    }
    const renderNumbersPagination = pageNumbers.map(num => <li className="pageNumbers" key={num}
      id={num}
      onClick={this.handleClickPagination}
    >{num}
    </li>)

    //-------------------------------  Conditional render table or loader -------------------------------

    let loader = <RenderTable
      foodData={paginationFoods}
      click={this.handleOnclickNutriton}
      numPagination={renderNumbersPagination}
    />
    if (this.state.loading) {
      loader = <Spiner />
    }


    let modalInfo = null;
    if (this.state.nutritionFacts) {
      modalInfo =
        <MyModal>
          <NutritionSummary
            // serving={this.state.individualCalorie}
            //select={this.state.measuresObj}
            onCancel={this.handleCancelModal}
            name={this.state.foodName}
            calories={this.state.calories}
            modal={this.state.nutritionFacts}
            onSubmit={this.handleSubmitModal}
            handleInput={this.handleInput}
            inputServing={this.state.serving}
            servingError={this.state.servingError}
            handleChange={this.handleChange}
            handleChangeMeal={this.handleChangeMeal}
            value={this.state.value}
            valueMeal={this.state.valueMeal}
            select2={this.state.foodData}
          />
        </MyModal>
    }

    console.log(this.props.location)

    //----------------------------- Renering mini table for diet to save with firebase -----------------------------
    const breakFast = this.state.dietData.filter(diet => diet.meal === 'Breakfast')
      .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories
      <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}><span className="buttonIcon">X</span></button>
      </span>
      </td></tr>)

    const lunch = this.state.dietData.filter(diet => diet.meal === 'Lunch')
      .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories</span>
        <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}>x</button></td></tr>)

    const dinner = this.state.dietData.filter(diet => diet.meal === 'Dinner')
      .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories}
        <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}>x</button>calories</span></td></tr>)


    // --------------------------- Error message for below zero calories -------------------------------
    let errorMessage = null;
    if (this.state.isBelowZero) {
      errorMessage =
        // <MyModal className="errorStyleDiv">
        //   <h3>you are passing your daily goal, are you sure you want to eat this food<span onClick={this.handleChangeError} style={{ cursor: 'pointer', fontWeight: 'bold', color: 'green' }}>ok</span>
        //   </h3>
        // </MyModal>
        <Modal show={this.state.isBelowZero} onHide={this.handleChangeError}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to eat this food ?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please stay motivate so you can cut your weight!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleChangeError}>
              Close
          </Button>
            {/* <Button variant="primary" onClick={this.handleClose}>
            Save Changes
          </Button> */}
          </Modal.Footer>
        </Modal>
    }

    // --------------------------------------------------- Render save error ---------------------------------
    //  let saveError = null;
    //  if (this.state.saveError) {
    //    saveError =
    //      <MyModal>
    //        <Auxiliary>

    //          <p style={{ color: 'red' }}>Based on your total calories consumed for today, you are likely not eating enough.</p>
    //         <p>For safe weight loss, the National Institutes of Health recommends no less than 1000-1200 calories for women and 1200-1500 calories for men.</p>
    //          <p>Even during weight loss, it's important to meet your body's basic nutrient and energy needs. Over time, not eating enough can lead to nutrient deficiencies, unpleasant side effects & other serious health problems.</p>
    //         <button
    //           onClick={() => { this.setState({ saveError: null }) }}
    //           className="btn btn-success buttonMargin">ok</button>
    //        </Auxiliary>
    //      </MyModal>
    // }

    // -------------------------------Fill form correct -----------------------------
    let isModalCorrect = null;
    if (this.state.isCorrect) {
      // isModalCorrect = <MyModal>
      //   <h3 onClick={this.handleFillCorrect} className="fillCorrect">please choose quantity or select measure</h3>
      // </MyModal>
      isModalCorrect = <Modal
        size="sm"
        show={this.state.isCorrect}
        onHide={this.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Fill Correct
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>Please choose quantity or select Measure</Modal.Body>
      </Modal>
    }

    // -------------------------------- Save diet -------------------------------------
    let dietSaveMessage = null;
    // if (this.state.isDietSaved) {
    //   dietSaveMessage =
    //     <MyModal>
    //       <Auxiliary>
    //         <h1>Your diet have been successfuly saved!</h1>
    //         <h2>would you like to check your diet calendar?</h2>
    //         <div>
    //           <button className="btnConfirm-btnSucsses" onClick={this.onIsDietSaveHandle}>yes</button>
    //           <button className="btnConfirm-btnCancel" onClick={() => (this.setState({ isDietSaved: false, startCount: 0 }))}>no</button>
    //         </div>

    //       </Auxiliary>
    //</MyModal>
    if (this.state.isDietSaved) {
      dietSaveMessage =
        <Modal show={this.state.isDietSaved} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Diet Save</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{ color: 'green' }}>
              Your diet have been successfuly saved!
              would you like to check your diet calendar?
                </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={this.onIsDietSaveHandle}>
              Yes
                  </Button>
            <Button variant="secondary" onClick={() => (this.setState({ isDietSaved: false, startCount: 0 }))}>
              No
                  </Button>
          </Modal.Footer>
        </Modal>
    }
    //  let renderDailyGoal = null;
    //  if(this.state.isFetched)
    //  {
    //    renderDailyGoal = 
    //    <div className="marginTop">
    //    <div>
    //        <p className="leftColParagrafs">Basaed on your bmr: <b>{this.state.bmr}, </b>
    //          you will need <b>{this.state.showCalories}</b> calories
    //          to maintain your weith.
    //           </p> 
    //    <h3>Goal:<span className="dailyGoal">
    //      {this.state.calories}</span> /<span className={this.state.startCount === 0 || 
    //      this.state.startCount > this.state.calories? 'dangerZone' : 'dailyGoal'}> {this.state.startCount}</span> calories</h3>
    //      {/* hide - add food */}
    //  {/* <button className="btn btn-primary" onClick={this.handleCalories}>{this.state.searchFood ? 'hide food' : 'add food'}</button> */}
    //  </div>
    //  </div>
    //  }


    console.log(this.state.isDietSaved)
    return (
      <Auxiliary>
        {modalInfo}
        <div className="row justify-content-between">
          {isModalCorrect}
          <div className="col-7">
            <Search
              handleSubmit={e => {
                e.preventDefault();
                this.handleSubmit()
              }}
              onChange={(e) => this.onChange(e.target.value)}
              value={this.state.searchText}
            />
            {
              !this.state.foodData &&
              <div className="headerInstructions">
                <h4 >
                  Search our food database from Edamam!
                  </h4>
              </div>
            }

            {loader}
            {errorMessage}
          </div>
          <div className="col-5">

            <div className="marginTop">
              <div>
                <p className="leftColParagrafs">Based on your bmr: <b>{this.state.bmr}, </b>
                  you will need <b>{this.state.showCalories}</b> calories
                  to maintain your weight.
                </p>
                <h3>Goal:<span className="dailyGoal">
                  {this.state.calories}</span> /<span className={this.state.startCount === 0 ||
                    this.state.startCount > this.state.calories ? 'dangerZone' : 'dailyGoal'}> {this.state.startCount}</span> calories</h3>
                {/* hide - add food */}
                {/* <button className="btn btn-primary" onClick={this.handleCalories}>{this.state.searchFood ? 'hide food' : 'add food'}</button> */}
              </div>
            </div>
            <div className="marginTop">
              <div style={{ padding: '10px' }}>
                <table className="userTable">

                  <tbody >
                    <tr><td><h3>My diet</h3></td></tr>
                    {/* <tr><td><p>cal:{dietCalories}</p></td></tr> */}
                    <tr><td><span className="dietTableTh">Breakfast</span></td></tr>
                    {breakFast}
                    <tr><td><span className="dietTableTh">Lunch</span></td></tr>
                    {lunch}
                    <tr><td><span className="dietTableTh">Dinner</span></td></tr>
                    {dinner}
                  </tbody>
                  <tfoot>
                    <tr><td><button className="btn btn-success" onClick={this.saveDiet}>Save diet</button></td></tr>
                  </tfoot>

                </table>
                {dietSaveMessage}
                <Modal
                  show={this.state.show} onHide={this.handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>
                      Friendly advice for safe fat loss
            </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p style={{ color: 'red' }}>
                      Based on your total calories consumed for today, you are likely not eating enough.
                      For safe weight loss, the National Institutes of Health recommends no less than 1000-1200 calories for women and 1200-1500 calories for men.
            </p>
                    <p>
                      Even during weight loss, it's important to meet your body's basic nutrient and energy needs. Over time, not eating enough can lead to nutrient deficiencies, unpleasant side effects & other serious health problems.
            </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>

      </Auxiliary>



    );
  }
}
const condition = authUser => authUser !== null;

export default withRouter(WithAuthorization(condition)(Diet));
