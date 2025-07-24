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
exports.getEngineStatus = exports.getAllEngine = exports.stopEngineById = exports.startEngineById = exports.stopEaglesEye = exports.startEaglesEye = void 0;
const football_1 = require("./bots/football");
const test_1 = require("./bots/test");
const botControllerMap = {
    football_bot: {
        start: football_1.startEngine,
        stop: football_1.stopEngine,
        status: football_1.getEngineStatus,
    },
    test_bot: {
        start: test_1.startEngine,
        stop: test_1.stopEngine,
        status: test_1.getEngineStatus,
    },
};
const bots = [
    { id: 'test_bot', name: 'test_bot', status: false },
    { id: 'football_bot', name: 'football_bot', status: false },
    { id: 'basketball_bot', name: 'bot_test', status: false },
    { id: 'tennis_bot', name: 'football_bot', status: false },
    { id: 'news_bot', name: 'bot_test', status: false },
    { id: 'crypto_bot', name: 'bot_test', status: false },
];
let engineStatus = false;
const results = [];
const findBotById = (id) => bots.find(bot => bot.id === id);
const startEaglesEye = (res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (engineStatus) {
        return res.status(200).json({
            success: false,
            status: 'ENGINE_ALREADY_RUNNING',
            message: 'Hmmm... I hope you know what you doing',
        });
    }
    engineStatus = true;
    for (const bot of bots) {
        const controller = botControllerMap[bot.name];
        if (controller === null || controller === void 0 ? void 0 : controller.start) {
            try {
                const result = yield controller.start(res);
                results.push({
                    id: bot.id,
                    name: bot.name,
                    success: (_a = result.success) !== null && _a !== void 0 ? _a : true,
                    message: result.message || 'Started successfully',
                    data: result,
                });
            }
            catch (error) {
                bot.status = false;
                results.push({
                    id: bot.id,
                    name: bot.name,
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                    data: null,
                });
            }
        }
        else {
            results.push({
                id: bot.id,
                name: bot.name,
                success: false,
                message: 'No start handler found',
                data: null,
            });
        }
    }
    for (const result of results) {
        const bot = findBotById(result.id);
        if (bot) {
            bot.status = result.success;
        }
    }
    results.length = 0; // Clear results after processing
    return res.status(200).json({
        success: true,
        status: 'ENGINE_STARTED',
        message: 'Eagles Eye Functional... Engines online',
    });
});
exports.startEaglesEye = startEaglesEye;
const stopEaglesEye = (res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!engineStatus) {
        return res.status(200).json({
            success: false,
            error: 'ENGINE_NOT_RUNNING',
            message: 'Hmmm... I hope you know what you doing',
        });
    }
    engineStatus = false;
    for (const bot of bots) {
        const controller = botControllerMap[bot.name];
        if (controller === null || controller === void 0 ? void 0 : controller.stop) {
            try {
                const result = yield controller.stop(res);
                bot.status = false;
                results.push({
                    id: bot.id,
                    name: bot.name,
                    success: (_a = result.success) !== null && _a !== void 0 ? _a : true,
                    message: result.message || 'Stopped successfully',
                    data: result,
                });
            }
            catch (error) {
                results.push({
                    id: bot.id,
                    name: bot.name,
                    success: false,
                    message: error instanceof Error ? error.message : 'Unknown error',
                    data: null,
                });
            }
        }
        else {
            results.push({
                id: bot.id,
                name: bot.name,
                success: false,
                message: 'No stop handler found',
                data: null,
            });
        }
    }
    for (const result of results) {
        const bot = findBotById(result.id);
        if (bot) {
            bot.status = result.success;
        }
    }
    return res.status(200).json({
        success: true,
        status: 'ENGINE_STOPPED',
        message: 'Lights Out.',
        bots,
    });
});
exports.stopEaglesEye = stopEaglesEye;
const startEngineById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!engineStatus) {
        return res.status(400).json({
            success: false,
            status: 'ENGINE_NOT_RUNNING',
            message: 'Engine must be running to start a bot.',
        });
    }
    const bot = findBotById(id);
    if (!bot) {
        return res.status(404).json({ success: false, message: 'Bot not found.' });
    }
    if (bot.status) {
        return res.status(200).json({ success: false, message: 'Bot is already running.' });
    }
    const controller = botControllerMap[bot.name];
    if (controller === null || controller === void 0 ? void 0 : controller.start) {
        yield controller.start(res);
        bot.status = true;
    }
    return res.status(200).json({
        success: true,
        message: `Bot ${bot.name} has been started.`,
        data: bot,
    });
});
exports.startEngineById = startEngineById;
const stopEngineById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!engineStatus) {
        return res.status(400).json({
            success: false,
            error: 'ENGINE_NOT_RUNNING',
            message: 'Engine must be running to stop a bot.',
        });
    }
    const bot = findBotById(id);
    if (!bot) {
        return res.status(404).json({ success: false, message: 'Bot not found.' });
    }
    if (!bot.status) {
        return res.status(200).json({ success: false, message: 'Bot is already stopped.' });
    }
    const controller = botControllerMap[bot.name];
    if (controller === null || controller === void 0 ? void 0 : controller.stop) {
        yield controller.stop(res);
        bot.status = false;
    }
    return res.status(200).json({
        success: true,
        message: `Bot ${bot.name} has been stopped.`,
        data: bot,
    });
});
exports.stopEngineById = stopEngineById;
const getAllEngine = (res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!engineStatus) {
        return res.status(400).json({
            success: false,
            status: 'ENGINE_NOT_RUNNING',
            message: 'Hmmm... i hope you know what you doing',
        });
    }
    return res.status(200).json({
        success: true,
        message: `Bot list fetched has been started.`,
        data: bots,
    });
});
exports.getAllEngine = getAllEngine;
const getEngineStatus = (req, res) => {
    const { id } = req.body;
    const bot = findBotById(id);
    if (!engineStatus) {
        return res.status(400).json({
            success: false,
            status: 'ENGINE_NOT_RUNNING',
            message: 'Engine must be running to check bot status.',
        });
    }
    if (!bot) {
        return res.status(404).json({ success: false, message: 'Bot not found.' });
    }
    return res.status(200).json({
        success: true,
        message: `Bot ${bot.name} is ${bot.status ? 'running' : 'not running'}.`,
        data: bot,
    });
};
exports.getEngineStatus = getEngineStatus;
