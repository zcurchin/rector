import imageCropper from 'ember-cli-image-cropper/components/image-cropper';
import Ember from 'ember';

const {
  inject: { service },
  get
} = Ember;

export default imageCropper.extend({
  firebaseApp: service(),

  //override default options of cropper
  aspectRatio: 1,
  minCropBoxWidth: 400,
  minCropBoxHeight: 400,
  cropperContainer: '.cropper-container > img',
  previewClass: '.img-preview',
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false,
  dragMode: 'move',

  croppedAvatar: null,

  actions: {
    getCroppedAvatar: function() {
      let container = this.$(this.get('cropperContainer'));
      let firebaseApp = get(this, 'firebaseApp');
      let storageRef = firebaseApp.storage().ref();

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
          console.log('Uploaded a blob or file!');
        });

      });

      this.set('croppedAvatar', croppedImage);
    },

    rotate(){
      let container = this.$(this.get('cropperContainer'));
      container.cropper('rotate', 15);
    }
  }
});
