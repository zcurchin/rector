import Ember from 'ember';

const {
  Controller,
  inject: { controller },
  set,
  get
} = Ember;

export default Controller.extend({
  app_controler: controller('application'),

  actions: {
    signUpRestaurant(){
      console.log('##### signUpRestaurant');
    },

    cancel(){
      this.transitionToRoute('sign-in');
      let app_ctrl = get(this, 'app_controler');
      set(app_ctrl, 'homePage', true);
    }
  }
});
