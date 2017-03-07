import Ember from 'ember';

export function gradeBox(params) {
  let valid_grades = params[0].filter(grade => {
    return grade.value > 0;
  }).map(grade => {
    return grade.value;
  });

  //console.log(valid_grades);

  let sum = valid_grades.reduce(function(a, b) { return a + b; });
  let avg = sum / valid_grades.length;

  return avg + ' / ' + valid_grades.length;
}

export default Ember.Helper.helper(gradeBox);
