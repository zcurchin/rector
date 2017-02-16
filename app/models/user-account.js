import DS from 'ember-data';

const {
  Model,
  attr
} = DS;

export default Model.extend({
  auth_uid: attr('string'),
  profile_id: attr('string'),
  created_at: attr('number', { defaultValue: Date.now() }),
  verified: attr('boolean', { defaultValue: false }),
  email: attr('string'),
  username: attr('string')
});
