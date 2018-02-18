import Ember from 'ember';
//import RSVP from 'rsvp';

const {
  Controller,
  inject: { service },
  get
} = Ember;


export default Controller.extend({
  user: service(),
  employees: service(),


  actions: {
    showInfo(employee){
      let employees = get(this, 'employees');
      this.transitionToRoute('employee-info', employee.user_uid);      
    }
  }
});
