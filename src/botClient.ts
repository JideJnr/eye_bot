import axios from 'axios';

export const sendPostCommand = async (bot: any, command: any) => {
  const { data } = await axios.post(`${bot}/${command}`);
  return data;
};

export const sendGetCommand = async ( bot:any, command: any) => {
  const { data } = await axios.get(`${bot}/${command}`);
  return data;
};