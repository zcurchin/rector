import Ember from 'ember';

const {
  Controller,
  inject: { service }
} = Ember;


export default Controller.extend({
  user: service(),

  
  actions: {
    goBack(){
      window.history.back();
    },


    deleteEmployee(){

    }
  }
});
