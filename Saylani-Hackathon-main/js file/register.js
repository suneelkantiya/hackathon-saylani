
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
   getAuth,
   createUserWithEmailAndPassword,onAuthStateChanged
 } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
 import {
     getFirestore,doc,setDoc,
 } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

let regFlag = false;

onAuthStateChanged(auth, async (user) => {
 if (user) {
     const uid = user.uid;
     console.log('User uid-->', uid)
 } else {
     console.log('User is not logged in')
 }
});



// -------------------    Geeting Html Elemnts -----------------------------------------------------------------//

let nameInp = document.querySelectorAll("#name")[0];
let userInp = document.querySelectorAll("#username")[0];
let emailInp = document.querySelectorAll("#email")[0];
let passInp = document.querySelectorAll("#password")[0];
let cPassInp = document.querySelectorAll("#c-password")[0];
let signupForm = document.querySelectorAll("#signup-form")[0]; 
let loader = document.querySelectorAll("#loader")[0]; 

// ---------------------------   Register User -----------------------------------------------//
signupForm.addEventListener("submit", async (e) => {
 e.preventDefault();
 loader.style.display = 'block';
 let name = nameInp.value.toLowerCase();
 let userName = userInp.value.toLowerCase();
 let email = emailInp.value.toLowerCase();
 let password = passInp.value;
 let confirmPs = cPassInp.value;
 // regFalg = false;
       // Only proceed if regFlag is false (user has not registered before)
       try {
           const userCredential = await createUserWithEmailAndPassword(auth, email, password);
           const user = userCredential.user;

           const userInfo = {
               name,
               userName,
               email,
               uid: user.uid,
           };

           const hackathonRef = doc(db, "hackathon", user.uid);
           await setDoc(hackathonRef, userInfo);

           // regFlag = true;
           loader.style.display = 'none';
           Swal.fire({
             icon: "success",
             title: "User updated successfully",
           });
           window.location.href = '../html file/home.html';
       } catch (error) {
        
         console.log("error", error);
           const errorCode = error.code;
           const errorMessage = error.message;
           Swal.fire({
             icon: "error",
             title: "Oops...",
             text: errorMessage,
             footer: '<a href="">Why do I have this issue?</a>',
           });
           console.log("error", error);
       }

 // Clear input fields after signup
 nameInp.value = "";
 userInp.value = "";
 emailInp.value = "";
 passInp.value = "";
 cPassInp.value = "";
});
