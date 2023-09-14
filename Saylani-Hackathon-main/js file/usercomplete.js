import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCFvP4hWepcoLWse_v1JCdy-yHAVf_8ZXc",
  authDomain: "hackathon-saylani-1c85a.firebaseapp.com",
  databaseURL: "https://friend-hackthon-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hackathon-saylani-1c85a",
  storageBucket: "hackathon-saylani-1c85a.appspot.com",
  messagingSenderId: "230700412505",
  appId: "1:230700412505:web:fa5b41a4f93d9148a48b48",
  measurementId: "G-62N93K3PEL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



// -------------------    Geeting Html Elemnts -----------------------------------------------------------------//
const allBlogsContainer = document.querySelectorAll(".post-container")[0];
const renderImg = document.querySelectorAll("#render-img")[0];
const userProfileRendering = document.querySelectorAll("#user-img-profile")[0];
const name = document.querySelectorAll("#user-profile-name")[0];
const email = document.querySelectorAll("#user-profile-email")[0];
let loader = document.querySelectorAll("#loader")[0];
const logOutUser = document.querySelectorAll("#logout")[0];


// -----------------     User State Check   -------------------------------------------------------------------//
onAuthStateChanged(auth,(user)=>{
    if(user){
        const uid = user.uid;
        getUserAllBlogs(uid)
        getUserInfo()
    }
})

// -------------------------------- Get All User Blogs -------------------------------------------------------//
const getUserAllBlogs = async() => {
    try {
        const urlParams = new URLSearchParams(location.search);
        const userParam = urlParams.get('user');
        console.log("userParam",userParam);
        loader.style.display = 'block';
        const q = query((collection(db, "bk_blogs")), where("userUid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
       
        querySnapshot.forEach((doc) => {
            const postInfo = doc.data();
            renderImg.src = doc.data().userImg;
            console.log(doc.id, " =>72 ", doc.data().userName);
            const { postTitle, created_at, userName, postDescription, userImg } = postInfo;
            const card = `
            <div class="card">
            <div class="img-name">
              <img id="user-img"  src="${userImg ? userImg : '../images/user-defoult.png'}" alt="">
            <div class="name-date-container">
                <h3>${userName || 'Unknown User'}</h3>
                <span>${created_at ? new Date(Number(created_at)).toLocaleDateString() : ''}</span>
            </div>
            </div>
            <div class="title-desc-container">
                <h2>${postTitle || ''}</h2>
                <p>${postDescription || ''}</p>
            </div>
            </div>
        `;
       allBlogsContainer.innerHTML += card;
        });
      } catch (error) {
       Swal.fire({
           icon: "error",
           title: "Oops...",
           text: error,
           footer: '<a href="">Why do I have this issue?</a>',
       });
       console.log("error",error);
      }
       loader.style.display = 'none';
}

// ---------------------------   Current User Information   ----------------------------------------------//
let getUserInfo = async (uid) => {
    try {
        
    loader.style.display = 'block';
    const q = query((collection(db, "hackathon"))
    , where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      name.innerHTML = doc.data().name;
      email.innerHTML = doc.data().email;
      if (doc.data().userProfileImgUrl) {
        userProfileRendering.src = doc.data().userProfileImgUrl;
        console.log("userprofile",userProfileRendering);
      }
      console.log(" doc.data()==>8888", doc.data());
    });
    } catch (error) {
        
    }
  
    loader.style.display = 'none';
  
  }
//---------------------------  User State Logout   -------------------------------------------------------//
  const logOut = () => {
    signOut(auth)
        .then(() => {
            location.href = "../index.html";
        })
        .catch((error) => {
            console.log("Error while signing out:", error);
        });
}
logOutUser.addEventListener("click", logOut)