import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { checkEyeStatus, getAllEngine, startEaglesEye, startEngineById, stopEaglesEye, stopEngineById, getEngineStatus } from './controller';
import setupWebSocket from './wsServer';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json()); // Ensure JSON body parsing

// Setup WebSocket
setupWebSocket(wss);

// REST endpoints
app.post('/start', startEaglesEye);
app.post('/stop', stopEaglesEye);
app.get('/status', checkEyeStatus);
app.get('/get/all', getAllEngine);
app.post('/start/:id', startEngineById); 
app.post('/stop/:id', stopEngineById);   
app.get('/status/:id', getEngineStatus); 

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Bot Service running on port ${PORT}`);
});