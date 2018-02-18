import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;

export default Route.extend({
  employees: service(),


  model(data){
    let staff = get(this, 'employees').staff;
    let employees = get(this, 'employees');
    let management = employees.management;

    var userData = null;

    // if (employees.ready)

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

    //console.log(userData);

    if (userData) {
      return userData;
    }
  }
});
