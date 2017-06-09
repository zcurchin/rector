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
  session: service(),

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

  savingAvatar: false,
  savingSuccess: false,
  savingFail: false,

  actions: {
    saveImage: function() {
      let self = this;
      let session = get(this, 'session');
      let currentUser = session.get('currentUser');
      let container = this.$(this.get('cropperContainer'));
      let firebaseApp = get(this, 'firebaseApp');
      let storageRef = firebaseApp.storage().ref();

      set(this, 'savingAvatar', true);

      if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
          value: function(callback) {

            let binStr = atob( this.toDataURL('image/jpeg', 0.6).split(',')[1] );
            let len = binStr.length;
            let arr = new Uint8Array(len);

            for (let i = 0; i < len; i++ ) {
              arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], {type: 'image/jpeg' }));
          }
        });
      }

      let croppedImage = container.cropper('getCroppedCanvas', {
        width: 400,
        height: 400

      }).toBlob(function(blob){
        var avatarRef = storageRef.child('avatars/'+currentUser.uid+'.jpg');
        var metadata = {
          contentType: 'image/jpeg',
        };

        avatarRef.put(blob, metadata).then(function(snapshot) {
          let profileRef = firebaseApp.database().ref('userProfiles/' + currentUser.uid);

          profileRef.update({
            profile_image: snapshot.downloadURL

          }).then(function(data){
            set(self, 'savingSuccess', true);
            self.sendAction('action', snapshot.downloadURL);

          }).catch(function(error){
            set(self, 'savingFail', true);
          });

        }).catch(function(error){
          set(self, 'savingFail', true);
        });

      }, 'image/jpeg', 0.6);
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
