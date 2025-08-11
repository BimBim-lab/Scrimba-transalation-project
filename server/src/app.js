import express from 'express';
import cors from 'cors';
import translateRouter from './routes/translate.routes.js'
import chatRouter from './routes/chat.routes.js';
import errorHandler from './middlewares/error-handler.js';

const app = express()  
app.use(cors());
app.use(express.json({ limit: '1mb' }))

app.get('/health', (_, res)=> res.json({ok:true}))

app.use('/api/v1/translate', translateRouter);
app.use('/api/v1/chat', chatRouter);
app.use(errorHandler);

export default app;