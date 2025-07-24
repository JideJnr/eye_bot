import { Response } from "express";

export interface Bot {
  id: string;
  name: string;
  status: boolean;
}

export interface BotController {
  start?: (res:Response) => Promise<any>;
  stop?: (res:Response) => Promise<any>;
  status?: (res:Response) => Promise<any>;
}

export interface BotResponse {
  id: string;
  name: string;
  success: boolean;
  message: string;
  data: any | null;
}
