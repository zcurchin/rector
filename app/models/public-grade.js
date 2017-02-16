import DS from 'ember-data';
//import Ember from 'ember';

const {
  Model,
  //hasMany,
  attr
} = DS;

// const {
//   computed
// } = Ember;

export default Model.extend({
  value: attr('number'),
  created_at: attr('number')
});
