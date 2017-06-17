import Ember from 'ember';

const {
  Component,
  inject: { service },
  get
} = Ember;

export default Component.extend({
  session: service(),
  paperSidenav: service(),
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

  swipeRight(){
    let paperSidenav = get(this, 'paperSidenav');
    paperSidenav.toggle('left-sidenav');
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
