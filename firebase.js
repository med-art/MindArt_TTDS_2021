// ref https://github.com/gauti123456/FirebaseStoragePhotoUpload/blob/master/index.html

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

function saveToFirebase(){
const name = +new Date()+".png";

// note jpeg not working... TODO
var file = defaultCanvas0.toBlob(function(blob) {
  var image = new Image();
  image.src = blob;
  storageRef.child(name).put(blob);
},'image/jpeg', 0.95);
};
