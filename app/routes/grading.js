import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  grading: service(),
  workplace: service(),


  activate(){
    let workplace = get(this, 'workplace');
    let grading = get(this, 'grading');

    if (workplace.ready) {
      grading.initialize();

    } else {
      workplace.onReady(() => {
        grading.initialize();
      });
    }
  }
});
