import Ember from 'ember';

const {
  Controller,
  inject: { service },
  set,
  get
} = Ember;


export default Controller.extend({
  session: service(),
  atGate: true,

  actions: {
    signOut(){
      this.transitionToRoute('sign-in');
      get(this, 'session').close().then(() => {
        window.location.reload();
      });
    }
  }
});
