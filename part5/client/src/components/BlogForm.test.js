import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('create a new blog', () => {
  const mockHandleCreateBlog = jest.fn()
  const component = render(
        <BlogForm
            handleCreateBlog={mockHandleCreateBlog}
            newBlogTitle=""
            newBlogAuthor=""
            newBlogUrl=""
            handleTitleChange={() => { }}
            handleAuthorChange={() => { }}
            handleUrlChange={() => { }}
        />
  )

  const titleInput = component.getByLabelText('Title:')
  const authorInput = component.getByLabelText('Author:')
  const urlInput = component.getByLabelText('URL:')

  fireEvent.change(titleInput, { target: { value: 'Test Title' } })
  fireEvent.change(authorInput, { target: { value: 'Test Author' } })
  fireEvent.change(urlInput, { target: { value: 'http://testurl.com' } })

  fireEvent.submit(component.container.querySelector('form'))

  expect(mockHandleCreateBlog).toHaveBeenCalledTimes(1)
})
