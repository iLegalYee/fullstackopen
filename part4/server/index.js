const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const { getBlogs, createBlog } = require('./controllers/blogs')
const { info, error } = require('./utils/logger')
const {mongoUrl } = require('./utils/config')



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