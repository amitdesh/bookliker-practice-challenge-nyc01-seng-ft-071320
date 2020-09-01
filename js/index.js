
document.addEventListener("DOMContentLoaded", function() {

    renderBookList();
    showBookProfile();
    getUsersForBook()

});

let ce = (element) => {
    return document.createElement(element)
}

function qs(element){
    return document.querySelector(element)
}

let byId = (idTag) => {
    return document.getElementById(idTag)
}



function renderBookList(){

    fetch('http://localhost:3000/books')
    .then(function(response){return response.json()})
    .then(renderBooks)
    .catch(function(err){return "Not rendering right -" + err}) 
    
}

function renderBooks(books){

    for (const book of books){
        addBookToDOM(book)
    }
}

function addBookToDOM(book){

    const {title, id} = book
    let listPanel = byId('list')
    let bookBullet = ce('li')
    bookBullet.innerHTML =`${title}`
    bookBullet.dataset.id = `${id}`
    bookBullet.classList.add("book")
    listPanel.append(bookBullet)

}

function showBookProfile(){

    let bookList = byId('list')

    bookList.addEventListener('click',function(e){

        if (e.target.matches('.book')){
            let div = byId('show-panel')
            div.innerHTML=''
            extractInfoFromBooks(e.target.dataset.id)
        }

    })

}

function displayBookShowPage(book){

    let showPanel = byId("show-panel")
    showPanel.innerHTML = ''
    const {img_url, title, subtitle, author, description, id} = book
    let li = ce("p")
    li.innerHTML = `<img src=${img_url}>
    <h2>${title}</h2>
    <h3>${subtitle}</h3>
    <h4>${author}</h4>
    <p>${description}</p>
    <button class="like-button">Like This Book</button>
    <br>Current Followers: <br>`
    li.dataset.id = id
    showPanel.appendChild(li)
    let ul = ce("ul")
    li.append(ul)
    for (user of book.users){
        let uLi = ce('li')
        uLi.innerText = user.username
        ul.append(uLi)
    }
}

function extractInfoFromBooks(bookID){

    fetch('http://localhost:3000/books'+`/${bookID}`)
    .then(response => response.json())
    .then(displayBookShowPage)

}

function getUsersForBook(){
    
    document.addEventListener('click', function(e){
        if(e.target.matches('.like-button')){
            let bookID = parseInt(e.target.parentNode.dataset.id)
            fetch('http://localhost:3000/books/' + bookID)
            .then(response => response.json())
            .then(book => addUserToBook(book.users, book.id))
        }
    })
}

function addUserToBook(users, id){
    const self = {"id":1, "username":"pouros"}
    users.push(self)
    // debugger
    console.log(users)
    fetch('http://localhost:3000/books/'+id,{
        method: "PATCH",
        header:{
            'Content-Type': 'application/json',
            // 'Accept': 'application/json'

        },
        body: JSON.stringify({
            users: users
        })
    }).then(resp => resp.json())
    .then(console.log)
}