import type {RequestHandler} from '@sveltejs/kit';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const POST: RequestHandler = async ({request}) => {
    const {prompt} = await request.json();

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `Extract FIVE abstract, symbolic VISUAL ELEMENTS from the article, each representing a MAIN ASPECT and together capturing the article's ESSENCE.

IMPORTANT:
- Each visual element should be a CONCRETE OBJECT OR WELL-KNOWN SYMBOL.
- AVOID CONTEXT-SPECIFIC TERMS or AMBIGUOUS DESCRIPTIONS!

FORMAT:"[First element]; [Second element]; [Third element]; [Fourth element]; [Fifth element]".
Note: Each element should be IN ENGLISH and ABOUT THREE WORDS.
`
                },
                {role: 'user', content: prompt}
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return new Response(JSON.stringify({text: response.data.choices[0].message.content}), {status: 200});
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error);
        return new Response(JSON.stringify({error: 'Error communicating with OpenAI API'}), {status: 500});
    }
};
