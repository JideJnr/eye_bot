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
exports.getEagleEyes = exports.getAllEngine = exports.stopEngineById = exports.startEngineById = exports.stopEaglesEye = exports.startEaglesEye = void 0;
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
    let allStarted = true;
    for (const bot of bots) {
        const controller = botControllerMap[bot.name];
        if (controller === null || controller === void 0 ? void 0 : controller.start) {
            try {
                const result = yield controller.start();
                bot.status = result.success;
                if (!result.success)
                    allStarted = false;
            }
            catch (error) {
                bot.status = false;
                allStarted = false;
            }
        }
        else {
            bot.status = false;
            allStarted = false;
        }
    }
    eagleEyes = allStarted;
    if (allStarted) {
        return res.status(200).json({
            success: true,
            status: 'ENGINE_STARTED',
            message: 'Eagles Eye Functional... Engines online',
        });
    }
    else {
        return res.status(500).json({
            success: false,
            status: 'ENGINE_START_FAILED',
            message: 'One or more bots failed to start.',
        });
    }
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
    let allStopped = true;
    for (const bot of bots) {
        const controller = botControllerMap[bot.name];
        if (controller === null || controller === void 0 ? void 0 : controller.stop) {
            try {
                const result = yield controller.stop();
                bot.status = !result.success ? false : bot.status;
                if (!result.success)
                    allStopped = false;
            }
            catch (error) {
                allStopped = false;
            }
        }
        else {
            allStopped = false;
        }
    }
    eagleEyes = !allStopped;
    if (allStopped) {
        eagleEyes = false;
        return res.status(200).json({
            success: true,
            status: 'ENGINE_STOPPED',
            message: 'Lights Out.',
            bots,
        });
    }
    else {
        return res.status(500).json({
            success: false,
            status: 'ENGINE_STOP_FAILED',
            message: 'One or more bots failed to stop.',
        });
    }
});
exports.stopEaglesEye = stopEaglesEye;
const startEngineById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!eagleEyes) {
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
        const result = yield controller.start();
        bot.status = result.success;
        if (!result.success) {
            return res.status(500).json({ success: false, message: result.message || 'Failed to start bot.' });
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
        const result = yield controller.stop();
        bot.status = !result.success ? false : bot.status;
        if (!result.success) {
            return res.status(500).json({ success: false, message: result.message || 'Failed to stop bot.' });
        }
    }
    return res.status(200).json({
        success: true,
        message: `Bot ${bot.name} has been stopped.`,
        data: bot,
    });
});
exports.stopEngineById = stopEngineById;
const getAllEngine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!eagleEyes) {
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
const getEagleEyes = (req, res) => {
    const { id } = req.body;
    const bot = findBotById(id);
    if (!eagleEyes) {
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
exports.getEagleEyes = getEagleEyes;
