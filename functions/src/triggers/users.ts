import { UserRecord } from 'firebase-functions/v1/auth';
import { functions } from '../firebase';
import { giveUserRole } from '../functions/user';

export const onUserCreate = functions.auth
  .user()
  .onCreate(async (user: UserRecord) => {
    await giveUserRole(user);
  });
