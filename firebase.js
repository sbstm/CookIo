// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB63ICZBZ4HpncgOm9s-g5QaSnywX4aPmM',
  authDomain: 'cook-math.firebaseapp.com',
  projectId: 'cook-math',
  storageBucket: 'cook-math.appspot.com',
  messagingSenderId: '1096447905263',
  appId: '1:1096447905263:web:817e9661d8e74739d77a1a',
  measurementId: 'G-2GCHLJVQPV',
  databaseURL:
    'https://cook-math-default-rtdb.asia-southeast1.firebasedatabase.app/',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app, 'gs://cook-math.appspot.com')
const db = getDatabase(app)
const auth = getAuth(app)

export { storage, db, auth }
