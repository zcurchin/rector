import DS from 'ember-data';

export default DS.Model.extend({
  business_id: DS.attr('string'),
  value: DS.attr('number'),
  timestamp: DS.attr('number')
});
