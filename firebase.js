// ref https://github.com/gauti123456/FirebaseStoragePhotoUpload/blob/master/index.html

let dlImg;

let reducedArr = [];

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

  const name = username + "." + d +".png";
  // note jpeg not working... TODO
  var file = defaultCanvas0.toBlob(function(blob) {
    var image = new Image();
    image.src = blob;
    storageRef.child(type + "/" + name).put(blob);
  }, 'image/png', 0.95);
};

function getFirebaseImgList() {

  // locay array to Store all images
  let fbPathArray = [];

  // get all paths as a list
  storageRef.child(type + "/").listAll()
    .then((res) => {
      res.items.forEach((itemRef) => {
        //push these to an array
        fbPathArray.push(itemRef.location.path);
      });
    }).then(() => {
      reducedArr = [];



      // Load a qty of images into the array randomly, but don't download them yet
      let qty = 400;
      if (fbPathArray.length < 10) {
        qty = fbPathArray.length;
      }
      for (let i = 0; i < qty; i++) {
        if (drawingPaused){
        reducedArr.push(fbPathArray[Math.floor(random(0, fbPathArray.length))]);
        if (i > Math.floor(qty*0.8)){
          downloadImg(i, qty);
        }
      }
    }

    //todo - do I need drawing paused now??



    }).catch((error) => {
      // Uh-oh, an error occurred!
    });
}

function getFirebaseImgListV2() {
  blendMode(BLEND);
  background(60);
  blendMode(OVERLAY);
  tint(255, 255)
  for (let i = 0; i < reducedArr.length; i++) {
    if (drawingPaused){
    downloadImgSmall(i); // todo - move above
  }
}
}



function downloadImg(i, qty) {
  console.log("downloading");
  // Create a reference to the file we want to download
  var starsRef = storageRef.child(reducedArr[i]);




  // Get the download URL
  starsRef.getDownloadURL()
    .then((url) => {
      dlImg = loadImage(url, function(loadedImg) {
      image(loadedImg, width/4, height/4, width/2, height/2);
      });
    })
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

// if this loop
    if (i >= qty-1){
      console.log("Finished Downloading")
      setTimeout(getFirebaseImgListV2, 4000);
    }

}

function downloadImgSmall(i, qty) {
  console.log("downloading");
  // Create a reference to the file we want to download
  var starsRef = storageRef.child(reducedArr[i]);
  // Get the download URL
  starsRef.getDownloadURL()
    .then((url) => {
      dlImg = loadImage(url, function(loadedImg) {
        image(loadedImg, random(0, width*0.85), random(0, height*0.85), width * 0.15, height * 0.15);
      });
    })
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
