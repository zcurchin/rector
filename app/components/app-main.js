import Ember from 'ember';

const {
  Component,
  inject: { service }
} = Ember;

export default Component.extend({
  session: service(),

  classNames: ['app-container'],

  actions: {
    signOut(){
      this.sendAction('action');
    }
  }
});
