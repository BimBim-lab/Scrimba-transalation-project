import { chatInLanguage } from "../services/openai.service.js";

export async function chatController(req, res, next) {
    try{
        const {history, target, options} = req.body;
        if(!Array.isArray(history)||!target){
            return res.status(400).json({error: 'history (array) and target are required.'});  
        }
        const reply = await chatInLanguage(history, target, options)
        res.json({reply})
    } catch (e) {next(e)}  
}
