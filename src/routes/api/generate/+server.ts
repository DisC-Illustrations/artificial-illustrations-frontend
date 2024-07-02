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
                    content: `Extract three key visual elements from the following text article, summarizing each element in less than ten words. Focus on elements that best represent and can be effectively interpreted by a stable diffusion model for creating compelling and representative illustrations or covers.
                    
                    Format:
                    "[First visual element]; [Second visual element]; [Third visual element];`
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
