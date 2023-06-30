const express = require('express');
const pool = require('./db');
const server = express();
const cors = require('cors');
const {v4:uuidv4} = require('uuid')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT ?? 8000

server.use(cors())
server.use(express.json())

server.get('/tasks/:userEmail',async (req,res)=>{
    const {userEmail} = req.params
    try {
        const alltasks = await pool.query('SELECT * FROM public.todoreact WHERE public.todoreact.user_email=$1',[userEmail])
        res.json(alltasks.rows)
    } catch (err) {
        console.log(err)
    }
})


server.post('/tasks',async (req,res)=>{
    const {userEmail, title, progress , date} = req.body
    const id = uuidv4()
    try {
        const alltasks = await pool.query('INSERT INTO public.todoreact (id,user_email,title,progress,date) VALUES ($1,$2,$3,$4,$5)',[id,userEmail,title,progress,date])
        res.json(alltasks)
    } catch (err) {
        console.log(err)
    }
})

server.put('/tasks/:id',async (req,res)=>{
    const {userEmail, title, progress , date} = req.body
    const {id} = req.params
    try {
        const editTask = await pool.query('UPDATE public.todoreact SET user_email=$1, title=$2, progress=$3, date=$4 WHERE public.todoreact.id=$5',[userEmail,title,progress,date,id])
        res.json(editTask.rows)
    } catch (err) {
        console.log(err)
    }
})

server.delete('/tasks/delete/:id',async (req,res)=>{
    const {id} = req.params
    try {
        const deleteTask = await pool.query('DELETE FROM public.todoreact WHERE public.todoreact.id = $1',[id])
        res.json("deleted")
    } catch (err) {
        console.log(err)
    }
})

//signup

server.post('/signup', async(req, res)=>{
    const {email, password} = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password,salt)
    try {
        const user = pool.query("INSERT INTO public.users (email , hashed_password) VALUES ($1,$2)",[email,hashedPassword])
        const token = jwt.sign({email}, 'secret', {expiresIn:'1hr'})
        res.json({email, token})
    } catch (error) {
        console.log(error)
        if(error){
            res.json({detail : error.detail})
        }
    }
})

//login

server.post('/login', async(req, res)=>{
    const {email, password} = req.body
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (!user.rows.length) return res.json({ detail: 'User does not exist!' })
        const success = await bcrypt.compare(password, user.rows[0].hashed_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
        if (success) {
            res.json({ 'email' : user.rows[0].email, token})
          } else {
            res.json({ detail: "Login failed"})
          }
    } catch (error) {
        console.log(error)
    }
})

server.listen(PORT, ()=> console.log(`Server runnig on ${PORT}`))