import { Request, Response } from 'express';
import { startEngine as startFootballEngine , stopEngine as stopFootballEngine, getEngineStatus as getFootballEngineStatus } from './bots/football';
import { startEngine as startTestEngine, stopEngine as stopTestEngine, getEngineStatus as getTestEngineStatus } from './bots/test';
import { Bot, BotController, BotResponse } from './type/types';

const botControllerMap: Record<string, BotController> = {
  football_bot: {
    start: startFootballEngine,
    stop: stopFootballEngine,
    status: getFootballEngineStatus,
  },
  test_bot: {
    start: startTestEngine,
    stop: stopTestEngine,
    status: getTestEngineStatus,
  },
};

const bots: Bot[] = [
  { id: 'test_bot', name: 'test_bot', status: false },
  { id: 'football_bot', name: 'football_bot', status: false },
  { id: 'basketball_bot', name: 'bot_test', status: false },
  { id: 'tennis_bot', name: 'football_bot', status: false },
  { id: 'news_bot', name: 'bot_test', status: false },
  { id: 'crypto_bot', name: 'bot_test', status: false },
];

let engineStatus = false;
const results = [] as BotResponse[];

const findBotById = (id: string) => bots.find(bot => bot.id === id);

export const startEaglesEye = async (res: Response) => {
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
    if (controller?.start) {
      try {
        const result = await controller.start(res);

        results.push({
          id: bot.id,
          name: bot.name,
          success: result.success ?? true,
          message: result.message || 'Started successfully',
          data: result,
        });
      } catch (error) {
        bot.status = false;
        results.push({
          id: bot.id,
          name: bot.name,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          data: null,
        });
      }
    } else {
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
};


export const stopEaglesEye = async (res: Response) => {
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
    if (controller?.stop) {
      try {
        const result = await controller.stop(res);
        bot.status = false;
        results.push({
          id: bot.id,
          name: bot.name,
          success: result.success ?? true,
          message: result.message || 'Stopped successfully',
          data: result,
        });
      } catch (error) {
        results.push({
          id: bot.id,
          name: bot.name,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          data: null,
        });
      }
    } else {
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
};

export const startEngineById = async (req: Request, res: Response) => {
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
  if (controller?.start) {
    await controller.start(res);
    bot.status = true;
  }
  return res.status(200).json({
    success: true,
    message: `Bot ${bot.name} has been started.`,
    data: bot,
  });
};

export const stopEngineById = async (req: Request, res: Response) => {
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
  if (controller?.stop) {
    await controller.stop(res);
    bot.status = false;
  }
  return res.status(200).json({
    success: true,
    message: `Bot ${bot.name} has been stopped.`,
    data: bot,
  });
};

export const getAllEngine = async ( res: Response) => {
  
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
};

export const getEngineStatus = (req: Request, res: Response) => {
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