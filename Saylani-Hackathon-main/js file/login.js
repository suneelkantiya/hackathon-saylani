
import { initializeApp } from  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFvP4hWepcoLWse_v1JCdy-yHAVf_8ZXc",
  authDomain: "hackathon-saylani-1c85a.firebaseapp.com",
  projectId: "hackathon-saylani-1c85a",
  storageBucket: "hackathon-saylani-1c85a.appspot.com",
  messagingSenderId: "230700412505",
  appId: "1:230700412505:web:fa5b41a4f93d9148a48b48",
  measurementId: "G-62N93K3PEL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
// -------------------    Geeting Html Elemnts -----------------------------------------------------------------//
let userInpLogin = document.querySelectorAll("#username-login")[0];
let passInpLogin = document.querySelectorAll("#password-login")[0];
let loginBtn = document.querySelectorAll("#login-btn")[0];

// -----------------     User State Check   -------------------------------------------------------------------//
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("uid==> User Status",uid);
    window.location.href = "../html file/home.html"
  } else {
    console.log("user is not find")
  }
});


//-------------------------  Register User Login   -------------------------------------------------//
const loginPage = () => {
  let email = userInpLogin.value.toLowerCase();
  let password = passInpLogin.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire(
        'Login!',
        'user succefully login!😊',
        'success'
      )
      console.log("user succefully login==>", user);
      window.location.href = "../html file/home.html"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: reject.error,
        footer: '<a href="">Why do I have this issue?</a>',
      });
      console.log("errorMessage==>",errorMessage);
    });


  // Clear input fields
  userInpLogin.value = "";
  passInpLogin.value = "";
}



loginBtn.addEventListener('click', loginPage)
