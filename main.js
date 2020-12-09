const bookList = document.querySelector("#book-list");
const form = document.querySelector("#add-book-form");

const mainApp = (() => {
var uid = null;
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      uid = user.uid;
    } else {
      window.location.replace("login.html");
    }
  });

  function logOut() {
    firebase.auth().signOut();
  }

return {logOut}
})();

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
    cross.setAttribute("class", "deleteCross")

    li.appendChild(title);
    li.appendChild(author);
    li.appendChild(pages);
    li.appendChild(read);
    li.appendChild(cross);

    bookList.appendChild(li);

//delete data
cross.addEventListener("click", (e) => {
  e.stopPropagation();
  let id = e.target.parentElement.getAttribute("data-id");
  db.collection("books").doc(id).delete();
  console.log(id)
})
}

//saving data to firestore
form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("books").add({
    title: form.title.value,
    author: form.author.value,
    pages: form.pages.value,
    read: form.read.checked

  })

  form.title.value ="";
  form.author.value ="";
  form.pages.value ="";
  form.read.checked="";

})

// real time listener

db.collection("books").orderBy("title").onSnapshot((snapshot) => {
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
})