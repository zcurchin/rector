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
    deleteEmployee(employee){
      let employees = get(this, 'employees');

      employees.deleteEmployee(employee.user_uid);
    }
  }
});
