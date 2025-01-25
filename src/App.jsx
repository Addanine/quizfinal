// src/App.jsx
import Auth from './Auth'
import { supabase } from './supabaseClient'
import Flashcards from './Flashcards.jsx' // your existing flashcard UI

function App() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check if there’s an active session on initial load
        supabase.auth.getSession().then(({ data }) => {
            setUser(data?.session?.user ?? null)
        })

        // Listen for auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    function handleLogout() {
        supabase.auth.signOut()
    }

    if (!user) {
        // Show the login/signup form if not logged in
        return <Auth onLogin={(loggedInUser) => setUser(loggedInUser)} />
    }

    return (
        <div>
            <p>Welcome, {user.email}!</p>
            <button onClick={handleLogout}>Logout</button>

            <Flashcards user={user} />
        </div>
    )
}

export default App
