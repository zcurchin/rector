import Ember from 'ember';

const {
  Controller,
  inject: { service }
} = Ember;


export default Controller.extend({
  employees: service(),


  actions: {
    showInfo(employee){
      this.transitionToRoute('employee-info', employee.user_uid);
    }
  }
});
