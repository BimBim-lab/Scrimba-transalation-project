import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config/env.js';

const client = new OpenAI({
  apiKey: OPENAI_API_KEY
});

/** Terjemahan single turn */
export async function translateWithOpenAI(text, target){
    const system = `You are a professional translator.
Return ONLY the translation in language: ${target} language.
Do not include any additional text or explanations.`;
    const resp = await client.responses.create({
        model: 'gpt-4o',
        input: [ 
            {role: 'system', content: system},
            {role: 'user', content: text}
        ]
    })
    return (resp.output_text ?? '').trim();
}
/** terjemahan multi turn */

export async function chatInLanguage(history, target, option ={}){
    const { correct = true, level = 'A2-B1'} = option;
    const system = [
        'you are a friendly language partner.',
        `speak only in ${target}.`,
        `User proficiency: ${level}`,
        correct
      ? `If the user's last message has mistakes, first reply naturally, then add a short correction section starting with "Correction:" in ${target}.`
      : `Do not correct unless asked.` 

    ].join(' ')
    const input = [{role: 'system', content: system}, ...history]
    const resp = await client.responses.create({
        model: 'gpt-4o',
        input
    })
    return (resp.output_text ?? '').trim()
}