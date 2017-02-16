import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('sign-in');
  this.route('sign-up');
  this.route('dashboard');
  this.route('profile');
  this.route('account');
  this.route('grade');
  this.route('statistics');
  this.route('notifications');
});

export default Router;
