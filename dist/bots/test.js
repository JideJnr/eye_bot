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
const startEngine = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield (0, botClient_1.sendPostCommand)(bot_url, 'start');
        return {
            success: (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : true,
            message: (result === null || result === void 0 ? void 0 : result.message) || 'Started successfully',
            data: result,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to start bot service',
            data: null,
        };
    }
});
exports.startEngine = startEngine;
const stopEngine = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield (0, botClient_1.sendPostCommand)(bot_url, 'stop');
        return {
            success: (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : true,
            message: (result === null || result === void 0 ? void 0 : result.message) || 'Stopped successfully',
            data: result,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to stop bot service',
            data: null,
        };
    }
});
exports.stopEngine = stopEngine;
const getEngineStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield (0, botClient_1.sendPostCommand)(bot_url, 'health');
        return {
            success: (_a = result === null || result === void 0 ? void 0 : result.success) !== null && _a !== void 0 ? _a : true,
            message: (result === null || result === void 0 ? void 0 : result.message) || 'Status fetched',
            data: result,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to get bot status',
            data: null,
        };
    }
});
exports.getEngineStatus = getEngineStatus;
