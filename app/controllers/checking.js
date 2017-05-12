import Ember from 'ember';
import moment from 'moment';

const {
  Controller,
  inject: { service },
  set,
  get,
  observer
} = Ember;


export default Controller.extend({
  user: service(),

  checkedIn: false,
  checkedOut: false,
  checkInEdit: false,
  checkedOut_value: false,
  checkOutTime: null,

  checkOutHours_input: null,

  onCheckOutHoursChange: observer('checkOutHours_input', function(){
    let checkOutHours_input = get(this, 'checkOutHours_input');
    let milisHours = parseFloat(checkOutHours_input ) * (60000 * 60);
    let now = Date.now();
    let checkOutTime = now + milisHours;
    console.log(checkOutTime);

    let time = moment(checkOutTime).format('hh:mm');

    console.log(time);


    set(this, 'checkOutTime', time);
  }),


  actions: {
    checkIn(){
      let user = this.get('user');
      let checkOutHours = get(this, 'checkOutHours');

      console.log(checkOutHours);

      // user.checkIn().then(() => {
      //   console.log('# checked In');
      // });
    },

    checkInEdit(){
      set(this, 'checkInEdit', true);
    },

    checkInEditCancel(){
      set(this, 'checkInEdit', false);
    },

    checkOut(){
      let user = this.get('user');

      user.checkOut();
    }
  }
});
