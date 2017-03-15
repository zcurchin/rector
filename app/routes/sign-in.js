import Ember from 'ember';

const {
  Route
} = Ember;


export default Route.extend({
  beforeModel(){
    let isAuthenticated = this.get('session').get('isAuthenticated');
    console.log('isAuthenticated:', isAuthenticated);

    if (isAuthenticated) {
      this.replaceWith('checking');
    }
  }
});
