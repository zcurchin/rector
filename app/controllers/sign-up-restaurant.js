import Ember from 'ember';

const {
  Controller
} = Ember;

export default Controller.extend({
  actions: {
    signUpRestaurant(){
      console.log('##### signUpRestaurant');
    },

    cancel(){
      this.transitionToRoute('sign-in');
    }
  }
});
