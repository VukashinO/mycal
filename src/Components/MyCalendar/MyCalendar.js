import React, { Component } from 'react';
import moment from 'moment';
import './MyCalendar.css';
import axios from 'axios';
import FirebaseTable from '../../Components/FirebaseTable/FirebaseTable';

class Calendar extends Component {
    state = {
        dateContext: moment(),
        today: moment(),
        showMonthPopup: false,
        selectedDay: null,
        dietFromFirebase: null,

        isDietSaved: false,
        user: JSON.parse(localStorage.getItem('user'))
    }

       constructor(props) {
           super(props);
           this.width = props.width || "285px";
           this.style = props.style || {};
           this.style.width = this.width; // add this
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
        console.log("currentDate: ", this.state.dateContext.get("date"));
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
        //this.props.onMonthChange && this.props.onMonthChange();

    }
    SelectList = (props) => {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                    <p onClick={(e)=> {this.onSelectChange(e, data)}}>
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
                onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
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
            axios.get('https://my-fitness-app-81de2.firebaseio.com/.json')
            .then(responce => {
              let arr = []
              for(let key in responce.data.diet)
              {
                arr.push({...responce.data.diet[key],
                  id: key})
              }
              const checkDate = `${this.year()}-${moment().month(`${this.month()}`).format("MM")}-${this.state.selectedDay}`;
              const filteredArr =  arr.filter(diet => diet.user === this.state.user.email && diet.date === checkDate)
              console.log(filteredArr)
              if(filteredArr.length === 0){
                  this.setState({ isDietSaved: true })
                  console.log("you haven't save diet for this user!")
                  
                  return;
              }
              this.setState({ dietFromFirebase: filteredArr })
            })
        });

    }

    handleNodiet = () => {
        this.setState({ isDietSaved: false })
    }

    // handleDivClick = () => {
    //     this.setState({ onDivClick: false })
    // }
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


        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let className = (d == this.currentDay() ? "day current-day": "day");
            let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
            // let dietDayClass = (d == this.state.dietFromFirebase[0]? " dietDay " : "")
            daysInMonth.push(
                <td key={d} className={ className + selectedClass } >
                    <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}</span>
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
                // rows.push(cells)
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        })

    // render if no diet save 
    let savedDiet = null;
    if(this.state.isDietSaved) {
        savedDiet = <div>
            <h3 
            onClick={this.handleNodiet}
            className="noDietSave">You haven't saved diet for this user or date!</h3>
        </div>
    }
    
        return (
            <div className="row">
            <div className="col">
                      {savedDiet}
            <div className="calendar-container" style={this.style}>
            <div className="divHeader"><span>Diet Calendar</span></div>
            
                <table className="calendar">
                    <thead>
                        <tr className="calendar-header">
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
          
            </div>
            </div>
            <div className="col">
            <FirebaseTable
                handleDivClick={this.handleDivClick} 
                dietFromFirebase={this.state.dietFromFirebase}
                />
            </div>
        </div>                       
        );
    }
}
export default Calendar;