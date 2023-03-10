import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native"

const firebaseConfig = {
    apiKey: "AIzaSyDMB99bz4sxu_-xEPPtPgKrUSRJrw07dqk",
    authDomain: "finanzas-679e5.firebaseapp.com",
    projectId: "finanzas-679e5",
    storageBucket: "finanzas-679e5.appspot.com",
    messagingSenderId: "354840202895",
    appId: "1:354840202895:web:cb05177859d4ba32216afa"
  };

  export const app = initializeApp(firebaseConfig);
  export const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)})
