import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBviK8fDYgeTJgZtEJO9ITmUtzLNO3ufbA',
  authDomain: 'quiz-9c4bb.firebaseapp.com',
  projectId: 'quiz-9c4bb',
  storageBucket: 'quiz-9c4bb.firebasestorage.app',
  messagingSenderId: '607239233173',
  appId: '1:607239233173:web:868c3b13bec6dccb69859c'
}

let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

export const auth = getAuth(app)
export const db = getFirestore(app)