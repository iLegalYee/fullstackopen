import React from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({
  handleCreateBlog,
  newBlogTitle,
  newBlogAuthor,
  newBlogUrl,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange
}) => {
  return (
        <div>
            <form onSubmit={handleCreateBlog} data-testid="blog-form">
                <h3>Add New Blog</h3>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        value={newBlogTitle}
                        name="newBlogTitle"
                        id="title"
                        onChange={handleTitleChange}
                    />
                </div>
                <div>
                    <label htmlFor="author">Author:</label>
                    <input
                        type="text"
                        value={newBlogAuthor}
                        name="newBlogAuthor"
                        id="author"
                        onChange={handleAuthorChange}
                    />
                </div>
                <div>
                    <label htmlFor="url">URL:</label>
                    <input
                        type="text"
                        value={newBlogUrl}
                        name="newBlogUrl"
                        id="url"
                        onChange={handleUrlChange}
                    />
                </div>
                <button type="submit" id="create">Create</button>
            </form>
        </div>
  )
}

BlogForm.propTypes = {
  handleCreateBlog: PropTypes.func.isRequired,
  newBlogTitle: PropTypes.string.isRequired,
  newBlogAuthor: PropTypes.string.isRequired,
  newBlogUrl: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired
}

export default BlogForm
