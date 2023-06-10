import React, { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
    const { setMessage } = useContext(NotificationContext);
    const queryClient = useQueryClient()
    const createAnecdoteMutation = useMutation(createAnecdote, {
        onSuccess: () => {
            queryClient.invalidateQueries('anecdotes');
        },
    });
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
      if (content.length >= 5) {
          createAnecdoteMutation.mutate({ content, votes: 0 });
          setMessage(`${content} Created!!`)
      } else {
          setMessage('Anecdote content must be at least 5 characters long.')
      }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
