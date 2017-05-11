import Ember from 'ember';

export function msDate(params) {

  let ms = params[0];
  let date = new Date(ms);

  console.log(date);

  return date;
}

export default Ember.Helper.helper(msDate);
