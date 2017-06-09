import Ember from 'ember';

const {
  Component,
  inject: { service },
  get
} = Ember;


export default Component.extend({
  avatar: service(),

  actions: {
    close(){
      let avatar = get(this, 'avatar');
      avatar.close();
    },

    onAvatarChanged(data){
      this.sendAction('action', data);
    }
  }
});
