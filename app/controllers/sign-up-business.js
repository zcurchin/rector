import Ember from 'ember';

const {
  Controller,
  inject: { service },
  get,
  set
} = Ember;

export default Controller.extend({
  //app_controler: controller('application'),
  business: service(),
  preloader: false,
  error_msg: '',

  actions: {
    signUpBusiness(){
      console.log('##### signUpBusiness');
      let self = this;
      let email = get(this,'email');
      let pass = get(this, 'password');
      let name = get(this, 'name');
      let business = get(this, 'business');

      set(this, 'preloader', true);

      let params = {
        email: email,
        password: pass,
        name: name
      };

      business.create(params).then(() => {
        console.log('# Sign Up Business : user data created');

        self.get('session').open('firebase', {
          provider: 'password',
          email: email,
          password: pass

        }).then(function() {
          console.log('# Sign Up Business : user logged in');

          user.setup().then(() => {
            set(self, 'preloader', false);
            self.replaceRoute('ranking');
          });

        }).catch(function(err){
          console.log(err);
          set(self, 'preloader', false);
          set(self, 'error_msg', err.message);
        });


      }).catch((err) => {
        console.log(err);
        set(self, 'preloader', false);
        set(self, 'error_msg', err.message);
      });
    },

    cancel(){
      this.transitionToRoute('sign-in');
    }
  }
});
