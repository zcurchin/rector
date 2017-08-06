import Ember from 'ember';

const {
  Controller,
  inject: { service },
  set,
  get
} = Ember;


export default Controller.extend({
  session: service(),

  actions: {
    signOut(){
      get(this, 'session').close().then(() => {
        this.transitionToRoute('sign-in');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  }
});
