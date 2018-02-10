import Ember from 'ember';
import moment from 'moment';

const {
  Component,
  inject: { service },
  get,
  set
} = Ember;

export default Component.extend({
  timeChooser: service(),
  classNames: ['time-chooser layout-align-center-center'],

  dateObj: null,
  dateInitObj: null,
  defaultOffset: null,
  hours: null,
  minutes: null,
  date: null,
  label: null,
  offsetLabel: null,
  offsetHours: null,
  startTime: null,


  didInsertElement() {
    this._super(...arguments);

    let dateObj = moment();
    let dateInitObj = moment();
    let defaultOffset = get(this, 'defaultOffset');
    let startTime = get(this, 'startTime');

    if (defaultOffset) {
      dateObj.add(defaultOffset, 'h');
    }

    if (startTime) {
      dateObj = moment(startTime);
    }

    set(this, 'dateObj', dateObj);
    set(this, 'dateInitObj', dateInitObj);

    this.update();
  },


  roundToTwo (num){
    return + (Math.round(num + "e+2")  + "e-2");
  },


  formatTime(type){
    let dateObj = get(this, 'dateObj');
    let number = null;

    if (type === 'hours') {
      number = dateObj.hours();

    } else if (type === 'minutes') {
      number = dateObj.minutes();
    }

    if (number < 10) {
      return '0' + number;
    } else {
      return number;
    }
  },


  update(){
    let timeChooser = get(this, 'timeChooser');
    let dateObj = get(this, 'dateObj');
    let dateInitObj = get(this, 'dateInitObj');

    set(this, 'hours', this.formatTime('hours'));
    set(this, 'minutes', this.formatTime('minutes'));    
    set(this, 'date', dateObj.format('dddd, MMMM Do'));

    let offsetHours = dateObj.diff(dateInitObj, 'h', true);
    let offesetRounded = this.roundToTwo(offsetHours);
    set(this, 'offsetHours', offesetRounded);

    set(timeChooser, 'time', dateObj);
  },


  actions: {
    increaseHours(){
      let dateObj = get(this, 'dateObj');
      dateObj.add(1, 'hours');
      this.update();
    },


    decreaseHours(){
      let dateObj = get(this, 'dateObj');
      let dateInitObj = get(this, 'dateInitObj');
      let diff = dateObj.diff(dateInitObj, 'h', true);

      if (diff - 1 >= 0) {
        dateObj.subtract(1, 'hours');
        this.update();
      }
    },


    increaseMinutes(){
      let dateObj = get(this, 'dateObj');
      dateObj.add(1, 'minutes');
      this.update();
    },


    decreaseMinutes(){
      let dateObj = get(this, 'dateObj');
      let dateInitObj = get(this, 'dateInitObj');
      let diff = dateObj.diff(dateInitObj, 'm', true);

      if (diff - 1 >= 0) {
        dateObj.subtract(1, 'minutes');
        this.update();
      }
    },
  }
});
