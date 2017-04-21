import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get
} = Ember;


export default Controller.extend({
  session : service(),


  actions: {
    signOut(){
      get(this, 'session').close().then(() => {
        this.transitionToRoute('sign-in');
      });
    },

    goToCreateAccount(){
      this.transitionToRoute('sign-up');
    }
  }
});
