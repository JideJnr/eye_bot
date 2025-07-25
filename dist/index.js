"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const controller_1 = require("./controller");
const wsServer_1 = __importDefault(require("./wsServer"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
app.use(express_1.default.json()); // Ensure JSON body parsing
// Setup WebSocket
(0, wsServer_1.default)(wss);
// REST endpoints
app.post('/start', controller_1.startEaglesEye);
app.post('/stop', controller_1.stopEaglesEye);
app.get('/status', controller_1.checkEyeStatus);
app.get('/get/all', controller_1.getAllEngine);
app.post('/start/id', controller_1.startEngineById); // expects { id } in body
app.post('/stop/id', controller_1.stopEngineById); // expects { id } in body
app.get('/status/id', controller_1.getEngineStatus); // expects ?id= in query
// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`✅ Bot Service running on port ${PORT}`);
});
