import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get
} = Ember;

export default Controller.extend({
  notifications: service(),

  actions: {
    hallo(data){
      let notifications = get(this, 'notifications');
      // console.log(notifications);
      // console.log(data);

      notifications.removeBusinessRequest(data);
    }
  }
});
