import Ember from 'ember';

const { Controller } = Ember;


export default Controller.extend({
  actions: {
    goBack(){
      window.history.back();
    },


    deleteEmployee(){

    }
  }
});
