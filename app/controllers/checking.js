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
  checkInEdit: false,
  confirmCheckOut: false,
  checkedOut_value: false,

  checkOutHours: 6,
  checkOutTime: computed('checkOutHours', function(){
    let checkOutMilis = this.getCheckOutMilis();
    let time = moment(checkOutMilis).format('hh:mm a');

    return time;
  }),

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


  closeCheckInForm(){
    set(this, 'checkInEdit', false);
    set(this, 'preloader', false);
    set(this, 'checkOutHours', 6);
  },


  actions: {
    checkIn(){
      let self = this;
      let user = this.get('user');
      let checkOutMilis = this.getCheckOutMilis();
      let now = Date.now();
      set(self, 'preloader', true);

      user.checkIn(checkOutMilis).then(() => {
        self.closeCheckInForm();

        set(self, 'checkedIn', now);
      });
    },

    checkInEdit(){
      set(this, 'checkInEdit', true);
    },

    checkInEditCancel(){
      this.closeCheckInForm();
    },

    openConfirmCheckOut(){
      set(this, 'confirmCheckOut', true);
    },

    cancelCheckOut(){
      set(this, 'confirmCheckOut', false);
    },

    checkOut(){
      let self = this;
      let user = this.get('user');
      let checkedIn = this.get('checkedIn');
      let now = Date.now();

      set(this, 'checkout_preloader', true);

      user.checkOut().then(() => {
        set(self, 'checkedIn', false);
        set(self, 'checkout_preloader', false);
        set(self, 'confirmCheckOut', false);
        set(self, 'checkedOut_value', now);

        self.updateHistory('checkOut', {
          in: checkedIn,
          out: now
        });
      });
    }
  }
});
