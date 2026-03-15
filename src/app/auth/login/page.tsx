'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Неверный email или пароль')
    else router.push('/dashboard')
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#080510',padding:'24px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .inp{width:100%;padding:14px 18px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:8px;color:#EDE8F5;font-family:'Lora',serif;font-size:16px;outline:none;transition:border-color 0.3s}
        .inp:focus{border-color:rgba(150,100,255,0.5)}
        .inp::placeholder{color:rgba(200,185,240,0.3);font-style:italic}
      `}</style>
      <div style={{position:'fixed',inset:0,zIndex:0,background:'radial-gradient(ellipse at 50% 0%,rgba(60,20,120,0.2) 0%,transparent 60%)'}}/>
      <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:'420px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',fontWeight:900,color:'#EDE8F5',textDecoration:'none',letterSpacing:'1px'}}>
            MYSTIC<span style={{color:'rgba(170,120,255,0.7)',fontSize:'14px',fontWeight:400,verticalAlign:'super',marginLeft:'3px'}}>AI</span>
          </Link>
          <div style={{fontFamily:'"Lora",serif',fontSize:'16px',fontStyle:'italic',color:'rgba(200,185,240,0.4)',marginTop:'8px'}}>Добро пожаловать обратно</div>
        </div>
        <div style={{background:'rgba(8,5,22,0.95)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'40px 36px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(150,100,255,0.6),transparent)'}}/>
          <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:700,color:'#EDE8F5',letterSpacing:'2px',marginBottom:'32px',textAlign:'center'}}>ВХОД</h1>
          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div>
              <label style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Email</label>
              <input className="inp" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
            </div>
            <div>
              <label style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Пароль</label>
              <input className="inp" type="password" placeholder="Ваш пароль" value={password} onChange={e=>setPassword(e.target.value)} required/>
            </div>
            {error&&<div style={{padding:'12px 16px',borderRadius:'8px',background:'rgba(220,80,80,0.08)',border:'1px solid rgba(220,80,80,0.3)',fontFamily:'"Lora",serif',fontSize:'14px',color:'rgba(255,120,120,0.9)'}}>{error}</div>}
            <button type="submit" disabled={loading} style={{marginTop:'8px',padding:'15px',background:loading?'rgba(100,60,200,0.3)':'linear-gradient(135deg,#6030B0,#9060E0,#C080FF)',border:'none',borderRadius:'8px',fontFamily:'"Playfair Display",serif',fontSize:'13px',letterSpacing:'2px',color:'#EDE8F5',fontWeight:700,cursor:loading?'not-allowed':'pointer',transition:'opacity 0.3s'}}>
              {loading?'ВХОДИМ...':'ВОЙТИ'}
            </button>
          </form>
          <div style={{textAlign:'center',marginTop:'24px',fontFamily:'"Lora",serif',fontSize:'14px',color:'rgba(200,185,240,0.35)'}}>
            Нет аккаунта?{' '}<Link href="/auth/register" style={{color:'rgba(150,100,255,0.8)',textDecoration:'none'}}>Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    </main>
  )
}