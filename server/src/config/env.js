import 'dotenv/config'

export const PORT = process.env.PORT || 3000;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if(!OPENAI_API_KEY){
    console.error('Missing OpenAI API key in .env file');
    process.exit(1);
}
