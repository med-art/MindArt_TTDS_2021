// ref https://github.com/gauti123456/FirebaseStoragePhotoUpload/blob/master/index.html

let dlImg;

  let fbPathArray = [];

const firebaseConfig = {
  apiKey: "AIzaSyCcsg-O-13sb_sOHRACVDeSdMoeYTaV9Qk",
  authDomain: "thinkdraw-a7a5c.firebaseapp.com",
  projectId: "thinkdraw-a7a5c",
  storageBucket: "thinkdraw-a7a5c.appspot.com",
  messagingSenderId: "477283263624",
  appId: "1:477283263624:web:3afe9b5a02f04143ed6b3d"
};

const app = firebase.initializeApp(firebaseConfig);
const storageRef = app.storage().ref();

function saveToFirebase() {
  const d = +new Date();

  const name = username + "." + d + ".jpg";
  // upload low resolution images
  var uploadCanvas = document.getElementById('uploadLayer');
  var file = uploadCanvas.toBlob(function(blob) {
    var image = new Image();
    image.src = blob;
    storageRef.child(type + "/" + name).put(blob);
  }, 'image/jpeg', 0.1);
  //upload high resolution images
  const nameHQ = username + "." + d + ".png";
  var fileHQ = defaultCanvas0.toBlob(function(blob) {
    var image = new Image();
    image.src = blob;
    storageRef.child(type + "HQ/" + nameHQ).put(blob);
  }, 'image/png', 1);
};

function getFirebaseImgList() {

fbPathArray = [];
  // locay array to Store all images


  // get all paths as a list
  storageRef.child(type + "/").listAll()
    .then((res) => {
      res.items.forEach((itemRef) => {
        //push these to an array
        fbPathArray.push(itemRef.location.path);
      });
    }).then(() => {downloadImg()}).catch((error) => {
      // Uh-oh, an error occurred!
    });
}

function getFirebaseImgListV2() {
  blendMode(BLEND);
  background(60);
  image(drawLayer, width * 0.4, height * 0.4, width * 0.2, height * 0.2);
  blendMode(OVERLAY);
  tint(255, 255)
  for (let i = 0; i < 250; i++) {
    downloadImgSmall(i); // todo - move above
  }
}


function downloadImg(i, qty) {



  for (let i = 0; i < 10; i++) {
    if (drawingPaused) {
    let nn = Math.floor(random(0, fbPathArray.length));
    let n = fbPathArray[nn];
    // Create a reference to the file we want to download
      var starsRef = storageRef.child(n);

    // Get the download URL
    starsRef.getDownloadURL()
      .then((url) => {
        if (drawingPaused){
        dlImg = loadImage(url, function(loadedImg) {
              if (drawingPaused){
        image(loadedImg, width/4, height/4, width/2, height/2);
      }});
      }})
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      });
    }
  }


        setTimeout(getFirebaseImgListV2, 4000);


}

function downloadImgSmall(i, qty) {

  // Create a reference to the file we want to download
  let n = fbPathArray[Math.floor(random(0, fbPathArray.length))];
  var starsRef = storageRef.child(n);
  // Get the download URL
  starsRef.getDownloadURL()
    .then((url) => {
      if (drawingPaused){
      dlImg = loadImage(url, function(loadedImg) {
            if (drawingPaused){
        image(loadedImg, randomGaussian(width/2, width/2), randomGaussian(height/2, height/2), width * 0.25, height * 0.25);
      }});
    }})
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
}
