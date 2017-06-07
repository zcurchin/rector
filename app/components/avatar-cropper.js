import imageCropper from 'ember-cli-image-cropper/components/image-cropper';
import Ember from 'ember';

const {
  inject: { service },
  get,
  set
} = Ember;

export default imageCropper.extend({
  avatar: service(),
  firebaseApp: service(),

  classNames: ['avatar-cropper-box'],

  // cropper js options
  aspectRatio: 1,
  autoCropArea: 1,
  cropperContainer: '.cropper-container > img',
  previewClass: '.img-preview',
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false,
  dragMode: 'move',

  error_msg: false,
  success_msg: false,
  uploading: false,

  savingImage: false,
  savedImageSuccess: false,
  savedImageFail: false,


  actions: {
    saveImage: function() {
      let container = this.$(this.get('cropperContainer'));
      let firebaseApp = get(this, 'firebaseApp');
      let storageRef = firebaseApp.storage().ref();

      set(this, 'savingImage', true);

      let croppedImage = container.cropper('getCroppedCanvas', {
        width: 400,
        height: 400

      }).toBlob(function(blob){
        console.log(blob);
        // Create a reference to 'mountains.jpg'
        var mountainsRef = storageRef.child('mountains.png');

        // Create a reference to 'images/mountains.jpg'
        //var mountainImagesRef = storageRef.child('images/mountains.jpg');

        // While the file names are the same, the references point to different files
        // mountainsRef.name === mountainImagesRef.name            // true
        // mountainsRef.fullPath === mountainImagesRef.fullPath    // false
        mountainsRef.put(blob).then(function(snapshot) {
          console.log(snapshot);
        });

      });

      this.set('croppedAvatar', croppedImage);
    },


    rotate(direction){
      let container = this.$(this.get('cropperContainer'));

      if (direction === 'right') {
        container.cropper('rotate', 15);
      } else {
        container.cropper('rotate', -15);
      }
    },


    zoom(direction){
      let container = this.$(this.get('cropperContainer'));

      if (direction === 'in') {
        container.cropper('zoom', 0.1);
      } else {
        container.cropper('zoom', -0.1);
      }
    }
  }
});
