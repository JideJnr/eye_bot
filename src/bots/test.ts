import { Response } from "express";
import { sendCommand } from "../botClient";


const bot_url = process.env.BOT_SERVICE_URL || 'https://godscpr.onrender.com';

export const startEngine = async ( res: Response ) => {
  try {
    const result = await sendCommand(bot_url,'start');
    res.json(result);
  } catch (error) {
    res.status(201).json({ 
      success: false,
      error: 'Failed to start bot service',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const stopEngine = async ( res: Response) => {
  try {
    const result = await sendCommand(bot_url,'stop');
    res.json(result);
  } catch (error) {
    res.status(201).json({ 
      success: false,
      error: 'Failed to start bot service',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getEngineStatus = async ( res: Response) => {
  try {
    const result = await sendCommand(bot_url,'health');
    res.json(result);
  } catch (error) {
    res.status(201).json({ 
      success: false,
      error: 'Failed to start bot service',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
