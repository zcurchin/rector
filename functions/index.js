const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.gradeAdded = functions.database.ref('/privateGrades/{userId}').onCreate(event => {

  let uid = event.params.userId;
  let value = event.data.val();

  console.log('Grade added', event.params.userId);
  console.log(event.data.val());

  // 1. Add to publicGrades
  // 2. Add to businessGrades

  // let businessGrades = {
  //   // business id
  //   'GOPMT9vQeXTVPjojpG8t42Mmp5k1': [
  //     // grade id
  //     '-KsZpSL3I35q6-xw0BKM': {
  //       uid: 'UdrPFfGhAmc1Ln4WlzvtSgxnC892',
  //       value: 3,
  //       timestamp: 1503903140825
  //     }
  //   ]
  // };
  //
  // let businessEmployees = [
  //   // business id
  //   'GOPMT9vQeXTVPjojpG8t42Mmp5k1': {
  //     // user id
  //     'UdrPFfGhAmc1Ln4WlzvtSgxnC892': {
  //       job_title: 'waiter',
  //       average_grade: 4.5,
  //       total_grades: 2,
  //       grades_value_0: 0,
  //       grades_value_1: 0,
  //       grades_value_2: 0,
  //       grades_value_3: 0,
  //       grades_value_4: 1,
  //       grades_value_5: 1
  //     }
  //   }
  // ];

  // REMOVE CHILD NODE
  // ref.child(key).remove();

  //const collectionRef = event.data.ref.parent;
  //const countRef = collectionRef.parent.child('likes_count');

  // Return the promise from countRef.transaction() so our function
  // waits for this async event to complete before it exits.
  // return countRef.transaction(current => {
  //   if (event.data.exists() && !event.data.previous.exists()) {
  //     return (current || 0) + 1;
  //   }
  //   else if (!event.data.exists() && event.data.previous.exists()) {
  //     return (current || 0) - 1;
  //   }
  // }).then(() => {
  //   console.log('Counter updated.');
  // });
});
