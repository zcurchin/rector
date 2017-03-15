import Ember from 'ember';

const {
  Controller
} = Ember;


export default Controller.extend({
  actions: {
    signOut(){
      this.get('session').close();
      this.transitionToRoute('sign-in');
    }
  }
});
