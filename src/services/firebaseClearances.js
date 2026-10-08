const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)

// Reads from: students/{studentId}/clearances, with office, status, and updatedAt fields.
export async function subscribeToFirebaseClearances(studentId, onUpdate, onError) {
  if (!firebaseConfigured) return null

  try {
    const appUrl = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'
    const firestoreUrl = 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'
    const { getApps, getApp, initializeApp } = await import(/* @vite-ignore */ appUrl)
    const { collection, getFirestore, onSnapshot } = await import(/* @vite-ignore */ firestoreUrl)
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
    const clearances = collection(getFirestore(app), 'students', studentId, 'clearances')

    return onSnapshot(
      clearances,
      (snapshot) => onUpdate(snapshot.docs.map((document) => ({ office: document.id, ...document.data() }))),
      onError,
    )
  } catch (error) {
    onError(error)
    return null
  }
}
