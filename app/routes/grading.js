import Ember from 'ember';

const { Route } = Ember;


export default Route.extend({
  // deactivate(){
  //   this._super(...arguments);
  //
  //   this.controller.set('yesterdayInfo', false);
  // }


  // setupController(controller, model){
  //   this._super(controller, model);
  //
  //   let date = new Date();
  //   let hours = date.getHours();
  //   let after_midnight_treshold = get(this, 'after_midnight_treshold');
  //
  //   console.log('# Route : Grading : hours :', hours);
  //   console.log('# Route : Grading : after_midnight_treshold :', after_midnight_treshold);
  //
  //   if (hours < after_midnight_treshold) {
  //     let startDate = this.getStartTime('date');
  //     controller.set('yesterday', startDate);
  //
  //   } else {
  //     controller.set('yesterday', false);
  //   }
  // }
});
