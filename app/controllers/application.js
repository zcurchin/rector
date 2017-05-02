import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get
} = Ember;


export default Controller.extend({
  session : service(),


  actions: {
    signOut(){
      let self = this;
      let session = get(this, 'session');
      let currentUser = session.get('currentUser');
      let uid = currentUser.uid;

      session.close().then(function(){
        // console.log('### LOGGING OUT USER', uid);
        // self.transitionToRoute('sign-in');
        window.location.reload();
      });
      // get(this, 'session').close().then(() => {
      //   console.log()
      //   //this.transitionToRoute('sign-in');
      // });
    },

    goToCreateAccount(){
      this.transitionToRoute('sign-up');
    }
  }
});
