import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

const firebaseConfig = {
  apiKey: "AIzaSyAG920A50-1m4L-o-53rYCrgLXwVDbbGJk",
  authDomain: "nearest-54654.firebaseapp.com",
  projectId: "nearest-54654",
  storageBucket: "nearest-54654.appspot.com",
  messagingSenderId: "676197603125",
  appId: "1:676197603125:web:35ed54b6d271ab34cede7c",
};
let app;
let auth;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth();
}
const db = getFirestore(app);

export { auth, db };
