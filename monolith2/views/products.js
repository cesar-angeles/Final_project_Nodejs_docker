console.log('PRODUCTS')

document.addEventListener('DOMContentLoaded',()=>{
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')




    if(!token){
        window.location.href = '/login'
        return
    }

    
    fetch('http://localhost:3006/api/getBooks', {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then((data)=>{
        console.log(data)
        document.querySelector('h1').innerHTML = `Welcome to my store ${data.user}`;
        document.getElementById('books').innerHTML = `Title: ${data.response[0].nombre}`
        document.getElementById('author').innerHTML = `Author: ${data.response[0].autor}`
        document.getElementById('image').src = `${data.response[0].cover}`

    })
    .catch((err)=>console.log(err))
})

document.getElementById('formSubmit').addEventListener('submit', ()=>{
    event.preventDefault()

    const token = localStorage.getItem('token')
    const nombre = document.getElementById('title').value;
    const autor = document.getElementById('autor').value;
    const cover = document.getElementById('cover').value;
    const year_publicacion = document.getElementById('year_publicacion').value;

    const user_id = 6;
    console.log(nombre,autor,cover,year_publicacion)

    fetch('http://localhost:3006/api/addBook', {
        method: 'POST',
        body: JSON.stringify({nombre, autor,year_publicacion, user_id, cover}),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        
    })
    .catch((err)=>console.error('Error: ', err))


})