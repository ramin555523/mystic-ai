'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

/* ─── TYPING ANIMATION ──────────────────────────────────── */
function TypingDots() {
  return (
    <span style={{display:'inline-flex',gap:'3px',alignItems:'center',verticalAlign:'middle',marginLeft:'4px'}}>
      {[0,1,2].map(i=>(
        <span key={i} style={{
          width:'5px',height:'5px',borderRadius:'50%',
          background:'rgba(200,180,255,0.7)',
          display:'inline-block',
          animation:`tdot 1.2s ease-in-out infinite`,
          animationDelay:`${i*0.18}s`,
        }}/>
      ))}
    </span>
  )
}

/* ─── LIVE CHAT DEMO ────────────────────────────────────── */
const MSGS = [
  {role:'ai', from:'Селена', text:'Добро пожаловать. Я чувствую вашу энергию. Какой вопрос привёл вас ко мне сегодня?'},
  {role:'user', text:'Стоит ли мне менять работу в этом году?'},
  {role:'ai', from:'Селена', text:'Карты говорят... Башня перевёрнутая · Туз Пентаклей · Колесница. Башня указывает — перемены уже начались внутри вас, но страх удерживает. Туз Пентаклей обещает материальный успех если вы сделаете шаг. Колесница — это победа через волю. Да, год благоприятен для перехода. Но действуйте из силы, не из страха.'},
]

function LiveChat() {
  const [shown, setShown] = useState<number[]>([])
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const delays = [600, 2200, 3800]
    const touts: ReturnType<typeof setTimeout>[] = []
    MSGS.forEach((m,i)=>{
      if(i>0 && m.role==='ai'){
        touts.push(setTimeout(()=>setTyping(true), delays[i]-1000))
        touts.push(setTimeout(()=>{setTyping(false);setShown(p=>[...p,i])}, delays[i]))
      } else {
        touts.push(setTimeout(()=>setShown(p=>[...p,i]), delays[i]))
      }
    })
    return ()=>touts.forEach(clearTimeout)
  },[])

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:'smooth'})
  },[shown,typing])

  return (
    <div style={{
      background:'#0C0818',
      border:'1px solid rgba(255,255,255,0.08)',
      borderRadius:'16px',overflow:'hidden',
      display:'flex',flexDirection:'column',height:'380px',
    }}>
      {/* Header */}
      <div style={{
        padding:'14px 18px',
        background:'rgba(255,255,255,0.03)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        display:'flex',alignItems:'center',gap:'10px',flexShrink:0,
      }}>
        <div style={{
          width:'36px',height:'36px',borderRadius:'50%',flexShrink:0,
          background:'linear-gradient(135deg,#3D1A5C,#7B3FA0)',
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',
        }}>🌙</div>
        <div>
          <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:'#F0EBF8'}}>Селена</div>
          <div style={{fontSize:'11px',color:'rgba(120,220,120,0.85)',display:'flex',alignItems:'center',gap:'4px'}}>
            <span style={{width:'5px',height:'5px',borderRadius:'50%',background:'#78DC78',display:'inline-block'}}/>
            онлайн · Мастер Таро
          </div>
        </div>
        <div style={{marginLeft:'auto'}}>
          <div style={{
            padding:'3px 10px',borderRadius:'4px',
            background:'rgba(150,100,255,0.15)',
            border:'1px solid rgba(150,100,255,0.25)',
            fontFamily:'"Lora",serif',fontSize:'10px',color:'rgba(180,150,255,0.8)',
            letterSpacing:'1px',
          }}>ТАРО</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',padding:'16px 14px',display:'flex',flexDirection:'column',gap:'10px'}}>
        {MSGS.map((m,i)=>shown.includes(i)&&(
          <div key={i} style={{
            display:'flex',
            justifyContent:m.role==='user'?'flex-end':'flex-start',
            animation:'msgSlide 0.35s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{
              maxWidth:'82%',padding:'10px 13px',
              borderRadius:m.role==='user'?'14px 14px 3px 14px':'14px 14px 14px 3px',
              background:m.role==='user'
                ? 'linear-gradient(135deg,rgba(100,60,180,0.9),rgba(60,30,120,0.9))'
                : 'rgba(255,255,255,0.07)',
              border:m.role==='user'?'none':'1px solid rgba(255,255,255,0.07)',
              fontFamily:'"Lora",serif',fontSize:'13.5px',lineHeight:1.65,
              color:m.role==='user'?'rgba(220,210,255,0.95)':'rgba(235,228,255,0.82)',
            }}>{m.text}</div>
          </div>
        ))}
        {typing&&(
          <div style={{display:'flex',animation:'msgSlide 0.3s ease'}}>
            <div style={{padding:'10px 14px',borderRadius:'14px 14px 14px 3px',
              background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.07)'}}>
              <TypingDots/>
            </div>
          </div>
        )}
        <div ref={scrollRef}/>
      </div>

      {/* Input bar */}
      <div style={{
        padding:'10px 14px',flexShrink:0,
        borderTop:'1px solid rgba(255,255,255,0.06)',
        background:'rgba(255,255,255,0.02)',
        display:'flex',gap:'8px',alignItems:'center',
      }}>
        <div style={{
          flex:1,padding:'9px 13px',
          background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.09)',
          borderRadius:'8px',
          fontFamily:'"Lora",serif',fontSize:'13px',
          color:'rgba(200,190,240,0.4)',
          fontStyle:'italic',
        }}>Задайте ваш вопрос...</div>
        <Link href="/auth/register" style={{
          padding:'9px 16px',borderRadius:'8px',flexShrink:0,
          background:'rgba(120,80,220,0.85)',
          fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,
          color:'rgba(230,220,255,0.95)',textDecoration:'none',letterSpacing:'0.5px',
          border:'1px solid rgba(150,100,255,0.4)',
        }}>Начать</Link>
      </div>
    </div>
  )
}

/* ─── ORNAMENTAL DIVIDER ────────────────────────────────── */
function Ornament({light=false}:{light?:boolean}) {
  const c = light ? 'rgba(200,180,255,0.25)' : 'rgba(200,180,255,0.12)'
  return (
    <div style={{display:'flex',alignItems:'center',gap:'16px',margin:'0 auto',width:'100%'}}>
      <div style={{flex:1,height:'1px',background:`linear-gradient(90deg,transparent,${c})`}}/>
      <div style={{color:c,fontSize:'16px',letterSpacing:'8px',fontFamily:'serif'}}>✦ ✦ ✦</div>
      <div style={{flex:1,height:'1px',background:`linear-gradient(270deg,transparent,${c})`}}/>
    </div>
  )
}

/* ─── PRICING CARD ──────────────────────────────────────── */
function PricingCard({
  name,tagline,price,period,priceNote,features,cta,featured,accentColor,badge
}:{
  name:string;tagline:string;price:string;period:string;priceNote?:string
  features:string[];cta:string;featured?:boolean;accentColor:string;badge?:string
}) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{
        background: featured ? 'rgba(80,40,140,0.18)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${hov||featured ? accentColor+'44' : 'rgba(255,255,255,0.07)'}`,
        borderRadius:'14px',padding:'32px 26px',
        position:'relative',overflow:'hidden',
        transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hov||featured ? `0 20px 60px ${accentColor}18` : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {featured && (
        <div style={{
          position:'absolute',top:0,left:0,right:0,height:'2px',
          background:`linear-gradient(90deg,transparent,${accentColor},transparent)`,
        }}/>
      )}
      {badge && (
        <div style={{
          position:'absolute',top:'14px',right:'14px',
          padding:'3px 10px',borderRadius:'4px',
          background:`${accentColor}22`,border:`1px solid ${accentColor}44`,
          fontFamily:'"Playfair Display",serif',fontSize:'9px',fontWeight:700,
          color:accentColor,letterSpacing:'1px',textTransform:'uppercase',
        }}>{badge}</div>
      )}
      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,
        letterSpacing:'3px',color:'rgba(200,180,255,0.45)',marginBottom:'8px',textTransform:'uppercase'}}>
        {name}
      </div>
      <div style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',
        color:'rgba(220,210,255,0.5)',marginBottom:'20px'}}>{tagline}</div>
      <div style={{marginBottom:'6px'}}>
        <span style={{fontFamily:'"Playfair Display",serif',fontSize:'44px',fontWeight:700,
          color:'#F0EBF8',lineHeight:1}}>{price}</span>
        <span style={{fontFamily:'"Lora",serif',fontSize:'13px',
          color:'rgba(200,180,255,0.4)',marginLeft:'6px'}}>{period}</span>
      </div>
      {priceNote && (
        <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',
          color:accentColor,marginBottom:'24px',opacity:0.8}}>{priceNote}</div>
      )}
      <div style={{height:'1px',background:'rgba(255,255,255,0.06)',margin:'20px 0'}}/>
      <ul style={{listStyle:'none',marginBottom:'28px',display:'flex',flexDirection:'column',gap:'10px'}}>
        {features.map((f,i)=>(
          <li key={i} style={{display:'flex',alignItems:'flex-start',gap:'10px',
            fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.6,
            color:'rgba(220,210,255,0.65)'}}>
            <span style={{color:accentColor,fontSize:'10px',flexShrink:0,marginTop:'4px'}}>◆</span>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/auth/register" style={{
        display:'block',padding:'13px',textAlign:'center',
        borderRadius:'8px',textDecoration:'none',
        background: featured ? `linear-gradient(135deg,${accentColor}CC,${accentColor}88)` : 'transparent',
        border: featured ? 'none' : `1px solid rgba(255,255,255,0.15)`,
        fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,
        color: featured ? '#0C0818' : 'rgba(220,210,255,0.7)',
        letterSpacing:'1px',
        transition:'all 0.3s',
      }}>{cta}</Link>
    </div>
  )
}

/* ─── PAGE ──────────────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [billingAnnual, setBillingAnnual] = useState(false)

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>50)
    window.addEventListener('scroll',fn,{passive:true})
    return()=>window.removeEventListener('scroll',fn)
  },[])

  const plans = billingAnnual ? [
    {
      name:'Seeker',tagline:'Плати за то что нужно',price:'£3–5',period:'за консультацию',
      features:['Расклад Таро — £3','Нумерология — £4','Совместимость — £4','Астрология — £5','Без подписки'],
      cta:'Начать бесплатно',accentColor:'rgba(160,130,220,1)',
    },
    {
      name:'Initiate',tagline:'Для практикующих',price:'£7.99',period:'/ месяц',
      priceNote:'£95.88 / год — экономия £24',
      features:['Безлимитные консультации','Таро · Нумерология · Астрология','Совместимость пар','История консультаций','Расширенные расклады'],
      cta:'Выбрать Initiate',featured:false,accentColor:'rgba(130,160,255,1)',badge:'Годовой',
    },
    {
      name:'Oracle Pro',tagline:'Полное погружение',price:'£13.99',period:'/ месяц',
      priceNote:'£167.88 / год — экономия £36',
      features:['Всё из Initiate','PDF-отчёты по запросу','Полный Human Design','Приоритетные ответы','Ранний доступ к новым функциям','Персональный контекст AI'],
      cta:'Выбрать Oracle Pro',featured:true,accentColor:'rgba(200,140,255,1)',badge:'Лучший выбор',
    },
  ] : [
    {
      name:'Seeker',tagline:'Плати за то что нужно',price:'£3–5',period:'за консультацию',
      features:['Расклад Таро — £3','Нумерология — £4','Совместимость — £4','Астрология — £5','Без подписки'],
      cta:'Начать бесплатно',accentColor:'rgba(160,130,220,1)',
    },
    {
      name:'Initiate',tagline:'Для практикующих',price:'£9.99',period:'/ месяц',
      features:['Безлимитные консультации','Таро · Нумерология · Астрология','Совместимость пар','История консультаций','Расширенные расклады'],
      cta:'Выбрать Initiate',featured:false,accentColor:'rgba(130,160,255,1)',
    },
    {
      name:'Oracle Pro',tagline:'Полное погружение',price:'£16.99',period:'/ месяц',
      features:['Всё из Initiate','PDF-отчёты по запросу','Полный Human Design','Приоритетные ответы','Ранний доступ к новым функциям','Персональный контекст AI'],
      cta:'Выбрать Oracle Pro',featured:true,accentColor:'rgba(200,140,255,1)',badge:'Лучший выбор',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{
          background:#080510;
          color:#EDE8F5;
          overflow-x:hidden;
          font-family:'Lora',serif;
        }
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#080510}
        ::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.3);border-radius:2px}

        /* Grain texture overlay */
        body::before{
          content:'';
          position:fixed;inset:0;z-index:0;
          pointer-events:none;
          opacity:0.032;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size:200px 200px;
        }

        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes msgSlide{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-4px);opacity:1}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.65}}
        @keyframes rotateOrb{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes breathe{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:.85;transform:scale(1.02)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}

        .reveal{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both}
        .d1{animation-delay:.1s;opacity:0}
        .d2{animation-delay:.25s;opacity:0}
        .d3{animation-delay:.4s;opacity:0}
        .d4{animation-delay:.55s;opacity:0}
        .d5{animation-delay:.7s;opacity:0}

        .shimmer-text{
          background:linear-gradient(90deg,#EDE8F5 0%,#C8B8FF 30%,#EDE8F5 50%,#C8B8FF 70%,#EDE8F5 100%);
          background-size:200% auto;
          animation:shimmer 5s linear infinite;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .ghost-btn{
          display:inline-block;padding:13px 36px;
          border:1px solid rgba(255,255,255,0.18);
          border-radius:6px;
          font-family:'Playfair Display',serif;font-size:13px;font-weight:700;
          color:rgba(220,210,255,0.7);text-decoration:none;
          letter-spacing:1px;
          transition:all .3s;
          cursor:pointer;background:transparent;
        }
        .ghost-btn:hover{border-color:rgba(180,140,255,0.5);color:rgba(230,220,255,0.95);background:rgba(120,80,200,0.08)}

        .primary-btn{
          display:inline-block;padding:14px 40px;
          border-radius:6px;
          font-family:'Playfair Display',serif;font-size:13px;font-weight:700;
          color:#0C0818;text-decoration:none;letter-spacing:1px;
          background:linear-gradient(135deg,#9060E0,#C080FF,#9060E0);
          background-size:200% 200%;
          box-shadow:0 6px 28px rgba(140,80,240,0.3);
          transition:transform .3s,box-shadow .3s;
        }
        .primary-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(140,80,240,0.45)}
        .primary-btn:active{transform:translateY(0)}

        .nav-a{
          font-family:'Playfair Display',serif;font-size:13px;font-weight:500;
          color:rgba(210,200,240,0.45);text-decoration:none;
          transition:color .25s;letter-spacing:0.3px;
        }
        .nav-a:hover{color:rgba(220,210,255,0.85)}

        details summary{list-style:none;cursor:pointer;
          display:flex;justify-content:space-between;align-items:center}
        details summary::-webkit-details-marker{display:none}

        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr!important}
          .plans-grid{grid-template-columns:1fr!important}
          .readers-grid{grid-template-columns:1fr 1fr!important}
          .hero-title{font-size:44px!important;line-height:1.15!important}
          .pad{padding-left:22px!important;padding-right:22px!important}
        }
        @media(max-width:600px){
          .readers-grid{grid-template-columns:1fr!important}
          .hnav{display:none!important}
        }
      `}</style>

      {/* Stars */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:90}).map((_,i)=>(
          <div key={i} style={{
            position:'absolute',
            left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,
            width:`${i%9===0?2:1}px`,height:`${i%9===0?2:1}px`,
            borderRadius:'50%',background:'rgba(230,220,255,0.9)',
            animation:`twinkle ${2.5+i%6}s ease-in-out infinite`,
            animationDelay:`${(i*0.22)%5}s`,
          }}/>
        ))}
        {/* Purple nebula */}
        <div style={{position:'absolute',top:'-25%',left:'20%',
          width:'80vw',height:'80vw',maxWidth:'900px',maxHeight:'900px',
          borderRadius:'50%',
          background:'radial-gradient(circle,rgba(80,30,160,0.14) 0%,rgba(40,10,80,0.07) 50%,transparent 70%)',
          animation:'breathe 8s ease-in-out infinite',
        }}/>
        <div style={{position:'absolute',bottom:'-15%',right:'10%',
          width:'60vw',height:'60vw',maxWidth:'700px',
          borderRadius:'50%',
          background:'radial-gradient(circle,rgba(20,40,120,0.10) 0%,transparent 65%)',
        }}/>
      </div>

      <div style={{position:'relative',zIndex:10}}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <header style={{
          position:'fixed',top:0,left:0,right:0,zIndex:100,
          display:'flex',justifyContent:'space-between',alignItems:'center',
          padding:'15px 52px',
          background:scrolled?'rgba(8,5,16,0.97)':'transparent',
          borderBottom:scrolled?'1px solid rgba(255,255,255,0.06)':'1px solid transparent',
          transition:'background .4s,border-color .4s',
        }}>
          <div style={{
            fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:900,
            color:'#EDE8F5',letterSpacing:'2px',
            textShadow:'0 0 30px rgba(160,100,255,0.35)',
          }}>
            MYSTIC
            <span style={{color:'rgba(170,120,255,0.7)',fontSize:'12px',marginLeft:'4px',
              fontWeight:400,verticalAlign:'super'}}>AI</span>
          </div>

          <nav className="hnav" style={{display:'flex',gap:'32px'}}>
            <a href="#readers" className="nav-a">Консультанты</a>
            <a href="#pricing" className="nav-a">Тарифы</a>
            <a href="#faq" className="nav-a">Вопросы</a>
          </nav>

          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <Link href="/auth/login" className="nav-a">Войти</Link>
            <Link href="/auth/register" className="ghost-btn" style={{padding:'8px 20px',fontSize:'12px'}}>
              Начать
            </Link>
          </div>
        </header>

        {/* ── HERO ───────────────────────────────────────── */}
        <section style={{
          minHeight:'100vh',
          display:'grid',
          gridTemplateColumns:'1fr 1fr',
          gap:'56px',
          alignItems:'center',
          padding:'120px 52px 80px',
          maxWidth:'1280px',
          margin:'0 auto',
        }} className="hero-grid pad">

          {/* LEFT */}
          <div>
            <div className="reveal d1" style={{
              fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',
              letterSpacing:'4px',color:'rgba(180,150,255,0.5)',
              marginBottom:'20px',textTransform:'uppercase',
            }}>
              — Лондон, 2025 — Персональный оракул —
            </div>

            <h1 className="reveal d2 hero-title shimmer-text" style={{
              fontFamily:'"Playfair Display",serif',
              fontSize:'clamp(44px,5vw,78px)',
              fontWeight:900,
              lineHeight:1.08,
              marginBottom:'24px',
              letterSpacing:'-0.5px',
            }}>
              Тайны<br/>раскрываются<br/>тем кто<br/>осмеливается<br/>спросить
            </h1>

            <p className="reveal d3" style={{
              fontFamily:'"Lora",serif',fontSize:'17px',fontStyle:'italic',
              color:'rgba(210,200,240,0.55)',lineHeight:1.85,
              marginBottom:'36px',maxWidth:'420px',
            }}>
              Таро · Астрология · Нумерология · Совместимость.<br/>
              AI-консультации которые говорят правду.
            </p>

            <div className="reveal d4" style={{display:'flex',gap:'14px',flexWrap:'wrap',marginBottom:'40px'}}>
              <Link href="/auth/register" className="primary-btn">
                Первая консультация бесплатно
              </Link>
              <a href="#readers" className="ghost-btn">Узнать больше</a>
            </div>

            {/* Social proof */}
            <div className="reveal d5" style={{
              display:'flex',gap:'28px',flexWrap:'wrap',
              paddingTop:'28px',
              borderTop:'1px solid rgba(255,255,255,0.06)',
            }}>
              {[['2 400+','консультаций проведено'],['4.9★','средняя оценка'],['£3','минимальная цена']].map(([v,l])=>(
                <div key={l}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:700,
                    color:'#EDE8F5'}}>{v}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',
                    color:'rgba(200,180,255,0.4)',marginTop:'2px'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — chat */}
          <div className="reveal d3">
            <LiveChat/>
            <p style={{textAlign:'center',marginTop:'10px',fontFamily:'"Lora",serif',
              fontSize:'12px',fontStyle:'italic',color:'rgba(180,160,240,0.25)'}}>
              Демонстрация · Зарегистрируйтесь для доступа
            </p>
          </div>
        </section>

        {/* ── READERS ────────────────────────────────────── */}
        <section id="readers" style={{padding:'80px 52px 100px'}} className="pad">
          <div style={{maxWidth:'1200px',margin:'0 auto'}}>
            <div style={{marginBottom:'12px'}}><Ornament/></div>

            <div style={{textAlign:'center',margin:'48px 0 56px'}}>
              <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',
                letterSpacing:'3px',color:'rgba(180,150,255,0.45)',marginBottom:'16px',textTransform:'uppercase'}}>
                Ваши наставники
              </div>
              <h2 style={{fontFamily:'"Playfair Display",serif',
                fontSize:'clamp(32px,4vw,56px)',fontWeight:900,
                color:'#EDE8F5',letterSpacing:'-0.3px',marginBottom:'14px'}}>
                Четыре пути к истине
              </h2>
              <p style={{fontFamily:'"Lora",serif',fontSize:'16px',fontStyle:'italic',
                color:'rgba(200,180,255,0.45)',maxWidth:'460px',margin:'0 auto'}}>
                Каждый специализируется на своём искусстве
              </p>
            </div>

            <div className="readers-grid" style={{
              display:'grid',
              gridTemplateColumns:'repeat(4,1fr)',
              gap:'16px',
            }}>
              {[
                {name:'Селена',art:'Таро',glyph:'☽',color:'rgba(180,130,255,1)',price:'£3',
                  bio:'Мастер чтения карт. Видит нити судьбы там где другие видят лишь символы.',
                  specialties:['Расклад на вопрос','Карта дня','Кельтский крест','Расклад на год']},
                {name:'Орион',art:'Астрология',glyph:'☿',color:'rgba(100,160,255,1)',price:'£5',
                  bio:'Читает натальный чарт как открытую книгу. Планеты говорят с ним напрямую.',
                  specialties:['Натальный чарт','Транзиты','Совместимость','Прогноз']},
                {name:'Мирра',art:'Нумерология',glyph:'✦',color:'rgba(255,160,80,1)',price:'£4',
                  bio:'В каждом числе — судьба. Вычисляет жизненный путь по имени и дате рождения.',
                  specialties:['Число пути','Число судьбы','Число души','Годовой прогноз']},
                {name:'Сатья',art:'Совместимость',glyph:'⊕',color:'rgba(200,120,255,1)',price:'£4',
                  bio:'Раскрывает тайную связь двух людей через нумерологию и астрологию.',
                  specialties:['Совместимость пар','Синастрия','Конфликты и дары','Потенциал союза']},
              ].map((r,i)=>(
                <div key={i} style={{
                  background:'rgba(255,255,255,0.025)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:'12px',padding:'24px 20px',
                  transition:'all 0.4s',cursor:'pointer',
                  position:'relative',overflow:'hidden',
                }}
                onMouseEnter={e=>{
                  const el=e.currentTarget
                  el.style.borderColor=r.color.replace('1)','0.3)')
                  el.style.transform='translateY(-6px)'
                  el.style.boxShadow=`0 20px 50px ${r.color.replace('1)','0.12)')}`
                }}
                onMouseLeave={e=>{
                  const el=e.currentTarget
                  el.style.borderColor='rgba(255,255,255,0.07)'
                  el.style.transform='translateY(0)'
                  el.style.boxShadow='none'
                }}>
                  {/* Glyph */}
                  <div style={{
                    fontFamily:'serif',fontSize:'36px',marginBottom:'14px',
                    color:r.color,lineHeight:1,
                    textShadow:`0 0 20px ${r.color.replace('1)','0.4)')}`,
                  }}>{r.glyph}</div>

                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'18px',fontWeight:700,
                    color:'#EDE8F5',marginBottom:'3px'}}>{r.name}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',
                    color:r.color,marginBottom:'12px',opacity:0.8}}>{r.art}</div>

                  <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.7,
                    color:'rgba(210,200,240,0.5)',marginBottom:'16px'}}>{r.bio}</p>

                  <div style={{height:'1px',background:'rgba(255,255,255,0.05)',marginBottom:'14px'}}/>

                  {r.specialties.map((s,j)=>(
                    <div key={j} style={{
                      fontFamily:'"Lora",serif',fontSize:'12px',
                      color:'rgba(200,185,240,0.5)',
                      padding:'4px 0',display:'flex',alignItems:'center',gap:'8px',
                    }}>
                      <span style={{color:r.color,fontSize:'7px'}}>◆</span>{s}
                    </div>
                  ))}

                  <div style={{
                    marginTop:'18px',paddingTop:'14px',
                    borderTop:'1px solid rgba(255,255,255,0.05)',
                    display:'flex',justifyContent:'space-between',alignItems:'center',
                  }}>
                    <span style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:700,
                      color:'#EDE8F5'}}>{r.price}</span>
                    <Link href="/auth/register" style={{
                      padding:'7px 16px',borderRadius:'6px',
                      background:r.color.replace('1)','0.12)'),
                      border:`1px solid ${r.color.replace('1)','0.3)')}`,
                      fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,
                      color:r.color,textDecoration:'none',letterSpacing:'0.5px',
                    }}>Начать →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ────────────────────────────────────── */}
        <section id="pricing" style={{padding:'80px 52px 100px',
          background:'rgba(255,255,255,0.012)'}} className="pad">
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>

            <div style={{marginBottom:'12px'}}><Ornament/></div>

            <div style={{textAlign:'center',margin:'48px 0 44px'}}>
              <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',
                letterSpacing:'3px',color:'rgba(180,150,255,0.45)',marginBottom:'16px',textTransform:'uppercase'}}>
                Тарифы
              </div>
              <h2 style={{fontFamily:'"Playfair Display",serif',
                fontSize:'clamp(30px,4vw,54px)',fontWeight:900,
                color:'#EDE8F5',marginBottom:'32px'}}>
                Выберите свой путь
              </h2>

              {/* Annual toggle */}
              <div style={{display:'inline-flex',alignItems:'center',gap:'14px',
                padding:'10px 20px',borderRadius:'50px',
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.08)'}}>
                <span style={{fontFamily:'"Lora",serif',fontSize:'13px',
                  color:billingAnnual?'rgba(200,180,255,0.4)':'rgba(200,180,255,0.85)',
                  transition:'color .3s',cursor:'pointer'}}
                  onClick={()=>setBillingAnnual(false)}>
                  Помесячно
                </span>
                <div
                  onClick={()=>setBillingAnnual(p=>!p)}
                  style={{
                    width:'42px',height:'22px',borderRadius:'11px',cursor:'pointer',
                    background:billingAnnual?'rgba(140,80,255,0.8)':'rgba(255,255,255,0.12)',
                    position:'relative',transition:'background .3s',
                    border:'1px solid rgba(255,255,255,0.12)',
                  }}>
                  <div style={{
                    position:'absolute',top:'2px',
                    left:billingAnnual?'21px':'2px',
                    width:'16px',height:'16px',borderRadius:'50%',
                    background:'#EDE8F5',transition:'left .3s',
                  }}/>
                </div>
                <span style={{fontFamily:'"Lora",serif',fontSize:'13px',
                  color:billingAnnual?'rgba(200,180,255,0.85)':'rgba(200,180,255,0.4)',
                  transition:'color .3s',cursor:'pointer'}}
                  onClick={()=>setBillingAnnual(true)}>
                  Годовой
                  <span style={{
                    marginLeft:'8px',padding:'2px 8px',borderRadius:'4px',
                    background:'rgba(120,80,200,0.25)',border:'1px solid rgba(150,100,255,0.3)',
                    fontSize:'10px',color:'rgba(190,160,255,0.85)',fontStyle:'normal',
                  }}>до −37%</span>
                </span>
              </div>
            </div>

            <div className="plans-grid" style={{
              display:'grid',
              gridTemplateColumns:'repeat(3,1fr)',
              gap:'18px',
              alignItems:'start',
            }}>
              {plans.map((p,i)=><PricingCard key={i} {...p}/>)}
            </div>

            <p style={{textAlign:'center',marginTop:'24px',
              fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',
              color:'rgba(180,160,220,0.3)'}}>
              Отмена в любой момент · Первая консультация бесплатно · Оплата через Stripe
            </p>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────── */}
        <section style={{padding:'80px 52px'}} className="pad">
          <div style={{maxWidth:'1000px',margin:'0 auto'}}>
            <div style={{marginBottom:'12px'}}><Ornament/></div>
            <div style={{textAlign:'center',margin:'48px 0 52px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',
                fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,color:'#EDE8F5'}}>
                Говорят те, кто уже спросил
              </h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'18px'}}>
              {[
                {text:'"Расклад таро попал в самую суть ситуации. Я сделала то что карты показали — и не пожалела."',name:'Анна К.',city:'Лондон',stars:5},
                {text:'"Нумерологический портрет оказался точнее чем я ожидала. Теперь понимаю почему некоторые решения давались мне так тяжело."',name:'Виктория М.',city:'Манчестер',stars:5},
                {text:'"Проверила совместимость с мужем — всё как будто с нас написано. Показала ему — он тоже был в шоке."',name:'Елена Р.',city:'Бирмингем',stars:5},
              ].map((t,i)=>(
                <div key={i} style={{
                  background:'rgba(255,255,255,0.025)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:'12px',padding:'24px',
                }}>
                  <div style={{color:'rgba(180,140,255,0.7)',fontSize:'16px',marginBottom:'12px',letterSpacing:'2px'}}>
                    {'★'.repeat(t.stars)}
                  </div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',
                    lineHeight:1.75,color:'rgba(210,200,240,0.65)',marginBottom:'16px'}}>
                    {t.text}
                  </p>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,
                    color:'rgba(200,180,255,0.6)'}}>{t.name}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',
                    color:'rgba(180,160,220,0.35)',marginTop:'2px'}}>{t.city}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────── */}
        <section id="faq" style={{padding:'80px 52px 100px'}} className="pad">
          <div style={{maxWidth:'680px',margin:'0 auto'}}>
            <div style={{marginBottom:'12px'}}><Ornament/></div>
            <div style={{textAlign:'center',margin:'48px 0 48px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',
                fontSize:'clamp(26px,3.5vw,46px)',fontWeight:900,color:'#EDE8F5'}}>
                Вопросы и ответы
              </h2>
            </div>
            {([
              ['Как работает AI-консультация?','Вы задаёте вопрос в чате — наш AI-наставник отвечает мгновенно. Для таро карты выбираются случайно из колоды Rider-Waite. Для нумерологии система рассчитывает числа по вашим данным. Консультация длится столько сколько нужно.'],
              ['Это настоящее предсказание?','Мы позиционируем сервис как инструмент самопознания и рефлексии. AI помогает взглянуть на ситуацию под новым углом — опираясь на богатейшую традицию таро, астрологии и нумерологии. Не категоричное предсказание, а мудрый совет.'],
              ['В чём разница между Initiate и Oracle Pro?','Initiate даёт безлимитный доступ ко всем четырём модулям. Oracle Pro дополнительно включает: подробные PDF-отчёты по запросу, полный анализ Дизайна Человека, приоритетные ответы и персональную память — AI помнит историю ваших консультаций.'],
              ['Как работает годовой тариф?','Годовой тариф — это оплата за 12 месяцев вперёд со скидкой. Initiate Annual стоит £95.88 (экономия £24 vs помесячного). Oracle Pro Annual — £167.88 (экономия £36). Отменить можно в любой момент через личный кабинет.'],
              ['Безопасна ли оплата?','Да. Мы используем Stripe — мировой стандарт безопасных платежей. Мы никогда не храним данные вашей карты.'],
            ] as [string,string][]).map(([q,a],i)=>(
              <details key={i} style={{marginBottom:'8px',
                border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:'10px',background:'rgba(255,255,255,0.02)',overflow:'hidden'}}>
                <summary style={{padding:'17px 20px',
                  fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,
                  color:'rgba(220,210,255,0.8)'}}>
                  {q}
                  <span style={{color:'rgba(180,140,255,0.6)',fontSize:'22px',fontWeight:300}}>+</span>
                </summary>
                <div style={{padding:'0 20px 18px',paddingTop:'14px',
                  fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.8,
                  color:'rgba(200,185,240,0.5)',
                  borderTop:'1px solid rgba(255,255,255,0.04)'}}>{a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA BOTTOM ─────────────────────────────────── */}
        <section style={{padding:'80px 52px 100px',textAlign:'center'}} className="pad">
          <div style={{maxWidth:'600px',margin:'0 auto'}}>
            <div style={{marginBottom:'40px'}}><Ornament light/></div>
            <div style={{fontFamily:'"Playfair Display",serif',
              fontSize:'clamp(30px,4vw,56px)',fontWeight:900,
              color:'#EDE8F5',marginBottom:'18px',lineHeight:1.1}}>
              Карты ждут вас
            </div>
            <p style={{fontFamily:'"Lora",serif',fontSize:'16px',fontStyle:'italic',
              color:'rgba(200,180,255,0.45)',marginBottom:'36px',lineHeight:1.8}}>
              Первая консультация — бесплатно.<br/>Без карты, без обязательств.
            </p>
            <Link href="/auth/register" className="primary-btn">
              Получить бесплатный расклад
            </Link>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────── */}
        <footer style={{
          padding:'28px 52px',
          borderTop:'1px solid rgba(255,255,255,0.05)',
          display:'flex',justifyContent:'space-between',alignItems:'center',
          flexWrap:'wrap',gap:'14px',
        }} className="pad">
          <div style={{fontFamily:'"Playfair Display",serif',fontSize:'17px',fontWeight:900,
            color:'rgba(200,180,255,0.35)',letterSpacing:'1px'}}>MYSTIC AI</div>
          <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',
            color:'rgba(180,160,220,0.2)'}}>© 2025 · United Kingdom</div>
          <div style={{display:'flex',gap:'20px'}}>
            {['Privacy','Terms','Support'].map(l=>(
              <a key={l} href="#" className="nav-a" style={{fontSize:'11px'}}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  )
}