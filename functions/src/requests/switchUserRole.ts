import { admin, collections, functions } from '../firebase';
import { validateUserPermissions } from '../utils/auth';
import { handleOptionsRequest, sendStatus } from '../utils/response';

export const switchUserRole = functions.https.onRequest(async (req, res) => {
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

  if (!req.body.userId || !req.body.roleName) {
    return sendStatus(res, 400);
  }

  const userId = req.body.userId;

  const roles = await collections.roles.get();

  const roleNames: string[] = [];

  roles.forEach((snapshot) => {
    roleNames.push(snapshot.id);
  });

  roleNames.push('Admin', 'User');

  const roleName = req.body.roleName;

  if (!roleNames.includes(roleName)) {
    return sendStatus(res, 200, { ...baseResponse, error: 'Invalid Role' });
  }

  try {
    await admin.auth().setCustomUserClaims(userId, { role: roleName });
  } catch (error) {
    return sendStatus(res, 200, { ...baseResponse, error: error });
  }
  return sendStatus(res, 200, { ...baseResponse, status: true });
});
