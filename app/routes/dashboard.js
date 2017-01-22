import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Route,
  inject: { service },
  get,
  run
} = Ember;

export default Route.extend({
  session: service(),

  model: function(){
    let currentUser = get(this, 'session.currentUser');

    // let self = this;
    // return new RSVP.Promise(function(resolve) {
    //   Ember.run.later(function() {
    //     resolve({ msg: 'Hold Your Horses' });
    //   }, 100000);
    // });

    return this.get('store').query('user', {
      orderBy: 'auth_uid',
      equalTo: currentUser.uid
    });

  }

  // actions: {
  //   loading(transition, originRoute) {
  //     console.log('### LOADING');
  //     // let controller = this.controllerFor('foo');
  //     // controller.set('currentlyLoading', true);
  //     //
  //     // transition.promise.finally(() => {
  //     //   //controller.set('currentlyLoading', false);
  //     //   console.log('### LOADED');
  //     // });
  //   }
  // }
});
