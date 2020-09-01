
document.addEventListener("DOMContentLoaded", function() {

    renderBookList();
    showBookProfile();
    likeBook()

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
    li.append(addUsersToBook(book))
    
    
}

function addUsersToBook(book){
    let ul = ce("ul")
    for (user of book.users){
        let uLi = ce('li')
        uLi.innerText = user.username
        uLi.dataset.id = user.id
        uLi.classList.add("users")
        ul.append(uLi)
    }
    return ul
}

function extractInfoFromBooks(bookID){

    fetch('http://localhost:3000/books'+`/${bookID}`)
    .then(response => response.json())
    .then(displayBookShowPage)

}

function likeBook(){
    
    document.addEventListener('click', function(e){
        if(e.target.matches('.like-button')){
            const self = {"id":1, "username": "pouros"}
            let x = document.querySelectorAll('.users')
            let userArray = []
            x.forEach(user =>{
                faker = {
                    "id": parseInt(user.dataset.id),
                    "username": user.innerText
                }
                userArray.push(faker)
            })
            userArray.push(self)
            let bookID = parseInt(e.target.parentNode.dataset.id)
            addNewUserToBook(userArray, bookID)
    //         fetch(`http://localhost:3000/books/${bookID}`, {
    //         method: "PATCH",
    //         headers: {
    //         "Content-type": "application/json",
    //         "accept": "application/json"
    //         },
    //         body: JSON.stringify({
    //         users: userArray
    //         })
    //      }).then(resp => resp.json())
    //      .then(book => {
    //          let x = document.querySelector('.users').parentElement
    //          x.innerHTML = ''
    //          addUsersToBook(book)
    //         })
    //      }) 
    //     //  This belongs to fetch
    //     })
        }
    })
}

function addNewUserToBook(userArray, bookId){
    fetch('http://localhost:3000/books/'+bookId,{
        method: "PATCH",
        header:{
            'Content-Type': 'application/json',
            'accept': 'application/json'

        },
        body: JSON.stringify({
            users: userArray
        })
    }).then(resp => resp.json())
    .then(book =>{
        let x = document.querySelector('.users').parentElement
        x.innerHTML = ''
        for (user of book.users){
            let uLi = ce('li')
            uLi.innerText = user.username
            uLi.dataset.id = user.id
            uLi.classList.add("users")
            x.append(uLi)
        }
        console.log(x)
    })
}