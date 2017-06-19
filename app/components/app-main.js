import Ember from 'ember';

const {
  Component,
  inject: { service },
  get,
  set
} = Ember;

export default Component.extend({
  session: service(),
  paperSidenav: service(),
  homePage: true,

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

    signUpRestaurant(){
      let router = this.get('router');
      set(this, 'createAccount', false);
      router.transitionTo('sign-up-restaurant');
    },

    goToSignIn(){
      let router = this.get('router');
      set(this, 'createAccount', true);
      router.transitionTo('sign-in');
    }
  }
});
