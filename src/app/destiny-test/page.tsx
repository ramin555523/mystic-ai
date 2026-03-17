'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DestinyTestPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressText, setProgressText] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      setLoading(false)
    })
  }, [router])

  const handleGenerate = async () => {
    if (!name || !birthDate) return
    setGenerating(true)
    setError('')
    setProgress(0)

    const steps = [
      'Рассчитываем числа матрицы...',
      'Анализируем центральное число...',
      'Раскрываем кармические задачи...',
      'Определяем таланты...',
      'Составляем рекомендации...',
      'Формируем аффирмации...',
      'Собираем отчёт...',
    ]

    let step = 0
    const interval = setInterval(() => {
      if (step < steps.length) {
        setProgressText(steps[step])
        setProgress(Math.round((step + 1) / steps.length * 85))
        step++
      }
    }, 3500)

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: 'destiny',
          name,
          birthDate,
          userId: user.id,
        }),
      })
      const data = await res.json()
      clearInterval(interval)
      if (data.success) {
        setProgress(100)
        setProgressText('Готово!')
        setTimeout(() => setResult(data.html), 500)
      } else {
        setError(data.details || data.error || 'Ошибка генерации')
      }
    } catch {
      clearInterval(interval)
      setError('Ошибка соединения. Попробуйте ещё раз.')
    }
    setGenerating(false)
  }

  const handleOpen = () => {
    if (!result) return
    const win = window.open('', '_blank')
    if (win) { win.document.write(result); win.document.close() }
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
        .inp{width:100%;padding:13px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#EDE8F5;font-family:'Lora',serif;font-size:15px;outline:none;transition:border-color 0.3s}
        .inp:focus{border-color:rgba(192,112,255,0.5)}
        .inp::placeholder{color:rgba(200,185,240,0.3);font-style:italic}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.5}}
      `}</style>

      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:50}).map((_,i)=>(
          <div key={i} style={{position:'absolute',left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,width:'1px',height:'1px',borderRadius:'50%',background:'rgba(230,220,255,0.8)',animation:`twinkle ${3+i%5}s ease-in-out infinite`,animationDelay:`${(i*0.3)%4}s`}}/>
        ))}
        <div style={{position:'absolute',top:'-20%',left:'10%',width:'80vw',height:'80vw',maxWidth:'900px',borderRadius:'50%',background:'radial-gradient(circle,rgba(100,30,180,0.12) 0%,transparent 70%)'}}/>
      </div>

      <div style={{position:'relative',zIndex:10,maxWidth:'640px',margin:'0 auto',padding:'48px 24px 80px'}}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'48px'}}>
          <Link href="/dashboard" style={{width:'36px',height:'36px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(200,185,240,0.6)',textDecoration:'none',fontSize:'18px',flexShrink:0}}>←</Link>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
              <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',fontWeight:900,color:'#EDE8F5'}}>Матрица Судьбы</h1>
              <span style={{padding:'3px 10px',borderRadius:'4px',background:'rgba(100,220,80,0.12)',border:'1px solid rgba(100,220,80,0.3)',fontFamily:'"Playfair Display",serif',fontSize:'10px',fontWeight:700,color:'rgba(120,230,100,0.9)',letterSpacing:'1px'}}>ТЕСТ</span>
            </div>
            <p style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',color:'rgba(200,185,240,0.35)'}}>Тестовый режим · Бесплатно</p>
          </div>
        </div>

        {result ? (
          /* Result */
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(100,200,100,0.2)',borderRadius:'16px',padding:'40px',textAlign:'center',animation:'fadeUp 0.5s ease'}}>
            <div style={{fontSize:'56px',marginBottom:'16px'}}>🔯</div>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',fontWeight:900,color:'#EDE8F5',marginBottom:'10px'}}>Матрица готова!</h2>
            <p style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',color:'rgba(200,185,240,0.5)',marginBottom:'28px',lineHeight:1.7}}>
              Персональный отчёт на 15+ страниц составлен.<br/>Откройте в новой вкладке и распечатайте или сохраните как PDF.
            </p>
            <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
              <button onClick={handleOpen} style={{padding:'13px 28px',borderRadius:'8px',border:'none',cursor:'pointer',background:'linear-gradient(135deg,rgba(150,80,255,0.8),rgba(200,100,255,0.6))',fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'#EDE8F5',letterSpacing:'1px'}}>
                📄 Открыть отчёт
              </button>
              <button onClick={()=>{setResult(null);setName('');setBirthDate('')}} style={{padding:'13px 20px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'transparent',fontFamily:'"Playfair Display",serif',fontSize:'12px',color:'rgba(200,185,240,0.4)',cursor:'pointer'}}>
                Новый отчёт
              </button>
            </div>
          </div>
        ) : generating ? (
          /* Progress */
          <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(192,112,255,0.2)',borderRadius:'16px',padding:'60px 40px',textAlign:'center'}}>
            <div style={{fontSize:'56px',marginBottom:'20px',animation:'pulse 1.5s ease-in-out infinite'}}>🔯</div>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:900,color:'#EDE8F5',marginBottom:'10px'}}>Составляем матрицу...</h2>
            <p style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',color:'rgba(200,185,240,0.5)',marginBottom:'28px'}}>{progressText}</p>
            <div style={{background:'rgba(255,255,255,0.06)',borderRadius:'50px',height:'6px',overflow:'hidden',maxWidth:'360px',margin:'0 auto 10px'}}>
              <div style={{height:'100%',borderRadius:'50px',background:'linear-gradient(90deg,rgba(150,80,255,1),rgba(200,120,255,1))',width:`${progress}%`,transition:'width 0.8s ease'}}/>
            </div>
            <p style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(200,185,240,0.3)'}}>Примерно 3-5 минут</p>
          </div>
        ) : (
          /* Form */
          <>
            {/* Info block */}
            <div style={{background:'rgba(192,112,255,0.05)',border:'1px solid rgba(192,112,255,0.15)',borderRadius:'14px',padding:'24px',marginBottom:'24px'}}>
              <div style={{display:'flex',gap:'14px',marginBottom:'16px'}}>
                <div style={{fontSize:'32px',flexShrink:0}}>🔯</div>
                <div>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:700,color:'#EDE8F5',marginBottom:'6px'}}>Что вы получите</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.7,color:'rgba(200,185,240,0.6)'}}>Персональный отчёт 15+ страниц с полным разбором вашей матрицы судьбы — кармические задачи, таланты, любовь, финансы и аффирмации.</p>
                </div>
              </div>
              {['Центральное число и главная жизненная миссия','Кармические задачи — что нужно проработать в этой жизни','Природные таланты и в чём вы можете преуспеть','Прогноз отношений, финансов и карьеры','Персональные аффирмации и духовные практики'].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:'10px',padding:'6px 0',fontFamily:'"Lora",serif',fontSize:'13px',color:'rgba(200,185,240,0.6)',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <span style={{color:'rgba(192,112,255,0.7)',fontSize:'8px',flexShrink:0,marginTop:'4px'}}>◆</span>{item}
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',padding:'28px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'18px',fontWeight:700,color:'#EDE8F5',marginBottom:'22px'}}>Ваши данные</h2>
              <div style={{display:'flex',flexDirection:'column',gap:'16px',marginBottom:'24px'}}>
                <div>
                  <label style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Полное имя</label>
                  <input className="inp" type="text" placeholder="Имя Фамилия" value={name} onChange={e=>setName(e.target.value)}/>
                </div>
                <div>
                  <label style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'2px',color:'rgba(200,185,240,0.4)',textTransform:'uppercase',display:'block',marginBottom:'8px'}}>Дата рождения</label>
                  <input className="inp" type="text" placeholder="ДД.ММ.ГГГГ (например: 15.06.1990)" value={birthDate} onChange={e=>setBirthDate(e.target.value)}/>
                </div>
              </div>
              {error && (
                <div style={{padding:'12px 16px',borderRadius:'8px',background:'rgba(220,80,80,0.08)',border:'1px solid rgba(220,80,80,0.25)',fontFamily:'"Lora",serif',fontSize:'13px',color:'rgba(255,130,130,0.9)',marginBottom:'16px'}}>{error}</div>
              )}
              <button
                onClick={handleGenerate}
                disabled={!name || !birthDate}
                style={{width:'100%',padding:'14px',borderRadius:'8px',border:'none',cursor:!name||!birthDate?'not-allowed':'pointer',background:!name||!birthDate?'rgba(150,80,255,0.2)':'linear-gradient(135deg,rgba(150,80,255,0.9),rgba(200,120,255,0.7))',fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:!name||!birthDate?'rgba(200,185,240,0.4)':'#EDE8F5',letterSpacing:'1px',transition:'all 0.3s',boxShadow:!name||!birthDate?'none':'0 4px 20px rgba(150,80,255,0.3)'}}
              >
                Создать Матрицу Судьбы — Бесплатно
              </button>
              <p style={{textAlign:'center',marginTop:'10px',fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(200,185,240,0.25)'}}>Тестовый режим · Генерация займёт 3-5 минут</p>
            </div>
          </>
        )}
      </div>
    </>
  )
}