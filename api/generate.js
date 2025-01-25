// api/generate.js
const { Configuration, OpenAIApi } = require('openai');

module.exports = async (req, res) => {
    try {
        const body = req.body; // Should contain { notes: "..." }
        if (!body || !body.notes) {
            return res.status(400).json({ error: 'Missing notes in request body.' });
        }

        // Create OpenAI client with your API key from environment variables
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY, // We'll set this in Vercel later
        });
        const openai = new OpenAIApi(configuration);

        // Build a prompt to generate flashcards from notes
        const prompt = `
      I have the following notes:
      ${body.notes}

      Create flashcards in a JSON array format, each entry has:
      {
        "question": "...",
        "answer": "..."
      }
    `;

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful tutor generating concise flashcards.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
        });

        const rawText = response.data.choices[0].message.content;

        // Attempt to parse as JSON
        let flashcards;
        try {
            flashcards = JSON.parse(rawText);
        } catch (err) {
            // If parsing fails, just return text as a single flashcard
            flashcards = [{ question: 'Parse Error', answer: rawText }];
        }

        return res.status(200).json({ flashcards });
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return res.status(500).json({ error: 'Failed to generate flashcards' });
    }
};
