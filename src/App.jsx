import React, { useState } from 'react';

function App() {
    const [notes, setNotes] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Generate flashcards
    async function handleGenerate() {
        if (!notes.trim()) {
            alert('Please enter some notes first.');
            return;
        }
        setLoading(true);
        setFlashcards([]);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Unknown server error');
            }

            const data = await response.json();
            setFlashcards(data.flashcards || []);
        } catch (err) {
            alert('Error: ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // 2. Read the flashcards aloud using the Web Speech API
    function handleReadAloud() {
        if (!('speechSynthesis' in window)) {
            alert('Web Speech API not supported in this browser.');
            return;
        }
        // Build a queue of utterances
        const utterances = [];
        flashcards.forEach(card => {
            if (card.question) {
                const questionUtterance = new SpeechSynthesisUtterance('Question: ' + card.question);
                utterances.push(questionUtterance);
            }
            if (card.answer) {
                const answerUtterance = new SpeechSynthesisUtterance('Answer: ' + card.answer);
                utterances.push(answerUtterance);
            }
        });

        // Recursively speak them in sequence
        function speakNext() {
            if (utterances.length === 0) return;
            const next = utterances.shift();
            next.onend = speakNext;
            window.speechSynthesis.speak(next);
        }
        speakNext();
    }

    return (
        <div style={styles.container}>
            <h1>Flashcard Generator</h1>
            <textarea
                style={styles.textarea}
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes here..."
            />
            <br/>
            <button style={styles.button} onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>

            {flashcards.length > 0 && (
                <div style={styles.flashcards}>
                    <h2>Generated Flashcards</h2>
                    {flashcards.map((fc, i) => (
                        <div key={i} style={styles.flashcard}>
                            <div><strong>Q:</strong> {fc.question}</div>
                            <div><strong>A:</strong> {fc.answer}</div>
                        </div>
                    ))}
                    <button style={styles.button} onClick={handleReadAloud}>
                        Read Aloud
                    </button>
                </div>
            )}
        </div>
    );
}

// Some basic inline styles
const styles = {
    container: {
        maxWidth: 600,
        margin: '40px auto',
        fontFamily: 'sans-serif',
        padding: 20
    },
    textarea: {
        width: '100%',
        fontSize: 16,
        padding: 10
    },
    button: {
        marginTop: 10,
        padding: '10px 15px',
        cursor: 'pointer'
    },
    flashcards: {
        marginTop: 20,
        padding: 10,
        border: '1px solid #ccc'
    },
    flashcard: {
        marginBottom: 15
    }
};

export default App;
