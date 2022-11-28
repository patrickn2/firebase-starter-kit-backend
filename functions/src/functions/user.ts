import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { admin } from '../firebase';

export const giveUserRole = async (user: UserRecord): Promise<string> => {
  const customClaims = {
    role: 'User',
  };

  const AdminEmails = ['patricknn@gmail.com'];

  if (AdminEmails.includes(user.email ?? '')) {
    customClaims.role = 'Admin';
  }

  if (user.email == 'rodrigo.n.nogueira@gmail.com') {
    customClaims.role = 'Editor';
  }

  if (user.email == 'e.patricknn@gmail.com') {
    customClaims.role = 'Editor';
  }

  await admin.auth().setCustomUserClaims(user.uid, customClaims);

  return customClaims.role;
};
