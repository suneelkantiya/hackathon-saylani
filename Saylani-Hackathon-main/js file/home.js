// //==================   FireBase Initializing ==================================//
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
    getFirestore, collection,
    query, where,
    addDoc, doc, getDoc, getDocs, deleteDoc, updateDoc
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

// -------------------------------- Getting HTML Elements -------------------------------------------------------//
let postContainer = document.querySelectorAll(".blogs-container")[0];
let postForm = document.querySelectorAll("#post_form")[0];
let renderUserProfile = document.querySelectorAll("#render-image")[0];
const logOutUser = document.querySelectorAll("#log-Out")[0];
let loader = document.querySelectorAll("#loader")[0];
let editModal = document.querySelectorAll("#post-form-modal")[0];
let updatedDesc = document.querySelectorAll("#edit_desc")[0];
let upadtedTitle = document.querySelectorAll("#edit-title")[0];
let cancelEdit = document.querySelectorAll("#cancel-post")[0];
let UpdateBlogPost = document.querySelectorAll("#update-post")[0];
let updateEditId = "";

// -------------------------------- User State Check-------------------------------------------------------//

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log('User uid-->', uid)
        getPosts();
        getUserInfo();
    } else {
        console.log('User is not logged in')
    }
});
// -------------------------------- Current User Information -------------------------------------------------------//

let getUserInfo = async (uid) => {
    const userRef = doc(db, "hackathon", auth.currentUser.uid)
    const docSnap = await getDoc(userRef);
    let info = null
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        if(docSnap.data().userProfileImgUrl)
        renderUserProfile.src = docSnap.data().userProfileImgUrl;
        info = docSnap.data(
        )
    } else {
        console.log("No such document!");
    }
    return info
}

// -------------------------------- User Will Publish Post Using This Logic -------------------------------------------------------//

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loader.style.display = 'block';

    let postTitle = document.querySelectorAll("#post_title")[0].value;
    let postDescription = document.querySelectorAll("#post_desc")[0].value;

    try {
        const userInfo = await getUserInfo(auth.currentUser.uid);
        console.log("userInfo==>",userInfo);
        const postObj = {
            postTitle,
            postDescription,
            userUid: auth.currentUser.uid,
            userName: userInfo.name,
            userImg: userInfo ? userInfo.userProfileImgUrl : '../images/user-default.png',
            created_at: new Date().getTime().toString(),
        }
        console.log("postObj==>",postObj);
        const postRef = collection(db, 'bk_blogs');
        await addDoc(postRef, postObj);
        loader.style.display = 'none';
        console.log("postRef", postRef);
        postTitle = "";
        postDescription = "";
        Swal.fire({
            icon: "success",
            title: "Post Publish Succesfully",
        });
    } catch (error) {
        console.log("Error getting user info:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
        });
    }
    getPosts();

});

// -------------------------------- Get All User Blogs -------------------------------------------------------//

let getPosts = async () => {
    try {
        loader.style.display = 'block';
        const q = query((collection(db, "bk_blogs")), where("userUid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        postContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const postInfo = doc.data();
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
             <div class="btn">
         <button class='button-bk'  id="edit-post" onclick="editPost('${doc.id}')">Edit</button>
         <button class='button-bk ' id="delete-post" onclick="deletePost('${doc.id}')">Delete</button>
         <div class="anchor-param"><a class="user-param" href="../html file/usercomplete.html?user=${doc.data().userUid}">See All From This User...</a>
         </div>
             </div>
         </div>  
         </div>
     `;
            postContainer.innerHTML += card;
        });
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
        });
    }
    loader.style.display = 'none';
};

//-----   Edit Post User Select The Edit Button Modal Will Be Open And User Edit Thier Uploaded Post   ---------//
const editPost = (id) => {
    try {
        updateEditId = id;
        console.log("Editing post with ID:", id);
        const postRef = doc(db, "bk_blogs", id);
        getDoc(postRef).then((postSnapshot) => {
            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                const { postTitle, postDescription } = postData;
                upadtedTitle.value = postTitle;
                updatedDesc.value = postDescription;
            }
            upadtedTitle.value = '';
            updatedDesc.value  = ' ';
            editModal.style.display = 'block';
        });

    } catch (error) {
        console.error("Error retrieving post data:", error)
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
        });
    }
};
// -----------------------   Modal Will Display And User Change His Publish Post   ----------------------//
const upadetPost = async () => {
    try {
        console.log(upadtedTitle.value, updatedDesc.value, updateEditId);
        const editBlogPostRef = doc(db, 'bk_blogs', updateEditId);
        await updateDoc(editBlogPostRef, {
            postTitle: upadtedTitle.value,
            postDescription: updatedDesc.value,
        });
        Swal.fire({
            icon: "success",
            title: "Post Edit Succesfully",
        });
        updateEditId = '';
        editModal.style.display = 'none';
        getPosts();

    } catch (error) {
        console.log("Error getting user info:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            footer: '<a href="">Why do I have this issue?</a>',
        });
    }
}
cancelEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
})

//------------------ Delete Logic Here This Publish Data Will Be deleted into the firebase -------------------//
const deletePost = async (id) => {
    try {
        loader.style.display = 'block';
        console.log("hey i Am Delete baby", id);
        const uid = auth.currentUser.uid;
        console.log("uid==>136", uid);
        await deleteDoc(doc(db, "bk_blogs", id));
        loader.style.display = 'none';
        Swal.fire({
            icon: "success",
            title: "Post Deleted Succesfully",
        });
        getPosts();
    } catch (error) {
        Swal.fire({
            icon: 'Error',
            title: error.message,
        });
    }

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

// -------------------------------  Event Trigger ------------------------------------------------//
window.deletePost = deletePost;
window.editPost = editPost;
UpdateBlogPost.addEventListener('click', upadetPost)
