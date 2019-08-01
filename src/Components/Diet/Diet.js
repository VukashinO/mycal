import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
import * as API from '../../ApiController/api';

//Api's here :



// ---------------- URL to firebase

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
    uniqueId: null,
  }

  // ------------ Load data from FireBase -------------------

  componentDidMount() {
    if(!JSON.parse(localStorage.getItem("token"))) this.props.history.push( ROUTES.SIGN_IN );

    this.setState({ isFetched: true })

    const token = JSON.parse(localStorage.getItem('token'));
    console.log(token)
    API.getTotalCalories(token)
    //axios.get("http://localhost:55494/api/health/totalcalories",  {headers:{"Authorization": `Bearer ${token}`}})
    .then(res => {
      this.setState({
        bmr: res.data.bmr,
        calories: res.data.totalCalories.toFixed(0),
        showCalories: res.data.totalCalories.toFixed(0),
      })
    });
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
      axios.get(`${API_EDAMAM}${this.state.searchText}${API_KEY}`)
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
    this.setState({
      nutritionFacts: false, 
      serving: '',
      value: 'Choose serving', 
      valueMeal: 'Breakfast' 
    })
  
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
    return calculateMesure;
  };

  // ------------------- Update the state if Modal is correct or show error message
  handleSubmitModal = () => {
    
    
    let cup = this.state.cup;
    let gram = this.state.gram;
    let defaultGram = this.state.defaultGram;
    let ounce = this.state.ounce;
    let pound = this.state.pound;
    let kilo = this.state.kilo;

    if (this.state.servingError === null && this.state.value !== 'Choose serving') {

      let foodCalorieCalculation = this.handleMesures();
      this.setState({ cup, gram, defaultGram, ounce, pound, kilo })
      console.log(this.state.foodCalorieCalculation)
      const post = {
        dateCreated: this.getCurrentDate(),
        name: this.state.foodName,
        calories:foodCalorieCalculation,
        mealType: this.state.valueMeal
      }
      const token = JSON.parse(localStorage.getItem('token'));
      console.log(token)
      API.createMeal(post, token) 
      //axios.post("http://localhost:55494/api/meal/create", post, {headers:{"Authorization": `Bearer ${token}`}})
      .then(res => this.setState({ uniqueId:res.data }));
      this.handleCancelModal();
    }
    else {
      return this.setState({ isCorrect: true })
    }
  }

  // ------------------------- Saving Diet to Firebase
  saveDiet = () => {
  //   let dietCalories = this.state.dietData.map(diet => diet.calories)
  //   .reduce((acc, curr) => {
  //     return acc + curr
  //   }, 0)
  // const post = {
  //   date: this.getCurrentDate(),
  //   user: this.state.user.email,
  //   dietInfo: this.state.dietData,
  //   totalCalories: dietCalories
  // }
  //   axios.ge
  // if (dietCalories < 1000) {
  //   this.setState({ show: true })
  //   return;
  // }
  //this.setState({ dietData: [], calories: this.state.showCalories, loading: false, searchFood: false, isDietSaved: true })
  // this.setState({ loading: true })
  // axios.post(`${getDataFromFirebase}/diet.json`, post)
  //   .then(responce => {
  //     this.setState({ dietData: [], calories: this.state.showCalories, loading: false, searchFood: false, isDietSaved: true })
  //   })
  //   .catch(err => err)
  }

  //----------------- Delete Food on the dinamic table
  handleDelete = (ind, calories) => {
    const index = this.state.dietData.findIndex(diet => diet.id === ind)
    console.log(index)
    const dietData = [...this.state.dietData]
    dietData.splice(index, 1)
    const cal = this.state.startCount;
    this.setState({ dietData, startCount: cal - calories })
    const token = JSON.parse(localStorage.getItem('token'));
    API.deleteMeal(this.state.uniq, token)
    //axios.delete(`http://localhost:55494/api/meal/delete/${this.state.uniqueId}`, {headers:{"Authorization": `Bearer ${token}`}})
    .then(responce => console.log(responce))
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

    //----------------------------- Renering mini table for diet to save with firebase -----------------------------
    const breakFast = this.state.dietData.filter(diet => diet.meal === 'Breakfast')
      .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories
      <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}><div className="buttonIcon">X</div></button>
      </span>
      </td></tr>)

    const lunch = this.state.dietData.filter(diet => diet.meal === 'Lunch')
      .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories
       <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}><div className="buttonIcon">X</div></button>
      </span>
      </td></tr>)

    const dinner = this.state.dietData.filter(diet => diet.meal === 'Dinner')
      .map((meal, i) => <tr key={meal.foodName + i}><td><span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories
             <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}><div className="buttonIcon">X</div></button>
      </span>
      </td></tr>)


    // --------------------------- Error message for below zero calories -------------------------------
    let errorMessage = null;
    if (this.state.isBelowZero) {
      errorMessage =

        <Modal show={this.state.isBelowZero} onHide={this.handleChangeError}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to eat this food ?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please stay motivate so you can cut your weight!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleChangeError}>
              Close
          </Button>
          </Modal.Footer>
        </Modal>
    }

    // -------------------------------Fill form correct -----------------------------
    let isModalCorrect = null;
    if (this.state.isCorrect) {
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
        <Modal.Footer><Button variant="secondary" onClick={this.handleClose}>Close</Button></Modal.Footer>
             
      </Modal>
    }

    // -------------------------------- Save diet -------------------------------------
    let dietSaveMessage = null;
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
                  Search our food database!
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
              </div>
            </div>
            <div className="marginTop">
              <div style={{ padding: '10px' }}>
                <table className="userTable">

                  <tbody >
                    <tr><td><h3>My diet</h3></td></tr>
                    <tr><td><span className="dietTableTh">Breakfast</span></td></tr>
                    {breakFast}
                    <tr><td><span className="dietTableTh">Lunch</span></td></tr>
                    {lunch}
                    <tr><td><span className="dietTableTh">Dinner</span></td></tr>
                    {dinner}
                  </tbody>
                  <tfoot>
                    {/* <tr><td><button className="btn btn-success" onClick={this.saveDiet}>Check Calendar</button></td></tr> */}
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

export default withRouter(Diet);
