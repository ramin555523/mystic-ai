'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Message = { role: 'user' | 'assistant'; content: string }

const MODULE_CONFIG = {
  tarot: {
    name: 'Селена',
    role: 'Мастер Таро',
    color: 'rgba(201,168,76,1)',
    glow: 'rgba(201,168,76,0.2)',
    icon: '🃏',
    placeholder: 'Задайте вопрос для расклада...',
    greeting: 'Приветствую. Я Селена, ваш таролог. Карты уже разложены — задайте ваш вопрос, и я вытяну расклад специально для вас. Можете спросить о любом аспекте жизни: отношениях, карьере, деньгах или духовном пути.',
  },
  astrology: {
    name: 'Орион',
    role: 'Астролог',
    color: 'rgba(100,180,255,1)',
    glow: 'rgba(100,180,255,0.2)',
    icon: '⭐',
    placeholder: 'Введите дату рождения и вопрос...',
    greeting: 'Здравствуйте. Я Орион, ваш астролог. Планеты говорят со мной напрямую. Назовите вашу дату рождения (и время если знаете) — и я прочту вашу натальную карту, расскажу о текущих транзитах и что они означают для вас.',
  },
  numerology: {
    name: 'Мирра',
    role: 'Нумеролог',
    color: 'rgba(255,160,80,1)',
    glow: 'rgba(255,160,80,0.2)',
    icon: '🔢',
    placeholder: 'Введите имя и дату рождения...',
    greeting: 'Добро пожаловать. Я Мирра, нумеролог. В каждом числе скрыта судьба. Назовите ваше полное имя (имя, отчество, фамилия) и дату рождения — и я раскрою ваш числовой код: число жизненного пути, число судьбы, число души и личный прогноз.',
  },
  compatibility: {
    name: 'Сатья',
    role: 'Анализ совместимости',
    color: 'rgba(192,112,255,1)',
    glow: 'rgba(192,112,255,0.2)',
    icon: '💫',
    placeholder: 'Введите имена и даты рождения обоих людей...',
    greeting: 'Здравствуйте. Я Сатья, специалист по совместимости. Назовите имена и даты рождения двух людей — и я раскрою тайну их связи через нумерологию и астрологию. Расскажу о сильных сторонах союза, зонах роста и потенциале отношений.',
  },
}

type ModuleKey = keyof typeof MODULE_CONFIG

function TypingDots({ color }: { color: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center', verticalAlign: 'middle' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: '5px', height: '5px', borderRadius: '50%', display: 'inline-block',
          background: color,
          animation: 'tdot 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </span>
  )
}

export default function ChatPage({ module }: { module: ModuleKey }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const cfg = MODULE_CONFIG[module]

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
      else setUser(user)
      setAuthLoading(false)
    })
  }, [router])

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.parentElement
      if (container) container.scrollTop = container.scrollHeight
    }
  }, [messages, loading])

  const send = async () => {
    if (!input.trim() || loading || !user) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: userMsg }],
          module,
          userId: user.id,
        }),
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Произошла ошибка. Попробуйте ещё раз.' }])
    }
    setLoading(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#080510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '16px', letterSpacing: '3px', color: 'rgba(200,180,255,0.5)' }}>ЗАГРУЗКА...</div>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif;overflow:hidden}
        @keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-4px);opacity:1}}
        @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        textarea{resize:none;outline:none;font-family:'Lora',serif}
        textarea::placeholder{color:rgba(200,185,240,0.35);font-style:italic}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.2);border-radius:2px}
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#080510' }}>

        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px 24px',
          background: 'rgba(8,5,16,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          zIndex: 10,
        }}>
          <Link href="/dashboard" style={{
            width: '36px', height: '36px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(200,185,240,0.6)', textDecoration: 'none',
            fontSize: '18px', transition: 'all 0.2s', flexShrink: 0,
          }}>←</Link>

          {/* Avatar */}
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg,rgba(30,15,60,1),${cfg.color.replace('1)', '0.7)')})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px',
            boxShadow: `0 0 16px ${cfg.color.replace('1)', '0.3)')}`,
          }}>{cfg.icon}</div>

          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '16px', fontWeight: 700, color: '#F0EBF8' }}>
              {cfg.name}
            </div>
            <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(120,220,120,0.85)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#78DC78', display: 'inline-block' }} />
              онлайн · {cfg.role}
            </div>
          </div>

          <div style={{
            padding: '5px 14px', borderRadius: '6px',
            background: cfg.color.replace('1)', '0.12)'),
            border: `1px solid ${cfg.color.replace('1)', '0.25)')}`,
            fontFamily: '"Playfair Display",serif', fontSize: '11px', fontWeight: 700,
            color: cfg.color.replace('1)', '0.9)'), letterSpacing: '1px',
          }}>{cfg.role.toUpperCase()}</div>

          <Link href="/dashboard" style={{
            fontFamily: '"Playfair Display",serif', fontSize: '20px', fontWeight: 900,
            color: 'rgba(200,180,255,0.35)', textDecoration: 'none', letterSpacing: '1px',
            marginLeft: '8px',
          }}>MYSTIC</Link>
        </header>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 16px' }}>

          {/* Greeting */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px', animation: 'msgIn 0.5s ease' }}>
            <div style={{ display: 'flex', gap: '10px', maxWidth: '75%' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,rgba(30,15,60,1),${cfg.color.replace('1)', '0.6)')})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              }}>{cfg.icon}</div>
              <div style={{
                padding: '14px 18px', borderRadius: '4px 18px 18px 18px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: '"Lora",serif', fontSize: '15px', lineHeight: 1.75,
                color: 'rgba(230,222,255,0.85)',
              }}>{cfg.greeting}</div>
            </div>
          </div>

          {/* Chat messages */}
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px',
              animation: 'msgIn 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg,rgba(30,15,60,1),${cfg.color.replace('1)', '0.6)')})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', marginRight: '10px', alignSelf: 'flex-end',
                }}>{cfg.icon}</div>
              )}
              <div style={{
                maxWidth: '72%', padding: '13px 17px',
                borderRadius: msg.role === 'user'
                  ? '18px 18px 4px 18px'
                  : '4px 18px 18px 18px',
                background: msg.role === 'user'
                  ? `linear-gradient(135deg,${cfg.color.replace('1)', '0.75)')},${cfg.color.replace('1)', '0.5)')})`
                  : 'rgba(255,255,255,0.07)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                fontFamily: '"Lora",serif', fontSize: '15px', lineHeight: 1.75,
                color: msg.role === 'user' ? 'rgba(255,250,235,0.95)' : 'rgba(230,222,255,0.85)',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px', animation: 'msgIn 0.3s ease' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg,rgba(30,15,60,1),${cfg.color.replace('1)', '0.6)')})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                }}>{cfg.icon}</div>
                <div style={{
                  padding: '14px 18px', borderRadius: '4px 18px 18px 18px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <TypingDots color={cfg.color.replace('1)', '0.7)')} />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '16px 24px 20px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(8,5,16,0.98)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${loading ? 'rgba(255,255,255,0.08)' : cfg.color.replace('1)', '0.25)')}`,
            borderRadius: '14px', padding: '12px 16px',
            transition: 'border-color 0.3s',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={cfg.placeholder}
              rows={1}
              disabled={loading}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: '#EDE8F5', fontSize: '15px', lineHeight: 1.6,
                maxHeight: '120px', overflowY: 'auto',
              }}
              onInput={e => {
                const t = e.target as HTMLTextAreaElement
                t.style.height = 'auto'
                t.style.height = Math.min(t.scrollHeight, 120) + 'px'
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                background: !input.trim() || loading
                  ? 'rgba(255,255,255,0.06)'
                  : `linear-gradient(135deg,${cfg.color.replace('1)', '0.9)')},${cfg.color.replace('1)', '0.65)')})`,
                border: 'none', cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s', fontSize: '18px',
                color: !input.trim() || loading ? 'rgba(200,185,240,0.3)' : '#0C0818',
              }}
            >→</button>
          </div>
          <div style={{
            textAlign: 'center', marginTop: '8px',
            fontFamily: '"Lora",serif', fontSize: '11px', fontStyle: 'italic',
            color: 'rgba(180,160,220,0.25)',
          }}>Enter — отправить · Shift+Enter — новая строка</div>
        </div>
      </div>
    </>
  )
}