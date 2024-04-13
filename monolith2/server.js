const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const pool = require('./src/connection_db')
const cors = require('cors');


const JWT_SECRET = "ASAFSDLKJFINF"


const PORT = 3005

app.use(express.static('views'))
app.use(bodyParser.json())
app.use(cors());




const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token = ''
    if(authHeader){
        token = authHeader.split(" ")[1]
        jwt.verify(token, JWT_SECRET, (err, user)=>{
            if(err) {
                res.redirect(301, '/login')
                return
            } 
            req.user = user;
            next()
        })
    } else {
        res.redirect(301, '/login');
    }
   
}

app.listen(PORT, (req,res)=>{
    console.log('Server running on port', PORT)
})

app.get('', (req,res)=>{
    res.sendFile(path.join(__dirname, 'views/home.html'))
})

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, 'views/login.html'))
})

app.post('/login', (req,res)=>{
    const {username, password} = req.body
    console.log(req.body)
    
    pool.query('SELECT * FROM users WHERE username = ?', [username],(err,result)=>{
        if(err){
            throw err;  
        } 
        
        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (error, match)=>{
                if(error){
                    throw error
                } 
                if(match){
                    const token = jwt.sign({name: result[0].username}, JWT_SECRET, {
                        expiresIn:'20m'
                    })
                    res.json({success: true, message: 'login correcto!', token, username:result[0].username })
                }
            })
        } else {
            //database error
            res.status(404).send({message: 'usuario no encontrado'})
        }
        
    })
})

app.get('/signup', (req,res)=>{
    res.sendFile(path.join(__dirname, 'views/signup.html'))
})

app.get('/products', (req,res)=>{
    res.sendFile(path.join(__dirname, 'views/products.html'))
})

app.get('/api/products', authenticateToken, (req, res)=>{
    res.json({products:{electronics:["iphone","galaxy", "zte"]}, user:req.user.name})
})

app.post('/signup', (req, res)=>{
    const {username, password} = req.body
    bcrypt.hash(password, 10, (err, hash)=>{
        if(err){
            return res.status(500).json({success: false, message: 'No se pudo crear el usuario'})
        }
        pool.query('INSERT INTO users (username, password) VALUES (?,?)', [username, hash], (err, result)=>{
            if(err){
                console.error(err)
                return result.status(500).json({success: false, message: 'No se pudo crear el usuario'})
            }
            res.json({success: true, message: 'Se pudo crear el usuario'})
        })
    })

})