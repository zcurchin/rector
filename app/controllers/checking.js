import Ember from 'ember';

const {
  Controller,
  inject: { service },
  set,
  get
} = Ember;


export default Controller.extend({
  user: service(),
  checking: service(),
  workplace: service(),
  timeChooser: service(),

  preloader: false,
  checkout_preloader: false,

  checkingIn: false,
  checkingOut: false,
  editingAutoCheckOut: false,

  checkedOut_value: false,

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


  actions: {
    checkInEdit(){
      let dateNow = new Date();
      let workingHoursDefault = get(this, 'workingHours');
      let currentHours = dateNow.getHours();
      let currentMinutes = dateNow.getMinutes();

      set(this, 'autoCheckOutHours', currentHours + workingHoursDefault);
      set(this, 'autoCheckOutMinutes', currentMinutes);

      set(this, 'checkingIn', true);
    },


    checkIn(){
      let self = this;
      let checking = this.get('checking');
      let timeChooser = this.get('timeChooser');

      set(self, 'ci_waiting', true);

      let milis = timeChooser.getTime();

      console.log(milis);

      checking.checkIn(milis).then(() => {
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
      let checking = get(this, 'checking');

      set(this, 'co_waiting', true);

      checking.checkOut().then(() => {
        set(self, 'co_success', true);

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
      let checking = get(this, 'checking');
      let timeChooser = get(this, 'timeChooser');
      let timestamp = timeChooser.getTime();

      set(this, 'ua_waiting', true);

      checking.checkOut(timestamp, 'update').then(() => {
        set(self, 'ua_success', true);

      }).catch(error => {
        set(self, 'ua_errorMsg', error);
        set(self, 'ua_error', true);
      });
    }
  }
});
