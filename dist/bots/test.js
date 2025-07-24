"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEngineStatus = exports.stopEngine = exports.startEngine = void 0;
const botClient_1 = require("../botClient");
const bot_url = process.env.BOT_SERVICE_URL || 'https://godscpr.onrender.com';
const startEngine = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, botClient_1.sendCommand)(bot_url, 'start');
        res.json(result);
    }
    catch (error) {
        res.status(201).json({
            success: false,
            error: 'Failed to start bot service',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.startEngine = startEngine;
const stopEngine = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, botClient_1.sendCommand)(bot_url, 'stop');
        res.json(result);
    }
    catch (error) {
        res.status(201).json({
            success: false,
            error: 'Failed to start bot service',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.stopEngine = stopEngine;
const getEngineStatus = (res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, botClient_1.sendCommand)(bot_url, 'health');
        res.json(result);
    }
    catch (error) {
        res.status(201).json({
            success: false,
            error: 'Failed to start bot service',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getEngineStatus = getEngineStatus;
