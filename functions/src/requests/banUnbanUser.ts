import { admin, functions } from '../firebase';
import { validateUserPermissions } from '../utils/auth';
import { handleOptionsRequest, sendStatus } from '../utils/response';

export const banUnbanUser = functions.https.onRequest(async (req, res) => {
  const baseResponse: BaseResponse = {
    status: false,
  };

  if (req.method === 'OPTIONS') {
    return handleOptionsRequest(res, 'POST', 'Content-Type, Authorization');
  }

  if (req.method !== 'POST') {
    return sendStatus(res, 405);
  }

  const userValidated = await validateUserPermissions({
    req,
    route: '/admin/users',
    permissionList: ['write'],
  });

  if (!userValidated) {
    return sendStatus(res, 401);
  }

  if (!req.body.userId) {
    return sendStatus(res, 400);
  }

  const userId = req.body.userId;

  let operation = 'ban';

  if (req.body.operation && !['ban', 'unban'].includes(req.body.operation)) {
    return sendStatus(res, 400);
  } else {
    operation = req.body.operation ?? 'ban';
  }

  try {
    await admin
      .auth()
      .updateUser(userId, { disabled: operation === 'ban' ? true : false });
  } catch (error) {
    return sendStatus(res, 200, { ...baseResponse, error: error });
  }
  return sendStatus(res, 200, { ...baseResponse, status: true });
});
