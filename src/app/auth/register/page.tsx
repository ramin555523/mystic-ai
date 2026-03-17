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
      email, password,
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
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#080510',padding:'24px'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .inp{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.10);border-radius:8px;color:#EDE8F5;font-family:'Lora',serif;font-size:15px;outline:none;transition:border-color 0.3s}
        .inp:focus{border-color:rgba(150,100,255,0.5)}
        .inp::placeholder{color:rgba(200,185,240,0.3);font-style:italic}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.5}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:60}).map((_,i)=>(
          <div key={i} style={{position:'absolute',left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,width:'1px',height:'1px',borderRadius:'50%',background:'rgba(230,220,255,0.8)',animation:`twinkle ${3+i%5}s ease-in-out infinite`,animationDelay:`${(i*0.3)%4}s`}}/>
        ))}
        <div style={{position:'absolute',top:'-20%',left:'10%',width:'80vw',height:'80vw',maxWidth:'900px',borderRadius:'50%',background:'radial-gradient(circle,rgba(60,20,120,0.12) 0%,transparent 70%)'}}/>
      </div>

      <div style={{position:'relative',zIndex:10,width:'100%',maxWidth:'420px',animation:'fadeUp 0.6s ease both'}}>
        <div style={{textAlign:'center',marginBottom:'36px'}}>
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',fontWeight:900,color:'#EDE8F5',textDecoration:'none',letterSpacing:'1px'}}>
            MYSTIC<span style={{color:'rgba(170,120,255,0.7)',fontSize:'14px',fontWeight:400,verticalAlign:'super',marginLeft:'3px'}}>AI</span>
          </Link>
          <div style={{fontFamily:'"Lora",serif',fontSize:'16px',fontStyle:'italic',color:'rgba(200,185,240,0.35)',marginTop:'8px'}}>Начните свой путь</div>
        </div>

        <div style={{background:'rgba(8,5,22,0.97)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'16px',padding:'40px 36px',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(150,100,255,0.6),transparent)'}}/>

          <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:700,color:'#EDE8F5',letterSpacing:'2px',marginBottom:'28px',textAlign:'center'}}>РЕГИСТРАЦИЯ</h1>

          {message ? (
            <div style={{padding:'24px',borderRadius:'12px',background:'rgba(100,220,120,0.06)',border:'1px solid rgba(100,220,120,0.25)',textAlign:'center'}}>
              <div style={{fontSize:'36px',marginBottom:'12px'}}>✉️</div>
              <p style={{fontFamily:'"Lora",serif',fontSize:'15px',lineHeight:1.75,color:'rgba(200,240,210,0.75)'}}>{message}</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Имя</label>
                <input className="inp" type="text" placeholder="Ваше имя" value={name} onChange={e=>setName(e.target.value)} required/>
              </div>
              <div>
                <label style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Email</label>
                <input className="inp" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
              </div>
              <div>
                <label style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Пароль</label>
                <input className="inp" type="password" placeholder="Минимум 6 символов" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/>
              </div>
              {error && (
                <div style={{padding:'12px 16px',borderRadius:'8px',background:'rgba(220,80,80,0.08)',border:'1px solid rgba(220,80,80,0.25)',fontFamily:'"Lora",serif',fontSize:'14px',color:'rgba(255,130,130,0.9)'}}>{error}</div>
              )}
              <button type="submit" disabled={loading} style={{marginTop:'8px',padding:'14px',background:loading?'rgba(100,60,200,0.3)':'linear-gradient(135deg,#6030B0,#9060E0,#C080FF)',border:'none',borderRadius:'8px',fontFamily:'"Playfair Display",serif',fontSize:'13px',letterSpacing:'2px',color:'#EDE8F5',fontWeight:700,cursor:loading?'not-allowed':'pointer',transition:'opacity 0.3s',boxShadow:loading?'none':'0 4px 20px rgba(100,40,200,0.3)'}}>
                {loading ? 'СОЗДАЁМ...' : 'СОЗДАТЬ АККАУНТ'}
              </button>
            </form>
          )}

          <div style={{textAlign:'center',marginTop:'24px',fontFamily:'"Lora",serif',fontSize:'14px',color:'rgba(200,185,240,0.3)'}}>
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" style={{color:'rgba(150,110,255,0.8)',textDecoration:'none'}}>Войти</Link>
          </div>
        </div>

        <p style={{textAlign:'center',marginTop:'16px',fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(180,160,220,0.2)'}}>
          Первая консультация бесплатно · Без карты
        </p>
      </div>
    </main>
  )
}