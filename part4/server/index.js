const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const {getBlogs, createBlog } = require('./controllers/blogs')



const password = process.argv[2]

console.log('password', password)

const mongoUrl = `mongodb+srv://fullstackopen:${password}@cluster0.nxazoik.mongodb.net/?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', getBlogs)
app.post('/api/blogs', createBlog)

const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 