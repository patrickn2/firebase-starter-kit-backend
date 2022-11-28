import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { admin, collections, functions } from '../../firebase';

export const authenticateUser = async (
  req: functions.https.Request,
): Promise<boolean | admin.auth.DecodedIdToken> => {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)
  ) {
    functions.logger.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.',
    );
    return false;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    return false;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    return decodedIdToken as DecodedIdToken;
  } catch (error) {
    functions.logger.error('Error while verifying Firebase ID token:', error);
    return false;
  }
};

interface ValidateUserPermissionsProps {
  req: functions.https.Request;
  route: RouteList;
  permissionList: PermissionList[];
}

export const validateUserPermissions = async ({
  req,
  route,
  permissionList,
}: ValidateUserPermissionsProps): Promise<boolean> => {
  const tokenId = await authenticateUser(req);

  if (!tokenId) return false;

  const roleName = (tokenId as DecodedIdToken).role;

  let result = true;

  if (roleName !== 'Admin') {
    const roleData = (
      await collections.roles.doc(roleName).get()
    ).data() as Role;

    if (!roleData) return false;

    permissionList.forEach((permission) => {
      if (!roleData.routes?.[route]?.[permission]) {
        result = false;
      }
    });
  }
  return result;
};
