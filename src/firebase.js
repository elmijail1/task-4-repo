import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWeFR2-lodFxxANd-bdOeE_avHxYfGiTY",
  authDomain: "task-4-itransition.firebaseapp.com",
  projectId: "task-4-itransition",
  storageBucket: "task-4-itransition.firebasestorage.app",
  messagingSenderId: "1043058894293",
  appId: "1:1043058894293:web:9ea04fa2148918568bc95c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
