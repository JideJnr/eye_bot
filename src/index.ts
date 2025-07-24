import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import { checkEyeStatus, getAllEngine, startEaglesEye, startEngineById, stopEaglesEye, stopEngineById, getBotStatusById } from './controller';
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
app.get('/all', getAllEngine);
app.post('/start/id', startEngineById); // expects { id } in body
app.post('/stop/id', stopEngineById);   // expects { id } in body
app.get('/status/id', getBotStatusById); // expects ?id= in query

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Bot Service running on port ${PORT}`);
});