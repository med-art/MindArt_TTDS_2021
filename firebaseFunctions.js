// import firebase from "firebase/app";
// import "firebase/storage";

// function uploadRef() {
//   // [START storage_upload_ref]
//   // Create a root reference
//   var storageRef = storage.ref();
//
//   // Create a reference to 'mountains.jpg'
//   var mountainsRef = storageRef.child('mountains.jpg');
//
//   // Create a reference to 'images/mountains.jpg'
//   var mountainImagesRef = storageRef.child('images/mountains.jpg');
//
//   // While the file names are the same, the references point to different files
//   mountainsRef.name === mountainImagesRef.name;           // true
//   mountainsRef.fullPath === mountainImagesRef.fullPath;   // false
//   // [END storage_upload_ref]
// }

// /**
//  * @param {File} file
// //  */
// function uploadBlob(file) {
//   const ref = app.storage().ref().child('some-child');
//
//   // [START storage_upload_blob]
//   // 'file' comes from the Blob or File API
//   ref.put(file).then((snapshot) => {
//     console.log('Uploaded a blob or file!');
//   });
//   // [END storage_upload_blob]
// }



//
// /**
//  * @param {File} file
//  */
// function manageUploads(file) {
//   const storageRef = firebase.storage().ref();
//
//   // [START storage_manage_uploads]
//   // Upload the file and metadata
//   var uploadTask = storageRef.child('images/mountains.jpg').put(file);
//
//   // Pause the upload
//   uploadTask.pause();
//
//   // Resume the upload
//   uploadTask.resume();
//
//   // Cancel the upload
//   uploadTask.cancel();
//   // [END storage_manage_uploads]
// }
//
// /**
//  * @param {File} file
//  */
// function monitorUpload(file) {
//   const storageRef = firebase.storage().ref();
//
//   // [START storage_monitor_upload]
//   var uploadTask = storageRef.child('images/rivers.jpg').put(file);
//
//   // Register three observers:
//   // 1. 'state_changed' observer, called any time the state changes
//   // 2. Error observer, called on failure
//   // 3. Completion observer, called on successful completion
//   uploadTask.on('state_changed',
//     (snapshot) => {
//       // Observe state change events such as progress, pause, and resume
//       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log('Upload is ' + progress + '% done');
//       switch (snapshot.state) {
//         case firebase.storage.TaskState.PAUSED: // or 'paused'
//           console.log('Upload is paused');
//           break;
//         case firebase.storage.TaskState.RUNNING: // or 'running'
//           console.log('Upload is running');
//           break;
//       }
//     },
//     (error) => {
//       // Handle unsuccessful uploads
//     },
//     () => {
//       // Handle successful uploads on complete
//       // For instance, get the download URL: https://firebasestorage.googleapis.com/...
//       uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//         console.log('File available at', downloadURL);
//       });
//     }
//   );
//   // [END storage_monitor_upload]
// }
//
// /**
//  * @param {File} file
//  */
// function uploadHandleError(file) {
//   const storageRef = firebase.storage().ref();
//
//   // [START storage_upload_handle_error]
//   // Create the file metadata
//   var metadata = {
//     contentType: 'image/jpeg'
//   };
//
//   // Upload file and metadata to the object 'images/mountains.jpg'
//   var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
//
//   // Listen for state changes, errors, and completion of the upload.
//   uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//     (snapshot) => {
//       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//       var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//       console.log('Upload is ' + progress + '% done');
//       switch (snapshot.state) {
//         case firebase.storage.TaskState.PAUSED: // or 'paused'
//           console.log('Upload is paused');
//           break;
//         case firebase.storage.TaskState.RUNNING: // or 'running'
//           console.log('Upload is running');
//           break;
//       }
//     },
//     (error) => {
//       // A full list of error codes is available at
//       // https://firebase.google.com/docs/storage/web/handle-errors
//       switch (error.code) {
//         case 'storage/unauthorized':
//           // User doesn't have permission to access the object
//           break;
//         case 'storage/canceled':
//           // User canceled the upload
//           break;
//
//         // ...
//
//         case 'storage/unknown':
//           // Unknown error occurred, inspect error.serverResponse
//           break;
//       }
//     },
//     () => {
//       // Upload completed successfully, now we can get the download URL
//       uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//         console.log('File available at', downloadURL);
//       });
//     }
//   );
//   // [END storage_upload_handle_error]
// }
