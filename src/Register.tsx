import { supabase } from './lib/supabase'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoEye, IoEyeOff } from "react-icons/io5";
import './auth.css'

function Register() {
    const [email, setEmail] = useState<string>('')
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setpassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [message, setmessage] = useState<string>('')

    async function userSignUp() {

        if (!email || !password) {
            setmessage("Please enter a valid email and password")
            return
        }

        if (password !== confirmPassword) {
            setmessage("Passwords do not match")
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        if (error) {
            console.log(error)
            setmessage(error.message)
            console.log("error")
        } else {
            console.log(data)
            setmessage("Sign Up successful")
            navigate('/Home')
        }
    }

    return (
        <>
            <head>
                <title>Register</title>
            </head>
            <div className="signup-page">
                <div className="signup-box">
                    <h1>Create an account</h1>
                    <h3>Enter email</h3>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <h3>Enter password</h3>

                    <div className="password-field">
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setpassword(e.target.value)} />

                        {showPassword ? (<IoEye onClick={() => setShowPassword(false)} />) : (<IoEyeOff onClick={() => setShowPassword(true)} />)}
                    </div>

                    <h3>Confirm password</h3>

                    <div className="password-field">
                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        {showConfirmPassword ? (<IoEye onClick={() => setShowConfirmPassword(false)} />) : (<IoEyeOff onClick={() => setShowConfirmPassword(true)} />)}
                    </div>

                    {message && (
                        <div className="message-box">
                            {message}
                        </div>
                    )}

                    <button onClick={userSignUp}>Register</button>
                    <p>Already have an account? <Link to="/">Log In</Link></p>
                </div>
            </div>
        </>
    );
}
export default Register