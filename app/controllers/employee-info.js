import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get,
  set
} = Ember;


export default Controller.extend({
  user: service(),
  employees: service(),

  removingEmployee: false,
  re_waiting: false,
  re_success: false,
  re_error: false,

  actions: {
    goBack(){
      window.history.back();
    },


    promptRemoveEmployee(){
      set(this, 'removingEmployee', true);
    },


    removeEmployee(model){
      let employees = get(this, 'employees');

      set(this, 're_waiting', true);

      employees.deleteEmployee(model).then(() => {
        set(this, 're_success', true);
        window.history.back();
      });
    }
  }
});
