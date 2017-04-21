import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  deactivate(){
    this.controller.set('email', '');
    this.controller.set('error_msg', '');
    this.controller.set('success_sent', false);
  }
});
