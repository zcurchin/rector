import Ember from 'ember';

const {
  Controller,
  inject: { service },
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
    },

    goToChecking(){
      this.transitionToRoute('checking');
    },

    goToNotifications(){
      this.transitionToRoute('notifications');
    }
  }
});
