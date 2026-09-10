import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();


    useEffect(() => {
        async function checkAuth() {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.log(error)
            }

            if (data.session) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }

            setLoading(false)
        }

        checkAuth()
    }, [])

    if (loading) {
        return <p>page not found error:404</p>
    }

    if (!isLoggedIn) {
        navigate("/");
    }

    return children
}

export default ProtectedRoute