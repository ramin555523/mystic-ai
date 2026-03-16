'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [zodiac, setZodiac] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const router = useRouter()

  const ZODIAC_SIGNS = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы']

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      setName(user.user_metadata?.full_name || '')
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile?.subscription_status === 'active') setIsPro(true)
      setLoading(false)
    }
    init()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    await supabase.auth.updateUser({ data: { full_name: name } })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#080510',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',letterSpacing:'3px',color:'rgba(200,180,255,0.5)'}}>ЗАГРУЗКА...</div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif}
        .inp{width:100%;padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#EDE8F5;font-family:'Lora',serif;font-size:15px;outline:none;transition:border-color 0.3s}
        .inp:focus{border-color:rgba(150,100,255,0.5)}
        .inp::placeholder{color:rgba(200,185,240,0.3);font-style:italic}
        select.inp{cursor:pointer}
        select.inp option{background:#1A0F3A}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:28px;animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both}
      `}</style>

      <div style={{minHeight:'100vh',background:'#080510'}}>
        <div style={{maxWidth:'640px',margin:'0 auto',padding:'32px 24px 80px'}}>

          {/* Header */}
          <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'40px'}}>
            <Link href="/dashboard" style={{width:'36px',height:'36px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(200,185,240,0.6)',textDecoration:'none',fontSize:'18px',flexShrink:0}}>←</Link>
            <div>
              <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',fontWeight:900,color:'#EDE8F5'}}>Настройки</h1>
              <p style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',color:'rgba(200,185,240,0.35)',marginTop:'2px'}}>{user?.email}</p>
            </div>
          </div>

          {/* Profile */}
          <div className="card" style={{marginBottom:'16px',animationDelay:'0.1s'}}>
            <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'3px',color:'rgba(180,150,255,0.5)',marginBottom:'20px',textTransform:'uppercase'}}>Профиль</div>
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              <div>
                <label style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Имя</label>
                <input className="inp" type="text" placeholder="Ваше имя" value={name} onChange={e=>setName(e.target.value)}/>
              </div>
              <div>
                <label style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Email</label>
                <input className="inp" type="email" value={user?.email} disabled style={{opacity:0.5,cursor:'not-allowed'}}/>
              </div>
              <div>
                <label style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Знак зодиака</label>
                <select className="inp" value={zodiac} onChange={e=>setZodiac(e.target.value)}>
                  <option value="">— Выбрать —</option>
                  {ZODIAC_SIGNS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={handleSave} disabled={saving} style={{padding:'13px',borderRadius:'8px',border:'none',cursor:'pointer',background:saved?'rgba(100,200,80,0.2)':saving?'rgba(150,100,255,0.2)':'linear-gradient(135deg,#6030B0,#9060E0)',fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:saved?'rgba(120,220,80,0.9)':'#EDE8F5',letterSpacing:'1px',transition:'all 0.3s'}}>
                {saved ? '✓ СОХРАНЕНО' : saving ? 'СОХРАНЯЕМ...' : 'СОХРАНИТЬ'}
              </button>
            </div>
          </div>

          {/* Subscription */}
          <div className="card" style={{marginBottom:'16px',animationDelay:'0.2s'}}>
            <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'3px',color:'rgba(180,150,255,0.5)',marginBottom:'20px',textTransform:'uppercase'}}>Подписка</div>
            {isPro ? (
              <div>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
                  <div style={{padding:'6px 14px',borderRadius:'6px',background:'rgba(120,200,80,0.1)',border:'1px solid rgba(120,200,80,0.3)',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'rgba(150,230,100,0.9)',letterSpacing:'1px'}}>⚡ АКТИВНА</div>
                </div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'16px'}}>У вас активная подписка. Все функции разблокированы.</p>
                <button style={{padding:'11px 20px',borderRadius:'8px',border:'1px solid rgba(255,80,80,0.2)',background:'transparent',fontFamily:'"Playfair Display",serif',fontSize:'12px',color:'rgba(255,100,100,0.5)',cursor:'pointer',letterSpacing:'1px'}}>Отменить подписку</button>
              </div>
            ) : (
              <div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'16px'}}>У вас нет активной подписки.</p>
                <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                  <div style={{padding:'16px',borderRadius:'10px',background:'rgba(150,100,255,0.06)',border:'1px solid rgba(150,100,255,0.2)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:700,color:'#EDE8F5'}}>Initiate</div>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:800,color:'rgba(150,120,255,0.9)'}}>£9.99<span style={{fontSize:'13px',fontWeight:400,color:'rgba(200,185,240,0.4)'}}>/мес</span></div>
                    </div>
                    <p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.4)',marginBottom:'12px'}}>Безлимитные консультации · Карта дня · Луна · Гороскоп</p>
                    <Link href="/#pricing" style={{display:'block',padding:'10px',textAlign:'center',borderRadius:'8px',background:'linear-gradient(135deg,#6030B0,#9060E0)',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'1px'}}>Подписаться</Link>
                  </div>
                  <div style={{padding:'16px',borderRadius:'10px',background:'rgba(200,140,255,0.06)',border:'1px solid rgba(200,140,255,0.2)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:700,color:'#EDE8F5'}}>Oracle Pro</div>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:800,color:'rgba(200,150,255,0.9)'}}>£16.99<span style={{fontSize:'13px',fontWeight:400,color:'rgba(200,185,240,0.4)'}}>/мес</span></div>
                    </div>
                    <p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.4)',marginBottom:'12px'}}>Всё из Initiate + PDF · Human Design · AI-память</p>
                    <Link href="/#pricing" style={{display:'block',padding:'10px',textAlign:'center',borderRadius:'8px',background:'linear-gradient(135deg,#8030C0,#C060F0)',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'1px'}}>Подписаться</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Danger zone */}
          <div className="card" style={{animationDelay:'0.3s'}}>
            <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'3px',color:'rgba(255,100,100,0.4)',marginBottom:'20px',textTransform:'uppercase'}}>Аккаунт</div>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              <button onClick={handleLogout} style={{padding:'10px 20px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',fontFamily:'"Playfair Display",serif',fontSize:'12px',color:'rgba(200,185,240,0.4)',cursor:'pointer',letterSpacing:'1px'}}>Выйти</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}