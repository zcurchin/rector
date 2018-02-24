import Ember from 'ember';

const {
  Service,
  get
} = Ember;


export default Service.extend({
  time: null,


  getTime(){
    let time = get(this, 'time');
    return time.valueOf();
  }
});
