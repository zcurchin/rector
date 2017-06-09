import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('sign-in');
  this.route('sign-up');
  this.route('checking');
  this.route('profile');
  this.route('account');
  this.route('grading');
  this.route('statistics');
  this.route('notifications');
  this.route('ranking');
  this.route('forgot-password');
});

export default Router;
