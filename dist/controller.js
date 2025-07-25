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
exports.getEngineStatus = exports.stopEngineById = exports.startEngineById = exports.getAllEngine = exports.checkEyeStatus = exports.stopEaglesEye = exports.startEaglesEye = void 0;
const test_1 = require("./bots/test");
const botControllerMap = {
    test_bot: {
        start: test_1.startEngine,
        stop: test_1.stopEngine,
        status: test_1.getEngineStatus,
    },
};
const bots = [
    { id: 'test_bot', name: 'test_bot', status: false }
];
let eagleEyes = false;
const findBotById = (id) => bots.find(bot => bot.id === id);
const startEaglesEye = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (eagleEyes) {
        return res.status(200).json({
            success: false,
            status: 'ENGINE_ALREADY_RUNNING',
            message: 'Hmmm... I hope you know what you doing',
        });
    }
    const botResults = [];
    for (const bot of bots) {
        const controller = botControllerMap[bot.name];
        if (controller === null || controller === void 0 ? void 0 : controller.start) {
            try {
                const result = yield controller.start();
                bot.status = result.success;
                botResults.push(Object.assign({ id: bot.id, name: bot.name }, result));
            }
            catch (error) {
                bot.status = false;
                botResults.push({ id: bot.id, name: bot.name, success: false, message: error instanceof Error ? error.message : 'Unknown error', data: null });
            }
        }
        else {
            bot.status = false;
            botResults.push({ id: bot.id, name: bot.name, success: false, message: 'No start handler found', data: null });
        }
    }
    eagleEyes = true;
    return res.status(200).json({
        success: true,
        status: 'ENGINE_STARTED',
        message: 'Eagles Eye Functional... Engines online',
        bots: botResults,
    });
});
exports.startEaglesEye = startEaglesEye;
const stopEaglesEye = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!eagleEyes) {
        return res.status(200).json({
            success: false,
            error: 'ENGINE_NOT_RUNNING',
            message: 'Hmmm... I hope you know what you doing',
        });
    }
    const botResults = [];
    for (const bot of bots) {
        const controller = botControllerMap[bot.name];
        if (controller === null || controller === void 0 ? void 0 : controller.stop) {
            try {
                const result = yield controller.stop();
                bot.status = !result.success ? false : bot.status;
                botResults.push(Object.assign({ id: bot.id, name: bot.name }, result));
            }
            catch (error) {
                botResults.push({ id: bot.id, name: bot.name, success: false, message: error instanceof Error ? error.message : 'Unknown error', data: null });
            }
        }
        else {
            botResults.push({ id: bot.id, name: bot.name, success: false, message: 'No stop handler found', data: null });
        }
    }
    eagleEyes = false;
    return res.status(200).json({
        success: true,
        status: 'ENGINE_STOPPED',
        message: 'Lights Out.',
        bots: botResults,
    });
});
exports.stopEaglesEye = stopEaglesEye;
const checkEyeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!eagleEyes) {
        return res.status(200).json({
            success: false,
            status: 'ENGINE_NOT_RUNNING',
            message: 'Hmmm... wonder why',
        });
    }
    const botResults = bots.map(bot => ({
        id: bot.id,
        name: bot.name,
        status: bot.status,
    }));
    return res.status(200).json({
        success: true,
        message: 'Eagles Eye is running',
        data: botResults,
    });
});
exports.checkEyeStatus = checkEyeStatus;
const getAllEngine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!eagleEyes) {
        return res.status(200).json({
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
const startEngineById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!eagleEyes) {
        return res.status(200).json({
            success: false,
            status: 'ENGINE_NOT_RUNNING',
            message: 'Engine must be running to start a bot.',
        });
    }
    const bot = findBotById(id);
    if (!bot) {
        return res.status(200).json({ success: false, message: 'Bot not found.' });
    }
    if (bot.status) {
        return res.status(200).json({ success: false, message: 'Bot is already running.' });
    }
    const controller = botControllerMap[bot.name];
    if (controller === null || controller === void 0 ? void 0 : controller.start) {
        const result = yield controller.start();
        bot.status = result.success;
        if (!result.success) {
            return res.status(200).json({ success: false, message: result.message || 'Failed to start bot.' });
        }
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
    if (!eagleEyes) {
        return res.status(200).json({
            success: false,
            error: 'ENGINE_NOT_RUNNING',
            message: 'Engine must be running to stop a bot.',
        });
    }
    const bot = findBotById(id);
    if (!bot) {
        return res.status(200).json({ success: false, message: 'Bot not found.' });
    }
    if (!bot.status) {
        return res.status(200).json({ success: false, message: 'Bot is already stopped.' });
    }
    const controller = botControllerMap[bot.name];
    if (controller === null || controller === void 0 ? void 0 : controller.stop) {
        const result = yield controller.stop();
        bot.status = !result.success ? false : bot.status;
        if (!result.success) {
            return res.status(200).json({ success: false, message: result.message || 'Failed to stop bot.' });
        }
    }
    return res.status(200).json({
        success: true,
        message: `Bot ${bot.name} has been stopped.`,
        data: bot,
    });
});
exports.stopEngineById = stopEngineById;
const getEngineStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    if (!eagleEyes) {
        return res.status(200).json({
            success: false,
            status: 'ENGINE_NOT_RUNNING',
            message: 'Engine must be running to check bot status.',
        });
    }
    const bot = findBotById(id);
    if (!bot) {
        return res.status(200).json({ success: false, message: 'Bot not found.' });
    }
    return res.status(200).json({
        success: true,
        message: `Bot ${bot.name} is ${bot.status ? 'running' : 'not running'}.`,
        data: bot,
    });
});
exports.getEngineStatus = getEngineStatus;
