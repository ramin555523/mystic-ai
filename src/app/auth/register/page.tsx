'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) setError(error.message)
    else setMessage('Проверьте email — мы отправили ссылку для подтверждения.')
    setLoading(false)
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#060412',padding:'24px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500&family=Cinzel+Decorative:wght@400&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .inp{width:100%;padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.10);border-radius:8px;color:#F0EBF8;font-family:'EB Garamond',serif;font-size:16px;outline:none;transition:border-color 0.3s}
        .inp:focus{border-color:rgba(201,168,76,0.5)}
        .inp::placeholder{color:rgba(240,235,248,0.3)}
      `}</style>

      <div style={{position:'fixed',inset:0,zIndex:0,background:'radial-gradient(ellipse at 50% 0%,rgba(70,30,150,0.2) 0%,transparent 60%)'}}/>

      <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:'420px'}}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <Link href="/" style={{fontFamily:'"Cinzel Decorative",serif',fontSize:'22px',color:'#C9A84C',textDecoration:'none',letterSpacing:'4px',textShadow:'0 0 24px rgba(201,168,76,0.4)'}}>✦ MYSTIC</Link>
          <div style={{fontFamily:'"EB Garamond",serif',fontSize:'16px',fontStyle:'italic',color:'rgba(240,235,248,0.35)',marginTop:'8px'}}>Начни свой путь</div>
        </div>

        <div style={{background:'rgba(7,4,20,0.95)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:'16px',padding:'40px 36px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#C9A84C,#FFF0A0,#C9A84C,transparent)'}}/>

          <h1 style={{fontFamily:'"Cinzel",serif',fontSize:'20px',fontWeight:400,color:'#F0EBF8',letterSpacing:'3px',marginBottom:'32px',textAlign:'center'}}>РЕГИСТРАЦИЯ</h1>

          {message ? (
            <div style={{padding:'20px',borderRadius:'10px',background:'rgba(100,220,150,0.08)',border:'1px solid rgba(100,220,150,0.3)',textAlign:'center'}}>
              <div style={{fontSize:'32px',marginBottom:'12px'}}>✉️</div>
              <p style={{fontFamily:'"EB Garamond",serif',fontSize:'16px',lineHeight:1.7,color:'rgba(240,235,248,0.7)'}}>{message}</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label style={{fontFamily:'"Cinzel",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(240,235,248,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Имя</label>
                <input className="inp" type="text" placeholder="Ваше имя" value={name} onChange={e=>setName(e.target.value)} required/>
              </div>
              <div>
                <label style={{fontFamily:'"Cinzel",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(240,235,248,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Email</label>
                <input className="inp" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
              </div>
              <div>
                <label style={{fontFamily:'"Cinzel",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(240,235,248,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Пароль</label>
                <input className="inp" type="password" placeholder="Минимум 6 символов" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/>
              </div>
              {error && (
                <div style={{padding:'12px 16px',borderRadius:'8px',background:'rgba(220,80,80,0.08)',border:'1px solid rgba(220,80,80,0.3)',fontFamily:'"EB Garamond",serif',fontSize:'14px',color:'rgba(255,120,120,0.9)'}}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading} style={{marginTop:'8px',padding:'15px',background:loading?'rgba(201,168,76,0.3)':'linear-gradient(135deg,#8A5A10,#C9A84C,#F8E878,#C9A84C)',border:'none',borderRadius:'8px',fontFamily:'"Cinzel",serif',fontSize:'12px',letterSpacing:'3px',color:'#1A0800',fontWeight:700,cursor:loading?'not-allowed':'pointer'}}>
                {loading ? 'ОТПРАВЛЯЕМ...' : 'СОЗДАТЬ АККАУНТ'}
              </button>
            </form>
          )}

          <div style={{textAlign:'center',marginTop:'24px',fontFamily:'"EB Garamond",serif',fontSize:'14px',color:'rgba(240,235,248,0.35)'}}>
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" style={{color:'#C9A84C',textDecoration:'none'}}>Войти</Link>
          </div>
        </div>
      </div>
    </main>
  )
}