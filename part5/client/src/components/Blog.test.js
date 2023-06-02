import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import '@testing-library/jest-dom/extend-expect'

describe('Blog component', () => {
  test('renders the blog title and author', () => {
    const blog = {
      title: 'tittle',
      author: 'author',
      url: 'url',
      likes: 1
    }

    render(<Blog blog={blog} handleLike={() => { }} handleDelete={() => { }} />)

    expect(screen.getByText(`${blog.title} by ${blog.author}`)).toBeInTheDocument()
    expect(screen.queryByText(blog.url)).not.toBeInTheDocument()
    expect(screen.queryByText(blog.likes)).not.toBeInTheDocument()
  })

  test('shows the blog URL and number of likes when the button is clicked', () => {
    const blog = {
      title: 'tittle',
      author: 'author',
      url: 'url',
      likes: 1
    }

    render(<Blog blog={blog} handleLike={() => { }} handleDelete={() => { }} />)

    const button = screen.getByText('View Details')
    fireEvent.click(button)

    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(screen.getByText(`Likes: ${blog.likes}`)).toBeInTheDocument()
  })

  test('calls the handleLike event handler twice when the like button is clicked twice', () => {
    const blog = {
      title: 'Test Blog',
      author: 'John Doe',
      url: 'https://example.com/blog',
      likes: 10
    }
    const handleLikeMock = jest.fn()

    render(<Blog blog={blog} handleLike={handleLikeMock} handleDelete={() => { }} />)

    const button = screen.getByText('View Details')
    fireEvent.click(button) // Show details
    const likeButton = screen.getByText('Like')

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(handleLikeMock).toHaveBeenCalledTimes(2)
  })
})
