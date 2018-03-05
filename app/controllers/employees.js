import Ember from 'ember';

const {
  Controller,
  inject: { service }
} = Ember;


export default Controller.extend({
  employees: service(),
  preserveScrollPosition: true,


  actions: {
    showInfo(employee){
      //console.log(employee);
      this.transitionToRoute('employee-info', employee.user_uid);
    }
  }
});
