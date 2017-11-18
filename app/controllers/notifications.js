import Ember from 'ember';

const {
  Controller,
  inject: { service }
} = Ember;


export default Controller.extend({
  notifications: service(),
  user: service(),


  actions: {
    launchAllowDialog(name){
      console.log('launchAllowDialog :', name);
    },


    launchDenyDialog(name){
      console.log('launchDenyDialog :', name);
    }
  }
});
