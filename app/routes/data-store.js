import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Route,
  inject: { service }
} = Ember;


export default Route.extend({
  store: service(),
  session: service(),

  model(){
    let store = this.get('store');
    let uid = this.get('session.currentUser').uid;

    return Ember.RSVP.hash({
      profile: store.findRecord('userProfile', uid),
      grades: store.query('publicGrade', {
        path: 'publicGrades/' + uid
      }),
      // workplaces: store.query('userWorkplace', {
      //   path: 'userWorkplaces/' + uid + '/Gm8fqVAZaAW1Wg6IDXuMHv5djOt2'
      // })
      workplace: store.findRecord('userWorkplace', 'Gm8fqVAZaAW1Wg6IDXuMHv5djOt2', {
        adapterOptions: {
          path: 'userWorkplaces/' + uid
        }
      })
      // weather: this.get('weather').current()
    });
  },


  setupController(controller, models) {
    controller.setProperties(models);
  }
});
