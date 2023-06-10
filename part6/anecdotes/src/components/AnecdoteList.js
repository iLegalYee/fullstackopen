
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { showNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
    const anecdotes = useSelector((state) => {
        const filter = state.filter;
        const filteredAnecdotes = state.anecdotes.filter((anecdote) =>
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
        );
        return filteredAnecdotes;
    });

    const dispatch = useDispatch();

    const vote = (id) => {
        const anecdote = anecdotes.find((anecdote) => anecdote.id === id);
        if (anecdote) {
            dispatch(voteAnecdote(id));
            dispatch(showNotification(`You voted for anecdote "${anecdote.content}"`,5));
        }
    };



    return (
        <div>
            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnecdoteList;