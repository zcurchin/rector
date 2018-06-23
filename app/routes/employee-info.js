import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Route,
  inject: { service },
  get
} = Ember;

export default Route.extend({
  employees: service(),
  workplace: service(),

  model(data){
    let self = this;
    let employees = get(this, 'employees');
    let workplace = get(this, 'workplace');
    let employee_uid = data.id;

    console.log('????????????????????? EMPLOYEES_INFO : MODEL');

    return new RSVP.Promise((resolve) => {
      if (workplace.ready) {
        if (employees.ready) {
          self.onEmployeesReady(employee_uid, (data) => {
            resolve(data);
          });
        } else {
          employees.createList().then(() => {
            self.onEmployeesReady(employee_uid, (data) => {
              resolve(data);
            });
          });
        }

      } else {
        workplace.onReady(() => {
          if (employees.ready) {
            self.onEmployeesReady(employee_uid, (data) => {
              resolve(data);
            });
          } else {
            employees.createList().then(() => {
              self.onEmployeesReady(employee_uid, (data) => {
                resolve(data);
              });
            });
          }
        });
      }
    });
  },


  onEmployeesReady(employee_uid, callback){
    console.log('**************** EMPLOYEES READY : data :', employee_uid);
    let employees = get(this, 'employees');
    let staff = employees.staff;
    let management = employees.management;
    var userData = null;

    staff.forEach(person => {
      if (person.uid === employee_uid) {
        userData = person;
      }
    });

    management.forEach(person => {
      if (person.uid === employee_uid) {
        userData = person;
      }
    });

    console.log(userData);

    if (userData) {
      callback(userData);
    }
  }
});
