import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;

export default Route.extend({
  employees: service(),


  model(data){
    let employees = get(this, 'employees');
    let staff = employees.staff;
    let management = employees.management;

    var userData = null;

    staff.forEach(person => {
      if (person.user_uid === data.id) {
        userData = person;
      }
    });

    management.forEach(person => {
      if (person.user_uid === data.id) {
        userData = person;
      }
    });    

    if (userData) {
      return userData;
    }
  }
});
