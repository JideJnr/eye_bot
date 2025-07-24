import { Response } from "express";

export interface Bot {
  id: string;
  name: string;
  status: boolean;
}

export interface BotController {
  start?: () => Promise<{ success: boolean; message: string; data?: any }>,
  stop?: () => Promise<{ success: boolean; message: string; data?: any }>,
  status?: () => Promise<{ success: boolean; message: string; data?: any }>,
}

export interface BotResponse {
  id: string;
  name: string;
  success: boolean;
  message: string;
  data: any | null;
}
