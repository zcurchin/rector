import Ember from 'ember';

const {
  Controller,
  inject: { service },
  set,
  get
} = Ember;


export default Controller.extend({
  session: service(),
  homePage: true,

  actions: {
    signOut(){
      this.transitionToRoute('sign-in');
      get(this, 'session').close().then(() => {
        window.location.reload();
      });
    },

    signUpRestaurant(){
      this.transitionToRoute('sign-up-restaurant');
      set(this, 'homePage', false);
    },

    goToSignIn(){
      this.transitionToRoute('sign-in');
      set(this, 'homePage', true);
    }
  }
});
