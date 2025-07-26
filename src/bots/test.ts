import { sendPostCommand } from "../botClient";


const bot_url = process.env.BOT_SERVICE_URL || 'https://godscpr.onrender.com';

export const startEngine = async () => {
  try {
    const result = await sendPostCommand(bot_url, 'start');
    return {
      success: result?.success ?? true,
      message: result?.message || 'Started successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start bot service',
      data: null,
    };
  }
};

export const stopEngine = async () => {
  try {
    const result = await sendPostCommand(bot_url, 'stop');
    return {
      success: result?.success ?? true,
      message: result?.message || 'Stopped successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to stop bot service',
      data: null,
    };
  }
};

export const getEngineStatus = async () => {
  try {
    const result = await sendPostCommand(bot_url, 'health');
    return {
      success: result?.success ?? true,
      message: result?.message || 'Status fetched',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get bot status',
      data: null,
    };
  }
};

export const getAllBot = async () => {
  try {
    const result = await sendPostCommand(bot_url, 'get/all');
    return {
      success: result?.success ?? true,
      message: result?.message || 'Started successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start bot service',
      data: null,
    };
  }
};


export const getBotById = async () => {
  try {
    const result = await sendPostCommand(bot_url, 'get/id');
    return {
      success: result?.success ?? true,
      message: result?.message || 'Started successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start bot service',
      data: null,
    };
  }
};


export const startBotById = async () => {
  try {
    const result = await sendPostCommand(bot_url, 'start/id');
    return {
      success: result?.success ?? true,
      message: result?.message || 'Started successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start bot service',
      data: null,
    };
  }
};


export const stopBotById = async () => {
  try {
    const result = await sendPostCommand(bot_url, 'stop/id');
    return {
      success: result?.success ?? true,
      message: result?.message || 'Started successfully',
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to start bot service',
      data: null,
    };
  }
};




