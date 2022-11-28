import { functions } from '../../firebase';

export const sendStatus = (
  res: functions.Response,
  status: number,
  response?: any,
) => {
  res.set('Access-Control-Allow-Origin', '*').status(status).send(response);
};

export const handleOptionsRequest = (
  res: functions.Response,
  allowedMethods = 'POST, PUT, DELETE, OPTIONS, GET',
  allowedHeaders = '*',
) => {
  res
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Methods', allowedMethods)
    .set('Access-Control-Allow-Headers', allowedHeaders)
    .set('Access-Control-Max-Age', '86400')
    .status(204)
    .send();
};
