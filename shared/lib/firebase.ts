/**
 * Firebase initialization.
 * @react-native-firebase/app initializes automatically from google-services.json (Android)
 * or GoogleService-Info.plist (iOS). No manual initialization needed.
 *
 * Firebase config is loaded from the native config files, which must NOT be committed
 * to version control. See .env.example for required env vars used during EAS Build.
 */
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

// Enable offline persistence — Firestore caches data locally
// and queues writes when offline, syncing when reconnected.
firestore().settings({ persistence: true })

export { auth, firestore }
