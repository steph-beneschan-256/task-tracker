import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBZB_MqLewba4Q01nWS4-AEzGYywC8nnbo",
    authDomain: "sesl2-team-34.firebaseapp.com",
    databaseURL: "https://sesl2-team-34-default-rtdb.firebaseio.com",
    projectId: "sesl2-team-34",
    storageBucket: "sesl2-team-34.appspot.com",
    messagingSenderId: "993812958664",
    appId: "1:993812958664:web:ee0fd0edacb9f8fc3304fd",
    measurementId: "G-BXJB4W50KL"
  };  

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);