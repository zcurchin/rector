import Ember from 'ember';

const {
  Component,
  inject: { service }
} = Ember;

export default Component.extend({
  session: service(),
  createAccount: true,

  classNames: ['app-container'],

  didInsertElement(){
    this.$('md-card-content').css({
      height: this.$('.inner-sidenav').height()
    });

    this.$(window).on('resize', () => {
      this.$('md-card-content').css({
        height: this.$('.inner-sidenav').height()
      });
    });
  },

  actions: {
    signOut(){
      this.sendAction('action');
    },

    goToCreateAccount(){
      let router = this.get('router');
      this.toggleProperty('createAccount');
      router.transitionTo('sign-up');
    },

    goToSignIn(){
      let router = this.get('router');
      this.toggleProperty('createAccount');
      router.transitionTo('sign-in');
    }
  }
});
