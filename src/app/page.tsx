'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/* ─── ORNAMENT ──────────────────────────────────────────── */
function Ornament() {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'16px',width:'100%'}}>
      <div style={{flex:1,height:'1px',background:'linear-gradient(90deg,transparent,rgba(180,140,255,0.2))'}}/>
      <div style={{color:'rgba(180,140,255,0.35)',fontSize:'14px',letterSpacing:'8px'}}>✦ ✦ ✦</div>
      <div style={{flex:1,height:'1px',background:'linear-gradient(270deg,transparent,rgba(180,140,255,0.2))'}}/>
    </div>
  )
}

/* ─── MODULE CARD ───────────────────────────────────────── */
function ModuleCard({
  icon, title, subtitle, description, price, color, glow, features, delay
}: {
  icon: string; title: string; subtitle: string; description: string
  price: string; color: string; glow: string; features: string[]; delay: number
}) {
  const [hov, setHov] = useState(false)

  return (
    <Link href="/auth/register" style={{textDecoration:'none'}}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}>
      <div style={{
        background: hov ? `rgba(255,255,255,0.06)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hov ? color.replace('1)','0.4)') : 'rgba(255,255,255,0.08)'}`,
        borderRadius:'16px',
        padding:'28px 24px',
        cursor:'pointer',
        transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hov ? `0 24px 60px ${glow}` : '0 4px 20px rgba(0,0,0,0.3)',
        animation:`fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
        position:'relative',
        overflow:'hidden',
      }}>
        {/* Top glow line */}
        <div style={{
          position:'absolute',top:0,left:0,right:0,height:'2px',
          background:`linear-gradient(90deg,transparent,${color.replace('1)','0.8)')},transparent)`,
          opacity: hov ? 1 : 0.4,
          transition:'opacity 0.3s',
        }}/>

        {/* Icon */}
        <div style={{
          fontSize:'42px',marginBottom:'16px',lineHeight:1,
          filter: hov ? `drop-shadow(0 0 16px ${color.replace('1)','0.6)')})` : 'none',
          transition:'filter 0.3s',
          transform: hov ? 'scale(1.1)' : 'scale(1)',
        }}>{icon}</div>

        {/* Title */}
        <div style={{
          fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:800,
          color: hov ? '#FFFFFF' : '#EDE8F5',
          marginBottom:'4px',transition:'color 0.3s',
          letterSpacing:'0.3px',
        }}>{title}</div>

        {/* Subtitle */}
        <div style={{
          fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',
          color: hov ? color.replace('1)','0.9)') : 'rgba(200,180,255,0.45)',
          marginBottom:'14px',transition:'color 0.3s',
        }}>{subtitle}</div>

        {/* Description */}
        <p style={{
          fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.7,
          color:'rgba(210,200,240,0.6)',marginBottom:'18px',
        }}>{description}</p>

        {/* Features */}
        <div style={{marginBottom:'20px'}}>
          {features.map((f,i)=>(
            <div key={i} style={{
              display:'flex',alignItems:'center',gap:'8px',
              padding:'5px 0',
              fontFamily:'"Lora",serif',fontSize:'13px',
              color:'rgba(200,185,240,0.55)',
              borderBottom:'1px solid rgba(255,255,255,0.04)',
            }}>
              <span style={{color:color.replace('1)','0.7)'),fontSize:'8px',flexShrink:0}}>◆</span>
              {f}
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div style={{
          display:'flex',justifyContent:'space-between',alignItems:'center',
          paddingTop:'16px',borderTop:'1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <div style={{
              fontFamily:'"Playfair Display",serif',fontSize:'26px',fontWeight:800,
              color:'#FFFFFF',lineHeight:1,
            }}>{price}</div>
            <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',
              color:'rgba(200,180,255,0.35)',marginTop:'2px'}}>за консультацию</div>
          </div>
          <div style={{
            padding:'10px 20px',borderRadius:'8px',
            background: hov
              ? `linear-gradient(135deg,${color.replace('1)','0.9)')},${color.replace('1)','0.6)')})`
              : 'rgba(255,255,255,0.06)',
            fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,
            color: hov ? '#0C0818' : 'rgba(220,210,255,0.5)',
            transition:'all 0.3s',letterSpacing:'0.5px',
          }}>
            Начать →
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── PRICING CARD ──────────────────────────────────────── */
function PricingCard({name,tagline,price,period,note,features,cta,featured,color,badge}:{
  name:string;tagline:string;price:string;period:string;note?:string
  features:string[];cta:string;featured?:boolean;color:string;badge?:string
}) {
  const [hov,setHov]=useState(false)
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{
      background:featured?'rgba(80,40,140,0.20)':'rgba(255,255,255,0.025)',
      border:`1px solid ${hov||featured?color.replace('1)','0.4)'):'rgba(255,255,255,0.07)'}`,
      borderRadius:'14px',padding:'32px 26px',position:'relative',overflow:'hidden',
      transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)',
      transform:hov?'translateY(-6px)':'translateY(0)',
      boxShadow:hov||featured?`0 20px 60px ${color.replace('1)','0.12)')}`:'none',
    }}>
      {featured&&<div style={{position:'absolute',top:0,left:0,right:0,height:'2px',
        background:`linear-gradient(90deg,transparent,${color.replace('1)','0.8)')},transparent)`}}/>}
      {badge&&<div style={{
        position:'absolute',top:'14px',right:'14px',padding:'4px 12px',borderRadius:'4px',
        background:color.replace('1)','0.15)'),border:`1px solid ${color.replace('1)','0.35)')}`,
        fontFamily:'"Playfair Display",serif',fontSize:'10px',fontWeight:700,
        color:color.replace('1)','0.9)'),letterSpacing:'1px',
      }}>{badge}</div>}
      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,
        letterSpacing:'3px',color:'rgba(200,180,255,0.45)',marginBottom:'8px',textTransform:'uppercase'}}>{name}</div>
      <div style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',
        color:'rgba(220,210,255,0.5)',marginBottom:'20px'}}>{tagline}</div>
      <div style={{marginBottom:'6px'}}>
        <span style={{fontFamily:'"Playfair Display",serif',fontSize:'48px',fontWeight:800,
          color:'#FFFFFF',lineHeight:1}}>{price}</span>
        <span style={{fontFamily:'"Lora",serif',fontSize:'14px',
          color:'rgba(200,180,255,0.4)',marginLeft:'8px'}}>{period}</span>
      </div>
      {note&&<div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',
        color:color.replace('1)','0.8)'),marginBottom:'24px'}}>{note}</div>}
      <div style={{height:'1px',background:'rgba(255,255,255,0.06)',margin:'20px 0'}}/>
      <ul style={{listStyle:'none',marginBottom:'28px',display:'flex',flexDirection:'column',gap:'10px'}}>
        {features.map((f,i)=>(
          <li key={i} style={{display:'flex',alignItems:'flex-start',gap:'10px',
            fontFamily:'"Lora",serif',fontSize:'15px',lineHeight:1.6,
            color:'rgba(220,210,255,0.65)'}}>
            <span style={{color:color.replace('1)','0.7)'),fontSize:'10px',flexShrink:0,marginTop:'4px'}}>◆</span>
            {f}
          </li>
        ))}
      </ul>
      <Link href="/auth/register" style={{
        display:'block',padding:'14px',textAlign:'center',borderRadius:'8px',textDecoration:'none',
        background:featured?`linear-gradient(135deg,${color.replace('1)','0.9)')},${color.replace('1)','0.6)')})`:'transparent',
        border:featured?'none':`1px solid rgba(255,255,255,0.15)`,
        fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,
        color:featured?'#0C0818':'rgba(220,210,255,0.7)',letterSpacing:'0.5px',transition:'all 0.3s',
      }}>{cta}</Link>
    </div>
  )
}

/* ─── PAGE ──────────────────────────────────────────────── */
export default function Home() {
  const [scrolled,setScrolled]=useState(false)
  const [annual,setAnnual]=useState(false)

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>50)
    window.addEventListener('scroll',fn,{passive:true})
    return()=>window.removeEventListener('scroll',fn)
  },[])

  const modules = [
    {
      icon:'🃏', title:'Таро', subtitle:'Расклад на любой вопрос',
      description:'Карты откроют что скрыто. Прошлое, настоящее и будущее — три арканы для вашей ситуации.',
      price:'£3', color:'rgba(201,168,76,1)', glow:'rgba(201,168,76,0.15)',
      features:['Расклад на 1, 3 или 5 карт','Глубокая интерпретация','Практический совет','78 арканов Rider-Waite'],
      delay:100,
    },
    {
      icon:'⭐', title:'Астрология', subtitle:'Карта небес в день рождения',
      description:'Планеты не лгут. Натальный чарт, транзиты и прогноз — всё по вашей дате рождения.',
      price:'£5', color:'rgba(100,180,255,1)', glow:'rgba(100,180,255,0.15)',
      features:['Натальный чарт','Текущие транзиты','Совместимость знаков','Прогноз на месяц'],
      delay:200,
    },
    {
      icon:'🔢', title:'Нумерология', subtitle:'Числа вашей судьбы',
      description:'В имени и дате рождения зашифрован ваш путь. Мирра раскроет вибрационный код.',
      price:'£4', color:'rgba(255,160,80,1)', glow:'rgba(255,160,80,0.15)',
      features:['Число жизненного пути','Число судьбы по имени','Число души','Прогноз на год'],
      delay:300,
    },
    {
      icon:'💫', title:'Совместимость', subtitle:'Анализ двух людей',
      description:'Мария и Дмитрий — что связывает вас на самом деле? Нумерология и астрология пары.',
      price:'£4', color:'rgba(192,112,255,1)', glow:'rgba(192,112,255,0.15)',
      features:['Числовая совместимость','Астро-синастрия','Сильные стороны пары','Зоны роста'],
      delay:400,
    },
  ]

  const plans = annual ? [
    {name:'Seeker',tagline:'Плати за то что нужно',price:'£3–5',period:'за консультацию',
      features:['Таро расклад — £3','Нумерология — £4','Совместимость — £4','Астрология — £5','Без подписки'],
      cta:'Начать бесплатно',color:'rgba(160,130,220,1)'},
    {name:'Initiate',tagline:'Для практикующих',price:'£7.99',period:'/ мес',
      note:'£95.88 / год — экономия £24',
      features:['Безлимитные консультации','Все 4 модуля','История консультаций','Расширенные расклады'],
      cta:'Выбрать Initiate',color:'rgba(130,160,255,1)',badge:'Годовой'},
    {name:'Oracle Pro',tagline:'Полное погружение',price:'£13.99',period:'/ мес',
      note:'£167.88 / год — экономия £36',
      features:['Всё из Initiate','PDF-отчёты','Human Design полный','Приоритет + AI-память'],
      cta:'Выбрать Oracle Pro',featured:true,color:'rgba(200,140,255,1)',badge:'Лучший выбор'},
  ] : [
    {name:'Seeker',tagline:'Плати за то что нужно',price:'£3–5',period:'за консультацию',
      features:['Таро расклад — £3','Нумерология — £4','Совместимость — £4','Астрология — £5','Без подписки'],
      cta:'Начать бесплатно',color:'rgba(160,130,220,1)'},
    {name:'Initiate',tagline:'Для практикующих',price:'£9.99',period:'/ мес',
      features:['Безлимитные консультации','Все 4 модуля','История консультаций','Расширенные расклады'],
      cta:'Выбрать Initiate',color:'rgba(130,160,255,1)'},
    {name:'Oracle Pro',tagline:'Полное погружение',price:'£16.99',period:'/ мес',
      features:['Всё из Initiate','PDF-отчёты','Human Design полный','Приоритет + AI-память'],
      cta:'Выбрать Oracle Pro',featured:true,color:'rgba(200,140,255,1)',badge:'Лучший выбор'},
  ]

  const reviews = [
    {text:'"Расклад таро попал точно в суть. Я сделала то что карты показали — и не пожалела ни разу."',name:'Анна К.',city:'Лондон',stars:5,module:'Таро'},
    {text:'"Нумерологический портрет оказался точнее чем я ожидала. Поняла почему некоторые решения давались так тяжело."',name:'Виктория М.',city:'Манчестер',stars:5,module:'Нумерология'},
    {text:'"Проверила совместимость с мужем — всё как будто с нас написано. Показала ему — он тоже был в шоке."',name:'Елена Р.',city:'Бирмингем',stars:5,module:'Совместимость'},
    {text:'"Астрологический прогноз на месяц сбылся почти полностью. Теперь захожу каждый месяц."',name:'Наталья С.',city:'Эдинбург',stars:5,module:'Астрология'},
    {text:'"Первый расклад был бесплатным — я не ожидала такого качества. Сразу купила подписку."',name:'Марина Л.',city:'Лидс',stars:5,module:'Таро'},
    {text:'"Human Design изменил моё отношение к себе. Наконец-то понимаю почему я такая."',name:'Ольга П.',city:'Бристоль',stars:5,module:'Oracle Pro'},
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,800;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#080510;color:#EDE8F5;overflow-x:hidden;font-family:'Lora',serif}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#080510}
        ::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.3);border-radius:2px}

        body::before{
          content:'';position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.025;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px;
        }

        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.6}}
        @keyframes breathe{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:.8;transform:scale(1.03)}}
        @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
        @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(140,80,255,0.4)}50%{box-shadow:0 0 0 12px rgba(140,80,255,0)}}

        .shimmer{
          background:linear-gradient(90deg,#EDE8F5 0%,#C8B8FF 25%,#FFFFFF 50%,#C8B8FF 75%,#EDE8F5 100%);
          background-size:200% auto;animation:shimmer 4s linear infinite;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }

        .primary-btn{
          display:inline-block;padding:16px 44px;border-radius:8px;
          font-family:'Playfair Display',serif;font-size:15px;font-weight:800;
          color:#0C0818;text-decoration:none;letter-spacing:0.5px;
          background:linear-gradient(135deg,#9060E0,#C080FF,#9060E0);
          background-size:200% 200%;
          box-shadow:0 8px 32px rgba(140,80,240,0.35),0 0 0 0 rgba(140,80,255,0.4);
          animation:pulse 3s ease-in-out infinite;
          transition:transform .3s,box-shadow .3s;
        }
        .primary-btn:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 16px 48px rgba(140,80,240,0.5)}

        .ghost-btn{
          display:inline-block;padding:16px 36px;border:1px solid rgba(255,255,255,0.2);
          border-radius:8px;font-family:'Playfair Display',serif;font-size:15px;font-weight:700;
          color:rgba(220,210,255,0.75);text-decoration:none;letter-spacing:0.5px;
          transition:all .3s;background:transparent;cursor:pointer;
        }
        .ghost-btn:hover{border-color:rgba(180,140,255,0.5);color:rgba(230,220,255,0.95);background:rgba(120,80,200,0.1)}

        .nav-a{font-family:'Playfair Display',serif;font-size:14px;font-weight:500;
          color:rgba(210,200,240,0.5);text-decoration:none;transition:color .25s}
        .nav-a:hover{color:rgba(220,210,255,0.9)}

        details summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center}
        details summary::-webkit-details-marker{display:none}

        .free-badge{
          display:inline-block;padding:8px 20px;border-radius:50px;
          background:linear-gradient(135deg,rgba(100,220,120,0.15),rgba(60,180,80,0.1));
          border:1px solid rgba(100,220,120,0.35);
          font-family:'Playfair Display',serif;font-size:13px;font-weight:700;
          color:rgba(120,230,140,0.9);letter-spacing:1px;
        }

        @media(max-width:900px){
          .modules-grid{grid-template-columns:1fr 1fr!important}
          .plans-grid{grid-template-columns:1fr!important}
          .reviews-grid{grid-template-columns:1fr!important}
          .hnav{display:none!important}
          .pad{padding-left:20px!important;padding-right:20px!important}
        }
        @media(max-width:600px){
          .modules-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* Stars */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:100}).map((_,i)=>(
          <div key={i} style={{
            position:'absolute',
            left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,
            width:`${i%9===0?2:1}px`,height:`${i%9===0?2:1}px`,
            borderRadius:'50%',background:'rgba(230,220,255,0.9)',
            animation:`twinkle ${2.5+i%6}s ease-in-out infinite`,
            animationDelay:`${(i*0.22)%5}s`,
          }}/>
        ))}
        <div style={{position:'absolute',top:'-20%',left:'10%',width:'80vw',height:'80vw',
          maxWidth:'900px',borderRadius:'50%',animation:'breathe 8s ease-in-out infinite',
          background:'radial-gradient(circle,rgba(80,30,160,0.13) 0%,rgba(40,10,80,0.06) 50%,transparent 70%)'}}/>
      </div>

      <div style={{position:'relative',zIndex:10}}>

        {/* ── HEADER ── */}
        <header style={{
          position:'fixed',top:0,left:0,right:0,zIndex:100,
          display:'flex',justifyContent:'space-between',alignItems:'center',
          padding:'15px 52px',
          background:scrolled?'rgba(8,5,16,0.97)':'transparent',
          borderBottom:scrolled?'1px solid rgba(255,255,255,0.06)':'1px solid transparent',
          transition:'all 0.4s',
        }}>
          <div style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:900,
            color:'#EDE8F5',letterSpacing:'1px'}}>
            MYSTIC<span style={{color:'rgba(170,120,255,0.7)',fontSize:'13px',
              fontWeight:400,verticalAlign:'super',marginLeft:'3px'}}>AI</span>
          </div>
          <nav className="hnav" style={{display:'flex',gap:'32px'}}>
            <a href="#modules" className="nav-a">Консультации</a>
            <a href="#pricing" className="nav-a">Тарифы</a>
            <a href="#reviews" className="nav-a">Отзывы</a>
            <a href="#faq" className="nav-a">Вопросы</a>
          </nav>
          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <Link href="/auth/login" className="nav-a">Войти</Link>
            <Link href="/auth/register" className="ghost-btn" style={{padding:'9px 22px',fontSize:'13px'}}>
              Начать
            </Link>
          </div>
        </header>

        {/* ── HERO ── */}
        <section style={{
          padding:'130px 52px 80px',
          textAlign:'center',
          maxWidth:'900px',
          margin:'0 auto',
        }} className="pad">

          {/* Free badge */}
          <div style={{marginBottom:'24px',animation:'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both',opacity:0}}>
            <span className="free-badge">✦ Первый расклад — бесплатно ✦</span>
          </div>

          {/* Main title */}
          <h1 className="shimmer" style={{
            fontFamily:'"Playfair Display",serif',
            fontSize:'clamp(48px,7vw,96px)',
            fontWeight:900,lineHeight:1.05,
            marginBottom:'24px',letterSpacing:'-1px',
            animation:'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both',
          }}>
            Тайны раскрываются
          </h1>

          <h2 style={{
            fontFamily:'"Playfair Display",serif',
            fontSize:'clamp(28px,4vw,52px)',fontWeight:400,
            color:'rgba(200,180,255,0.65)',marginBottom:'28px',
            fontStyle:'italic',lineHeight:1.2,
            animation:'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both',opacity:0,
          }}>
            тем кто осмеливается спросить
          </h2>

          <p style={{
            fontFamily:'"Lora",serif',fontSize:'18px',lineHeight:1.85,
            color:'rgba(210,200,240,0.55)',marginBottom:'40px',maxWidth:'560px',margin:'0 auto 40px',
            animation:'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both',opacity:0,
          }}>
            AI-консультации по Таро, Астрологии, Нумерологии и Совместимости.<br/>
            Первый расклад — бесплатно. Без карты. Прямо сейчас.
          </p>

          <div style={{
            display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',marginBottom:'48px',
            animation:'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both',opacity:0,
          }}>
            <Link href="/auth/register" className="primary-btn">
              Получить бесплатный расклад
            </Link>
            <a href="#modules" className="ghost-btn">Выбрать консультацию</a>
          </div>

          {/* Stats */}
          <div style={{
            display:'flex',gap:'40px',justifyContent:'center',flexWrap:'wrap',
            paddingTop:'32px',borderTop:'1px solid rgba(255,255,255,0.06)',
            animation:'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s both',opacity:0,
          }}>
            {[['2 400+','консультаций'],['4.9 ★','средняя оценка'],['£3','минимальная цена'],['24/7','всегда онлайн']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'26px',fontWeight:800,
                  color:'#FFFFFF'}}>{v}</div>
                <div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',
                  color:'rgba(200,180,255,0.4)',marginTop:'3px'}}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MODULES ── */}
        <section id="modules" style={{padding:'60px 52px 100px'}} className="pad">
          <div style={{maxWidth:'1200px',margin:'0 auto'}}>

            <div style={{textAlign:'center',marginBottom:'52px'}}>
              <Ornament/>
              <h2 style={{
                fontFamily:'"Playfair Display",serif',
                fontSize:'clamp(32px,4vw,56px)',fontWeight:900,
                color:'#FFFFFF',marginTop:'40px',marginBottom:'14px',
              }}>
                Выберите консультацию
              </h2>
              <p style={{fontFamily:'"Lora",serif',fontSize:'17px',fontStyle:'italic',
                color:'rgba(200,180,255,0.45)',maxWidth:'440px',margin:'0 auto'}}>
                Первая — бесплатно. Остальные от £3.
              </p>
            </div>

            <div className="modules-grid" style={{
              display:'grid',
              gridTemplateColumns:'repeat(4,1fr)',
              gap:'20px',
            }}>
              {modules.map((m,i)=><ModuleCard key={i} {...m}/>)}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" style={{
          padding:'80px 52px 100px',
          background:'rgba(255,255,255,0.015)',
        }} className="pad">
          <div style={{maxWidth:'1050px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}><Ornament/></div>
            <div style={{textAlign:'center',margin:'40px 0 44px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',
                fontSize:'clamp(30px,4vw,54px)',fontWeight:900,
                color:'#FFFFFF',marginBottom:'32px'}}>
                Выберите свой путь
              </h2>

              {/* Toggle */}
              <div style={{display:'inline-flex',alignItems:'center',gap:'14px',
                padding:'10px 22px',borderRadius:'50px',
                background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                <span onClick={()=>setAnnual(false)} style={{
                  fontFamily:'"Lora",serif',fontSize:'14px',cursor:'pointer',
                  color:annual?'rgba(200,180,255,0.4)':'rgba(200,180,255,0.9)',transition:'color .3s'}}>
                  Помесячно
                </span>
                <div onClick={()=>setAnnual(p=>!p)} style={{
                  width:'44px',height:'24px',borderRadius:'12px',cursor:'pointer',
                  background:annual?'rgba(140,80,255,0.8)':'rgba(255,255,255,0.12)',
                  position:'relative',transition:'background .3s',border:'1px solid rgba(255,255,255,0.12)',
                }}>
                  <div style={{position:'absolute',top:'3px',left:annual?'22px':'3px',
                    width:'16px',height:'16px',borderRadius:'50%',
                    background:'#EDE8F5',transition:'left .3s'}}/>
                </div>
                <span onClick={()=>setAnnual(true)} style={{
                  fontFamily:'"Lora",serif',fontSize:'14px',cursor:'pointer',
                  color:annual?'rgba(200,180,255,0.9)':'rgba(200,180,255,0.4)',transition:'color .3s'}}>
                  Годовой
                  <span style={{marginLeft:'8px',padding:'2px 8px',borderRadius:'4px',
                    background:'rgba(120,80,200,0.25)',border:'1px solid rgba(150,100,255,0.3)',
                    fontSize:'11px',color:'rgba(190,160,255,0.85)',fontStyle:'normal'}}>до −37%</span>
                </span>
              </div>
            </div>

            <div className="plans-grid" style={{
              display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'18px',
            }}>
              {plans.map((p,i)=><PricingCard key={`${i}-${annual}`} {...p}/>)}
            </div>

            <p style={{textAlign:'center',marginTop:'20px',fontFamily:'"Lora",serif',
              fontSize:'13px',fontStyle:'italic',color:'rgba(180,160,220,0.3)'}}>
              Отмена в любой момент · Первая консультация бесплатно · Stripe
            </p>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section id="reviews" style={{padding:'80px 52px 100px'}} className="pad">
          <div style={{maxWidth:'1200px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}><Ornament/></div>
            <div style={{textAlign:'center',margin:'40px 0 52px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',
                fontSize:'clamp(30px,4vw,54px)',fontWeight:900,color:'#FFFFFF',marginBottom:'12px'}}>
                Говорят те, кто уже спросил
              </h2>
              <p style={{fontFamily:'"Lora",serif',fontSize:'16px',fontStyle:'italic',
                color:'rgba(200,180,255,0.4)'}}>
                Реальные отзывы наших пользователей
              </p>
            </div>

            <div className="reviews-grid" style={{
              display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'18px',
            }}>
              {reviews.map((r,i)=>(
                <div key={i} style={{
                  background:'rgba(255,255,255,0.025)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:'14px',padding:'26px',
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',
                    alignItems:'center',marginBottom:'14px'}}>
                    <div style={{color:'rgba(200,160,80,0.9)',fontSize:'18px',letterSpacing:'2px'}}>
                      {'★'.repeat(r.stars)}
                    </div>
                    <div style={{padding:'3px 10px',borderRadius:'4px',
                      background:'rgba(150,100,255,0.12)',border:'1px solid rgba(150,100,255,0.2)',
                      fontFamily:'"Playfair Display",serif',fontSize:'10px',fontWeight:700,
                      color:'rgba(180,150,255,0.7)',letterSpacing:'1px'}}>{r.module}</div>
                  </div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',
                    lineHeight:1.8,color:'rgba(215,205,245,0.7)',marginBottom:'18px'}}>
                    {r.text}
                  </p>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,
                    color:'rgba(200,180,255,0.65)'}}>{r.name}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',
                    color:'rgba(180,160,220,0.35)',marginTop:'2px'}}>{r.city}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{padding:'80px 52px 100px',background:'rgba(255,255,255,0.015)'}} className="pad">
          <div style={{maxWidth:'680px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}><Ornament/></div>
            <div style={{textAlign:'center',margin:'40px 0 48px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',
                fontSize:'clamp(28px,4vw,50px)',fontWeight:900,color:'#FFFFFF'}}>
                Частые вопросы
              </h2>
            </div>
            {([
              ['Как получить бесплатный расклад?','Зарегистрируйтесь — и сразу получите одну бесплатную консультацию. Карта не нужна. Просто введите email и пароль.'],
              ['Как работает AI-консультация?','Вы задаёте вопрос в чате — AI-наставник отвечает мгновенно. Для таро карты выбираются случайно. Для нумерологии система рассчитывает числа по вашим данным.'],
              ['В чём разница между Initiate и Oracle Pro?','Initiate — безлимитный доступ ко всем 4 модулям. Oracle Pro добавляет PDF-отчёты, полный Human Design анализ, приоритетные ответы и персональную AI-память.'],
              ['Можно ли отменить подписку?','Да, в любой момент через личный кабинет. Доступ сохраняется до конца оплаченного периода.'],
              ['На каком языке консультации?','Полностью на русском языке.'],
            ] as [string,string][]).map(([q,a],i)=>(
              <details key={i} style={{marginBottom:'8px',
                border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px',
                background:'rgba(255,255,255,0.025)',overflow:'hidden'}}>
                <summary style={{padding:'18px 22px',
                  fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:700,
                  color:'rgba(225,215,255,0.85)'}}>
                  {q}
                  <span style={{color:'rgba(180,140,255,0.6)',fontSize:'24px',fontWeight:300}}>+</span>
                </summary>
                <div style={{padding:'0 22px 18px',paddingTop:'14px',
                  fontFamily:'"Lora",serif',fontSize:'15px',lineHeight:1.85,
                  color:'rgba(200,185,240,0.5)',borderTop:'1px solid rgba(255,255,255,0.04)'}}>{a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section style={{padding:'80px 52px 100px',textAlign:'center'}} className="pad">
          <div style={{maxWidth:'580px',margin:'0 auto'}}>
            <div style={{marginBottom:'36px'}}><Ornament/></div>
            <h2 style={{fontFamily:'"Playfair Display",serif',
              fontSize:'clamp(32px,5vw,64px)',fontWeight:900,
              color:'#FFFFFF',marginBottom:'16px',marginTop:'36px',lineHeight:1.05}}>
              Карты ждут вас
            </h2>
            <p style={{fontFamily:'"Lora",serif',fontSize:'18px',fontStyle:'italic',
              color:'rgba(200,180,255,0.45)',marginBottom:'36px',lineHeight:1.8}}>
              Первая консультация бесплатно.<br/>Без карты. Без обязательств.
            </p>
            <Link href="/auth/register" className="primary-btn" style={{fontSize:'16px',padding:'18px 52px'}}>
              Получить бесплатный расклад
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{padding:'28px 52px',borderTop:'1px solid rgba(255,255,255,0.05)',
          display:'flex',justifyContent:'space-between',alignItems:'center',
          flexWrap:'wrap',gap:'14px'}} className="pad">
          <div style={{fontFamily:'"Playfair Display",serif',fontSize:'18px',fontWeight:900,
            color:'rgba(200,180,255,0.35)',letterSpacing:'1px'}}>MYSTIC AI</div>
          <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',
            color:'rgba(180,160,220,0.2)'}}>© 2025 · United Kingdom</div>
          <div style={{display:'flex',gap:'20px'}}>
            {['Privacy','Terms','Support'].map(l=>(
              <a key={l} href="#" className="nav-a" style={{fontSize:'12px'}}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  )
}