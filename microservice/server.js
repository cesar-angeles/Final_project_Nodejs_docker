const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const pool = require('./connection_DB')
const PORT = 3006
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { Sequelize, DataTypes } = require("sequelize")
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

const sequelize = new Sequelize(process.env.DB_DATABASE,process.env.DB_USERNAME,process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
})

//model
const Book = sequelize.define(
    'Book',{
        nombre: {
            type: DataTypes.STRING,
        },
        autor: {
            type: DataTypes.STRING
        },
        year_publicacion: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        cover: {
            type: DataTypes.STRING
        }
    }, {
        tableName:"libros"
    }
)

// sequelize
//     .sync({alter:true})
//     .then(()=> {
//         console.log("All the models were created in mysql");
//     })
//     .catch((err)=>console.error(err));

async function createBook(a,b,c,d,e) {
    try{
        const newBook = await Book.create({
            nombre: a,
            autor: b,
            year_publicacion: c,
            user_id: d,
            cover: e
        })
        console.log("User was created successfully", newUser.toJSON())
    } catch(err){
        console.err('Error al crear el libro', err)
    }
}



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token = ''
    if(authHeader){
        token = authHeader.split(" ")[1]
        jwt.verify(token, JWT_SECRET, (err, user)=>{
            if(err) {
                res.redirect(301, 'http://localhost:3005/login')
                return
            } 
            req.user = user;
            next()
        })
    } else {
        res.redirect(301, 'http://localhost:3005/login');
    }
   
}

pool.getConnection((err,conn)=>{
    if(err) throw err;
    console.log('Connected to the DB as ID', conn.threadId)
})

app.listen(PORT, ()=>{
    console.log('server microservice running on port', PORT)
})

app.post('/api/addBook', (req, res)=>{
    const {     nombre,
                autor,
                year_publicacion,
                user_id,
                cover
            } = req.body;
    console.log('hola')
    
    console.log(req.body)
    res.json({"status":"OK"})
    //createBook(nombre, autor, year_publicacion, user_id, cover)
    

    // const queryStr = `INSERT INTO libros (nombre, autor, year_publicacion, user_id, cover)
    //                     VALUES ('${nombre}', '${autor}', '${year_publicacion}', '${user_id}', '${cover}');`;
    
    // pool.query(queryStr, (err, result)=>{
    //     if(err){
    //         console.error('Error executing query', err);
    //         res.status(500).send('Something went wrong, try again later')
    //         res.json({"status":"FAILED"})
    //     } else {
    //         res.json({"status":"OK"})
    //     }
    // })
})

app.get('/api/getBooks', authenticateToken, (req,res)=>{
    const { username } = req.body;

    const queryStr = `SELECT * FROM libros WHERE user_id = 6;`;

    pool.query(queryStr, (err, response)=>{
        if(err){
            console.error('Error running query', err);
            res.status(500).send('Something wen wrong, try again later');
        } else {
            res.json({response, user:req.user.name}) 
        }
    })

})


app.post('/api/getId', authenticateToken, (req,res)=>{
    const username = req.headers['content'];
    console.log(username)
    const queryStr = `SELECT id FROM users WHERE username = '${username}';`;

    pool.query(queryStr, (err, response)=>{
        if(err){
            console.error('Error running query', err);
            res.status(500).send('Something went wrong')
        } else {
            res.json(response)
        }
    })
})




