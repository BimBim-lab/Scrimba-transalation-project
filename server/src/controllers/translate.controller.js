import e from "express";
import { translateWithOpenAI } from "../services/openai.service.js";

export async function translateController(req, res, next) {
    try{
        const {text, target} = req.body;
        if(!text || !target) {
            return res.status(400).json({error: 'Text and target language are required.'})
        }
        const translation = await translateWithOpenAI(text, target)
        res.json({translation})
    } catch (e) {next(e)}
}