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
      this.transitionToRoute('sign-in');
      get(this, 'session').close().then(() => {
        window.location.reload();
      });
    },

    goToCreateAccount(){
      this.transitionToRoute('sign-up');
    }
  }
});
