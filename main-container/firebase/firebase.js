/**
 * Use for interacting with the firebase(nearby database)
 * It use Firebase authentication(for user login)
 * and firebase firestore(for database)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

const firebaseConfig = {
  apiKey: "AddYourOwnFirebaseConfig",
  authDomain: "AddYourOwnFirebaseConfig",
  projectId: "AddYourOwnFirebaseConfig",
  storageBucket: "AddYourOwnFirebaseConfig",
  messagingSenderId: "AddYourOwnFirebaseConfig",
  appId: "AddYourOwnFirebaseConfig",
};
let app, auth, db;
//To check if the app is not yet initialize. Initialize if not. If already initialize use the inilize version
//Initialize auth and db
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  db = initializeFirestore(app, {
    //To Fix the bug:
    //https://stackoverflow.com/questions/72562281/could-not-reach-cloud-firestore-backend-strange-behavior
    experimentalForceLongPolling: true,
  });
} else {
  app = getApp();
  auth = getAuth();
  db = getFirestore();
}

export { auth, db };
