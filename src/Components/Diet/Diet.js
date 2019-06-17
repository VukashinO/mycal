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
import * as ROUTES from '../../Constants/Routes';
import Messures from '../../Components/MesuresEnum/MesuresEnum';

//import Calendar from '../../Components/Calendar/Calendar';

//Api's here



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
    saveError: null,

    user: JSON.parse(localStorage.getItem('user')),
    isCorrect: false,
    isDietSaved: false,
    startCount: 0
  }

  

  componentDidMount(){
    axios.get('https://my-fitness-app-81de2.firebaseio.com/.json')
    .then(responce => {
    const users = [];
    for(let key in responce.data.users)
    {
      users.push({...responce.data.users[key], id:key})
    }
     console.log(users)
      console.log(this.state.user.email)
      const userFirebase = users.find(user => user.email === this.state.user.email);
      console.log(userFirebase)
      this.setState({ bmr:userFirebase.bmr, calories:userFirebase.calories, showCalories:userFirebase.calories })
    })
    .catch(err => console.log(err))
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
  // myFirebase = () => {
  //   axios.get('https://my-fitness-app-81de2.firebaseio.com/.json')
  //     .then(responce => {
  //       let arr = []
  //       for(let key in responce.data.diet)
  //       {
  //         arr.push({...responce.data.diet[key],
  //           id: key})
  //       }
  //       console.log(responce.data.diet)
  //       this.setState({ dietFromFirebase: arr })
  //       console.log(arr)
  //     })
  // }

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

  handleMesures = () => {

    let mesure = this.state.value;
        let calculateMesure = mesure === "Serving" ?
        Math.round(+this.state.serving * (Messures[mesure] * this.state.individualCalorie)) :
        Math.round(+this.state.serving * (Messures[mesure] * this.state.individualCalorie) / 100);

            if (this.state.startCount + calculateMesure > this.state.calories) {
             this.setState({ isBelowZero: true, nutritionFacts: false })
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

  handleSubmitModal = () => {

    let cup = this.state.cup;
    let gram = this.state.gram;
    let defaultGram = this.state.defaultGram;
    let ounce = this.state.ounce;
    let pound = this.state.pound;
    let kilo = this.state.kilo;
    if (this.state.servingError === null && this.state.value !== 'Choose serving') {

      switch (this.state.value) {
          case 'Cup':
          this.handleMesures();
          break;
          case 'Gram':
          this.handleMesures();
          case 'Ounce':
          this.handleMesures();
          break;
          case 'Serving':
          this.handleMesures();
          break;
          case 'Pound': 
          this.handleMesures();
          break;
          case 'Kilogram':
          this.handleMesures();
          break;
        default:
          break;
      }
      // if (this.state.value === 'Cup') {


      //   cup = Math.round(+this.state.serving * (156 * this.state.individualCalorie) / 100)
      //   // logic for max to zero:
      //   // if (this.state.calories - cup < 0) {
      //   //   this.setState({ isBelowZero: true, nutritionFacts: false })
      //   //   return;
      //   // }
      //   // logic for zero to max:
      //      if (this.state.startCount + cup > this.state.calories) {
      //       this.setState({ isBelowZero: true, nutritionFacts: false })
          
      //    }
      //   this.setState((prevState) => ({
      //     // calories: prevState.calories - cup,
      //     startCount: prevState.startCount + cup,
      //     dietData: prevState.dietData.concat({
      //       meal: this.state.valueMeal,
      //       foodName: this.state.foodName,
      //       calories: cup
      //     }), nutritionFacts: false
      //   }))

      // }
      // if (this.state.value === 'Gram') {
      //   gram = Math.round(+this.state.serving * (1 * this.state.individualCalorie) / 100)
      //   // if (this.state.calories - gram < 0) {
      //   //   this.setState({ isBelowZero: true, nutritionFacts: false })
      //   //   return;
      //   // }
      //   if (this.state.startCount + gram > this.state.calories) {
      //     this.setState({ isBelowZero: true, nutritionFacts: false })
      //    // return;
      //  }
      //   this.setState((prevState) => ({
      //     // calories: prevState.calories - gram,
      //     startCount: prevState.startCount + gram,
      //     dietData: prevState.dietData.concat({
      //       meal: this.state.valueMeal,
      //       foodName: this.state.foodName,
      //       calories: gram
      //     }), nutritionFacts: false
      //   }))
      //   // this.state.dietData.breakFast= {}
      // }

      // if (this.state.value === 'Ounce') {
      //   ounce = Math.round(+this.state.serving * (28.3495 * this.state.individualCalorie) / 100)
      //   // if (this.state.calories - ounce < 0) {
      //   //   this.setState({ isBelowZero: true, nutritionFacts: false })
      //   //   return;
      //   // }
      //   if (this.state.startCount + ounce > this.state.calories) {
      //     this.setState({ isBelowZero: true, nutritionFacts: false })
      //    // return;
      //  }
      //   this.setState((prevState) => ({
      //     // calories: prevState.calories - ounce,
      //     startCount: prevState.startCount + ounce,
      //     dietData: prevState.dietData.concat({
      //       meal: this.state.valueMeal,
      //       foodName: this.state.foodName,
      //       calories: ounce
      //     }), nutritionFacts: false
      //   }))
      // }
      // if (this.state.value === 'Serving') {
      //   defaultGram = +this.state.serving *(1 * this.state.individualCalorie);
      //   // if (this.state.calories - defaultGram < 0) {
      //   //   this.setState({ isBelowZero: true, nutritionFacts: false })
      //   //   return;
      //   // }
      //   if (this.state.startCount + defaultGram > this.state.calories) {
      //     this.setState({ isBelowZero: true, nutritionFacts: false })
      //    // return;
      //  }
      //   this.setState((prevState) => ({
      //     // calories: prevState.calories - defaultGram,
      //     startCount: prevState.startCount + defaultGram,
      //     dietData: prevState.dietData.concat({
      //       meal: this.state.valueMeal,
      //       foodName: this.state.foodName,
      //       calories: defaultGram
      //     }), nutritionFacts: false
      //   }))
      // }
      // if (this.state.value === 'Pound') {
      //   pound = Math.round(+this.state.serving * (453.592 * this.state.individualCalorie) / 100)
      //   // if (this.state.calories - pound < 0) {
      //   //   this.setState({ isBelowZero: true, nutritionFacts: false })
      //   //   return;
      //   // }
      //   if (this.state.startCount + pound > this.state.calories) {
      //     this.setState({ isBelowZero: true, nutritionFacts: false })
      //    // return;
      //  }
      //   this.setState((prevState) => ({
      //     //calories: prevState.calories - pound,
      //     startCount: prevState.startCount + pound,
      //     dietData: prevState.dietData.concat({
      //       meal: this.state.valueMeal,
      //       foodName: this.state.foodName,
      //       calories: pound
      //     }), nutritionFacts: false
      //   }))
      // }
      // if (this.state.value === 'Kilogram') {
      //   kilo = Math.round(+this.state.serving * (1000 * this.state.individualCalorie) / 100)
      //   // if (this.state.calories - kilo < 0) {
      //   //   this.setState({ isBelowZero: true, nutritionFacts: false })
      //   //   return;
      //   // }
      //   if (this.state.startCount + kilo > this.state.calories) {
      //     this.setState({ isBelowZero: true, nutritionFacts: false })
      //    // return;
      //  }
      //   this.setState((prevState) => ({
      //    // calories: prevState.calories - kilo,
      //     startCount: prevState.startCount + kilo,
      //     dietData: prevState.dietData.concat({
      //       meal: this.state.valueMeal,
      //       foodName: this.state.foodName,
      //       calories: kilo
      //     }), nutritionFacts: false
      //   }))
      // }

      this.setState({ cup, gram, defaultGram, ounce, pound, kilo })
    }
    else {
      return this.setState({ isCorrect: true })
    }
  }
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
      this.setState({ saveError: true })
      return;
    }
    this.setState({loading:true})
    axios.post('https://my-fitness-app-81de2.firebaseio.com/diet.json', post)
      .then(responce => {
        console.log(responce)
        this.setState({ dietData:[],calories: this.state.showCalories,loading:false,searchFood:false, isDietSaved: true }) 
      })
      .catch(err => console.log(err))
      
  }

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


  render() {
    if(this.state.foodData) {
     (this.state.foodData.forEach(obj =>  console.log(obj.measures)))
    }
   
 
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
          // select2={this.state.foodData}
        />
      </Modal>
    }

    console.log(this.props.location.state)
    // renering mini table for diet to save with firebase

    const breakFast = this.state.dietData.filter(diet => diet.meal === 'Breakfast')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories</span>
        <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}>-</button></td></tr>)

    const lunch = this.state.dietData.filter(diet => diet.meal === 'Lunch')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span className="dinamicTableTd">{meal.foodName}: {meal.calories}calories</span>
        <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}>-</button></td></tr>)

    const dinner = this.state.dietData.filter(diet => diet.meal === 'Dinner')
      .map((meal, i) => <tr key={meal.foodName + i}><td>food:<span className="dinamicTableTd">{meal.foodName}: {meal.calories}
        <button className="buttonDelete" onClick={() => this.handleDelete(meal.id, meal.calories)}>-</button>calories</span></td></tr>)
   

    // error message for below zero calories
    let errorMessage = null;
    if (this.state.isBelowZero) {
      errorMessage = <Modal className="errorStyleDiv">
        <h3>you are passing your daily goal, are you sure you want to eat this food :)<span onClick={this.handleChangeError} style={{ cursor: 'pointer', fontWeight: 'bold', color: 'green' }}>ok</span>
        </h3>
      </Modal>
    }

    // Search and API for food
    let searchFood = null;
    if (this.state.searchFood) {
      searchFood = <div >
        {errorMessage}
        {/* <Search
          handleSubmit={e => {
            e.preventDefault();
            this.handleSubmit()
          }}
          onChange={(e) => this.onChange(e.target.value)}
          value={this.state.searchText}
        /> */}
        {loader}
      </div>
    }

    // render save error
    let saveError = null;
    if (this.state.saveError) {
      saveError = 
      <Modal>
      <Auxiliary>

        <p style={{ color: 'red' }}>Based on your total calories consumed for today, you are likely not eating enough.</p>
        <p>For safe weight loss, the National Institutes of Health recommends no less than 1000-1200 calories for women and 1200-1500 calories for men.</p>
       <p>Even during weight loss, it's important to meet your body's basic nutrient and energy needs. Over time, not eating enough can lead to nutrient deficiencies, unpleasant side effects & other serious health problems.</p>
       <button
       onClick={()=>{this.setState({ saveError: null })}}
       className="btn btn-success buttonMargin">ok</button> 
       </Auxiliary>
       </Modal>
    }
    // fill form correct
    let isModalCorrect = null;
    if(this.state.isCorrect) {
      isModalCorrect = <div>
        <h3 onClick={this.handleFillCorrect} className="fillCorrect">please choose quantity or measure</h3>
      </div>
    }

    // save diet
    let dietSaveMessage = null;
    if(this.state.isDietSaved)
    {
      dietSaveMessage = 
      <Modal>
        <Auxiliary>
          <h1>Your diet have been successfuly saved!</h1>
          <h2>would you like to check your diet calendar?</h2>
          <div>
          <button className="btn btn-success btn-sm" onClick={this.onIsDietSaveHandle}>yes</button>
          <button className="brn btn-danger btn-sm" onClick={()=>(this.setState({ isDietSaved:false }))}>no</button>
          </div>

        </Auxiliary>
      </Modal>
    }
    console.log(this.state.isDietSaved)
    return (
      <Auxiliary>
        
        {modalInfo}
        {/* <div className="row">
          <div className="col">
          {searchFood}
          
          </div>
        </div> */}
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
          {loader}
          {errorMessage}
          </div>
          <div className="col-5">
       
              <div className="marginTop">
            <div>
                <p className="leftColParagrafs">Basaed on your bmr: <b>{this.state.bmr}</b>
                  you will need <b>{this.state.showCalories}</b> calories
                  to maintain your weith.
                   </p> 
            <h3>Goal:<span className="dailyGoal">
              {this.state.calories}</span>/<span className={this.state.startCount === 0 || 
              this.state.startCount > this.state.calories? 'dangerZone' : 'dailyGoal'}>{this.state.startCount}</span>calories</h3>
              {/* hide - add food */}
          {/* <button className="btn btn-primary" onClick={this.handleCalories}>{this.state.searchFood ? 'hide food' : 'add food'}</button> */}
            </div>
          </div>
              <div className="marginTop">
            <div>
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
          
            {saveError}
            {dietSaveMessage}
          </div>
          </div>
          {/* <Calendar user={this.state.user}/> */}
          
          </div>
        </div>
      </Auxiliary>



    );
  }
}
const condition = authUser => authUser !== null;

export default withRouter(WithAuthorization(condition)(Diet));
