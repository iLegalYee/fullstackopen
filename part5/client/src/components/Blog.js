import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, handleDelete, user }) => {
  const [showDetails, setShowDetails] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const showDeleteButton = () => {
    if (!user || !blog.user) {
      return false
    }
    return user.username === blog.user.username
  }

  return (
        <div style={blogStyle}>
            {blog.title} by {blog.author}
            <button onClick={toggleDetails}>{showDetails ? 'Hide Details' : 'View Details'}</button>

            {showDetails && (
                <div>
                    <div>{blog.url}</div>
                    <div>
                        Likes: {blog.likes}
                        <button onClick={handleLike}>Like</button>
                    </div>
                    {blog.user && <div>Added by: {blog.user.name}</div>}
                    {showDeleteButton() && <button onClick={handleDelete}>Delete</button>}
                </div>
            )}
        </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  }).isRequired,
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default Blog
