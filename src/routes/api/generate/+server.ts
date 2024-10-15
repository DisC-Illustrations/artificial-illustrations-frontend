import type {RequestHandler} from '@sveltejs/kit';
import axios from 'axios';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({request}) => {
    const {prompt} = await request.json();

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o', // Ändern Sie dies zu einem gültigen Modellnamen
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
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`, // Verwenden Sie den importierten 'env'
                'Content-Type': 'application/json'
            }
        });

        return new Response(JSON.stringify({text: response.data.choices[0].message.content}), {status: 200});
    } catch (error: Error | any) {
        console.error('Fehler bei der Kommunikation mit der OpenAI API:', error.response?.data || error.message);
        return new Response(JSON.stringify({error: error.response?.data || error.message}), {status: 500});
    }
};
