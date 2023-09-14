import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


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

const tryOutBtn = document.getElementById("try-out-button");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log("user login uid==>:", uid);
    }
    else {
        console.log("User is Not Login");
    }

});