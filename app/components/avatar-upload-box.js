import Ember from 'ember';

const {
  inject: { service },
  Component,
  get,
  set
} = Ember;


export default Component.extend({
  avatar: service(),
  classNames: ['avatar-upload-box'],


  didInsertElement(){
    this._super(...arguments);

    let avatar = get(this, 'avatar');

    this.$('#local_image').on('change', function(e){
      let file = e.target.files[0];
      let reader = new FileReader();

      reader.onload = function(e) {
        avatar.setUploadedImage(e.target.result);
      };

      reader.readAsDataURL(file);
    });
  },


  willDestroyElement() {
    this._super(...arguments);

    this.$('#local_image').off('change');
  }
});
