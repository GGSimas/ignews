import { NextApiRequest, NextApiResponse } from 'next'
export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    {id: 1, name: 'Tiriça'},
    {id: 1, name: 'Ticaba'},
    {id: 1, name: 'Tina'},
    {id: 1, name: 'Lisa'},
    {id: 1, name: 'Kate'},
  ];

  return response.status(200).json(users);
};