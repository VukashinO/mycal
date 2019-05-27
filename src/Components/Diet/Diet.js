import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { WithAuthorization } from '../Hoc/Hoc';
import axios from 'axios';
import Spiner from '../../Components/UI/Spiner/Spiner';
import RenderTable from '../../Components/RenderTable/RenderTable';
import Search from '../../Components/Search/Search';
import './Diet.css';
import Modal from '../../Components/UI/Modal/Modal';
import Auxiliary from '../../Components/myHoc/Auxiliary';
import NutritionSummary from '../../Components/NutritionSummary/NutritionSummary';
import User from '../../Components/User/User';

const API = 'https://api.edamam.com/api/food-database/parser?nutrition-type=logging&ingr=';
const API_KEY = '&app_id=ec5bc123&app_key=7bdb51e00e617d9d25545d840d03fa0b';



class Diet extends Component {
  state = {
    bmr: this.props.location.state.bmr,
    calories: this.props.location.state.calories,
    showCalories: this.props.location.state.calories,

    foodData: null,
    searchText: '',
    loading: false,
    nutritionFacts: false,

    currentPage: 1,
    itemsPerPage: 4,

    individualCalorie: null,
    measuresObj: ['choose serving:', 'Cup', 'Gram', 'Ounce', 'Serving', 'Pound', 'Kilogram'],
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
    saveError: null
  }

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

  onChange = (text) => {
    this.setState(({ searchText: text }))
  }

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

  handleOnclickNutriton = (individualCalorie, foodName) => {
    this.setState({ nutritionFacts: true, individualCalorie, foodName })
  }

  handleCancelModal = () => {
    this.setState({ nutritionFacts: false })
  }
  myFirebase = () => {
    axios.get('https://my-fitness-app-81de2.firebaseio.com/.json')
      .then(responce => {
        let arr = []
        for (let diet in responce.data.diet) {
          arr.push(responce.data.diet[diet])
        }

        this.setState({ dietFromFirebase: arr })
        console.log(arr)
      })
  }

  handleClickPagination = (event) => {
    console.log(+event.target.id)
    this.setState({ currentPage: +event.target.id })
  }
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

  handleSubmitModal = () => {

    let cup = this.state.cup;
    let gram = this.state.gram;
    let defaultGram = this.state.defaultGram;
    let ounce = this.state.ounce;
    let pound = this.state.pound;
    let kilo = this.state.kilo;
    if (this.state.servingError === null && this.state.value !== 'Choose serving') {

      if (this.state.value === 'Cup') {

        cup = Math.round(+this.state.serving * (156 * this.state.individualCalorie) / 100)
        if (this.state.calories - cup < 0) {
          this.setState({ isBelowZero: true, nutritionFacts: false })
          return;
        }
        this.setState((prevState) => ({
          calories: prevState.calories - cup,
          dietData: prevState.dietData.concat({
            meal: this.state.valueMeal,
            foodName: this.state.foodName,
            calories: cup
          }), nutritionFacts: false
        }))

      }
      if (this.state.value === 'Gram') {
        gram = Math.round(+this.state.serving * (1 * this.state.individualCalorie) / 100)
        if (this.state.calories - gram < 0) {
          this.setState({ isBelowZero: true, nutritionFacts: false })
          return;
        }
        this.setState((prevState) => ({
          calories: prevState.calories - gram,
          dietData: prevState.dietData.concat({
            meal: this.state.valueMeal,
            foodName: this.state.foodName,
            calories: gram
          }), nutritionFacts: false
        }))
        // this.state.dietData.breakFast= {}
      }

      if (this.state.value === 'Ounce') {
        ounce = Math.round(+this.state.serving * (28.3495 * this.state.individualCalorie) / 100)
        if (this.state.calories - ounce < 0) {
          this.setState({ isBelowZero: true, nutritionFacts: false })
          return;
        }
        this.setState((prevState) => ({
          calories: prevState.calories - ounce,
          dietData: prevState.dietData.concat({
            meal: this.state.valueMeal,
            foodName: this.state.foodName,
            calories: ounce
          }), nutritionFacts: false
        }))
      }
      if (this.state.value === 'Serving') {
        defaultGram = +this.state.serving * this.state.individualCalorie;
        if (this.state.calories - defaultGram < 0) {
          this.setState({ isBelowZero: true, nutritionFacts: false })
          return;
        }
        this.setState((prevState) => ({
          calories: prevState.calories - defaultGram,
          dietData: prevState.dietData.concat({
            meal: this.state.valueMeal,
            foodName: this.state.foodName,
            calories: defaultGram
          }), nutritionFacts: false
        }))
      }
      if (this.state.value === 'Pound') {
        pound = Math.round(+this.state.serving * (453.592 * this.state.individualCalorie) / 100)
        if (this.state.calories - pound < 0) {
          this.setState({ isBelowZero: true, nutritionFacts: false })
          return;
        }
        this.setState((prevState) => ({
          calories: prevState.calories - pound,
          dietData: prevState.dietData.concat({
            meal: this.state.valueMeal,
            foodName: this.state.foodName,
            calories: pound
          }), nutritionFacts: false
        }))
      }
      if (this.state.value === 'Kilogram') {
        kilo = Math.round(+this.state.serving * (1000 * this.state.individualCalorie) / 100)
        if (this.state.calories - kilo < 0) {
          this.setState({ isBelowZero: true, nutritionFacts: false })
          return;
        }
        this.setState((prevState) => ({
          calories: prevState.calories - kilo,
          dietData: prevState.dietData.concat({
            meal: this.state.valueMeal,
            foodName: this.state.foodName,
            calories: kilo
          }), nutritionFacts: false
        }))
      }

      this.setState({ cup, gram, defaultGram, ounce, pound, kilo })
    }
    else {
      alert('fill correct')
    }
  }
  saveDiet = () => {
    const post = [this.state.dietData, {
      date: this.getCurrentDate()
    }];
    // const diet =
    // {
    //   breakFast: { meal: 'oats', calories: 500 },
    //   launch: {},
    //   dinner: {},
    //   createdDate: '',
    //   totalCalories: 5000
    //}
    let dietCalories = this.state.dietData.map(diet => diet.calories)
      .reduce((acc, curr) => {
        return acc + curr
      }, 0)
    if (dietCalories < 1000) {
      this.setState({ saveError: true })
      return;
    }

    axios.post('https://my-fitness-app-81de2.firebaseio.com/diet.json', post)
      .then(responce => console.log(responce))
      .catch(err => console.log(err))
      
  }

  handleDelete = (ind, calories) => {
    const index = this.state.dietData.findIndex(diet => diet.id === ind)
    console.log(index)
    const dietData = [...this.state.dietData]
    dietData.splice(index, 1)
    const cal = this.state.calories
    this.setState({ dietData, calories: cal + calories })
  }

  handleChangeError = () => {
    this.setState({ isBelowZero: false })
  }
  render() {
    console.log(localStorage.getItem('userEmail'))
    //pagination:
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
    //  conditional render table or loader

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
      modalInfo = <Modal>
        <NutritionSummary
          // serving={this.state.individualCalorie}
          select={this.state.measuresObj}
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
        />
      </Modal>
    }

    // renering mini table for diet to save with firebase

    const breakFast = this.state.dietData.filter(diet => diet.meal === 'Breakfast')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories</span>
        <button onClick={() => this.handleDelete(meal.id, meal.calories)}>-</button></td></tr>)

    const lunch = this.state.dietData.filter(diet => diet.meal === 'Lunch')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories</span>
        <button onClick={() => this.handleDelete(meal.id, meal.calories)}>-</button></td></tr>)

    const dinner = this.state.dietData.filter(diet => diet.meal === 'Dinner')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories</span>
        <button onClick={() => this.handleDelete(meal.id, meal.calories)}>-</button></td></tr>)
    let errorMessage = null;

    // error message for below zero calories
    if (this.state.isBelowZero) {
      errorMessage = <div className="errorStyleDiv">
        <h3>You are passing your daily goal, choose mesure so u dont go below zero,
           please stay motivate so u can cut weigth<span onClick={this.handleChangeError} style={{ cursor: 'pointer', fontWeight: 'bold', color: 'green' }}>ok</span>
        </h3>
      </div>
    }

    // Search and API for food
    let searchFood = null;
    if (this.state.searchFood) {
      searchFood = <div >
        {errorMessage}
        <Search
          handleSubmit={e => {
            e.preventDefault();
            this.handleSubmit()
          }}
          onChange={(e) => this.onChange(e.target.value)}
          value={this.state.searchText}
        />
        {loader}
      </div>
    }

    // render save error
    let saveError = null;
    if (this.state.saveError) {
      saveError = <div>
        <p style={{ color: 'red' }}>Based on your total calories consumed for today, you are likely not eating enough.</p>
        <p>For safe weight loss, the National Institutes of Health recommends no less than 1000-1200 calories for women and 1200-1500 calories for men.</p>
        <p>Even during weight loss, it's important to meet your body's basic nutrient and energy needs. Over time, not eating enough can lead to nutrient deficiencies, unpleasant side effects & other serious health problems.</p>
      </div>
    }

    return (
      <Auxiliary>
        {modalInfo}

        <div >

          <div className="dailyGoalContainer">
            <p>basaed on your bmr: {this.state.bmr}
              you will need {this.state.showCalories} calories
             to maintain your weith.
                   </p>

            <p>daily Goal:<span className={this.state.calories < 500 ? 'dangerZone' : 'dailyGoal'}>{this.state.calories}</span>calories</p>
            <button onClick={this.handleCalories}>{this.state.searchFood ? 'hide food' : 'add food'}</button>
          </div>

          {searchFood}
          <button onClick={this.myFirebase}>firebase</button>

          <div className="mealTable">
            <table >

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
                <tr><td><button onClick={this.saveDiet}>Save diet</button></td></tr>

              </tfoot>

            </table>
            {saveError}
          </div>
        </div>
      </Auxiliary>



    );
  }
}
const condition = authUser => authUser !== null;

export default withRouter(WithAuthorization(condition)(Diet));
