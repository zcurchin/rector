import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;

export default Route.extend({
  employees: service(),
  workplace: service(),


  activate(){
    let workplace = get(this, 'workplace');
    let employees = get(this, 'employees');

    if (workplace.ready) {
      employees.createList();

    } else {
      workplace.onReady(() => {
        employees.createList();
      });
    }
  }
});
