import Link from 'next/link'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../lib/firebase'
import { signOut } from 'firebase/auth'

export default function Header() {
  const [user] = useAuthState(auth)

  return (
    <header style={{padding: '1rem', borderBottom: '1px solid #eee'}}>
      <nav style={{display:'flex', gap: '1rem', alignItems:'center'}}>
        <Link href="/">Home</Link>
        <Link href="/create-quiz">Create Quiz (AI)</Link>
        {user ? (
          <>
            <span>{user.email}</span>
            <button onClick={() => signOut(auth)}>Logout</button>
            <Link href="/my-results">My Results</Link>
          </>
        ) : (
          <Link href="/auth">Login / Register</Link>
        )}
      </nav>
    </header>
  )
}