import Ember from 'ember';
import RSVP from 'rsvp';

const {
  Route,
  inject: { service },
  get
} = Ember;


export default Route.extend({
  store: service(),
  session: service(),
  firebaseApp: service(),

  model(){
    let self = this;
    let store = this.get('store');
    let uid = this.get('session.currentUser').uid;

    return RSVP.hash({
      profile: self.getUserProfile(),
      grades: self.getUserGrades(),
      employees: self.getEmployees()
    });
  },

  // --------------------------------------------
  // WORKPLACE
  // --------------------------------------------

  getWorkplaces(){
    let store = this.get('store');
    let firebaseApp = get(this, 'firebaseApp');
    let uid = this.get('session.currentUser').uid;

    let userWorkplacesRef = firebaseApp.database().ref('userWorkplaces');

    return userWorkplacesRef.child(uid).once('value').then(snap => {
      console.log(snap.val());

      let workplaces = [];

      Object.keys(snap.val()).forEach(key => {
        let obj = {
          business_uid: key,
          pending: snap.val()[key].pending
        };
      });
    });
  },


  getWorkplace(){
    let store = this.get('store');
    let uid = this.get('session.currentUser').uid;
    let business_uid = 'Gm8fqVAZaAW1Wg6IDXuMHv5djOt2';

    store.findRecord('userWorkplace', business_uid, {
      adapterOptions: {
        path: 'userWorkplaces/' + uid
      }
    })
  },


  // --------------------------------------------
  // GRADES
  // --------------------------------------------

  getUserProfile(){
    let store = this.get('store');
    let uid = this.get('session.currentUser').uid;

    return store.findRecord('userProfile', uid);
  },


  // --------------------------------------------
  // GRADES
  // --------------------------------------------

  getUserGrades(){
    let store = this.get('store');
    let uid = this.get('session.currentUser').uid;

    return store.query('publicGrade', {
      path: 'publicGrades/' + uid

    });
  },


  // --------------------------------------------
  // EMPLOYEES
  // --------------------------------------------

  getEmployees(){
    let store = this.get('store');
    let uid = this.get('session.currentUser').uid;
    let business_uid = 'Gm8fqVAZaAW1Wg6IDXuMHv5djOt2';

    return store.query('businessEmployee', {
      path: 'businessEmployees/' + business_uid

    }).then(data => {
      return RSVP.all(data.content.map(value => {
        return store.findRecord('userProfile', value.id).then((profile) => {

          return store.query('businessGrade', {
            path: 'businessGrades/' + business_uid + '/' + value.id

          }).then(grades => {
            let obj = Ember.Object.create({
              profile: profile,
              grades: grades,
              average_grade: 4,
              total_grades: 12
            });

            return obj;
          });
        });

      })).then((res) => {
        return res;
      });
    });
  },


  setupController(controller, models) {
    controller.setProperties(models);
  }
});
