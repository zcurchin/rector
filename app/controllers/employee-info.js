import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    goBack(){
      window.history.back();
    },

    deleteEmployee(){

    }
  }
});
