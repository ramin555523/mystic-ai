'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function getMoonPhase() {
  const now = new Date()
  const jd = now.getTime() / 86400000 + 2440587.5
  const phase = ((jd - 2451549.5) / 29.53058867) % 1
  const p = ((phase % 1) + 1) % 1
  if (p < 0.03) return { name: 'Новолуние', icon: '🌑', energy: 'Время новых намерений и начинаний. Посейте семена желаний.', pct: 0 }
  if (p < 0.22) return { name: 'Растущая луна', icon: '🌒', energy: 'Время роста и привлечения. Начинайте новые проекты.', pct: Math.round(p * 200) }
  if (p < 0.28) return { name: 'Первая четверть', icon: '🌓', energy: 'Время действий и преодоления. Решайте накопившиеся вопросы.', pct: 50 }
  if (p < 0.47) return { name: 'Прибывающая луна', icon: '🌔', energy: 'Усиление намерений. Привлекайте то что хотите в жизнь.', pct: Math.round(p * 150) }
  if (p < 0.53) return { name: 'Полнолуние', icon: '🌕', energy: 'Пик энергии. Завершайте дела, благодарите за достижения.', pct: 100 }
  if (p < 0.72) return { name: 'Убывающая луна', icon: '🌖', energy: 'Время отпускания. Избавляйтесь от лишнего в жизни.', pct: Math.round((1 - p) * 200) }
  if (p < 0.78) return { name: 'Последняя четверть', icon: '🌗', energy: 'Подведение итогов. Что стоит завершить перед новым циклом?', pct: 25 }
  return { name: 'Убывающая луна', icon: '🌘', energy: 'Время покоя и внутренней работы. Готовьтесь к новому циклу.', pct: 10 }
}

const DAILY_CARDS = [
  { name: 'Луна', number: 'XVIII', meaning: 'Интуиция и скрытые истины выходят на поверхность. Доверяйте внутреннему голосу сегодня.' },
  { name: 'Звезда', number: 'XVII', meaning: 'День надежды и вдохновения. Вселенная поддерживает ваши мечты.' },
  { name: 'Солнце', number: 'XIX', meaning: 'Радость и жизненная сила — ваши союзники сегодня. Действуйте открыто.' },
  { name: 'Мир', number: 'XXI', meaning: 'Завершение цикла. Время праздновать достижения и готовиться к новому.' },
  { name: 'Колесо Фортуны', number: 'X', meaning: 'Судьба поворачивается в вашу сторону. Будьте готовы к переменам.' },
  { name: 'Влюблённые', number: 'VI', meaning: 'Важный выбор стоит перед вами. Действуйте от сердца, не от ума.' },
  { name: 'Сила', number: 'VIII', meaning: 'Внутренняя мощь и терпение — ваше главное оружие сегодня.' },
  { name: 'Маг', number: 'I', meaning: 'Все ресурсы для успеха у вас есть. День для проявления воли.' },
  { name: 'Верховная жрица', number: 'II', meaning: 'Тайное знание доступно вам. Прислушайтесь к снам и интуиции.' },
  { name: 'Императрица', number: 'III', meaning: 'Изобилие и творчество расцветают. День для красоты и чувственности.' },
  { name: 'Колесница', number: 'VII', meaning: 'Победа через дисциплину. Держите курс, несмотря на препятствия.' },
  { name: 'Справедливость', number: 'XI', meaning: 'Баланс восстанавливается. Честность приведёт к верному решению.' },
  { name: 'Отшельник', number: 'IX', meaning: 'Время уединения и внутреннего поиска. Ответы внутри вас.' },
  { name: 'Умеренность', number: 'XIV', meaning: 'Гармония достигается через баланс. Не торопитесь сегодня.' },
  { name: 'Башня', number: 'XVI', meaning: 'Неожиданное откровение разрушит старое, чтобы построить лучшее.' },
  { name: 'Шут', number: '0', meaning: 'Новое начало зовёт вас. Прыгайте в неизвестность с лёгким сердцем.' },
  { name: 'Суд', number: 'XX', meaning: 'Пробуждение и призыв. Прислушайтесь к зову своей истинной природы.' },
  { name: 'Иерофант', number: 'V', meaning: 'Традиция и духовное руководство укажут путь. Ищите наставника.' },
  { name: 'Повешенный', number: 'XII', meaning: 'Пауза и новый угол зрения дадут неожиданное решение.' },
  { name: 'Смерть', number: 'XIII', meaning: 'Трансформация неизбежна. Отпустите старое — новое уже ждёт.' },
  { name: 'Дьявол', number: 'XV', meaning: 'Осознайте что вас держит. Свобода начинается с признания.' },
  { name: 'Император', number: 'IV', meaning: 'Структура и порядок принесут результат. День для планирования.' },
]

const DAILY_TIPS = [
  'Сегодня хороший день чтобы написать то что вас беспокоит — и сжечь бумагу. Символическое освобождение работает.',
  'Выпейте стакан воды осознанно — с намерением очистить мысли. Это простая но мощная практика.',
  'Посмотрите на небо сегодня хотя бы 1 минуту. Связь с природой восстанавливает внутренний баланс.',
  'Скажите вслух три вещи за которые вы благодарны сегодня. Вслух — это важно.',
  'Положите левую руку на сердце и сделайте 5 глубоких вдохов. Это успокаивает нервную систему за 90 секунд.',
  'Сегодня избегайте принимать важные решения до полудня — утреннее состояние не всегда отражает реальность.',
  'Один маленький шаг к мечте сегодня важнее большого шага который вы откладываете месяцами.',
  'Проведите 10 минут в тишине без телефона. Ваша интуиция говорит — но вы не слышите из-за шума.',
  'Цвет дня — фиолетовый. Наденьте что-то фиолетовое или окружите себя этим цветом для усиления интуиции.',
  'Запишите один вопрос который вас тревожит. Сам процесс записи часто даёт ответ.',
  'Сегодня хороший день для разговора который вы откладывали. Звёзды поддерживают честность.',
  'Лунная энергия сегодня особенно сильна для медитации перед сном. Попробуйте хотя бы 5 минут.',
  'Обратите внимание на первую мысль после пробуждения — это послание от подсознания.',
  'Прогулка босиком по земле или траве заземляет энергию. Даже 5 минут меняют состояние.',
  'Сегодня хорошо работает аффирмация: "Я открыта к новым возможностям".',
]

const HOROSCOPES: Record<string, string> = {
  'Овен': 'Марс energizes вас сегодня. Смелые шаги в карьере принесут плоды — говорите правду на встречах.',
  'Телец': 'Венера подчёркивает вашу творческую сторону. Финансовая интуиция обострена — доверяйте чутью.',
  'Близнецы': 'Меркурий обостряет ум. Разговоры ведут к прорывам. Записывайте идеи — одна из них золотая.',
  'Рак': 'Луна приносит эмоциональную ясность. Семейные связи исцеляют что-то давнее.',
  'Лев': 'Солнце освещает вашу естественную магнетичность. Возможности лидерства — шагайте вперёд.',
  'Дева': 'Меркурий приносит аналитическую точность. Практическое решение давней проблемы появится.',
  'Весы': 'Венера гармонизирует отношения. Переговоры в вашу пользу. Красота вдохновляет решения.',
  'Скорпион': 'Плутон углубляет восприятие. Скрытая информация всплывает на поверхность.',
  'Стрелец': 'Юпитер расширяет горизонты. Возможности путешествий или обучения стучатся в дверь.',
  'Козерог': 'Сатурн вознаграждает дисциплину сегодня. Признание в карьере возможно.',
  'Водолей': 'Уран зажигает оригинальность. Нестандартные подходы побеждают.',
  'Рыбы': 'Нептун углубляет интуицию. Художественные и духовные занятия благословлены.',
}

const ZODIAC_SIGNS = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы']

const MODULE_COLORS: Record<string, string> = {
  tarot:'rgba(201,168,76,1)',astrology:'rgba(100,180,255,1)',
  numerology:'rgba(255,160,80,1)',compatibility:'rgba(192,112,255,1)',destiny:'rgba(255,120,180,1)',
}
const MODULE_ICONS: Record<string, string> = {
  tarot:'🃏',astrology:'⭐',numerology:'🔢',compatibility:'💫',destiny:'🔯',
}
const MODULE_NAMES: Record<string, string> = {
  tarot:'Таро',astrology:'Астрология',numerology:'Нумерология',compatibility:'Совместимость',destiny:'Матрица Судьбы',
}

function ProLock({ onUpgrade, description }: { onUpgrade: () => void; description: string }) {
  const [hov, setHov] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:'absolute',inset:0,background: hov ? 'rgba(8,5,22,0.96)' : 'rgba(8,5,22,0.88)',
        zIndex:5,borderRadius:'14px',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        gap:'10px', backdropFilter:'blur(3px)',
        transition:'background 0.3s',
        padding:'20px',
      }}>
      <div style={{fontSize:'24px'}}>{hov ? '✨' : '🔒'}</div>
      {hov ? (
        <div style={{textAlign:'center'}}>
          <p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',
            color:'rgba(200,185,240,0.65)',lineHeight:1.7,marginBottom:'14px'}}>
            {description}
          </p>
        </div>
      ) : (
        <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,
          color:'rgba(200,180,255,0.75)',textAlign:'center',letterSpacing:'0.5px',padding:'0 16px'}}>
          Только для подписчиков
        </div>
      )}
      <button onClick={onUpgrade} style={{
        padding:'8px 20px',borderRadius:'6px',border:'none',cursor:'pointer',
        background:'linear-gradient(135deg,#6030B0,#9060E0)',
        fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,
        color:'#EDE8F5',letterSpacing:'1px',
        boxShadow:'0 4px 16px rgba(100,40,200,0.3)',
      }}>Подписаться →</button>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [zodiac, setZodiac] = useState('')
  const [isPro, setIsPro] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const router = useRouter()

  const moon = getMoonPhase()
  const today = new Date()
  const cardIdx = (today.getDate() + today.getMonth() * 31) % DAILY_CARDS.length
  const tipIdx = (today.getDate() + today.getMonth() * 17) % DAILY_TIPS.length
  const dailyCard = DAILY_CARDS[cardIdx]
  const dailyTip = DAILY_TIPS[tipIdx]

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: msgs } = await supabase
        .from('chat_messages').select('*').eq('user_id', user.id)
        .eq('role','user').order('created_at',{ascending:false}).limit(5)
      if (msgs) setHistory(msgs)

      const { data: profile } = await supabase
        .from('profiles').select('subscription_status,streak').eq('id',user.id).single()
      if (profile?.subscription_status === 'active') setIsPro(true)
      if (profile?.streak) setStreak(profile.streak)

      // Update streak
      const lastVisit = localStorage.getItem('lastVisit')
      const todayStr = today.toDateString()
      if (lastVisit !== todayStr) {
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const newStreak = lastVisit === yesterday.toDateString() ? (profile?.streak || 0) + 1 : 1
        localStorage.setItem('lastVisit', todayStr)
        await supabase.from('profiles').update({ streak: newStreak, last_visit: new Date().toISOString() }).eq('id', user.id)
        setStreak(newStreak)
      }

      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Upgrade modal
  const UpgradeModal = () => (
    <div style={{position:'fixed',inset:0,zIndex:100,background:'rgba(4,2,12,0.95)',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',animation:'fadeUp 0.3s ease'}}
      onClick={() => setShowUpgrade(false)}>
      <div style={{maxWidth:'480px',width:'100%',background:'rgba(12,8,30,0.99)',border:'1px solid rgba(150,100,255,0.25)',borderRadius:'20px',padding:'40px 32px',position:'relative'}}
        onClick={e => e.stopPropagation()}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(150,100,255,0.7),transparent)',borderRadius:'20px 20px 0 0'}}/>
        <button onClick={() => setShowUpgrade(false)} style={{position:'absolute',top:'16px',right:'16px',background:'none',border:'none',cursor:'pointer',color:'rgba(200,185,240,0.3)',fontSize:'22px'}}>×</button>
        <div style={{textAlign:'center',marginBottom:'28px'}}>
          <div style={{fontSize:'48px',marginBottom:'12px'}}>✨</div>
          <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'24px',fontWeight:900,color:'#EDE8F5',marginBottom:'8px'}}>Разблокируйте всё</h2>
          <p style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',color:'rgba(200,185,240,0.5)',lineHeight:1.7}}>Карта дня · Лунный календарь · Гороскоп · Безлимитные консультации</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <a href="/#pricing" style={{display:'block',padding:'18px 24px',borderRadius:'12px',background:'linear-gradient(135deg,rgba(130,100,255,0.2),rgba(100,70,220,0.1))',border:'1px solid rgba(130,100,255,0.35)',textDecoration:'none',transition:'all 0.3s'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'17px',fontWeight:800,color:'rgba(180,150,255,0.95)'}}>Initiate</div>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:800,color:'#EDE8F5'}}>£9.99<span style={{fontSize:'13px',fontWeight:400,color:'rgba(200,185,240,0.4)'}}>/мес</span></div>
            </div>
            <div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.45)'}}>Безлимит + Карта дня + Луна + Гороскоп</div>
          </a>
          <a href="/#pricing" style={{display:'block',padding:'18px 24px',borderRadius:'12px',background:'linear-gradient(135deg,rgba(200,130,255,0.2),rgba(150,80,220,0.1))',border:'1px solid rgba(200,130,255,0.35)',textDecoration:'none',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',top:'10px',right:'12px',padding:'3px 10px',borderRadius:'4px',background:'rgba(120,200,80,0.15)',border:'1px solid rgba(120,200,80,0.35)',fontFamily:'"Playfair Display",serif',fontSize:'10px',fontWeight:700,color:'rgba(150,230,100,0.9)',letterSpacing:'1px'}}>BEST</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'17px',fontWeight:800,color:'rgba(220,170,255,0.95)'}}>Oracle Pro</div>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:800,color:'#EDE8F5'}}>£16.99<span style={{fontSize:'13px',fontWeight:400,color:'rgba(200,185,240,0.4)'}}>/мес</span></div>
            </div>
            <div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.45)'}}>Всё из Initiate + PDF + Human Design + AI-память</div>
          </a>
        </div>
      </div>
    </div>
  )

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#080510',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',letterSpacing:'3px',color:'rgba(200,180,255,0.5)'}}>ЗАГРУЗКА...</div>
    </div>
  )

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Искатель'
  const horoscope = zodiac ? HOROSCOPES[zodiac] : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif;overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#080510}::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.2);border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.5}}
        @keyframes pulse{0%,100%{opacity:.7}50%{opacity:1}}
        .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:24px;animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both;position:relative;overflow:hidden}
        .module-btn{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;cursor:pointer;text-decoration:none;display:block;transition:all 0.3s;position:relative;overflow:hidden}
        .module-btn:hover{transform:translateY(-4px);background:rgba(255,255,255,0.055)}
        select{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#EDE8F5;font-family:'Lora',serif;font-size:14px;padding:10px 14px;outline:none;cursor:pointer;width:100%}
        select option{background:#1A0F3A}
        @media(max-width:768px){.top-grid{grid-template-columns:1fr!important}.modules-row{grid-template-columns:1fr 1fr!important}.pad{padding:20px 16px 60px!important}}
      `}</style>

      {/* Stars */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:50}).map((_,i)=>(
          <div key={i} style={{position:'absolute',left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,width:'1px',height:'1px',borderRadius:'50%',background:'rgba(230,220,255,0.8)',animation:`twinkle ${3+i%5}s ease-in-out infinite`,animationDelay:`${(i*0.3)%4}s`}}/>
        ))}
        <div style={{position:'absolute',top:'-20%',left:'20%',width:'70vw',height:'70vw',maxWidth:'700px',borderRadius:'50%',background:'radial-gradient(circle,rgba(60,20,120,0.10) 0%,transparent 70%)',pointerEvents:'none'}}/>
      </div>

      {showUpgrade && <UpgradeModal/>}

      <div style={{position:'relative',zIndex:10,maxWidth:'1100px',margin:'0 auto',padding:'32px 28px 80px'}} className="pad">

        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'36px'}}>
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:900,color:'rgba(200,180,255,0.4)',textDecoration:'none',letterSpacing:'1px'}}>
            MYSTIC<span style={{fontSize:'12px',fontWeight:400,verticalAlign:'super',marginLeft:'2px',color:'rgba(150,100,255,0.4)'}}>AI</span>
          </Link>
          <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
            {streak > 0 && (
              <div style={{padding:'6px 12px',borderRadius:'6px',background:'rgba(255,140,30,0.1)',border:'1px solid rgba(255,140,30,0.25)',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'rgba(255,160,60,0.85)'}}>
                🔥 {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'}
              </div>
            )}
            {isPro && <div style={{padding:'6px 12px',borderRadius:'6px',background:'rgba(120,200,80,0.08)',border:'1px solid rgba(120,200,80,0.25)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(150,230,100,0.8)',letterSpacing:'1px'}}>⚡ PRO</div>}
            <Link href="/settings" style={{padding:'7px 16px',background:'none',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'6px',fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'1px',color:'rgba(200,185,240,0.35)',textDecoration:'none',transition:'all 0.3s'}}>НАСТРОЙКИ</Link>
            <button onClick={handleLogout} style={{padding:'7px 16px',background:'none',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'6px',fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'1px',color:'rgba(200,185,240,0.35)',cursor:'pointer'}}>ВЫЙТИ</button>
          </div>
        </div>

        {/* Welcome */}
        <div style={{marginBottom:'32px'}}>
          <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'4px',color:'rgba(180,150,255,0.4)',marginBottom:'8px',textTransform:'uppercase'}}>Добро пожаловать</div>
          <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(26px,4vw,42px)',fontWeight:900,color:'#EDE8F5',marginBottom:'4px'}}>{name}</h1>
          <p style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',color:'rgba(200,185,240,0.35)'}}>
            {today.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}
          </p>
        </div>

        {/* Daily Tip */}
        <div className="card" style={{marginBottom:'20px',animationDelay:'0.05s',borderLeft:'3px solid rgba(150,100,255,0.4)'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:'14px'}}>
            <div style={{fontSize:'24px',flexShrink:0}}>✨</div>
            <div>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'3px',color:'rgba(180,150,255,0.5)',marginBottom:'8px',textTransform:'uppercase'}}>Совет дня</div>
              <p style={{fontFamily:'"Lora",serif',fontSize:'15px',lineHeight:1.75,color:'rgba(220,210,245,0.7)',fontStyle:'italic'}}>{dailyTip}</p>
            </div>
          </div>
        </div>

        {/* TOP ROW */}
        <div className="top-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',marginBottom:'20px'}}>

          {/* Daily Tarot */}
          <div className="card" style={{animationDelay:'0.1s'}}>
            {!isPro && <ProLock onUpgrade={() => setShowUpgrade(true)} description="Каждое утро новая карта таро с персональным посланием. Помогает настроиться на нужную энергию дня и принимать решения осознанно."/>}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'3px',color:'rgba(201,168,76,0.6)',textTransform:'uppercase'}}>Карта дня</div>
              <div style={{fontSize:'18px'}}>🃏</div>
            </div>
            <div style={{textAlign:'center',marginBottom:'12px'}}>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:900,color:'#C9A84C',marginBottom:'3px'}}>{dailyCard.name}</div>
              <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(201,168,76,0.45)'}}>Аркан {dailyCard.number}</div>
            </div>
            <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.7,color:'rgba(220,210,245,0.55)',fontStyle:'italic'}}>{dailyCard.meaning}</p>
            {!isPro && (
              <div style={{marginTop:'12px',padding:'8px 12px',borderRadius:'8px',background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)'}}>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(201,168,76,0.6)',marginBottom:'3px'}}>Что это даёт?</div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.4)',lineHeight:1.6}}>Каждое утро новая карта таро с персональным посланием на день. Помогает настроиться на нужную энергию и принимать решения осознанно.</p>
              </div>
            )}
          </div>

          {/* Moon */}
          <div className="card" style={{animationDelay:'0.15s'}}>
            {!isPro && <ProLock onUpgrade={() => setShowUpgrade(true)} description="Реальная фаза луны сегодня с описанием энергии дня. Знайте когда начинать новое, когда действовать активно, а когда отдыхать и восстанавливаться."/>}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'3px',color:'rgba(180,150,255,0.6)',textTransform:'uppercase'}}>Луна сегодня</div>
              <div style={{fontSize:'18px'}}>{moon.icon}</div>
            </div>
            <div style={{textAlign:'center',marginBottom:'12px'}}>
              <div style={{fontSize:'40px',marginBottom:'8px',animation:'pulse 3s ease-in-out infinite'}}>{moon.icon}</div>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:700,color:'#EDE8F5',marginBottom:'3px'}}>{moon.name}</div>
            </div>
            <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.7,color:'rgba(220,210,245,0.55)',fontStyle:'italic'}}>{moon.energy}</p>
            {!isPro && (
              <div style={{marginTop:'12px',padding:'8px 12px',borderRadius:'8px',background:'rgba(150,100,255,0.06)',border:'1px solid rgba(150,100,255,0.15)'}}>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(180,150,255,0.6)',marginBottom:'3px'}}>Что это даёт?</div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.4)',lineHeight:1.6}}>Лунный календарь показывает фазу луны и её влияние на вашу энергию. Знайте когда начинать новое, а когда отдыхать.</p>
              </div>
            )}
          </div>

          {/* Horoscope */}
          <div className="card" style={{animationDelay:'0.2s'}}>
            {!isPro && <ProLock onUpgrade={() => setShowUpgrade(true)} description="Персональный астрологический прогноз на сегодня по вашему знаку зодиака. Карьера, отношения, энергия дня — всё в одном месте каждый день."/>}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'3px',color:'rgba(100,180,255,0.6)',textTransform:'uppercase'}}>Гороскоп</div>
              <div style={{fontSize:'18px'}}>⭐</div>
            </div>
            {!horoscope ? (
              <div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.4)',marginBottom:'12px',lineHeight:1.6}}>
                  Персональный прогноз на день по вашему знаку зодиака
                </p>
                <select value={zodiac} onChange={e=>setZodiac(e.target.value)}>
                  <option value="">— Выбрать знак —</option>
                  {ZODIAC_SIGNS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
                {!isPro && (
                  <div style={{marginTop:'12px',padding:'8px 12px',borderRadius:'8px',background:'rgba(100,180,255,0.06)',border:'1px solid rgba(100,180,255,0.15)'}}>
                    <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(100,180,255,0.6)',marginBottom:'3px'}}>Что это даёт?</div>
                    <p style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.4)',lineHeight:1.6}}>Ежедневный астрологический прогноз по вашему знаку. Карьера, отношения, энергия дня — всё в одном месте.</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'#64B4FF'}}>{zodiac}</div>
                  <button onClick={()=>setZodiac('')} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(200,185,240,0.3)',fontSize:'18px'}}>×</button>
                </div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.7,color:'rgba(220,210,245,0.55)',fontStyle:'italic'}}>{horoscope}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modules */}
        <div style={{marginBottom:'20px'}}>
          <div style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'4px',color:'rgba(180,150,255,0.4)',marginBottom:'14px',textTransform:'uppercase'}}>Консультации</div>
          <div className="modules-row" style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'12px'}}>
            {[
              {key:'tarot',title:'Таро',sub:'Расклад на вопрос',desc:'Карты откроют скрытое и подскажут путь',href:'/chat/tarot'},
              {key:'astrology',title:'Астрология',sub:'Натальный чарт',desc:'Планеты расскажут о вашем пути и транзитах',href:'/chat/astrology'},
              {key:'numerology',title:'Нумерология',sub:'Числа судьбы',desc:'Имя и дата рождения хранят код вашей жизни',href:'/chat/numerology'},
              {key:'compatibility',title:'Совместимость',sub:'Анализ пары',desc:'Раскройте тайну связи двух людей',href:'/chat/compatibility'},
              {key:'destiny',title:'Матрица Судьбы',sub:'Карма и предназначение',desc:'Кармические задачи и таланты по дате рождения',href:'/chat/destiny'},
            ].map((m,i)=>(
              <Link key={i} href={m.href} className="module-btn" style={{borderTop:`2px solid ${MODULE_COLORS[m.key].replace('1)','0.5)')}`}}>
                <div style={{fontSize:'26px',marginBottom:'10px'}}>{MODULE_ICONS[m.key]}</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:MODULE_COLORS[m.key].replace('1)','0.9)'),marginBottom:'3px'}}>{m.title}</div>
                <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(200,185,240,0.35)',marginBottom:'8px'}}>{m.sub}</div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.45)',lineHeight:1.5,marginBottom:'12px'}}>{m.desc}</p>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'rgba(200,185,240,0.5)'}}></div>
              </Link>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="card" style={{animationDelay:'0.4s',marginBottom:'20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'18px'}}>
            <div style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'4px',color:'rgba(180,150,255,0.4)',textTransform:'uppercase'}}>История консультаций</div>
          </div>
          {history.length === 0 ? (
            <div style={{textAlign:'center',padding:'28px 0'}}>
              <div style={{fontSize:'32px',marginBottom:'10px',opacity:0.3}}>🃏</div>
              <p style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',color:'rgba(200,185,240,0.3)',marginBottom:'16px'}}>
                У вас ещё нет консультаций.<br/>Начните с таро, астрологии или нумерологии.
              </p>
              <div style={{display:'flex',gap:'10px',justifyContent:'center',flexWrap:'wrap'}}>
                {['tarot','astrology','numerology','compatibility'].map(m=>(
                  <Link key={m} href={`/chat/${m}`} style={{padding:'8px 16px',borderRadius:'8px',textDecoration:'none',background:`${MODULE_COLORS[m].replace('1)','0.1)')}`,border:`1px solid ${MODULE_COLORS[m].replace('1)','0.25)')}`,fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:MODULE_COLORS[m].replace('1)','0.8)'),letterSpacing:'0.5px'}}>
                    {MODULE_ICONS[m]} {MODULE_NAMES[m]}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {history.map((msg,i)=>(
                <Link key={i} href={`/chat/${msg.module}`} style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'12px 14px',background:'rgba(255,255,255,0.025)',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.05)',textDecoration:'none',transition:'all 0.2s',borderLeft:`3px solid ${MODULE_COLORS[msg.module]?.replace('1)','0.4)')||'rgba(150,100,255,0.4)'}`}}>
                  <div style={{fontSize:'18px',flexShrink:0,marginTop:'2px'}}>{MODULE_ICONS[msg.module]||'💬'}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'3px'}}>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:MODULE_COLORS[msg.module]?.replace('1)','0.8)')||'rgba(150,100,255,0.8)'}}>{MODULE_NAMES[msg.module]||msg.module}</div>
                      <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(200,185,240,0.22)',flexShrink:0,marginLeft:'8px'}}>{new Date(msg.created_at).toLocaleDateString('ru-RU',{day:'numeric',month:'short'})}</div>
                    </div>
                    <div style={{fontFamily:'"Lora",serif',fontSize:'13px',color:'rgba(200,185,240,0.45)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{msg.content}</div>
                  </div>
                  <div style={{fontSize:'13px',color:'rgba(200,185,240,0.18)',flexShrink:0}}>→</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Premium Reports Block */}
        <div style={{marginBottom:'20px'}}>
          <div style={{fontFamily:'"Playfair Display",serif',fontSize:'10px',letterSpacing:'4px',color:'rgba(255,160,60,0.5)',marginBottom:'14px',textTransform:'uppercase'}}>Премиум Отчёты</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
            {[
              {icon:'🔯',name:'Матрица Судьбы',desc:'Кармические задачи и предназначение',price:'£34.99',pages:'15-18 стр',color:'rgba(192,112,255,1)'},
              {icon:'⭐',name:'Натальная Карта',desc:'Полный астрологический портрет',price:'£34.99',pages:'15-18 стр',color:'rgba(100,180,255,1)'},
              {icon:'🌟',name:'Годовой Прогноз',desc:'Все сферы жизни по месяцам',price:'£89.99',pages:'30-40 стр',color:'rgba(255,160,60,1)'},
            ].map((r,i)=>(
              <Link key={i} href="/reports" style={{
                textDecoration:'none',display:'block',padding:'18px',
                background:'rgba(255,255,255,0.025)',
                border:`1px solid ${r.color.replace('1)','0.2)')}`,
                borderRadius:'12px',transition:'all 0.3s',
                borderTop:`2px solid ${r.color.replace('1)','0.5)')}`,
              }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.transform='translateY(-4px)';el.style.borderColor=r.color.replace('1)','0.4)')}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.transform='translateY(0)';el.style.borderColor=r.color.replace('1)','0.2)')}}>
                <div style={{fontSize:'26px',marginBottom:'8px'}}>{r.icon}</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:'#EDE8F5',marginBottom:'3px'}}>{r.name}</div>
                <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(200,185,240,0.35)',marginBottom:'8px'}}>{r.desc}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:800,color:r.color.replace('1)','0.9)')}}>{r.price}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(200,185,240,0.3)'}}>{r.pages}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade banner */}
        {(!isPro || showUpgrade) && (
          <div style={{padding:'24px 28px',borderRadius:'14px',background:'linear-gradient(135deg,rgba(80,30,160,0.18),rgba(40,10,80,0.12))',border:'1px solid rgba(150,100,255,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px'}}>
            <div>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:700,color:'#EDE8F5',marginBottom:'6px'}}>
                🔓 Разблокируйте всё
              </div>
              <div style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'8px'}}>
                Карта дня · Лунный календарь · Гороскоп · Безлимитные консультации
              </div>
              <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                {[['🃏 Карта таро каждое утро','Настройка на энергию дня'],['🌙 Фаза луны','Когда действовать, когда отдыхать'],['⭐ Гороскоп','Персональный прогноз по знаку'],['💬 Безлимит','Все 4 консультанта без ограничений']].map(([title,desc])=>(
                  <div key={title} style={{display:'flex',gap:'6px',alignItems:'flex-start'}}>
                    <div style={{fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'rgba(200,180,255,0.6)'}}>{title}</div>
                    <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(180,160,220,0.35)'}}> — {desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <a href="/#pricing" target="_blank" rel="noreferrer" style={{padding:'13px 28px',borderRadius:'8px',background:'linear-gradient(135deg,#6030B0,#9060E0,#C080FF)',fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'1px',whiteSpace:'nowrap',boxShadow:'0 4px 20px rgba(100,40,200,0.3)'}}>
              Подписаться — от £9.99/мес
            </a>
          </div>
        )}
      </div>
    </>
  )
}