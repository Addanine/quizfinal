// src/Flashcards.jsx
import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Flashcards({ user }) {
    const [notes, setNotes] = useState('')
    const [flashcards, setFlashcards] = useState([])

    async function handleGenerate() {
        // ... your existing fetch to /api/generate
        // Suppose you get an array of flashcards from OpenAI:
        const newFlashcards = [
            { question: 'Q1', answer: 'A1' },
            { question: 'Q2', answer: 'A2' },
            // ...
        ]
        setFlashcards(newFlashcards)
    }

    async function handleSave() {
        if (!user) return
        try {
            // Insert multiple flashcards into DB
            // Each needs user_id, question, answer
            const { data, error } = await supabase
                .from('flashcards')
                .insert(flashcards.map(fc => ({
                    user_id: user.id,      // The user's unique ID from supabase
                    question: fc.question,
                    answer: fc.answer,
                })))

            if (error) throw error
            alert('Flashcards saved successfully!')
        } catch (err) {
            console.error(err)
            alert(err.message)
        }
    }

    async function loadFlashcards() {
        try {
            const { data, error } = await supabase
                .from('flashcards')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            setFlashcards(data)
        } catch (err) {
            console.error(err)
            alert(err.message)
        }
    }

    return (
        <div>
            <h1>Flashcard Generator</h1>
            <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
            />
            <button onClick={handleGenerate}>Generate Flashcards</button>
            <button onClick={handleSave}>Save to My Account</button>
            <button onClick={loadFlashcards}>Load My Saved Flashcards</button>

            {flashcards.map((fc, i) => (
                <div key={i}>
                    <p><strong>Q:</strong> {fc.question}</p>
                    <p><strong>A:</strong> {fc.answer}</p>
                </div>
            ))}
        </div>
    )
}
