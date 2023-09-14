// //==================   FireBase Initializing ==================================//


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
    getFirestore, collection,
    query,
    where,
    getDocs,
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

// -------------------------------- Geting HTML Elements -------------------------------------------------------//
let loader = document.querySelectorAll("#loader")[0];
const allBlogsContainer = document.querySelectorAll(".post-container")[0];
const renderImg = document.querySelectorAll("#render-img")[0];
const logOutUser = document.querySelectorAll("#logout")[0];


// -------------------------------- Current User State Check -------------------------------------------------------//
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('User uid-->', uid)
        getAllBlogs()
        getUserInfo(uid)
    } else {
        console.log('User is not logged in')
    }
});

// -------------------------------- Current User Info -------------------------------------------------------//
let getUserInfo = async (uid) => {
    try {
        console.log("uid==>49",uid);
    loader.style.display = 'block';
    const q = query((collection(db, "hackathon"))
    , where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      if (doc.data().userProfileImgUrl) {
        renderImg.src = doc.data().userProfileImgUrl;
        console.log("renderImg",renderImg);
      }
      console.log(" doc.data()==>8888", doc.data());
    });
    } catch (error) {
        console.log("error",error);
    }
  
    loader.style.display = 'none';
  
  }

// -------------------------------- Get All User Blogs -------------------------------------------------------//
const getAllBlogs = async () => {
    loader.style.display = 'block';
    const querySnapshot = await getDocs(collection(db, "bk_blogs"));
    querySnapshot.forEach((doc) => {
        const postInfo = doc.data();
        console.log("51",postInfo);
        // renderImg.src = doc.data().userImg;
        const { postTitle, created_at, userName, postDescription, userImg } = postInfo;
        console.log("postInfo55", postInfo);

        allBlogsContainer.innerHTML += `
        <div class="card">
        <div class="img-name">
          <img id="user-img"  src="${userImg ? userImg : '../images/user-defoult.png'}" alt="">
        <div class="name-date-container">
            <h3>${userName || 'Unknown User'}</h3>
            <span>published ${created_at ? new Date(Number(created_at)).toLocaleDateString() : ''}</span>
        </div>
        </div>
        <div class="title-desc-container">
            <h2>${postTitle || ''}</h2>
            <p>${postDescription || ''}</p>
        </div>

    </div>
     `
    });

    loader.style.display = 'none';
}

// -------------------------------- Logout -------------------------------------------------------//
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