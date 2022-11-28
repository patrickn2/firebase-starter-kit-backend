import { ListUsersResult } from 'firebase-admin/lib/auth/base-auth';
import { UserRecord } from 'firebase-functions/v1/auth';
import { admin, functions } from '../firebase';
import { validateUserPermissions } from '../utils/auth';
import { handleOptionsRequest, sendStatus } from '../utils/response';

interface FetchUsersResponse extends BaseResponse {
  data?: UserRecord[];
  perPage?: number;
  totalPages?: number;
}

export const fetchUsers = functions.https.onRequest(async (req, res) => {
  const baseResponse: FetchUsersResponse = {
    status: false,
  };

  if (req.method === 'OPTIONS') {
    return handleOptionsRequest(res, 'POST', 'Content-Type, Authorization');
  }

  if (req.method !== 'POST') {
    return sendStatus(res, 405);
  }

  let perPage = 50;

  if (
    req.body['perPage'] &&
    typeof req.body['perPage'] === 'number' &&
    req.body['perPage'] <= 2000 &&
    req.body['perPage'] > 0
  ) {
    perPage = req.body.perPage;
  }

  let page = 1;

  if (
    req.body['page'] &&
    typeof req.body['page'] === 'number' &&
    req.body['page'] > 0
  ) {
    page = req.body.page;
  }

  const userValidated = await validateUserPermissions({
    req,
    route: '/admin/users',
    permissionList: ['read'],
  });

  if (!userValidated) {
    return sendStatus(res, 401);
  }

  let pageToken: ListUsersResult['pageToken'];
  let users: UserRecord[] = [];

  try {
    do {
      const result = await admin.auth().listUsers(1000, pageToken);
      users = [...users, ...result.users];
      pageToken = result.pageToken ?? undefined;
    } while (pageToken);
  } catch (error) {
    return sendStatus(res, 200, { ...baseResponse, error: error });
  }

  // Pagination

  const totalPages = Math.ceil(users.length / perPage);
  page = page > totalPages ? totalPages : page;
  const offset = (page - 1) * perPage;
  const finalUsers = users.slice(offset, perPage + offset);

  const finalResponse = {
    ...baseResponse,
    data: finalUsers,
    status: true,
    page,
    perPage,
    totalPages,
  };
  return sendStatus(res, 200, finalResponse);
});
