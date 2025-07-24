import axios from 'axios';

export const sendCommand = async (command: any , bot: any) => {
  const { data } = await axios.post(`${bot}/${command}`);
  return data;
};