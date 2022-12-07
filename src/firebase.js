import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyASfMOVPgZ5UGEXDFx_55yIL1WSsqk5-0c',
  authDomain: 'todo-list-4fc10.firebaseapp.com',
  projectId: 'todo-list-4fc10',
  storageBucket: 'todo-list-4fc10.appspot.com',
  messagingSenderId: '120463638996',
  appId: '1:120463638996:web:c8ffc0d1a9a97735f69641',
  measurementId: 'G-9PFMPZ1VZ7',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
