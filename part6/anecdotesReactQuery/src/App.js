import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import React, { useContext } from 'react';
import NotificationContext from './NotificationContext'

const App = () => {

    const { data, isLoading, isError } = useQuery('anecdotes', getAnecdotes, {
        retry: false,
    });
    const { setMessage } = useContext(NotificationContext);
 
    const queryClient = useQueryClient()
    const voteMutation = useMutation(updateAnecdote, {
        onSuccess: () => {
            queryClient.invalidateQueries('anecdotes');
        },
    });

    const handleVote = (anecdote) => {
        voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
        setMessage(`${anecdote.content} Voted!!`)
  }


    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification />
            <AnecdoteForm />

            {isError ? (
                <div>Anecdote service not available due to server problems.</div>
            ) : isLoading ? (
                <div>Loading...</div>
            ) : (
                data.map((anecdote) => (
                    <div key={anecdote.id}>
                        <div>{anecdote.content}</div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => handleVote(anecdote)}>vote</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default App
