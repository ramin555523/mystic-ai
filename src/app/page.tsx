'use client'
import React from 'react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'


// Moon phase for landing page
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

function Ornament() {
  return (
    <div style={{display:'flex',alignItems:'center',gap:'16px',width:'100%'}}>
      <div style={{flex:1,height:'1px',background:'linear-gradient(90deg,transparent,rgba(180,140,255,0.2))'}}/>
      <div style={{color:'rgba(180,140,255,0.3)',fontSize:'14px',letterSpacing:'8px'}}>✦ ✦ ✦</div>
      <div style={{flex:1,height:'1px',background:'linear-gradient(270deg,transparent,rgba(180,140,255,0.2))'}}/>
    </div>
  )
}

const CHAT_MODULES = [
  {id:'tarot',label:'🃏 Таро',color:'rgba(201,168,76,1)',glow:'rgba(201,168,76,0.2)',
    consultant:'Селена',role:'Мастер Таро',
    greeting:'Приветствую. Я Селена. Карты уже разложены — задайте ваш вопрос, и я вытяну расклад специально для вас.',
    demo:[
      {role:'user',text:'Что ждёт меня в отношениях в этом году?'},
      {role:'ai',text:'Вытягиваю три карты... Луна · Влюблённые · Колесо Фортуны. Луна говорит о тайных чувствах которые скоро выйдут на поверхность. Влюблённые — важный выбор стоит перед вами. Колесо Фортуны обещает перемены к лучшему. Это время честности с собой и с партнёром.'},
    ]},
  {id:'astrology',label:'⭐ Астрология',color:'rgba(100,180,255,1)',glow:'rgba(100,180,255,0.2)',
    consultant:'Орион',role:'Астролог',
    greeting:'Здравствуйте. Я Орион. Планеты говорят со мной напрямую. Назовите дату рождения — и я прочту вашу карту.',
    demo:[
      {role:'user',text:'Я родилась 15 марта 1990. Что говорят транзиты?'},
      {role:'ai',text:'Вы — Рыбы с Луной в Весах. Сейчас Сатурн проходит через ваш 7-й дом — время серьёзных решений в отношениях. Юпитер в трине к вашему Солнцу обещает расширение в профессии до конца года. Период трансформации — используйте его осознанно.'},
    ]},
  {id:'numerology',label:'🔢 Нумерология',color:'rgba(255,160,80,1)',glow:'rgba(255,160,80,0.2)',
    consultant:'Мирра',role:'Нумеролог',
    greeting:'Добро пожаловать. Я Мирра. В каждом числе скрыта судьба. Назовите ваше полное имя и дату рождения.',
    demo:[
      {role:'user',text:'Меня зовут Анна Иванова, родилась 7 апреля 1995.'},
      {role:'ai',text:'Ваше число жизненного пути — 8. Это число силы и материального успеха. Число судьбы по имени — 5: жажда свободы и перемен. 2025 — ваш личный год 4, год закладки фундамента. Стройте — это ваше время.'},
    ]},
  {id:'compatibility',label:'💫 Совместимость',color:'rgba(192,112,255,1)',glow:'rgba(192,112,255,0.2)',
    consultant:'Сатья',role:'Совместимость',
    greeting:'Здравствуйте. Я Сатья. Назовите имена и даты рождения двух людей — и я раскрою тайну их связи.',
    demo:[
      {role:'user',text:'Мария 12.05.1992 и Дмитрий 03.09.1988 — насколько совместимы?'},
      {role:'ai',text:'Мария — число 3 (творчество), Дмитрий — число 9 (мудрость). Сильный союз: 3 и 9 резонируют через тройку. Астрологически: Телец и Дева — земной гармоничный союз. Совместимость 84%. Главный вызов: баланс между лёгкостью Марии и глубиной Дмитрия.'},
    ]},
]

function TypingDots({color}:{color:string}) {
  return (
    <span style={{display:'inline-flex',gap:'3px',alignItems:'center',verticalAlign:'middle'}}>
      {[0,1,2].map(i=>(
        <span key={i} style={{
          width:'5px',height:'5px',borderRadius:'50%',display:'inline-block',
          background:color,
          animation:'tdot 1.2s ease-in-out infinite',
          animationDelay:`${i*0.18}s`,
        }}/>
      ))}
    </span>
  )
}

function ChatSection() {
  const [active, setActive] = React.useState(0)

  type Demo = { module: string; icon: string; color: string; bg: string; border: string; expert: string; question: string; paragraphs: string[] }

  const demos: Demo[] = [
    {
      module: 'Таро', icon: '🃏', color: 'rgba(201,168,76,1)', bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.2)', expert: 'Селена',
      question: 'Стоит ли мне менять работу? Я уже год думаю об этом.',
      paragraphs: [
        '**Три карты:** Смерть (XIII) · Колесо Фортуны (X) · Звезда (XVII)',
        'Карты говорят чётко — перемены неизбежны и своевременны. **Смерть** здесь не об окончании, а о трансформации: старое место уже отслужило своё.',
        '**Колесо Фортуны** подтверждает — цикл завершается, судьба поворачивается в вашу сторону. **Звезда** в позиции исхода — знак надежды и нового пути.',
        'Ответ карт: **да, время пришло.**',
      ],
    },
    {
      module: 'Астрология', icon: '⭐', color: 'rgba(100,180,255,1)', bg: 'rgba(100,180,255,0.06)', border: 'rgba(100,180,255,0.2)', expert: 'Орион',
      question: 'Я Скорпион, 15.11.1990. Что меня ждёт в отношениях в этом году?',
      paragraphs: [
        '**Скорпион, 35 лет.** Ваша натальная Венера в Стрельце создаёт жажду свободы в любви — вам нужен партнёр-путешественник духом.',
        '**Транзиты 2026:** Юпитер входит в ваш 7-й дом отношений в марте — один из лучших периодов для новых союзов за 12 лет.',
        'Если одиноки — встреча возможна между **апрелем и августом.** Если в отношениях — союз выйдет на новый уровень.',
        'Сатурн требует серьёзности: поверхностное не приживётся. **Ищите глубину.**',
      ],
    },
    {
      module: 'Нумерология', icon: '🔢', color: 'rgba(255,160,80,1)', bg: 'rgba(255,160,80,0.06)', border: 'rgba(255,160,80,0.2)', expert: 'Мирра',
      question: 'Меня зовут Анна Петрова, родилась 23.04.1988. Что числа говорят о моей судьбе?',
      paragraphs: [
        '**Анна Петрова, 37 лет.** Числа открыты.',
        '**Число жизненного пути: 9** — вы пришли исцелять и завершать циклы. Девятки — гуманисты и мудрецы.',
        '**Число судьбы: 6** — ваше предназначение связано с домом, семьёй и заботой о других. **Число души: 11** — мастер-число, тонкая интуиция.',
        '**Личный год 2026: 5** — год перемен, свободы и новых возможностей.',
      ],
    },
    {
      module: 'Совместимость', icon: '💫', color: 'rgba(192,112,255,1)', bg: 'rgba(192,112,255,0.06)', border: 'rgba(192,112,255,0.2)', expert: 'Сатья',
      question: 'Мария (12.03.1995) и Дмитрий (28.07.1991). Насколько мы совместимы?',
      paragraphs: [
        '**Мария, 31 год — Рыбы. Дмитрий, 34 года — Лев.**',
        '**Астрологическая совместимость: 78%.** Рыбы и Лев — союз воды и огня. Дмитрий даёт Марии защиту, Мария дарит Дмитрию глубину которой ему не хватает.',
        '**Числовая совместимость:** путь Марии — 3 (творчество), Дмитрия — 1 (лидерство). Лидер и вдохновитель — отличное сочетание.',
        'Главный вызов: Лев требует восхищения, Рыбы — слияния. Давайте друг другу пространство. **Потенциал союза — высокий.**',
      ],
    },
  ]

  const d = demos[active]

  return (
    <div style={{maxWidth:'860px',margin:'0 auto',padding:'0 52px'}} className="pad">
      <div style={{display:'flex',gap:'8px',justifyContent:'center',marginBottom:'28px',flexWrap:'wrap'}}>
        {demos.map((dm, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding:'8px 20px', borderRadius:'24px', cursor:'pointer',
            fontFamily:'"Playfair Display",serif', fontSize:'13px', fontWeight:700,
            border:`1px solid ${i===active ? dm.color.replace('1)','0.5)') : 'rgba(255,255,255,0.1)'}`,
            background: i===active ? dm.color.replace('1)','0.12)') : 'transparent',
            color: i===active ? dm.color.replace('1)','0.95)') : 'rgba(200,185,240,0.4)',
            transition:'all 0.25s',
          }}>
            {dm.icon} {dm.module}
          </button>
        ))}
      </div>

      <div style={{background:'rgba(8,5,22,0.95)',border:`1px solid ${d.border}`,borderRadius:'16px',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
        <div style={{padding:'14px 20px',display:'flex',alignItems:'center',gap:'12px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:`linear-gradient(135deg,rgba(8,5,22,1),${d.bg})`}}>
          <div style={{width:'38px',height:'38px',borderRadius:'50%',flexShrink:0,background:d.color.replace('1)','0.15)'),border:`1px solid ${d.color.replace('1)','0.3)')}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>{d.icon}</div>
          <div>
            <div style={{fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'#EDE8F5'}}>{d.expert}</div>
            <div style={{display:'flex',alignItems:'center',gap:'5px',fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(100,220,100,0.8)'}}>
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#64DC64',display:'inline-block'}}/>
              онлайн · {d.module}
            </div>
          </div>
          <div style={{marginLeft:'auto',padding:'4px 12px',borderRadius:'20px',background:d.color.replace('1)','0.1)'),border:`1px solid ${d.color.replace('1)','0.2)')}`,fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:d.color.replace('1)','0.7)')}}>
            пример диалога
          </div>
        </div>

        <div style={{padding:'24px 20px',display:'flex',flexDirection:'column',gap:'16px'}}>
          <div style={{display:'flex',justifyContent:'flex-end'}}>
            <div style={{maxWidth:'70%',padding:'12px 16px',borderRadius:'18px 18px 4px 18px',background:`linear-gradient(135deg,${d.color.replace('1)','0.7)')},${d.color.replace('1)','0.45)')})`,fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.7,color:'rgba(255,250,235,0.95)'}}>
              {d.question}
            </div>
          </div>

          <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
            <div style={{width:'32px',height:'32px',borderRadius:'50%',flexShrink:0,background:d.color.replace('1)','0.15)'),border:`1px solid ${d.color.replace('1)','0.3)')}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>{d.icon}</div>
            <div style={{maxWidth:'80%',padding:'14px 18px',borderRadius:'4px 18px 18px 18px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)'}}>
              {d.paragraphs.map((para, i) => (
                <p key={i} style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.8,color:'rgba(230,222,255,0.88)',marginBottom:i<d.paragraphs.length-1?'10px':'0'}}>
                  {para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                      ? <strong key={j} style={{color:'#FFFFFF',fontFamily:'"Playfair Display",serif',fontWeight:800}}>{part.slice(2,-2)}</strong>
                      : <span key={j}>{part}</span>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div style={{padding:'16px 20px',borderTop:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.02)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',flexWrap:'wrap'}}>
          <p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.4)'}}>
            Первые 5 сообщений — бесплатно
          </p>
          <Link href="/auth/register" style={{padding:'10px 24px',borderRadius:'8px',textDecoration:'none',background:`linear-gradient(135deg,${d.color.replace('1)','0.85)')},${d.color.replace('1)','0.6)')})`,fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'#0C0818',letterSpacing:'0.5px'}}>
            Начать бесплатно
          </Link>
        </div>
      </div>
    </div>
  )
}