import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model(){
    return new RSVP.Promise((resolve, reject) => {

    });
  }
});
