// src/Auth.jsx
import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            let result
            if (isSignUp) {
                result = await supabase.auth.signUp({
                    email,
                    password,
                })
            } else {
                result = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
            }

            if (result.error) {
                throw result.error
            }

            // If no error, user is signed in or an email confirmation was sent
            if (onLogin) onLogin(result.data?.user)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', width: 300 }}>
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                /><br/>
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                /><br/>
                <button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
            </form>

            <button onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Have an account? Log in' : 'Need an account? Sign up'}
            </button>
        </div>
    )
}
