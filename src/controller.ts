import { Request, Response } from 'express';
import { startEngine as startTestEngine, stopEngine as stopTestEngine, getEngineStatus as getTestStatus } from './bots/test';
import { Bot, BotController, BotResponse } from './type/types';

const botControllerMap: Record<string, BotController> = {
  test_bot: {
    start: startTestEngine,
    stop: stopTestEngine,
    status: getTestStatus,
  },
};

const bots: Bot[] = [
  { id: 'test_bot', name: 'test_bot', status: false }
];

let eagleEyes = false;

const findBotById = (id: string) => bots.find(bot => bot.id === id);

export const startEaglesEye = async (req: Request, res: Response) => {
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
    if (controller?.start) {
      try {
        const result = await controller.start();
        bot.status = result.success;
        botResults.push({ id: bot.id, name: bot.name, ...result });
      } catch (error) {
        bot.status = false;
        botResults.push({ id: bot.id, name: bot.name, success: false, message: error instanceof Error ? error.message : 'Unknown error', data: null });
      }
    } else {
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
};

export const stopEaglesEye = async (req: Request, res: Response) => {
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
    if (controller?.stop) {
      try {
        const result = await controller.stop();
        bot.status = !result.success ? false : bot.status;
        botResults.push({ id: bot.id, name: bot.name, ...result });
      } catch (error) {
        botResults.push({ id: bot.id, name: bot.name, success: false, message: error instanceof Error ? error.message : 'Unknown error', data: null });
      }
    } else {
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
};

export const startEngineById = async (req: Request, res: Response) => {
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
  if (controller?.start) {
    const result = await controller.start();
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
};

export const stopEngineById = async (req: Request, res: Response) => {
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
  if (controller?.stop) {
    const result = await controller.stop();
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
};

export const getAllEngine = async (req: Request, res: Response) => {
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
};

export const getEagleEyes = (req: Request, res: Response) => {
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