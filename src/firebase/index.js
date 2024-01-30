// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

import { STORED_ENVIRONMENT_KEY } from "../constants";
import { CONFIGS } from "./configs";

const storedEnvironment = localStorage.getItem(STORED_ENVIRONMENT_KEY);

let app;
if (storedEnvironment) {
  app = initializeApp(CONFIGS[storedEnvironment]);
} else {
  app = initializeApp(CONFIGS.PROD);
}

const db = getFirestore(app);

export { db };
