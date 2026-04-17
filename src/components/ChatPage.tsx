'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import MessageRenderer from '@/components/MessageRenderer'

type Message = { role: 'user' | 'assistant'; content: string }

const FREE_LIMIT = 5
const FREE_CHAR_LIMIT = 300

const MODULE_CONFIG = {
  tarot: {
    name: 'Селена', role: 'Мастер Таро', color: 'rgba(201,168,76,1)',
    icon: '🃏', placeholder: 'Задайте вопрос для расклада... (до 300 символов)',
    greeting: 'Приветствую. Я Селена, ваш таролог. Карты уже разложены — задайте ваш вопрос, и я вытяну расклад специально для вас.',
    paywallHook: 'Карты открыли лишь часть истины о вашей ситуации...',
    paywallSub: 'Селена видит ещё многое — но для полного расклада нужен доступ.',
  },
  astrology: {
    name: 'Орион', role: 'Астролог', color: 'rgba(100,180,255,1)',
    icon: '⭐', placeholder: 'Введите дату рождения и вопрос... (до 300 символов)',
    greeting: 'Здравствуйте. Я Орион, ваш астролог. Назовите вашу дату рождения — и я прочту вашу карту.',
    paywallHook: 'Планеты говорят о вас гораздо больше...',
    paywallSub: 'Орион видит полную картину — транзиты, прогнозы, натальный чарт.',
  },
  numerology: {
    name: 'Мирра', role: 'Нумеролог', color: 'rgba(255,160,80,1)',
    icon: '🔢', placeholder: 'Введите имя и дату рождения... (до 300 символов)',
    greeting: 'Добро пожаловать. Я Мирра. Назовите полное имя и дату рождения.',
    paywallHook: 'Числа вашей судьбы раскрыты лишь наполовину...',
    paywallSub: 'Мирра готова дать полный числовой портрет вашей жизни.',
  },
  compatibility: {
    name: 'Сатья', role: 'Совместимость', color: 'rgba(192,112,255,1)',
    icon: '💫', placeholder: 'Введите имена и даты рождения... (до 300 символов)',
    greeting: 'Здравствуйте. Я Сатья. Назовите имена и даты рождения двух людей.',
    paywallHook: 'Тайна вашей связи раскрыта лишь частично...',
    paywallSub: 'Сатья готова показать полную глубину ваших отношений.',
  },
  destiny: {
    name: 'Аркана', role: 'Матрица Судьбы', color: 'rgba(255,120,180,1)',
    icon: '🔯', placeholder: 'Введите дату рождения для расчёта матрицы... (до 300 символов)',
    greeting: 'Приветствую. Я Аркана, мастер Матрицы Судьбы. Эта система раскрывает кармические задачи, таланты и предназначение через цифровой код вашего рождения. Назовите дату рождения — и я построю вашу матрицу.',
    paywallHook: 'Матрица показала лишь первый слой вашего предназначения...',
    paywallSub: 'Аркана готова раскрыть полную карту кармических задач и талантов.',
  },
}

type ModuleKey = keyof typeof MODULE_CONFIG

function TypingDots({ color }: { color: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center', verticalAlign: 'middle' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: '5px', height: '5px', borderRadius: '50%', display: 'inline-block',
          background: color, animation: 'tdot 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </span>
  )
}

// Paywall overlay
function Paywall({ module, cfg, onClose }: { module: string; cfg: typeof MODULE_CONFIG[ModuleKey]; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(4,2,12,0.96)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px',
      animation: 'fadeIn 0.4s ease',
    }}>
      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        {/* Icon */}
        <div style={{
          fontSize: '64px', marginBottom: '24px',
          filter: `drop-shadow(0 0 30px ${cfg.color.replace('1)', '0.5)')})`,
          animation: 'pulse 2s ease-in-out infinite',
        }}>{cfg.icon}</div>

        {/* Hook text */}
        <h2 style={{
          fontFamily: '"Playfair Display",serif',
          fontSize: 'clamp(22px,4vw,32px)', fontWeight: 900,
          color: '#F0EBF8', marginBottom: '12px', lineHeight: 1.2,
        }}>{cfg.paywallHook}</h2>

        <p style={{
          fontFamily: '"Lora",serif', fontSize: '16px', fontStyle: 'italic',
          color: 'rgba(210,200,240,0.55)', marginBottom: '36px', lineHeight: 1.8,
        }}>{cfg.paywallSub}</p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <Link href="/auth/register" style={{
            display: 'block', padding: '20px 24px', borderRadius: '12px',
            background: 'linear-gradient(135deg,rgba(80,30,160,0.4),rgba(120,60,220,0.2))',
            border: '1px solid rgba(150,100,255,0.5)',
            textDecoration: 'none', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '12px', right: '14px',
              padding: '3px 10px', borderRadius: '4px',
              background: 'rgba(120,200,80,0.15)', border: '1px solid rgba(120,200,80,0.4)',
              fontFamily: '"Playfair Display",serif', fontSize: '10px', fontWeight: 700,
              color: 'rgba(150,230,100,0.9)', letterSpacing: '1px',
            }}>ЛУЧШИЙ ВЫБОР</div>
            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '22px', fontWeight: 800, color: 'rgba(200,170,255,0.95)', marginBottom: '6px' }}>
              Initiate — $9.99/мес
            </div>
            <div style={{ fontFamily: '"Lora",serif', fontSize: '14px', fontStyle: 'italic', color: 'rgba(200,185,240,0.55)', marginBottom: '4px' }}>
              Все 4 консультанта · Безлимитно · Карта дня · Луна · Гороскоп
            </div>
            <div style={{ fontFamily: '"Lora",serif', fontSize: '13px', fontStyle: 'italic', color: 'rgba(200,185,240,0.35)' }}>
              Отмена в любой момент
            </div>
          </Link>
          <Link href="/auth/register" style={{
            display: 'block', padding: '18px 24px', borderRadius: '12px',
            background: 'linear-gradient(135deg,rgba(200,130,255,0.15),rgba(150,80,220,0.08))',
            border: '1px solid rgba(200,130,255,0.3)',
            textDecoration: 'none',
          }}>
            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '18px', fontWeight: 800, color: 'rgba(220,170,255,0.9)', marginBottom: '4px' }}>
              Oracle Pro — $16.99/мес
            </div>
            <div style={{ fontFamily: '"Lora",serif', fontSize: '13px', fontStyle: 'italic', color: 'rgba(200,185,240,0.45)' }}>
              Всё из Initiate + PDF-отчёты + Human Design + AI-память
            </div>
          </Link>
        </div>

        {/* Skip */}
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: '"Lora",serif', fontSize: '13px', fontStyle: 'italic',
          color: 'rgba(200,185,240,0.25)', transition: 'color 0.3s',
        }}>
          Вернуться к чату
        </button>
      </div>
    </div>
  )
}

// Soft upsell hint
function UpsellHint({ remaining, color, onUpgrade }: { remaining: number; color: string; onUpgrade: () => void }) {
  if (remaining > 2) return null
  return (
    <div style={{
      margin: '8px 0 4px',
      padding: '10px 16px',
      borderRadius: '10px',
      background: remaining === 1
        ? `linear-gradient(135deg,${color.replace('1)', '0.12)')},rgba(120,60,220,0.08))`
        : 'rgba(255,255,255,0.03)',
      border: `1px solid ${remaining === 1 ? color.replace('1)', '0.3)') : 'rgba(255,255,255,0.06)'}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: '12px', flexWrap: 'wrap',
      animation: 'fadeIn 0.5s ease',
    }}>
      <div>
        <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '13px', fontWeight: 700, color: remaining === 1 ? color.replace('1)', '0.9)') : 'rgba(200,185,240,0.5)' }}>
          {remaining === 1 ? '⚡ Последнее бесплатное сообщение' : `Осталось ${remaining} бесплатных сообщения`}
        </div>
        <div style={{ fontFamily: '"Lora",serif', fontSize: '12px', fontStyle: 'italic', color: 'rgba(200,185,240,0.35)', marginTop: '2px' }}>
          {remaining === 1 ? 'Получите полный ответ с подпиской $9.99/мес' : 'Подписка даёт безлимитный доступ'}
        </div>
      </div>
      <button onClick={onUpgrade} style={{
        padding: '7px 16px', borderRadius: '6px', cursor: 'pointer', border: 'none',
        background: `linear-gradient(135deg,${color.replace('1)', '0.8)')},${color.replace('1)', '0.5)')})`,
        fontFamily: '"Playfair Display",serif', fontSize: '11px', fontWeight: 700,
        color: '#0C0818', letterSpacing: '0.5px', whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>Подписаться</button>
    </div>
  )
}

export default function ChatPage({ module }: { module: ModuleKey }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const cfg = MODULE_CONFIG[module]

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('subscription_status').eq('id', user.id).single()
      if (profile?.subscription_status === 'active') setIsPro(true)
      setAuthLoading(false)
    })
  }, [router])

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.parentElement
      if (container) container.scrollTop = container.scrollHeight
    }
  }, [messages, loading])

  const remaining = FREE_LIMIT - msgCount

  const send = async () => {
    if (!input.trim() || loading || !user) return
    if (!isPro && msgCount >= FREE_LIMIT) { setShowPaywall(true); return }
    if (!isPro && input.length > FREE_CHAR_LIMIT) return

    const userMsg = input.trim()
    setInput('')
    setCharCount(0)
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: userMsg }],
          module, userId: user.id,
        }),
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
        if (!isPro) {
          const newCount = msgCount + 1
          setMsgCount(newCount)
          if (newCount >= FREE_LIMIT) {
            setTimeout(() => setShowPaywall(true), 2000)
          }
        }
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Произошла ошибка. Попробуйте ещё раз.' }])
    }
    setLoading(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const t = e.target as HTMLTextAreaElement
    t.style.height = 'auto'
    t.style.height = Math.min(t.scrollHeight, 120) + 'px'
    setCharCount(t.value.length)
  }

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#080510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '16px', letterSpacing: '3px', color: 'rgba(200,180,255,0.5)' }}>ЗАГРУЗКА...</div>
    </div>
  )

  const isOverLimit = !isPro && charCount > FREE_CHAR_LIMIT
  const isAtLimit = !isPro && msgCount >= FREE_LIMIT

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif;overflow:hidden}
        @keyframes tdot{0%,60%,100%{transform:translateY(0);opacity:.35}30%{transform:translateY(-4px);opacity:1}}
        @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        textarea{resize:none;outline:none;font-family:'Lora',serif}
        textarea::placeholder{color:rgba(200,185,240,0.35);font-style:italic}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.2);border-radius:2px}
      `}</style>

      {showPaywall && <Paywall module={module} cfg={cfg} onClose={() => setShowPaywall(false)} />}

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#080510' }}>

        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', gap: '14px',
          padding: '14px 24px',
          background: 'rgba(8,5,16,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <Link href="/dashboard" style={{
            width: '36px', height: '36px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(200,185,240,0.6)', textDecoration: 'none', fontSize: '18px', flexShrink: 0,
          }}>←</Link>

          <div style={{
            width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg,rgba(30,15,60,1),${cfg.color.replace('1)', '0.7)')})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            boxShadow: `0 0 16px ${cfg.color.replace('1)', '0.3)')}`,
          }}>{cfg.icon}</div>

          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '16px', fontWeight: 700, color: '#F0EBF8' }}>{cfg.name}</div>
            <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(120,220,120,0.85)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#78DC78', display: 'inline-block' }} />
              онлайн · {cfg.role}
            </div>
          </div>

          {!isPro && (
            <div style={{
              padding: '5px 12px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: '"Playfair Display",serif', fontSize: '11px', fontWeight: 700,
              color: remaining <= 1 ? 'rgba(255,160,80,0.9)' : 'rgba(200,185,240,0.4)',
              letterSpacing: '1px',
            }}>
              {remaining > 0 ? `${remaining} из ${FREE_LIMIT}` : '0 / 3'}
            </div>
          )}

          {isPro && (
            <div style={{
              padding: '5px 12px', borderRadius: '6px',
              background: 'rgba(120,200,80,0.08)', border: '1px solid rgba(120,200,80,0.25)',
              fontFamily: '"Playfair Display",serif', fontSize: '11px', fontWeight: 700,
              color: 'rgba(150,230,100,0.8)', letterSpacing: '1px',
            }}>PRO ✓</div>
          )}

          <Link href="/dashboard" style={{
            fontFamily: '"Playfair Display",serif', fontSize: '18px', fontWeight: 900,
            color: 'rgba(200,180,255,0.3)', textDecoration: 'none', letterSpacing: '1px', marginLeft: '8px',
          }}>MYSTIC</Link>
        </header>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 8px' }}>

          {/* Greeting */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px', animation: 'msgIn 0.5s ease' }}>
            <div style={{ display: 'flex', gap: '10px', maxWidth: '78%' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,rgba(30,15,60,1),${cfg.color.replace('1)', '0.6)')})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              }}>{cfg.icon}</div>
              <div style={{
                padding: '14px 18px', borderRadius: '4px 18px 18px 18px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: '"Lora",serif', fontSize: '15px', lineHeight: 1.75, color: 'rgba(230,222,255,0.85)',
              }}>{cfg.greeting}</div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '8px',
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
                maxWidth: '75%', padding: '13px 17px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                background: msg.role === 'user'
                  ? `linear-gradient(135deg,${cfg.color.replace('1)', '0.75)')},${cfg.color.replace('1)', '0.5)')})`
                  : 'rgba(255,255,255,0.07)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                fontFamily: '"Lora",serif', fontSize: '15px', lineHeight: 1.75,
                color: msg.role === 'user' ? 'rgba(255,250,235,0.95)' : 'rgba(230,222,255,0.85)',
              }}>
                {msg.role === 'user' ? msg.content : <MessageRenderer content={msg.content} color={cfg.color} />}
              </div>
            </div>
          ))}

          {/* Upsell hint after AI response */}
          {!isPro && msgCount > 0 && !loading && (
            <UpsellHint
              remaining={remaining}
              color={cfg.color}
              onUpgrade={() => setShowPaywall(true)}
            />
          )}

          {/* Typing */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px', animation: 'msgIn 0.3s ease' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg,rgba(30,15,60,1),${cfg.color.replace('1)', '0.6)')})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                }}>{cfg.icon}</div>
                <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <TypingDots color={cfg.color.replace('1)', '0.7)')} />
                </div>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '12px 24px 20px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(8,5,16,0.98)',
          flexShrink: 0,
        }}>
          {isAtLimit ? (
            <div style={{
              padding: '16px', borderRadius: '12px', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(150,100,255,0.2)',
            }}>
              <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '15px', fontWeight: 700, color: 'rgba(200,180,255,0.8)', marginBottom: '12px' }}>
                Бесплатные сообщения исчерпаны
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/auth/register" style={{
                  padding: '10px 22px', borderRadius: '8px', textDecoration: 'none',
                  background: 'linear-gradient(135deg,rgba(80,30,160,0.8),rgba(120,60,220,0.6))',
                  fontFamily: '"Playfair Display",serif', fontSize: '12px', fontWeight: 700,
                  color: '#EDE8F5', letterSpacing: '0.5px',
                }}>Initiate — $9.99/мес</Link>
                <Link href="/auth/register" style={{
                  padding: '10px 22px', borderRadius: '8px', textDecoration: 'none',
                  background: 'linear-gradient(135deg,rgba(150,80,220,0.6),rgba(200,100,255,0.4))',
                  fontFamily: '"Playfair Display",serif', fontSize: '12px', fontWeight: 700,
                  color: '#EDE8F5', letterSpacing: '0.5px',
                }}>Oracle Pro — $16.99/мес</Link>
              </div>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex', gap: '10px', alignItems: 'flex-end',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${isOverLimit ? 'rgba(255,80,80,0.4)' : cfg.color.replace('1)', '0.25)')}`,
                borderRadius: '14px', padding: '12px 16px',
                transition: 'border-color 0.3s',
              }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); setCharCount(e.target.value.length) }}
                  onKeyDown={onKeyDown}
                  onInput={onInput}
                  placeholder={cfg.placeholder}
                  rows={1}
                  disabled={loading}
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    color: '#EDE8F5', fontSize: '15px', lineHeight: 1.6,
                    maxHeight: '120px', overflowY: 'auto',
                  }}
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim() || isOverLimit}
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                    background: !input.trim() || loading || isOverLimit
                      ? 'rgba(255,255,255,0.06)'
                      : `linear-gradient(135deg,${cfg.color.replace('1)', '0.9)')},${cfg.color.replace('1)', '0.65)')})`,
                    border: 'none', cursor: !input.trim() || loading || isOverLimit ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s', fontSize: '18px',
                    color: !input.trim() || loading || isOverLimit ? 'rgba(200,185,240,0.3)' : '#0C0818',
                  }}
                >→</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', padding: '0 2px' }}>
                <div style={{ fontFamily: '"Lora",serif', fontSize: '11px', fontStyle: 'italic', color: 'rgba(180,160,220,0.25)' }}>
                  Enter — отправить · Shift+Enter — новая строка
                </div>
                {!isPro && (
                  <div style={{
                    fontFamily: '"Playfair Display",serif', fontSize: '11px', fontWeight: 700,
                    color: isOverLimit ? 'rgba(255,100,100,0.8)' : charCount > FREE_CHAR_LIMIT * 0.8 ? 'rgba(255,160,80,0.7)' : 'rgba(180,160,220,0.3)',
                  }}>
                    {charCount}/{FREE_CHAR_LIMIT}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}