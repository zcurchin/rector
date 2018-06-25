import { moduleForModel, test } from 'ember-qunit';

moduleForModel('business-grade', 'Unit | Model | business grade', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
