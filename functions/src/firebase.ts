import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();

const firestore = admin.firestore();

const collections = {
  roles: firestore.collection('roles'),
};

export { admin, collections, functions, firestore };
