const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.gradeAdded = functions.database.ref('/privateGrades/{userId}').onCreate(event => {

  let uid = event.params.userId;
  let value = event.data.val();
  
  console.log('Grade added', event.params.userId);
  console.log(event.data.val());

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
