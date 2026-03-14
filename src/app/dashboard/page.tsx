'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <main style={{minHeight:'100vh',background:'#060412',display:'flex',
      alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'"Cinzel",serif',fontSize:'14px',letterSpacing:'3px',
        color:'rgba(201,168,76,0.6)'}}>ЗАГРУЗКА...</div>
    </main>
  )

  const modules = [
    { title:'Таро', subtitle:'Расклад на вопрос', price:'£3', color:'#C9A84C', icon:'🃏', href:'/chat/tarot' },
    { title:'Нумерология', subtitle:'Числа судьбы', price:'£4', color:'#FFA050', icon:'🔢', href:'/chat/numerology' },
    { title:'Астрология', subtitle:'Карта небес', price:'£5', color:'#64B4FF', icon:'⭐', href:'/chat/astrology' },
    { title:'Совместимость', subtitle:'Анализ пары', price:'£4', color:'#C070FF', icon:'💑', href:'/chat/compatibility' },
  ]

  return (
    <main style={{minHeight:'100vh',background:'#060412',color:'#F0EBF8'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400;500&family=Cinzel+Decorative:wght@300;400&family=EB+Garamond:ital,wght@0,400;1,400&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        .module-card {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:14px; padding:28px 24px;
          transition:all 0.3s; cursor:pointer;
          text-decoration:none; display:block; color:#F0EBF8;
        }
        .module-card:hover {
          background:rgba(255,255,255,0.06);
          transform:translateY(-4px);
        }
      `}</style>

      {/* Background */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        background:'radial-gradient(ellipse at 50% 0%, rgba(70,30,150,0.12) 0%, transparent 60%)'}}/>

      <div style={{position:'relative',zIndex:10,maxWidth:'900px',margin:'0 auto',padding:'40px 24px'}}>

        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'48px'}}>
          <Link href="/" style={{fontFamily:'"Cinzel Decorative",serif',fontSize:'20px',
            color:'#C9A84C',textDecoration:'none',letterSpacing:'3px',
            textShadow:'0 0 20px rgba(201,168,76,0.4)'}}>✦ MYSTIC</Link>
          <button onClick={handleLogout} style={{
            padding:'8px 20px',background:'none',
            border:'1px solid rgba(255,255,255,0.1)',borderRadius:'6px',
            fontFamily:'"Cinzel",serif',fontSize:'10px',letterSpacing:'2px',
            color:'rgba(240,235,248,0.4)',cursor:'pointer',transition:'all 0.3s',
          }}>ВЫЙТИ</button>
        </div>

        {/* Welcome */}
        <div style={{marginBottom:'48px'}}>
          <div style={{fontFamily:'"Cinzel",serif',fontSize:'11px',letterSpacing:'5px',
            color:'#C9A84C',opacity:0.6,marginBottom:'12px',textTransform:'uppercase'}}>
            Добро пожаловать
          </div>
          <h1 style={{fontFamily:'"Cinzel Decorative",serif',fontSize:'clamp(28px,4vw,44px)',
            fontWeight:300,color:'#F0EBF8',marginBottom:'8px'}}>
            {user?.user_metadata?.full_name || 'Искатель'}
          </h1>
          <p style={{fontFamily:'"EB Garamond",serif',fontSize:'17px',fontStyle:'italic',
            color:'rgba(240,235,248,0.4)'}}>
            Выбери консультацию — первая бесплатно
          </p>
        </div>

        {/* Modules */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'48px'}}>
          {modules.map((m,i) => (
            <Link key={i} href={m.href} className="module-card" style={{borderTop:`2px solid ${m.color}66`}}>
              <div style={{fontSize:'32px',marginBottom:'14px'}}>{m.icon}</div>
              <div style={{fontFamily:'"Cinzel",serif',fontSize:'16px',letterSpacing:'2px',
                color:m.color,marginBottom:'6px'}}>{m.title}</div>
              <div style={{fontFamily:'"EB Garamond",serif',fontSize:'14px',fontStyle:'italic',
                color:'rgba(240,235,248,0.4)',marginBottom:'14px'}}>{m.subtitle}</div>
              <div style={{fontFamily:'"Cinzel Decorative",serif',fontSize:'20px',color:m.color}}>
                {m.price}
              </div>
            </Link>
          ))}
        </div>

        {/* Subscription banner */}
        <div style={{
          padding:'28px 32px',
          background:'rgba(201,168,76,0.04)',
          border:'1px solid rgba(201,168,76,0.2)',
          borderRadius:'14px',
          display:'flex',justifyContent:'space-between',alignItems:'center',
          flexWrap:'wrap',gap:'16px',
        }}>
          <div>
            <div style={{fontFamily:'"Cinzel",serif',fontSize:'14px',letterSpacing:'2px',
              color:'#C9A84C',marginBottom:'6px'}}>БЕЗЛИМИТНЫЙ ДОСТУП</div>
            <div style={{fontFamily:'"EB Garamond",serif',fontSize:'16px',fontStyle:'italic',
              color:'rgba(240,235,248,0.5)'}}>
              Все консультации без ограничений за £9.99/мес
            </div>
          </div>
          <button style={{
            padding:'12px 28px',
            background:'linear-gradient(135deg,#8A5A10,#C9A84C,#F8E878,#C9A84C)',
            border:'none',borderRadius:'8px',
            fontFamily:'"Cinzel",serif',fontSize:'11px',letterSpacing:'3px',
            color:'#1A0800',fontWeight:700,cursor:'pointer',
            boxShadow:'0 4px 20px rgba(201,168,76,0.3)',
          }}>ПОДПИСАТЬСЯ</button>
        </div>
      </div>
    </main>
  )
}