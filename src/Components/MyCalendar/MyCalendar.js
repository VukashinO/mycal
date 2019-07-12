import React, { Component } from 'react';
import moment from 'moment';
import './MyCalendar.css';
import axios from 'axios';
import FirebaseTable from '../../Components/FirebaseTable/FirebaseTable';
import { withRouter } from 'react-router-dom';
import { WithAuthorization } from '../../Components/Hoc/Hoc';

// ---------------- URL to firebase
const getDataFromFirebase = 'https://my-fitness-app-81de2.firebaseio.com';

class Calendar extends Component {
    state = {
        dateContext: moment(),
        today: moment(),
        showMonthPopup: false,
        selectedDay: null,
        dietFromFirebase: null,
        isDietSaved: false,
        user: JSON.parse(localStorage.getItem('user')),
        selectDayObj: null
    }

    constructor(props) {
        super(props);
        this.width = props.width || "285px";
        this.style = props.style || {};
        this.style.width = this.width;
    }

    // OnLoad always go to fireBase and get data
    componentDidMount() {
        this.getDataFromFireBase();
    }
    getDataFromFireBase = () => {
        axios.get(`${getDataFromFirebase}/.json`)
            .then(responce => {
                let arr = []
                for (let key in responce.data.diet) {
                    arr.push({
                        ...responce.data.diet[key],
                        id: key
                    })
                }
                const filteredArr = arr.filter(diet => diet.user === this.state.user.email);
                const initialDietFromFirebase = filteredArr.find(diet => diet.date.split("-")[2] == this.currentDay());
                if (filteredArr.length === 0) {
                    this.setState({ isDietSaved: true })
                    return;
                }
                this.setState({ 
                    dietFromFirebase: filteredArr, 
                    selectedDay: this.currentDay(), 
                    selectDayObj: initialDietFromFirebase 
                    })
            });
    }

    weekdays = moment.weekdays();
    weekdaysShort = moment.weekdaysShort(); // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    months = moment.months();

    year = () => {
        return this.state.dateContext.format("Y");
    }
    month = () => {
        return this.state.dateContext.format("MMMM");
    }
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    currentDate = () => {
        return this.state.dateContext.get("date");
    }
    currentDay = () => {
        return this.state.dateContext.format("D");
    }

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');
        return firstDay;
    }

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext
        });
    }


    onSelectChange = (e, data) => {
        this.setMonth(data);
    }

    SelectList = (props) => {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                    <p onClick={(e) => { this.onSelectChange(e, data) }}>
                        {data}
                    </p>
                </div>
            );
        });

        return (
            <div className="month-popup">
                {popup}
            </div>
        );
    }

    onChangeMonth = (e, month) => {
        this.setState({
            
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav = () => {
        return (
            <span className="label-month"
                onClick={(e) => { this.onChangeMonth(e, this.month()) }}>
                {this.month()}
                {this.state.showMonthPopup &&
                    <this.SelectList data={this.months} />
                }
            </span>
        );
    }


    YearNav = () => {
        return (
            <span>{this.year()}</span>
        );
    }


    onDayClick = (e, day) => {
        this.setState({
            selectedDay: day
        }, () => {

          const selectDayObj = this.state.dietFromFirebase.find(diet => diet.date.split("-")[2] === day.toString());
          if(selectDayObj)
          {
            this.setState({ selectDayObj, isDietSaved: false }); 
          }
          else
          {
            this.setState({ isDietSaved: true, selectDayObj: null });
          }
         
        })
            
    }
    
    handleNodiet = () => {
        this.setState({ isDietSaved: false })
    }

    render() {
        // Map the weekdays i.e Sun, Mon, Tue etc as <td>
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });

        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                {""}
            </td>
            );
        }
        let dietDays = null;
        if (this.state.dietFromFirebase) {
            dietDays = this.state.dietFromFirebase
        }


        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d == this.currentDay() ? "day current-day" : "day");
            let selectedClass = (d == this.state.selectedDay ? " selected-day " : "");
            // let dietDayClass = (d == dietDay ? "dietDayColor" : "");
            let dietDayClass = dietDays ? dietDays.find(obj =>  obj.date.split("-")[2] == d) ? " diet-day" : "" : null;
            daysInMonth.push(
                <td key={d} className={className + selectedClass + dietDayClass} >
                    <span onClick={(e) => { this.onDayClick(e, d) }}>{d}</span>
                </td>
            );
        }



        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);

                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);              
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i * 100}>
                    {d}
                </tr>
            );
        })

        // render if no diet save

        let savedDiet = null;
        if (this.state.isDietSaved) {
            savedDiet = <div>
                <h3
                    onClick={this.handleNodiet}
                    className="noDietSave">You haven't saved diet for this date please go to Diet!</h3>
            </div>
        }
        return (
          
            <div className="row">
                <div className="col-4 m-5">

                    <div className="calendar-container" style={this.style}>
                        <div className="divHeader centerElement"><span>Diet Calendar</span></div>

                        <table className="calendar">
                            <thead>
                                <tr className="calendar-header centerElement">
                                    <td colSpan="5">
                                        <this.MonthNav />
                                        {" "}
                                        <this.YearNav />
                                    </td>
                                    <td colSpan="2" className="nav-month">
                                        {/* <i className="prev fa fa-fw fa-chevron-left"
                                    >
                                </i>
                                <i className="prev fa fa-fw fa-chevron-right"
                                    >
                                </i> */}

                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {weekdays}
                                </tr>
                                {trElems}
                            </tbody>
                        </table>
                        {savedDiet}
                    </div>
                </div>
                <div className="col-4 m-5">
                    <FirebaseTable
                        handleDivClick={this.handleDivClick}                      
                        objForRenderingFirebaseTable={this.state.selectDayObj}
                    />
                </div>
            </div>
        );
    }
}


const condition = authUser => authUser !== null;

export default withRouter(WithAuthorization(condition)(Calendar));