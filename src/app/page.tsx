'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

function Ornament() {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'12px',justifyContent:'center'}}>
      <div style={{height:'1px',width:'60px',background:'linear-gradient(90deg,transparent,rgba(150,100,255,0.4))'}}/>
      <span style={{color:'rgba(150,100,255,0.5)',fontSize:'14px',letterSpacing:'4px'}}>✦ ✦ ✦</span>
      <div style={{height:'1px',width:'60px',background:'linear-gradient(90deg,rgba(150,100,255,0.4),transparent)'}}/>
    </div>
  )
}

function getLandingMoonPhase() {
  const now = new Date()
  const jd = now.getTime() / 86400000 + 2440587.5
  const phase = ((jd - 2451549.5) / 29.53058867 % 1 + 1) % 1
  if (phase < 0.03 || phase > 0.97) return { name: 'Новолуние', icon: '🌑', tip: 'Время новых намерений. Посейте семена желаний сегодня.' }
  if (phase < 0.22) return { name: 'Растущий серп', icon: '🌒', tip: 'Время роста. Начинайте новые проекты — энергия поддерживает.' }
  if (phase < 0.28) return { name: 'Первая четверть', icon: '🌓', tip: 'Время действий. Преодолевайте препятствия — силы на высоте.' }
  if (phase < 0.47) return { name: 'Прибывающая луна', icon: '🌔', tip: 'Усиление намерений. Привлекайте то что хотите в жизнь.' }
  if (phase < 0.53) return { name: 'Полнолуние', icon: '🌕', tip: 'Пик энергии. Завершайте дела и благодарите за достижения.' }
  if (phase < 0.72) return { name: 'Убывающая луна', icon: '🌖', tip: 'Время отпускания. Избавляйтесь от лишнего в жизни.' }
  if (phase < 0.78) return { name: 'Последняя четверть', icon: '🌗', tip: 'Подведение итогов. Завершайте начатое.' }
  return { name: 'Убывающий серп', icon: '🌘', tip: 'Время покоя. Готовьтесь к новому циклу.' }
}

const LANDING_CARDS = [
  { name: 'Луна', number: 'XVIII', meaning: 'Интуиция и скрытые истины выходят на поверхность. Доверяйте внутреннему голосу сегодня.' },
  { name: 'Звезда', number: 'XVII', meaning: 'День надежды и вдохновения. Вселенная поддерживает ваши мечты.' },
  { name: 'Солнце', number: 'XIX', meaning: 'Радость и жизненная сила — ваши союзники сегодня. Действуйте открыто.' },
  { name: 'Мир', number: 'XXI', meaning: 'Завершение цикла. Время праздновать достижения.' },
  { name: 'Колесо Фортуны', number: 'X', meaning: 'Судьба поворачивается в вашу сторону. Будьте готовы к переменам.' },
  { name: 'Влюблённые', number: 'VI', meaning: 'Важный выбор стоит перед вами. Действуйте от сердца.' },
  { name: 'Сила', number: 'VIII', meaning: 'Внутренняя мощь — ваше главное оружие сегодня.' },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [annual, setAnnual] = useState(false)
  const [zodiac, setZodiac] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const moon = getLandingMoonPhase()
  const today = new Date()
  const card = LANDING_CARDS[(today.getDate() + today.getMonth() * 31) % LANDING_CARDS.length]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const HOROSCOPES: Record<string,string> = {
    'Овен':'Марс даёт энергию. Смелые шаги в карьере принесут плоды сегодня.',
    'Телец':'Венера подчёркивает творчество. Финансовая интуиция обострена.',
    'Близнецы':'Меркурий обостряет ум. Один разговор сегодня изменит многое.',
    'Рак':'Луна приносит ясность. Прислушайтесь к интуиции в важных делах.',
    'Лев':'Солнце освещает вашу магнетичность. Шагайте вперёд уверенно.',
    'Дева':'Точность и анализ — ваши союзники. Решение давней проблемы близко.',
    'Весы':'Венера гармонизирует отношения. Переговоры в вашу пользу.',
    'Скорпион':'Плутон углубляет восприятие. Скрытое выходит на поверхность.',
    'Стрелец':'Юпитер расширяет горизонты. Новая возможность стучится в дверь.',
    'Козерог':'Сатурн вознаграждает дисциплину. Признание в карьере возможно.',
    'Водолей':'Уран зажигает оригинальность. Нестандартный подход победит.',
    'Рыбы':'Нептун углубляет интуицию. Духовные занятия благословлены.',
  }
  const ZODIAC_SIGNS = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы']

  const plans = annual ? [
    { name:'Initiate', tagline:'Для практикующих', price:'$7.99', period:'/ мес', note:'$95.88 / год — экономия $24',
      features:['Безлимитные консультации','Все 4 модуля','Карта таро дня','Лунный календарь','Гороскоп дня','История консультаций'],
      cta:'Выбрать Initiate', color:'rgba(130,160,255,1)', badge:'Годовой' },
    { name:'Oracle Pro', tagline:'Полное погружение', price:'$13.99', period:'/ мес', note:'$167.88 / год — экономия $36',
      features:['Всё из Initiate','PDF-отчёты по запросу','Human Design полный','Приоритетные ответы','AI-память консультаций'],
      cta:'Выбрать Oracle Pro', featured:true, color:'rgba(200,140,255,1)', badge:'Лучший выбор' },
  ] : [
    { name:'Initiate', tagline:'Для практикующих', price:'$9.99', period:'/ мес',
      features:['Безлимитные консультации','Все 4 модуля','Карта таро дня','Лунный календарь','Гороскоп дня','История консультаций'],
      cta:'Выбрать Initiate', color:'rgba(130,160,255,1)' },
    { name:'Oracle Pro', tagline:'Полное погружение', price:'$16.99', period:'/ мес',
      features:['Всё из Initiate','PDF-отчёты по запросу','Human Design полный','Приоритетные ответы','AI-память консультаций'],
      cta:'Выбрать Oracle Pro', featured:true, color:'rgba(200,140,255,1)', badge:'Лучший выбор' },
  ]

  const modules = [
    { icon:'🃏', title:'Таро', subtitle:'Расклад на любой вопрос', desc:'Карты откроют скрытое. Прошлое, настоящее и будущее через архетипы 78 арканов.', color:'rgba(201,168,76,1)', href:'/tarot' },
    { icon:'⭐', title:'Астрология', subtitle:'Натальный чарт и транзиты', desc:'Планеты не лгут. Натальный чарт, транзиты и прогноз по вашей дате рождения.', color:'rgba(100,180,255,1)', href:'/astrology' },
    { icon:'🔢', title:'Нумерология', subtitle:'Числа вашей судьбы', desc:'В имени и дате рождения зашифрован ваш путь. Мирра раскроет вибрационный код.', color:'rgba(255,160,80,1)', href:'/numerology' },
    { icon:'💫', title:'Совместимость', subtitle:'Анализ двух людей', desc:'Мария и Дмитрий — что связывает вас? Нумерология и астрология пары.', color:'rgba(192,112,255,1)', href:'/compatibility' },
  ]

  const reviews = [
    { text:'"Расклад таро попал точно в суть. Я сделала то что карты показали — и не пожалела."', name:'Анна К.', city:'Лондон', stars:5, module:'Таро' },
    { text:'"Нумерологический портрет описал меня точнее чем я сама себя знаю. Число жизненного пути 7 — всё совпало."', name:'Мария С.', city:'Киев', stars:5, module:'Нумерология' },
    { text:'"Спросила про совместимость с мужем. Сатья описала наши отношения так точно — мы были в шоке."', name:'Карина М.', city:'Бирмингем', stars:5, module:'Совместимость' },
    { text:'"Астрология дала мне понять почему отношения не складываются. Теперь знаю что искать в партнёре."', name:'Юлия В.', city:'Манчестер', stars:5, module:'Астрология' },
    { text:'"Годовой прогноз купила скептически. Прошло 3 месяца — всё что было написано про январь сбылось."', name:'Ольга Д.', city:'Эдинбург', stars:5, module:'Годовой Прогноз' },
    { text:'"Заказала Матрицу Судьбы — 35 страниц про меня, точно в точку. Сразу поняла повторяющиеся паттерны."', name:'Светлана П.', city:'Глазго', stars:5, module:'Матрица Судьбы' },
  ]

  const faqs = [
    ['Это реальный астролог или AI?', 'Mystic AI использует искусственный интеллект — но с глубокими знаниями астрологии, нумерологии и таро. Наши AI-консультанты работают 24/7 и дают персональные ответы на ваши вопросы.'],
    ['Сколько бесплатных сообщений?', 'При регистрации вы получаете 5 бесплатных сообщений. Этого достаточно чтобы попробовать любой из 4 модулей.'],
    ['Можно ли отменить подписку?', 'Да, в любой момент через личный кабинет. Доступ сохраняется до конца оплаченного периода.'],
    ['Как работают премиум отчёты?', 'Вы вводите имя и дату рождения — AI составляет персональный PDF-отчёт за 5-10 минут. Оплата разовая, без подписки.'],
    ['На каком языке консультации?', 'Полностью на русском языке.'],
    ['Насколько точны расчёты?', 'Все числовые расчёты (возраст, знак зодиака, числа нумерологии, матрица судьбы) выполняются программно — без ошибок.'],
    ['Как работают премиум отчёты?', 'Вы вводите имя и дату рождения — AI составляет персональный PDF-отчёт за 5-10 минут. Матрица Судьбы и Натальная карта — 15-18 страниц, Годовой прогноз — 30-40 страниц.'],
    ['Есть ли мобильное приложение?', 'Сайт полностью оптимизирован для мобильных браузеров. Нативное приложение в разработке.'],
    ['Что если я не удовлетворена результатом?', 'Напишите нам на support@mystic-ai.app — мы разберём ситуацию и при необходимости повторим консультацию.'],
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif;overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.2);border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.5}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes shimmer{0%{opacity:.5}50%{opacity:1}100%{opacity:.5}}
        .nav-a{font-family:'Playfair Display',serif;font-size:14px;color:rgba(200,185,240,0.5);text-decoration:none;transition:color .25s;letter-spacing:.3px}
        .nav-a:hover{color:#EDE8F5}
        .module-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px 24px;text-decoration:none;display:block;transition:all 0.35s;position:relative;overflow:hidden}
        .module-card:hover{transform:translateY(-6px)}
        @media(max-width:900px){.modules-grid{grid-template-columns:1fr 1fr!important}.top-grid{grid-template-columns:1fr!important}.plans-grid{grid-template-columns:1fr!important}}
        @media(max-width:600px){.modules-grid{grid-template-columns:1fr!important}.pad{padding-left:20px!important;padding-right:20px!important}}
      `}</style>

      {/* Stars */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:80}).map((_,i)=>(
          <div key={i} style={{position:'absolute',left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,width:'1px',height:'1px',borderRadius:'50%',background:'rgba(230,220,255,0.9)',animation:`twinkle ${3+i%5}s ease-in-out infinite`,animationDelay:`${(i*0.3)%4}s`}}/>
        ))}
        <div style={{position:'absolute',top:'-15%',left:'15%',width:'70vw',height:'70vw',maxWidth:'800px',borderRadius:'50%',background:'radial-gradient(circle,rgba(60,20,120,0.12) 0%,transparent 70%)'}}/>
        <div style={{position:'absolute',bottom:'-10%',right:'10%',width:'50vw',height:'50vw',maxWidth:'600px',borderRadius:'50%',background:'radial-gradient(circle,rgba(80,20,100,0.08) 0%,transparent 70%)'}}/>
      </div>

      <div style={{position:'relative',zIndex:10}}>

        {/* NAV */}
        <header style={{
          position:'fixed',top:0,left:0,right:0,zIndex:100,
          padding:'16px 52px',
          background:scrolled?'rgba(8,5,16,0.97)':'transparent',
          backdropFilter:scrolled?'blur(20px)':'none',
          borderBottom:scrolled?'1px solid rgba(255,255,255,0.07)':'none',
          transition:'all 0.4s',
          display:'flex',alignItems:'center',justifyContent:'space-between',gap:'20px',
        }} className="pad">
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:900,color:'rgba(200,180,255,0.6)',textDecoration:'none',letterSpacing:'1px',flexShrink:0}}>
            MYSTIC<span style={{fontSize:'12px',fontWeight:400,verticalAlign:'super',marginLeft:'2px',color:'rgba(150,100,255,0.5)'}}>AI</span>
          </Link>
          <nav style={{display:'flex',gap:'24px',alignItems:'center'}}>
            {[['Таро','/tarot'],['Астрология','/astrology'],['Нумерология','/numerology'],['Совместимость','/compatibility']].map(([l,h])=>(
              <Link key={l} href={h} className="nav-a">{l}</Link>
            ))}
            {/* Premium dropdown */}
            <div ref={dropdownRef} style={{position:'relative'}}>
              <button onClick={() => setDropdownOpen(p => !p)} style={{
                background:dropdownOpen?'rgba(150,80,255,0.15)':'rgba(150,80,255,0.08)',
                border:`1px solid ${dropdownOpen?'rgba(150,80,255,0.5)':'rgba(150,80,255,0.2)'}`,
                borderRadius:'6px',padding:'6px 14px',cursor:'pointer',
                fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,
                color:'rgba(200,160,255,0.9)',display:'flex',alignItems:'center',gap:'6px',transition:'all 0.2s',
              }}>
                ✦ Премиум <span style={{fontSize:'10px',transition:'transform 0.2s',transform:dropdownOpen?'rotate(180deg)':'rotate(0deg)'}}>▾</span>
              </button>
              {dropdownOpen && (
                <div style={{position:'absolute',top:'calc(100% + 10px)',left:'50%',transform:'translateX(-50%)',width:'320px',background:'rgba(10,6,24,0.98)',border:'1px solid rgba(150,80,255,0.2)',borderRadius:'14px',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.6)',zIndex:200}}>
                  <div style={{padding:'12px 16px 8px',borderBottom:'1px solid rgba(255,255,255,0.06)',fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'3px',color:'rgba(180,140,255,0.5)',textTransform:'uppercase'}}>Персональные PDF-отчёты</div>
                  {[{icon:'🔯',name:'Матрица Судьбы',desc:'Кармические задачи и предназначение',price:'$34.99',color:'rgba(192,112,255,1)'},
                    {icon:'⭐',name:'Натальная Карта',desc:'Полный астрологический портрет',price:'$34.99',color:'rgba(100,180,255,1)'},
                    {icon:'🌟',name:'Годовой Прогноз',desc:'Прогноз по всем сферам на год',price:'$89.99',color:'rgba(255,160,60,1)'},
                  ].map((item,i)=>(
                    <Link key={i} href="#premium-reports" onClick={()=>setDropdownOpen(false)} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 16px',borderBottom:i<2?'1px solid rgba(255,255,255,0.05)':'none',textDecoration:'none',transition:'background 0.2s'}}
                      onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,0.04)'}
                      onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.background='transparent'}>
                      <div style={{width:'38px',height:'38px',borderRadius:'10px',flexShrink:0,background:item.color.replace('1)','0.12)'),border:`1px solid ${item.color.replace('1)','0.25)')}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>{item.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'#EDE8F5',marginBottom:'2px'}}>{item.name}</div>
                        <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(200,185,240,0.4)'}}>{item.desc}</div>
                      </div>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:800,color:item.color.replace('1)','0.9)'),flexShrink:0}}>{item.price}</div>
                    </Link>
                  ))}
                  <div style={{padding:'10px 16px',background:'rgba(150,80,255,0.05)',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                    <Link href="#premium-reports" onClick={()=>setDropdownOpen(false)} style={{display:'block',textAlign:'center',padding:'9px',borderRadius:'8px',background:'linear-gradient(135deg,rgba(120,60,220,0.8),rgba(180,100,255,0.6))',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'1px'}}>Смотреть все →</Link>
                  </div>
                </div>
              )}
            </div>
            <a href="#pricing" className="nav-a">Тарифы</a>
            <a href="#reviews" className="nav-a">Отзывы</a>
            <a href="#faq" className="nav-a">Вопросы</a>
          </nav>
          <div style={{display:'flex',gap:'10px',alignItems:'center',flexShrink:0}}>
            <Link href="/auth/login" className="nav-a">Войти</Link>
            <Link href="/auth/register" style={{padding:'8px 20px',borderRadius:'6px',background:'linear-gradient(135deg,rgba(120,60,200,0.9),rgba(180,100,255,0.7))',fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'0.5px',boxShadow:'0 4px 16px rgba(120,60,200,0.3)'}}>Начать</Link>
          </div>
        </header>

        {/* HERO */}
        <section style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'120px 52px 80px',position:'relative'}} className="pad">
          <div style={{maxWidth:'800px',margin:'0 auto'}}>
            <div style={{animation:'fadeUp 0.6s ease both'}}>
              <Ornament/>
              <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(42px,7vw,90px)',fontWeight:900,color:'#FFFFFF',lineHeight:1.05,margin:'32px 0 20px',letterSpacing:'-1px'}}>
                Тайны<br/><span style={{background:'linear-gradient(135deg,rgba(180,140,255,0.9),rgba(120,80,220,0.9))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>раскрываются</span>
              </h1>
              <p style={{fontFamily:'"Lora",serif',fontSize:'clamp(16px,2vw,20px)',fontStyle:'italic',color:'rgba(210,200,245,0.6)',maxWidth:'560px',margin:'0 auto 40px',lineHeight:1.85}}>
                AI-консультанты по таро, астрологии, нумерологии и совместимости. Персональные ответы на ваши вопросы — 24/7.
              </p>
              <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap',marginBottom:'48px'}}>
                <Link href="/auth/register" style={{padding:'15px 36px',borderRadius:'8px',background:'linear-gradient(135deg,rgba(150,100,255,0.9),rgba(100,60,200,0.8))',fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'0.5px',boxShadow:'0 4px 30px rgba(120,60,220,0.4)'}}>
                  Начать бесплатно
                </Link>
                <a href="#modules" style={{padding:'15px 32px',borderRadius:'8px',border:'1px solid rgba(150,100,255,0.3)',fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'rgba(180,150,255,0.8)',textDecoration:'none'}}>
                  Узнать больше
                </a>
              </div>
              <div style={{display:'flex',gap:'32px',justifyContent:'center',flexWrap:'wrap'}}>
                {[['2400+','консультаций'],['4.9 ★','средняя оценка'],['5','бесплатных сообщений'],['24/7','всегда онлайн']].map(([v,l])=>(
                  <div key={l} style={{textAlign:'center'}}>
                    <div style={{fontFamily:'"Playfair Display",serif',fontSize:'26px',fontWeight:800,color:'rgba(180,150,255,0.9)'}}>{v}</div>
                    <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(200,185,240,0.35)',marginTop:'3px'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* DAILY PREVIEW */}
        <section style={{padding:'0 52px 80px',maxWidth:'1200px',margin:'0 auto'}} className="pad">
          <div style={{textAlign:'center',marginBottom:'40px'}}>
            <Ornament/>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(24px,3.5vw,44px)',fontWeight:900,color:'#FFFFFF',marginTop:'32px',marginBottom:'10px'}}>Что говорят звёзды сегодня</h2>
            <p style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',color:'rgba(200,180,255,0.4)'}}>Доступны подписчикам каждый день</p>
          </div>
          <div className="top-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
            {/* Card */}
            <div style={{background:'rgba(201,168,76,0.04)',border:'1px solid rgba(201,168,76,0.18)',borderRadius:'16px',padding:'28px 24px',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',minHeight:'320px'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.6),transparent)'}}/>
              <div style={{marginBottom:'14px'}}>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'17px',fontWeight:900,color:'#EDE8F5',marginBottom:'3px'}}>Карта Таро Дня</div>
                <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(201,168,76,0.55)'}}>Послание на сегодня</div>
              </div>
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px',marginBottom:'16px'}}>
                <div style={{fontSize:'32px'}}>🃏</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:900,color:'#C9A84C',textAlign:'center'}}>{card.name}</div>
                <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(201,168,76,0.45)'}}>Аркан {card.number}</div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.7,color:'rgba(220,210,245,0.6)',fontStyle:'italic',textAlign:'center',marginTop:'6px'}}>{card.meaning}</p>
              </div>
              <Link href="/auth/register" style={{display:'block',padding:'10px',textAlign:'center',borderRadius:'8px',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.25)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(201,168,76,0.85)',textDecoration:'none',letterSpacing:'1px'}}>Получить доступ →</Link>
            </div>
            {/* Moon */}
            <div style={{background:'rgba(150,100,255,0.04)',border:'1px solid rgba(150,100,255,0.18)',borderRadius:'16px',padding:'28px 24px',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',minHeight:'320px'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(150,100,255,0.6),transparent)'}}/>
              <div style={{marginBottom:'14px'}}>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'17px',fontWeight:900,color:'#EDE8F5',marginBottom:'3px'}}>Лунный Календарь</div>
                <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(150,100,255,0.55)'}}>Фаза луны и энергия дня</div>
              </div>
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px',marginBottom:'16px'}}>
                <div style={{fontSize:'40px'}}>{moon.icon}</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:900,color:'#EDE8F5',textAlign:'center'}}>{moon.name}</div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.7,color:'rgba(220,210,245,0.6)',fontStyle:'italic',textAlign:'center',marginTop:'6px'}}>{moon.tip}</p>
              </div>
              <Link href="/auth/register" style={{display:'block',padding:'10px',textAlign:'center',borderRadius:'8px',background:'rgba(150,100,255,0.1)',border:'1px solid rgba(150,100,255,0.25)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(180,140,255,0.85)',textDecoration:'none',letterSpacing:'1px'}}>Получить доступ →</Link>
            </div>
            {/* Horoscope */}
            <div style={{background:'rgba(100,180,255,0.04)',border:'1px solid rgba(100,180,255,0.18)',borderRadius:'16px',padding:'28px 24px',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',minHeight:'320px'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(100,180,255,0.6),transparent)'}}/>
              <div style={{marginBottom:'14px'}}>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'17px',fontWeight:900,color:'#EDE8F5',marginBottom:'3px'}}>Гороскоп Дня</div>
                <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(100,180,255,0.55)'}}>Персональный астропрогноз</div>
              </div>
              <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:'10px',marginBottom:'16px'}}>
                {!zodiac ? (
                  <>
                    <div style={{textAlign:'center'}}><div style={{fontSize:'32px',marginBottom:'8px'}}>⭐</div><p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.5)',lineHeight:1.65}}>Ежедневный прогноз по вашему знаку зодиака</p></div>
                    <select value={zodiac} onChange={e=>setZodiac(e.target.value)} style={{width:'100%',padding:'9px 12px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(100,180,255,0.25)',borderRadius:'8px',color:'#EDE8F5',fontFamily:'"Lora",serif',fontSize:'14px',outline:'none',cursor:'pointer'}}>
                      <option value="">— Выбрать знак —</option>
                      {ZODIAC_SIGNS.map(s=><option key={s} value={s} style={{background:'#1A0F3A'}}>{s}</option>)}
                    </select>
                  </>
                ) : (
                  <>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'17px',fontWeight:700,color:'#64B4FF'}}>{zodiac}</div>
                      <button onClick={()=>setZodiac('')} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(200,185,240,0.3)',fontSize:'20px',lineHeight:1}}>×</button>
                    </div>
                    <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.7,color:'rgba(220,210,245,0.65)',fontStyle:'italic'}}>{HOROSCOPES[zodiac]}</p>
                  </>
                )}
              </div>
              <Link href="/auth/register" style={{display:'block',padding:'10px',textAlign:'center',borderRadius:'8px',background:'rgba(100,180,255,0.1)',border:'1px solid rgba(100,180,255,0.25)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(100,180,255,0.85)',textDecoration:'none',letterSpacing:'1px'}}>{zodiac?'Полный прогноз →':'Попробовать →'}</Link>
            </div>
          </div>
          <p style={{textAlign:'center',marginTop:'14px',fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(180,160,220,0.25)'}}>
            ✦ Карта дня · Лунный календарь · Гороскоп — доступны каждый день с подпиской от $9.99/мес
          </p>
        </section>

        {/* MODULES */}
        <section id="modules" style={{padding:'80px 52px 100px',background:'rgba(255,255,255,0.015)'}} className="pad">
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}><Ornament/></div>
            <div style={{textAlign:'center',margin:'32px 0 48px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:900,color:'#FFFFFF',marginBottom:'14px'}}>Выберите консультацию</h2>
              <p style={{fontFamily:'"Lora",serif',fontSize:'17px',fontStyle:'italic',color:'rgba(200,180,255,0.45)'}}>Первая консультация — бесплатно</p>
            </div>
            <div className="modules-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px'}}>
              {modules.map((m,i)=>(
                <Link key={i} href={m.href} className="module-card"
                  style={{borderTop:`2px solid ${m.color.replace('1)','0.5)')}`}}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.boxShadow=`0 20px 50px ${m.color.replace('1)','0.12)')}`;el.style.borderColor=m.color.replace('1)','0.35)')}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.boxShadow='none';el.style.borderColor='rgba(255,255,255,0.07)'}}>
                  <div style={{fontSize:'36px',marginBottom:'14px'}}>{m.icon}</div>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'18px',fontWeight:800,color:'#EDE8F5',marginBottom:'5px'}}>{m.title}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:m.color.replace('1)','0.7)'),marginBottom:'10px'}}>{m.subtitle}</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.7,color:'rgba(200,185,240,0.5)',marginBottom:'18px'}}>{m.desc}</p>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:m.color.replace('1)','0.7)')}}>Подробнее →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* PREMIUM REPORTS */}
        <section id="premium-reports" style={{padding:'80px 52px 100px'}} className="pad">
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}><Ornament/></div>
            <div style={{textAlign:'center',margin:'32px 0 48px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:900,color:'#FFFFFF',marginBottom:'14px'}}>Премиум Отчёты</h2>
              <p style={{fontFamily:'"Lora",serif',fontSize:'17px',fontStyle:'italic',color:'rgba(200,180,255,0.45)',maxWidth:'500px',margin:'0 auto'}}>Персональные PDF-отчёты на 15-40 страниц. Готовы за 5-10 минут.</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
              {[
                {icon:'🔯',name:'Матрица Судьбы',price:'$34.99',pages:'15-18 стр',color:'rgba(192,112,255,1)',
                  desc:'Кармические задачи, таланты и предназначение через числовой код даты рождения.',
                  includes:['Центральное число и главная жизненная миссия','Кармические задачи: что нужно проработать','Природные таланты и скрытые ресурсы','Паттерны в любви и отношениях','Финансовый поток и путь к достатку','Карьера: где вы можете преуспеть','Персональные аффирмации и практики']},
                {icon:'⭐',name:'Натальная Карта',price:'$34.99',pages:'15-18 стр',color:'rgba(100,180,255,1)',
                  desc:'Полный астрологический портрет личности: характер, эмоции, любовь, карьера и кармическая миссия.',
                  includes:['Солнечный знак — ядро характера','Лунный знак — эмоциональная природа','Венера и Марс — любовь и действие','Юпитер и Сатурн — удача и испытания','Кармические узлы и жизненная миссия','Текущие транзиты и их влияние','Рекомендации по всем сферам жизни']},
                {icon:'🌟',name:'Годовой Прогноз',price:'$89.99',pages:'30-40 стр',color:'rgba(255,160,60,1)',featured:true,
                  desc:'Ультра-премиум: астрология + нумерология + Матрица Судьбы. Подробный прогноз по каждому месяцу года.',
                  includes:['Общая энергия и тема года','Любовь и отношения — прогноз','Карьера и финансы — лучшее время','Здоровье и жизненная энергия','Прогноз по каждому из 12 месяцев','Матрица Судьбы в контексте года','Нумерологический годовой цикл','Духовные практики и аффирмации']},
              ].map((r,i)=>(
                <div key={i} style={{background:(r as any).featured?'rgba(255,140,40,0.04)':'rgba(255,255,255,0.025)',border:`1px solid ${r.color.replace('1)','0.18)')}`,borderRadius:'16px',overflow:'hidden',display:'grid',gridTemplateColumns:'1fr 1fr',position:'relative',transition:'all 0.3s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=r.color.replace('1)','0.35)');(e.currentTarget as HTMLDivElement).style.boxShadow=`0 20px 60px ${r.color.replace('1)','0.08)')}`}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=r.color.replace('1)','0.18)');(e.currentTarget as HTMLDivElement).style.boxShadow='none'}}>
                  {(r as any).featured && <div style={{position:'absolute',top:'14px',right:'14px',padding:'4px 14px',borderRadius:'4px',background:'rgba(255,160,40,0.15)',border:'1px solid rgba(255,160,40,0.4)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(255,180,80,0.95)',letterSpacing:'1px'}}>ULTRA PREMIUM</div>}
                  <div style={{padding:'36px 40px',borderRight:'1px solid rgba(255,255,255,0.06)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'16px'}}>
                      <div style={{fontSize:'36px',filter:`drop-shadow(0 0 12px ${r.color.replace('1)','0.4)')})`}}>{r.icon}</div>
                      <div>
                        <div style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:900,color:'#EDE8F5'}}>{r.name}</div>
                        <div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:r.color.replace('1)','0.65)')}}>{r.pages} · 5-10 минут</div>
                      </div>
                    </div>
                    <p style={{fontFamily:'"Lora",serif',fontSize:'15px',lineHeight:1.85,color:'rgba(210,200,240,0.65)',marginBottom:'20px'}}>{r.desc}</p>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:'20px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
                      <div>
                        <div style={{fontFamily:'"Playfair Display",serif',fontSize:'32px',fontWeight:900,color:'#EDE8F5'}}>{r.price}</div>
                        {(r as any).featured && <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(200,185,240,0.3)',marginTop:'2px'}}>вместо $114.97 за три</div>}
                      </div>
                      <Link href="/auth/register" style={{padding:'12px 24px',borderRadius:'8px',background:`linear-gradient(135deg,${r.color.replace('1)','0.85)')},${r.color.replace('1)','0.6)')})`,fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'#0C0818',textDecoration:'none',letterSpacing:'0.5px'}}>Заказать →</Link>
                    </div>
                  </div>
                  <div style={{padding:'36px 40px'}}>
                    <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'3px',color:r.color.replace('1)','0.5)'),textTransform:'uppercase',marginBottom:'16px'}}>Что входит</div>
                    {r.includes.map((item,j)=>(
                      <div key={j} style={{display:'flex',gap:'10px',padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',fontFamily:'"Lora",serif',fontSize:'14px',color:'rgba(210,200,240,0.6)'}}>
                        <span style={{color:r.color.replace('1)','0.7)'),fontSize:'8px',flexShrink:0,marginTop:'5px'}}>◆</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{padding:'80px 52px 100px',background:'rgba(255,255,255,0.015)'}} className="pad">
          <div style={{maxWidth:'900px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}><Ornament/></div>
            <div style={{textAlign:'center',margin:'32px 0 16px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:900,color:'#FFFFFF',marginBottom:'14px'}}>Выберите свой путь</h2>
            </div>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'16px',marginBottom:'40px'}}>
              <span style={{fontFamily:'"Lora",serif',fontSize:'14px',color:!annual?'#EDE8F5':'rgba(200,185,240,0.4)'}}>Помесячно</span>
              <button onClick={()=>setAnnual(p=>!p)} style={{width:'48px',height:'26px',borderRadius:'13px',background:annual?'rgba(150,100,255,0.6)':'rgba(255,255,255,0.1)',border:'none',cursor:'pointer',position:'relative',transition:'background 0.3s'}}>
                <div style={{position:'absolute',top:'3px',left:annual?'25px':'3px',width:'20px',height:'20px',borderRadius:'50%',background:'#EDE8F5',transition:'left 0.3s'}}/>
              </button>
              <span style={{fontFamily:'"Lora",serif',fontSize:'14px',color:annual?'#EDE8F5':'rgba(200,185,240,0.4)'}}>Годовой</span>
              {annual && <span style={{padding:'3px 10px',borderRadius:'4px',background:'rgba(120,200,80,0.15)',border:'1px solid rgba(120,200,80,0.35)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(150,230,100,0.9)',letterSpacing:'1px'}}>до -20%</span>}
            </div>
            <div className="plans-grid" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'20px'}}>
              {plans.map((p,i)=>(
                <div key={i} style={{padding:'36px 32px',background:(p as any).featured?'rgba(150,100,255,0.06)':'rgba(255,255,255,0.025)',border:`1px solid ${(p as any).featured?'rgba(150,100,255,0.35)':'rgba(255,255,255,0.08)'}`,borderRadius:'16px',position:'relative',overflow:'hidden'}}>
                  {(p as any).badge && <div style={{position:'absolute',top:'16px',right:'16px',padding:'4px 12px',borderRadius:'4px',background:'rgba(120,200,80,0.15)',border:'1px solid rgba(120,200,80,0.35)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(150,230,100,0.9)',letterSpacing:'1px'}}>{(p as any).badge}</div>}
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'12px',letterSpacing:'3px',color:(p.color as string).replace('1)','0.6)'),textTransform:'uppercase',marginBottom:'8px'}}>{p.name}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'16px'}}>{p.tagline}</div>
                  <div style={{marginBottom:'4px'}}>
                    <span style={{fontFamily:'"Playfair Display",serif',fontSize:'48px',fontWeight:900,color:'#EDE8F5'}}>{p.price}</span>
                    <span style={{fontFamily:'"Lora",serif',fontSize:'16px',color:'rgba(200,185,240,0.4)',marginLeft:'4px'}}>{p.period}</span>
                  </div>
                  {(p as any).note && <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(200,185,240,0.35)',marginBottom:'24px'}}>{(p as any).note}</div>}
                  <div style={{margin:'24px 0',height:'1px',background:'rgba(255,255,255,0.08)'}}/>
                  <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'28px'}}>
                    {p.features.map((f,j)=>(
                      <div key={j} style={{display:'flex',gap:'10px',fontFamily:'"Lora",serif',fontSize:'14px',color:'rgba(210,200,240,0.7)'}}>
                        <span style={{color:(p.color as string).replace('1)','0.7)'),fontSize:'9px',flexShrink:0,marginTop:'4px'}}>◆</span>{f}
                      </div>
                    ))}
                  </div>
                  <Link href="/auth/register" style={{display:'block',padding:'14px',textAlign:'center',borderRadius:'8px',background:(p as any).featured?`linear-gradient(135deg,${(p.color as string).replace('1)','0.85)')},${(p.color as string).replace('1)','0.6)')})`:'rgba(255,255,255,0.06)',border:(p as any).featured?'none':'1px solid rgba(255,255,255,0.1)',fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:(p as any).featured?'#0C0818':'rgba(220,210,255,0.7)',textDecoration:'none',letterSpacing:'0.5px'}}>
                    {p.cta}
                  </Link>
                </div>
              ))}
            </div>
            <p style={{textAlign:'center',marginTop:'20px',fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.25)'}}>Отмена в любой момент · Первая консультация бесплатно · Без карты при регистрации</p>
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" style={{padding:'80px 52px 100px'}} className="pad">
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}><Ornament/></div>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:900,color:'#FFFFFF',textAlign:'center',margin:'32px 0 48px'}}>Отзывы</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
              {reviews.map((r,i)=>(
                <div key={i} style={{padding:'24px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'14px',animation:`fadeUp 0.6s ease ${i*0.1}s both`}}>
                  <div style={{display:'flex',gap:'2px',marginBottom:'14px'}}>{'★★★★★'.split('').map((s,j)=><span key={j} style={{color:'rgba(201,168,76,0.8)',fontSize:'14px'}}>{s}</span>)}</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.8,color:'rgba(220,210,245,0.7)',fontStyle:'italic',marginBottom:'16px'}}>{r.text}</p>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'rgba(180,150,255,0.7)'}}>{r.name}</div>
                  <div style={{display:'flex',gap:'8px',marginTop:'3px'}}>
                    <span style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.3)'}}>{r.city}</span>
                    <span style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(150,100,255,0.4)',fontStyle:'italic'}}>· {r.module}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{padding:'80px 52px 100px',background:'rgba(255,255,255,0.015)'}} className="pad">
          <div style={{maxWidth:'760px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'20px'}}><Ornament/></div>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:900,color:'#FFFFFF',textAlign:'center',margin:'32px 0 48px'}}>Вопросы и ответы</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {faqs.map(([q,a],i)=>(
                <div key={i} style={{padding:'22px 24px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px'}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'#EDE8F5',marginBottom:'8px'}}>{q}</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.75,color:'rgba(200,185,240,0.55)'}}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{padding:'100px 52px',textAlign:'center'}} className="pad">
          <div style={{maxWidth:'600px',margin:'0 auto'}}>
            <Ornament/>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,5vw,56px)',fontWeight:900,color:'#FFFFFF',margin:'32px 0 16px',lineHeight:1.1}}>Тайны ждут<br/>своего часа</h2>
            <p style={{fontFamily:'"Lora",serif',fontSize:'18px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'40px',lineHeight:1.8}}>
              Первые 5 сообщений — бесплатно.<br/>Без карты. Без обязательств.
            </p>
            <Link href="/auth/register" style={{display:'inline-block',padding:'17px 44px',borderRadius:'8px',background:'linear-gradient(135deg,rgba(150,100,255,0.9),rgba(100,60,200,0.8))',fontFamily:'"Playfair Display",serif',fontSize:'17px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'0.5px',boxShadow:'0 4px 40px rgba(120,60,220,0.5)'}}>
              ✦ Начать бесплатно
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{padding:'28px 52px',borderTop:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}} className="pad">
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'18px',fontWeight:900,color:'rgba(200,180,255,0.3)',textDecoration:'none',letterSpacing:'1px'}}>MYSTIC AI</Link>
          <div style={{display:'flex',gap:'20px',flexWrap:'wrap'}}>
            {[['Таро','/tarot'],['Астрология','/astrology'],['Нумерология','/numerology'],['Совместимость','/compatibility'],['Privacy','/privacy'],['Terms','/terms'],['Refund','/refund']].map(([l,h])=>(
              <Link key={l} href={h} style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.3)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
          <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(200,185,240,0.2)'}}>© 2026 Mystic AI</div>
        </footer>
      </div>
    </>
  )
}