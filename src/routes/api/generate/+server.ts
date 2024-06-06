import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const POST: RequestHandler = async ({ request }) => {
    const { prompt } = await request.json();

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        }, {
            headers: {
                'Authorization': `Bearer `,
                'Content-Type': 'application/json'
            }
        });

        return new Response(JSON.stringify({ text: response.data.choices[0].message.content }), { status: 200 });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        return new Response(JSON.stringify({ error: 'Error communicating with OpenAI API' }), { status: 500 });
    }
};
