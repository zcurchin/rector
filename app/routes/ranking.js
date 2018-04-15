import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  ranking: service(),
  workplace: service(),


  activate(){
    let workplace = get(this, 'workplace');
    let ranking = get(this, 'ranking');

    if (workplace.ready) {
      ranking.initialize();

    } else {
      workplace.onReady(() => {
        ranking.initialize();
      });
    }
  },


  deactivate(){
    let ranking = get(this, 'ranking');

    ranking.resetList();
  }
});
