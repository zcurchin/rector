import Ember from 'ember';

export function gradeHtml(params) {
  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  let type = params[0];
  let grades = params[1];

  let valid_grades = grades.filter(grade => {
    return grade.get('value') > 0;
  }).map(grade => {
    return grade.get('value');
  });

  let sum = valid_grades.length ? valid_grades.reduce(function(a, b) { return a + b; }) : 0;
  let total_grades = valid_grades.length;
  let avg_grade = sum ? roundToTwo(sum / valid_grades.length) : 0;

  let return_value = null;

  switch (type) {
    case 'avg':
      return_value = avg_grade;
    break;

    case 'total':
      return_value = total_grades;
    break;

    case '5':
      let fives = valid_grades.filter(grade => {
        return grade === 5;
      }).map(grade => {
        return grade.value;
      });
      return_value = fives.length;
    break;

    case '4':
      let fours = valid_grades.filter(grade => {
        return grade === 4;
      }).map(grade => {
        return grade.value;
      });
      return_value = fours.length;
    break;

    case '3':
      let trees = valid_grades.filter(grade => {
        return grade === 3;
      }).map(grade => {
        return grade.value;
      });
      return_value = trees.length;
    break;

    case '2':
      let twos = valid_grades.filter(grade => {
        return grade === 2;
      }).map(grade => {
        return grade.value;
      });
      return_value = twos.length;
    break;

    case '1':
      let ones = valid_grades.filter(grade => {
        return grade === 1;
      }).map(grade => {
        return grade.value;
      });
      return_value = ones.length;
    break;
  }

  return return_value;
}

export default Ember.Helper.helper(gradeHtml);
