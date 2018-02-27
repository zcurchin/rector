import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get
} = Ember;


export default Controller.extend({
  user: service(),
  employees: service(),


  actions: {
    goBack(){
      window.history.back();
    },


    deleteEmployee(employee){
      let employees = get(this, 'employees');

      employees.deleteEmployee(employee);
    }
  }
});
