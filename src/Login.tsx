import { useState } from 'react'
import { supabase } from './lib/supabase.ts'
import { Link,useNavigate } from 'react-router-dom'
import { IoEye, IoEyeOff } from "react-icons/io5";
import './auth.css'

function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setpassword] = useState<string>('')
    const [message, setmessage] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const navigate = useNavigate()

    async function userLogin() {

        if (!email || !password) {
            setmessage("Please enter a valid email and password")
            return
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) {
            setmessage("email or password is incorrect")
        } else {
            setmessage("Login successful")
            navigate('/Home')
        }
    }

    

    return (
        <>
            <head>
                <title>Login</title>
            </head>
            <div className="signin-page">
                <div className="signin-box">
                    <h1>Welcome back!</h1>
                    <h3>Enter email</h3>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <h3>Enter password</h3>

                    <div className="password-field">
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setpassword(e.target.value)} />

                        {showPassword ? (<IoEye onClick={() => setShowPassword(false)} />) : (<IoEyeOff onClick={() => setShowPassword(true)} />)}
                    </div>

                    {message && (
                        <div className="message-box">
                            {message}
                        </div>
                    )}

                    <button onClick={userLogin}>Login</button>
                    <p>Don't have an account? <Link to="/Register">Sign Up</Link></p>
                </div>
            </div>
        </>
    )
}

export default Login