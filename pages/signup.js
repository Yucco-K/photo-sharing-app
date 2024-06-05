// pages/signup.js
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSignUp = async () => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) console.log('Error: ', error.message)
    else console.log('User: ', user)
  }

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  )
}
