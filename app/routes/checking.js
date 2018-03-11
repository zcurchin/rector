import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  checking: service(),
  workplace: service(),


  activate(){
    let workplace = get(this, 'workplace');
    let checking = get(this, 'checking');

    if (workplace.ready) {
      checking.initialize();

    } else {
      workplace.onReady(() => {
        checking.initialize();
      });
    }
  }
});
