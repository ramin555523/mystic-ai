'use client'
import Link from 'next/link'
import { useState } from 'react'

const MODULES = [
  { key:'tarot', name:'Таро', sub:'Расклад на любой вопрос', icon:'🃏', color:'rgba(201,168,76,1)', glow:'rgba(201,168,76,0.15)', desc:'Карты откроют прошлое, настоящее и будущее вашей ситуации. Задайте любой вопрос — о любви, карьере, деньгах или жизненном пути.', href:'/chat/tarot' },
  { key:'astrology', name:'Астрология', sub:'Натальный чарт и транзиты', icon:'⭐', color:'rgba(100,180,255,1)', glow:'rgba(100,180,255,0.15)', desc:'Положение планет в момент вашего рождения раскрывает характер и судьбу. Узнайте что говорят текущие транзиты.', href:'/chat/astrology' },
  { key:'numerology', name:'Нумерология', sub:'Числа вашей судьбы', icon:'🔢', color:'rgba(255,160,80,1)', glow:'rgba(255,160,80,0.15)', desc:'Имя и дата рождения содержат вибрационный код жизни. Узнайте число пути, число судьбы и личный прогноз.', href:'/chat/numerology' },
  { key:'compatibility', name:'Совместимость', sub:'Анализ двух людей', icon:'💫', color:'rgba(192,112,255,1)', glow:'rgba(192,112,255,0.15)', desc:'Введите данные двух людей — нумерология и астрология раскроют глубину связи, сильные стороны и зоны роста пары.', href:'/chat/compatibility' },
]

export default function ChooseModule() {
  const [hov, setHov] = useState<string|null>(null)
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.5}}
      `}</style>

      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:60}).map((_,i)=>(
          <div key={i} style={{position:'absolute',left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,width:'1px',height:'1px',borderRadius:'50%',background:'rgba(230,220,255,0.8)',animation:`twinkle ${3+i%5}s ease-in-out infinite`,animationDelay:`${(i*0.3)%4}s`}}/>
        ))}
        <div style={{position:'absolute',top:'-20%',left:'10%',width:'80vw',height:'80vw',maxWidth:'900px',borderRadius:'50%',background:'radial-gradient(circle,rgba(60,20,120,0.12) 0%,transparent 70%)'}}/>
      </div>

      <div style={{position:'relative',zIndex:10,maxWidth:'900px',margin:'0 auto',padding:'48px 24px 80px'}}>

        <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'48px'}}>
          <Link href="/dashboard" style={{width:'36px',height:'36px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(200,185,240,0.6)',textDecoration:'none',fontSize:'18px',flexShrink:0}}>←</Link>
          <div>
            <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(24px,4vw,40px)',fontWeight:900,color:'#EDE8F5',marginBottom:'4px'}}>Выберите консультанта</h1>
            <p style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',color:'rgba(200,185,240,0.35)'}}>Первые 5 сообщений — бесплатно</p>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(380px,1fr))',gap:'16px'}}>
          {MODULES.map((m,i)=>(
            <Link key={i} href={m.href} style={{textDecoration:'none'}}
              onMouseEnter={()=>setHov(m.key)} onMouseLeave={()=>setHov(null)}>
              <div style={{
                background:hov===m.key?'rgba(255,255,255,0.055)':'rgba(255,255,255,0.03)',
                border:`1px solid ${hov===m.key?m.color.replace('1)','0.35)'):'rgba(255,255,255,0.07)'}`,
                borderRadius:'16px',padding:'28px 24px',
                transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)',
                transform:hov===m.key?'translateY(-6px)':'translateY(0)',
                boxShadow:hov===m.key?`0 20px 50px ${m.glow}`:'none',
                animation:`fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i*0.08}s both`,
                display:'flex',gap:'20px',alignItems:'flex-start',
                position:'relative',overflow:'hidden',
              }}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:`linear-gradient(90deg,transparent,${m.color.replace('1)','0.7)')},transparent)`,opacity:hov===m.key?1:0.3,transition:'opacity 0.3s'}}/>
                <div style={{fontSize:'44px',flexShrink:0,filter:hov===m.key?`drop-shadow(0 0 16px ${m.color.replace('1)','0.6(')})`:'none',transition:'filter 0.3s',transform:hov===m.key?'scale(1.1)':'scale(1)'}}>{m.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:800,color:hov===m.key?'#FFFFFF':'#EDE8F5',marginBottom:'4px',transition:'color 0.3s'}}>{m.name}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:hov===m.key?m.color.replace('1)','0.85)'):'rgba(200,185,240,0.4)',marginBottom:'12px',transition:'color 0.3s'}}>{m.sub}</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.7,color:'rgba(200,185,240,0.55)',marginBottom:'16px'}}>{m.desc}</p>
                  <div style={{display:'inline-block',padding:'8px 20px',borderRadius:'8px',background:hov===m.key?`linear-gradient(135deg,${m.color.replace('1)','0.8)')},${m.color.replace('1)','0.5(')})`:'rgba(255,255,255,0.06)',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:hov===m.key?'#0C0818':'rgba(220,210,255,0.5)',transition:'all 0.3s',letterSpacing:'0.5px'}}>
                    Начать консультацию →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}