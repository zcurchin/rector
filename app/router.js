import Ember from 'ember';
import RouterScroll from 'ember-router-scroll';

const Router = Ember.Router.extend(RouterScroll, {
// const Router = Ember.Router.extend({
  // locationType: 'router-scroll',
  // historySupportMiddleware: true
  // location: config.locationType,
  // rootURL: config.rootURL
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
  this.route('sign-up-business');
  this.route('workplace');
  this.route('employees', function(){});
  this.route('business-profile');
  this.route('business-requests');
  this.route('employee-info', { path: ':id' });
});

export default Router;
