import DS from 'ember-data';

export default DS.Model.extend({
  business_id: DS.attr('string'),
  comment: DS.attr('string'),
  timestamp: DS.attr('number'),
  value: DS.attr('number')
});
