'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import MessageRenderer from '@/components/MessageRenderer'

type Message = { role: 'user' | 'assistant'; content: string; module?: string }

const FREE_LIMIT = 5
const FREE_CHAR_LIMIT = 300

const CONSULTANTS = [
  {
    key: 'tarot', name: 'Селена', role: 'Мастер Таро', icon: '🃏',
    color: 'rgba(201,168,76,1)', bg: 'rgba(201,168,76,0.08)',
    border: 'rgba(201,168,76,0.2)',
    greeting: 'Приветствую. Я Селена, ваш таролог. Карты уже разложены — задайте вопрос, и я вытяну расклад специально для вас.',
    placeholder: 'Задайте вопрос для расклада...',
    paywallHook: 'Карты открыли лишь часть истины...',
  },
  {
    key: 'astrology', name: 'Орион', role: 'Астролог', icon: '⭐',
    color: 'rgba(100,180,255,1)', bg: 'rgba(100,180,255,0.08)',
    border: 'rgba(100,180,255,0.2)',
    greeting: 'Здравствуйте. Я Орион, ваш астролог. Назовите дату рождения — и я прочту вашу натальную карту.',
    placeholder: 'Введите дату рождения и вопрос...',
    paywallHook: 'Планеты говорят о вас гораздо больше...',
  },
  {
    key: 'numerology', name: 'Мирра', role: 'Нумеролог', icon: '🔢',
    color: 'rgba(255,160,80,1)', bg: 'rgba(255,160,80,0.08)',
    border: 'rgba(255,160,80,0.2)',
    greeting: 'Добро пожаловать. Я Мирра. Назовите полное имя и дату рождения — открою ваш числовой код.',
    placeholder: 'Введите имя и дату рождения...',
    paywallHook: 'Числа вашей судьбы раскрыты лишь наполовину...',
  },
  {
    key: 'compatibility', name: 'Сатья', role: 'Совместимость', icon: '💫',
    color: 'rgba(192,112,255,1)', bg: 'rgba(192,112,255,0.08)',
    border: 'rgba(192,112,255,0.2)',
    greeting: 'Здравствуйте. Я Сатья. Назовите имена и даты рождения двух людей.',
    placeholder: 'Введите имена и даты рождения...',
    paywallHook: 'Тайна вашей связи раскрыта лишь частично...',
  },
]

function TypingDots({ color }: { color: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width:'5px',height:'5px',borderRadius:'50%',background:color,
          animation:'tdot 1.2s ease-in-out infinite',animationDelay:`${i*0.18}s`,display:'inline-block' }}/>
      ))}
    </span>
  )
}

export default function ChatPageWithSidebar() {
  const [activeKey, setActiveKey] = useState('tarot')
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const consultant = CONSULTANTS.find(c => c.key === activeKey)!
  const currentMessages = messages[activeKey] || []

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('subscription_status,free_messages_used').eq('id',user.id).single()
      if (profile?.subscription_status === 'active') setIsPro(true)
      if (profile?.free_messages_used) setMsgCount(profile.free_messages_used)
      setAuthLoading(false)
    })
  }, [router])

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current.parentElement
      if (container) container.scrollTop = container.scrollHeight
    }
  }, [currentMessages, loading])

  const send = async () => {
    if (!input.trim() || loading || !user) return
    if (!isPro && msgCount >= FREE_LIMIT) { setShowPaywall(true); return }
    if (!isPro && input.length > FREE_CHAR_LIMIT) return

    const userMsg = input.trim()
    setInput('')
    setCharCount(0)
    setMessages(prev => ({
      ...prev,
      [activeKey]: [...(prev[activeKey] || []), { role: 'user', content: userMsg, module: activeKey }]
    }))
    setLoading(true)

    try {
      const history = currentMessages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...history, { role: 'user', content: userMsg }], module: activeKey, userId: user.id }),
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => ({
          ...prev,
          [activeKey]: [...(prev[activeKey] || []), { role: 'assistant', content: data.message, module: activeKey }]
        }))
        if (!isPro) {
          const newCount = msgCount + 1
          setMsgCount(newCount)
          await supabase.from('profiles').update({ free_messages_used: newCount }).eq('id', user.id)
          if (newCount >= FREE_LIMIT) setTimeout(() => setShowPaywall(true), 2000)
        }
      }
    } catch {
      setMessages(prev => ({
        ...prev,
        [activeKey]: [...(prev[activeKey] || []), { role: 'assistant', content: 'Произошла ошибка. Попробуйте ещё раз.', module: activeKey }]
      }))
    }
    setLoading(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const remaining = FREE_LIMIT - msgCount
  const isOverLimit = !isPro && charCount > FREE_CHAR_LIMIT
  const isAtLimit = !isPro && msgCount >= FREE_LIMIT

  if (authLoading) return (
    <div style={{minHeight:'100vh',background:'#080510',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',letterSpacing:'3px',color:'rgba(200,180,255,0.5)'}}>ЗАГРУЗКА...</div>
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
        ::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.2);border-radius:2px}
        .consultant-btn{background:transparent;border:none;cursor:pointer;width:100%;text-align:left;border-radius:10px;padding:12px;transition:all 0.2s}
        .consultant-btn:hover{background:rgba(255,255,255,0.04)}
      `}</style>

      {/* Paywall */}
      {showPaywall && (
        <div style={{position:'fixed',inset:0,zIndex:50,background:'rgba(4,2,12,0.96)',display:'flex',alignItems:'center',justifyContent:'center',padding:'32px',animation:'fadeIn 0.4s ease'}}
          onClick={() => setShowPaywall(false)}>
          <div style={{maxWidth:'460px',width:'100%',background:'rgba(12,8,30,0.99)',border:'1px solid rgba(150,100,255,0.25)',borderRadius:'20px',padding:'40px 32px',position:'relative'}}
            onClick={e => e.stopPropagation()}>
            <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(150,100,255,0.7),transparent)',borderRadius:'20px 20px 0 0'}}/>
            <button onClick={() => setShowPaywall(false)} style={{position:'absolute',top:'16px',right:'16px',background:'none',border:'none',cursor:'pointer',color:'rgba(200,185,240,0.3)',fontSize:'22px'}}>×</button>
            <div style={{textAlign:'center',marginBottom:'28px'}}>
              <div style={{fontSize:'48px',marginBottom:'12px'}}>{consultant.icon}</div>
              <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:900,color:'#EDE8F5',marginBottom:'8px'}}>{consultant.paywallHook}</h2>
              <p style={{fontFamily:'"Lora",serif',fontSize:'14px',fontStyle:'italic',color:'rgba(200,185,240,0.5)'}}>Подпишитесь чтобы продолжить</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <Link href="/#pricing" style={{display:'block',padding:'16px',borderRadius:'10px',background:'linear-gradient(135deg,rgba(100,60,220,0.8),rgba(160,100,255,0.6))',textAlign:'center',fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:800,color:'#EDE8F5',textDecoration:'none'}}>
                Initiate — $9.99/мес
              </Link>
              <Link href="/#pricing" style={{display:'block',padding:'16px',borderRadius:'10px',background:'linear-gradient(135deg,rgba(150,80,200,0.6),rgba(200,120,255,0.4))',textAlign:'center',fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:800,color:'#EDE8F5',textDecoration:'none'}}>
                Oracle Pro — $16.99/мес
              </Link>
            </div>
          </div>
        </div>
      )}

      <div style={{display:'flex',height:'100vh',background:'#080510'}}>

        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? '260px' : '64px',
          flexShrink: 0,
          background:'rgba(6,3,16,0.98)',
          borderRight:'1px solid rgba(255,255,255,0.07)',
          display:'flex',flexDirection:'column',
          transition:'width 0.3s ease',
          overflow:'hidden',
        }}>
          {/* Sidebar header */}
          <div style={{padding:'16px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px'}}>
            {sidebarOpen && (
              <Link href="/dashboard" style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:900,color:'rgba(200,180,255,0.4)',textDecoration:'none',letterSpacing:'1px',whiteSpace:'nowrap'}}>
                MYSTIC<span style={{fontSize:'10px',verticalAlign:'super',marginLeft:'2px',fontWeight:400}}>AI</span>
              </Link>
            )}
            <button onClick={() => setSidebarOpen(p => !p)} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'6px',padding:'6px 8px',cursor:'pointer',color:'rgba(200,185,240,0.5)',fontSize:'14px',flexShrink:0}}>
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* Consultants list */}
          <div style={{padding:'10px',flex:1,overflow:'auto'}}>
            {sidebarOpen && <div style={{fontFamily:'"Playfair Display",serif',fontSize:'9px',letterSpacing:'3px',color:'rgba(180,150,255,0.35)',textTransform:'uppercase',padding:'8px 4px 12px'}}>Консультанты</div>}
            {CONSULTANTS.map(c => (
              <button key={c.key} className="consultant-btn" onClick={() => setActiveKey(c.key)}
                style={{background: activeKey===c.key ? c.bg : 'transparent',
                  border: `1px solid ${activeKey===c.key ? c.border : 'transparent'}`,
                  borderRadius:'10px',
                }}>
                <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <div style={{
                    width:'36px',height:'36px',borderRadius:'50%',flexShrink:0,
                    background: activeKey===c.key ? c.color.replace('1)','0.2)') : 'rgba(255,255,255,0.05)',
                    border:`1px solid ${activeKey===c.key ? c.color.replace('1)','0.4)') : 'rgba(255,255,255,0.08)'}`,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',
                  }}>{c.icon}</div>
                  {sidebarOpen && (
                    <div>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,
                        color: activeKey===c.key ? '#EDE8F5' : 'rgba(200,185,240,0.5)',whiteSpace:'nowrap'}}>
                        {c.name}
                      </div>
                      <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',
                        color: activeKey===c.key ? c.color.replace('1)','0.6)') : 'rgba(200,185,240,0.3)',whiteSpace:'nowrap'}}>
                        {c.role}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Bottom links */}
          {sidebarOpen && (
            <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
              <Link href="/dashboard" style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px',borderRadius:'8px',textDecoration:'none',color:'rgba(200,185,240,0.35)',fontFamily:'"Lora",serif',fontSize:'12px',transition:'all 0.2s'}}>
                ← Дашборд
              </Link>
              {!isPro && (
                <div style={{marginTop:'10px',padding:'12px',borderRadius:'8px',background:'rgba(150,100,255,0.06)',border:'1px solid rgba(150,100,255,0.15)'}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(180,150,255,0.7)',marginBottom:'4px'}}>
                    {remaining > 0 ? `Осталось ${remaining} из ${FREE_LIMIT}` : 'Лимит исчерпан'}
                  </div>
                  <Link href="/#pricing" style={{display:'block',textAlign:'center',padding:'6px',borderRadius:'6px',background:'linear-gradient(135deg,rgba(120,60,220,0.8),rgba(180,100,255,0.6))',fontFamily:'"Playfair Display",serif',fontSize:'10px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'0.5px',marginTop:'6px'}}>
                    Подписаться
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat area */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

          {/* Chat header */}
          <div style={{padding:'14px 20px',borderBottom:'1px solid rgba(255,255,255,0.07)',background:'rgba(8,5,16,0.98)',display:'flex',alignItems:'center',gap:'12px',flexShrink:0}}>
            <div style={{width:'40px',height:'40px',borderRadius:'50%',flexShrink:0,background:consultant.color.replace('1)','0.15)'),border:`1px solid ${consultant.color.replace('1)','0.3)')}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',boxShadow:`0 0 16px ${consultant.color.replace('1)','0.25)')}`}}>
              {consultant.icon}
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:700,color:'#F0EBF8'}}>{consultant.name}</div>
              <div style={{display:'flex',alignItems:'center',gap:'5px',fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(120,220,120,0.85)'}}>
                <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#78DC78',display:'inline-block'}}/>
                онлайн · {consultant.role}
              </div>
            </div>
            {!isPro && remaining > 0 && (
              <div style={{padding:'5px 12px',borderRadius:'6px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:remaining<=1?'rgba(255,160,80,0.9)':'rgba(200,185,240,0.4)',letterSpacing:'1px'}}>
                {remaining}/{FREE_LIMIT}
              </div>
            )}
            {isPro && <div style={{padding:'5px 12px',borderRadius:'6px',background:'rgba(120,200,80,0.08)',border:'1px solid rgba(120,200,80,0.25)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(150,230,100,0.8)',letterSpacing:'1px'}}>PRO ✓</div>}
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:'auto',padding:'24px 24px 8px'}}>
            {/* Greeting */}
            <div style={{display:'flex',justifyContent:'flex-start',marginBottom:'16px',animation:'msgIn 0.5s ease'}}>
              <div style={{display:'flex',gap:'10px',maxWidth:'78%'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',flexShrink:0,background:consultant.color.replace('1)','0.15)'),border:`1px solid ${consultant.color.replace('1)','0.3)')}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>{consultant.icon}</div>
                <div style={{padding:'14px 18px',borderRadius:'4px 18px 18px 18px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)',fontFamily:'"Lora",serif',fontSize:'15px',lineHeight:1.75,color:'rgba(230,222,255,0.85)'}}>
                  {consultant.greeting}
                </div>
              </div>
            </div>

            {currentMessages.map((msg, i) => (
              <div key={i} style={{display:'flex',justifyContent:msg.role==='user'?'flex-end':'flex-start',marginBottom:'10px',animation:'msgIn 0.4s ease'}}>
                {msg.role==='assistant' && (
                  <div style={{width:'32px',height:'32px',borderRadius:'50%',flexShrink:0,background:consultant.color.replace('1)','0.15)'),border:`1px solid ${consultant.color.replace('1)','0.3)')}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',marginRight:'10px',alignSelf:'flex-end'}}>{consultant.icon}</div>
                )}
                <div style={{maxWidth:'75%',padding:'13px 17px',borderRadius:msg.role==='user'?'18px 18px 4px 18px':'4px 18px 18px 18px',
                  background:msg.role==='user'?`linear-gradient(135deg,${consultant.color.replace('1)','0.75)')},${consultant.color.replace('1)','0.5)')})`:'rgba(255,255,255,0.07)',
                  border:msg.role==='user'?'none':'1px solid rgba(255,255,255,0.08)',
                  color:msg.role==='user'?'rgba(255,250,235,0.95)':'rgba(230,222,255,0.85)',
                }}>
                  {msg.role==='user' ? <span style={{fontFamily:'"Lora",serif',fontSize:'15px',lineHeight:1.75}}>{msg.content}</span> : <MessageRenderer content={msg.content} color={consultant.color}/>}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{display:'flex',gap:'10px',marginBottom:'10px',animation:'msgIn 0.3s ease'}}>
                <div style={{width:'32px',height:'32px',borderRadius:'50%',flexShrink:0,background:consultant.color.replace('1)','0.15)'),border:`1px solid ${consultant.color.replace('1)','0.3)')}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>{consultant.icon}</div>
                <div style={{padding:'14px 18px',borderRadius:'4px 18px 18px 18px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.08)'}}>
                  <TypingDots color={consultant.color.replace('1)','0.7)')} />
                </div>
              </div>
            )}
            <div ref={scrollRef}/>
          </div>

          {/* Input */}
          <div style={{padding:'12px 20px 20px',borderTop:'1px solid rgba(255,255,255,0.07)',background:'rgba(8,5,16,0.98)',flexShrink:0}}>
            {isAtLimit ? (
              <div style={{padding:'16px',borderRadius:'12px',textAlign:'center',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(150,100,255,0.2)'}}>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:'rgba(200,180,255,0.8)',marginBottom:'10px'}}>Бесплатные сообщения исчерпаны</div>
                <Link href="/#pricing" style={{padding:'10px 24px',borderRadius:'8px',background:'linear-gradient(135deg,rgba(80,30,160,0.8),rgba(120,60,220,0.6))',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'0.5px'}}>
                  Подписаться — от $9.99/мес
                </Link>
              </div>
            ) : (
              <>
                <div style={{display:'flex',gap:'10px',alignItems:'flex-end',background:'rgba(255,255,255,0.05)',border:`1px solid ${isOverLimit?'rgba(255,80,80,0.4)':consultant.color.replace('1)','0.25)')}`,borderRadius:'14px',padding:'12px 16px',transition:'border-color 0.3s'}}>
                  <textarea
                    value={input}
                    onChange={e => { setInput(e.target.value); setCharCount(e.target.value.length) }}
                    onKeyDown={onKeyDown}
                    onInput={e => { const t=e.target as HTMLTextAreaElement; t.style.height='auto'; t.style.height=Math.min(t.scrollHeight,120)+'px' }}
                    placeholder={consultant.placeholder}
                    rows={1}
                    disabled={loading}
                    style={{flex:1,background:'transparent',border:'none',color:'#EDE8F5',fontSize:'15px',lineHeight:1.6,maxHeight:'120px',overflowY:'auto'}}
                  />
                  <button onClick={send} disabled={loading||!input.trim()||isOverLimit} style={{width:'40px',height:'40px',borderRadius:'10px',flexShrink:0,
                    background:!input.trim()||loading||isOverLimit?'rgba(255,255,255,0.06)':`linear-gradient(135deg,${consultant.color.replace('1)','0.9)')},${consultant.color.replace('1)','0.65)')})`,
                    border:'none',cursor:!input.trim()||loading||isOverLimit?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s',fontSize:'18px',
                    color:!input.trim()||loading||isOverLimit?'rgba(200,185,240,0.3)':'#0C0818'}}>→</button>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:'6px',padding:'0 2px'}}>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'11px',fontStyle:'italic',color:'rgba(180,160,220,0.25)'}}>Enter — отправить · Shift+Enter — новая строка</div>
                  {!isPro && <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:isOverLimit?'rgba(255,100,100,0.8)':charCount>FREE_CHAR_LIMIT*0.8?'rgba(255,160,80,0.7)':'rgba(180,160,220,0.3)'}}>{charCount}/{FREE_CHAR_LIMIT}</div>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}