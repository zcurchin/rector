import Ember from 'ember';

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

  checkOutTime_clock: null,

  checkOutHours_input: null,
  onCheckOutHoursChange: observer('checkOutHours_input', function(){
    let checkOutHours_input = this.get('checkOutHours_input');
    console.log(checkOutHours_input);
    let milisHours = checkOutHours_input * (60000 * 60);
    let now = Date.now();
    let checkOutTime = now + milisHours;

    set(this, 'checkOutTime_clock', this.get('checkOutTime'));
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
