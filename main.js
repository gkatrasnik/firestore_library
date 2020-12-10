const bookList = document.querySelector("#book-list");
const form = document.querySelector("#add-book-form");
const signedInAs = document.querySelector("#signedInAs");
let uid = null;

// Detect logged in user change
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      uid = user.uid;
      signedInAs.textContent=("Logged in as: " + user.email)
      loadBooks()

    } else {
      window.location.replace("index.html");
    }
  });

  function logOut() {
    firebase.auth().signOut();
    uid = null;
  }



//create element and render book
function renderBook(doc){
  let li = document.createElement("li");
  let title = document.createElement("span");
  let author = document.createElement("span");
  let pages = document.createElement("span");
  let read = document.createElement("span");
  let cross = document.createElement("button");

  li.setAttribute("data-id", doc.id);
  li.setAttribute("class", "bookLi")
  title.setAttribute("class", "title")
  title.textContent = doc.data().title;
  author.textContent = doc.data().author;
  pages.textContent = (doc.data().pages + " pages");
  
  if (doc.data().read == true) {
    read.textContent = "Read";
    } else if (doc.data().read == false) {
      read.textContent = "Not Read";
    }

  cross.textContent="Delete";

  li.appendChild(title);
  li.appendChild(author);
  li.appendChild(pages);
  li.appendChild(read);
  li.appendChild(cross);

  bookList.appendChild(li);


  //delete book 
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("users").doc(uid).collection("books").doc(id).delete();
    
    console.log("deleted" + id)
    loadBooks()
  })
}


//Add book to firestore ----WORKS
form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("users").doc(uid).collection("books").add({
    title: form.title.value,
    author: form.author.value,
    pages: form.pages.value,
    read: form.read.checked,
    userId: uid
  })

  form.title.value ="";
  form.author.value ="";
  form.pages.value ="";
  form.read.checked="";

  loadBooks();
})


// real time listener ----- DOESNT WORK WITH GROUP QUERIES

/*db.collection("users").doc(uid).collection("books").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  console.log(changes.doc)
  changes.forEach(change => {
    if(change.type == "added") {
      renderBook(change.doc)
    }else if (change.type == "removed") {
      let li = bookList.querySelector("[data-id=" + change.doc.id + "]")
      bookList.removeChild(li);
    }
  })
})*/


function clearBookList() {
  document.getElementById("book-list").innerHTML = "";
}

function loadBooks(){ 

  clearBookList();

  var books = db.collectionGroup('books').where('userId', '==', uid);
  books.get().then( (snapshot) => {
      snapshot.docs.forEach(doc => {
        renderBook(doc)
      });
    });
  
}

