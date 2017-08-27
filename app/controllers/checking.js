import Ember from 'ember';
import moment from 'moment';

const {
  Controller,
  inject: { service },
  set,
  get,
  computed
} = Ember;


export default Controller.extend({
  user: service(),
  preloader: false,
  checkout_preloader: false,

  checkedIn: false,
  checkingIn: false,
  checkingOut: false,

  autoCheckOut: null,
  checkedOut_value: false,

  editingAutoCheckOut: false,

  checkOutHours: 6,

  checkOutTime: computed('checkOutHours', function(){
    let checkOutMilis = this.getCheckOutMilis();
    let dateNow = new Date();
    let dateNow_num = dateNow.getDate();
    let checkOutDate = new Date(checkOutMilis);
    let checkOutDate_num = checkOutDate.getDate();
    let time = null;

    console.log('dateNow_num :', dateNow_num);
    console.log('checkOutDate_num :', checkOutDate_num);

    if (checkOutDate_num > dateNow_num) {
      time = moment(checkOutMilis).format('hh:mm a, dddd');

    } else {
      time = moment(checkOutMilis).format('hh:mm a');
    }

    return time;
  }),

  co_waiting: false,
  co_success: false,
  co_error: false,
  co_errorMsg: '',

  ci_waiting: false,
  ci_success: false,
  ci_error: false,
  ci_errorMsg: '',

  ua_waiting: false,
  ua_success: false,
  ua_error: false,
  ua_errorMsg: '',

  history: [],


  updateHistory: function(type, obj){
    let history = get(this, 'history');

    if (type === 'checkOut') {
      history.unshiftObject(obj);
    }
  },


  getCheckOutMilis(){
    let checkOutHours = get(this, 'checkOutHours');
    let milisHours = parseFloat(checkOutHours) * (60000 * 60);
    let now = Date.now();
    let checkOutMilis = now + milisHours;

    return checkOutMilis;
  },


  actions: {
    checkInEdit(){
      set(this, 'checkingIn', true);
    },


    checkIn(){
      let self = this;
      let user = this.get('user');
      let checkOutMilis = this.getCheckOutMilis();
      let now = Date.now();

      set(self, 'ci_waiting', true);

      user.checkIn(checkOutMilis).then(() => {
        set(self, 'checkedIn', now);
        set(self, 'autoCheckOut', checkOutMilis);
        set(self, 'ci_success', true);

      }).catch(error => {
        set(self, 'ci_error', true);
        set(self, 'ci_errorMsg', error);
      });
    },


    checkOutEdit(){
      set(this, 'checkingOut', true);
    },


    checkOut(){
      let self = this;
      let user = get(this, 'user');
      let checkedIn = get(this, 'checkedIn');
      let now = Date.now();

      set(this, 'co_waiting', true);

      user.checkOut().then(() => {
        set(self, 'checkedIn', false);
        set(self, 'checkedOut_value', now);

        set(self, 'co_success', true);

        self.updateHistory('checkOut', {
          in: checkedIn,
          out: now
        });

      }).catch(error => {
        set(self, 'co_errorMsg', error);
        set(self, 'co_error', true);
      });
    },


    editAutoCheckOut(){
      set(this, 'editingAutoCheckOut', true);
    },


    updateAutoCheckOut(){
      let self = this;
      let user = get(this, 'user');
      let timestamp = this.getCheckOutMilis();

      set(this, 'ua_waiting', true);

      user.checkOut(timestamp, 'update').then(() => {
        set(self, 'autoCheckOut', timestamp);
        set(self, 'ua_success', true);

      }).catch(error => {
        set(self, 'ua_errorMsg', error);
        set(self, 'ua_error', true);
      });
    }
  }
});
