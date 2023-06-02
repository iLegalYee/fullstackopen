import { React, useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorMessage(null)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    try {
      const createdBlog = await blogService.create(newBlog)
      createdBlog.user = user
      setBlogs((prevBlogs) => [...prevBlogs, createdBlog])
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      setNotification(`A new blog "${newBlogTitle}" by "${newBlogAuthor}" added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLike = async (blogId) => {
    try {
      const blogToUpdate = blogs.find((blog) => blog.id === blogId)
      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        user: blogToUpdate.user.id,
        id: blogToUpdate.id,
        likes: blogToUpdate.likes + 1
      }
      const returnedBlog = await blogService.update(blogId, updatedBlog)
      returnedBlog.user = blogToUpdate.user
      const updatedBlogs = blogs.map((blog) =>
        blog.id === blogId ? returnedBlog : blog
      )
      const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    } catch (exception) {
      setErrorMessage('Failed to update blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDelete = async (blogId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this blog?')

      if (!confirmed) {
        return
      }
      await blogService.deleteBlog(blogId)
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId))
      setNotification('Blog deleted successfully')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to delete blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
        <div>
            <h2>Application</h2>
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
            {notification && <div className="notification">{notification}</div>}
            {user === null
              ? (
                <LoginForm
                    handleLogin={handleLogin}
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                />
                )
              : (
                <div>
                    <h2>blogs</h2>
                    <p>
                        {user.name} logged in <button onClick={handleLogout}>Logout</button>
                        </p>
                    <Togglable buttonLabel = "Create New Blog">
                    <BlogForm
                        handleCreateBlog={handleCreateBlog}
                        newBlogTitle={newBlogTitle}
                        newBlogAuthor={newBlogAuthor}
                        newBlogUrl={newBlogUrl}
                        handleTitleChange={({ target }) => setNewBlogTitle(target.value)}
                        handleAuthorChange={({ target }) => setNewBlogAuthor(target.value)}
                        handleUrlChange={({ target }) => setNewBlogUrl(target.value)}
                            />
                      </Togglable>
                        <div>
                          {blogs.map((blog) => (
                              <div key={blog.id} className="blog"><Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog.id)} handleDelete={() => handleDelete(blog.id)} user={user} /></div>
                          ))}
                        </div>
                </div>
                )}
        </div>
  )
}

export default App
