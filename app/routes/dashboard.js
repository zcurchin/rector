import Ember from 'ember';

const {
  Route,
  inject: { service },
  get
} = Ember;

export default Route.extend({
  session: service(),

  model: function(){
    let currentUser = get(this, 'session.currentUser');

    return this.get('store').query('user', {
      orderBy: 'uid',
      equalTo: currentUser.uid
    });
  }
});
