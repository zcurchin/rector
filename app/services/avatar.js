import Ember from 'ember';

const {
  Service,
  set
} = Ember;


export default Service.extend({
  show: false,
  showCropper: false,
  uploadedImageDataURL: null,


  open(){
    set(this, 'show', true);
  },


  close(){
    set(this, 'show', false);
    set(this, 'showCropper', false);
    set(this, 'uploadedImageDataURL', null);
  },


  setUploadedImage(dataURL){
    set(this, 'uploadedImageDataURL', dataURL);
    set(this, 'showCropper', true);
  }
});
