import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import {   getAllEngine, getEngineStatus,   startEaglesEye,  startEngineById,  stopEaglesEye,  stopEngineById } from './controller';
import setupWebSocket from './wsServer';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Setup WebSocket
setupWebSocket(wss);

// REST endpoints
app.post('/start', startEaglesEye);
app.post('/stop', stopEaglesEye);
app.get('/all', getAllEngine);
app.get('/start/id', startEngineById)
app.get('/stop/id', stopEngineById)
app.post('/getStatus/id', getEngineStatus);


// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Bot Service running on port ${PORT}`);
});