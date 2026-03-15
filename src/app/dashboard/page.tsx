'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Moon phase calculator
function getMoonPhase() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const c = Math.floor((year - 1900) * 12.3685)
  const e = c + Math.floor((month - 1) * 1.0165)
  const jd = e * 29.53058867 + 2415020.75933
  const phase = ((now.getTime() / 86400000 + 2440587.5 - jd) % 29.53058867) / 29.53058867
  const p = ((phase % 1) + 1) % 1
  if (p < 0.03) return { name: 'Новолуние', icon: '🌑', energy: 'Время новых намерений и начинаний', pct: 0 }
  if (p < 0.22) return { name: 'Растущая луна', icon: '🌒', energy: 'Время роста, привлечения и созидания', pct: p * 100 }
  if (p < 0.28) return { name: 'Первая четверть', icon: '🌓', energy: 'Время действий и преодоления препятствий', pct: 50 }
  if (p < 0.47) return { name: 'Прибывающая луна', icon: '🌔', energy: 'Время усиления намерений', pct: p * 100 }
  if (p < 0.53) return { name: 'Полнолуние', icon: '🌕', energy: 'Пик энергии. Время завершений и благодарности', pct: 100 }
  if (p < 0.72) return { name: 'Убывающая луна', icon: '🌖', energy: 'Время отпускания и очищения', pct: (1 - p) * 100 }
  if (p < 0.78) return { name: 'Последняя четверть', icon: '🌗', energy: 'Время подведения итогов', pct: 25 }
  return { name: 'Убывающая луна', icon: '🌘', energy: 'Время покоя и внутренней работы', pct: (1 - p) * 30 }
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
  { name: 'Справедливость', number: 'XI', meaning: 'Баланс восстанавливается. Честность и ясность приведут к верному решению.' },
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

const HOROSCOPES: Record<string, string> = {
  'Овен': 'Марс energizes you today. Bold moves in career will pay off — speak your truth in meetings. Evening favours intimate connections.',
  'Телец': 'Venus highlights your creative side. Financial intuition is sharp — trust your gut on money matters. Avoid overindulgence.',
  'Близнецы': 'Mercury sharpens your mind. Conversations lead to breakthroughs. Write down ideas — one of them is gold.',
  'Рак': 'The Moon, your ruler, brings emotional clarity. Home matters need attention. A family connection heals something old.',
  'Лев': 'The Sun illuminates your natural magnetism. Leadership opportunities arise — step forward confidently. Love is highlighted.',
  'Дева': 'Mercury brings analytical precision. Health routines matter today. A practical solution to a long-standing problem emerges.',
  'Весы': 'Venus brings harmony to relationships. Negotiations in your favour. Beauty and aesthetics inspire your decisions.',
  'Скорпион': 'Pluto deepens your perception. Hidden information surfaces. Transformation begins with honest self-examination.',
  'Стрелец': 'Jupiter expands your horizons. Travel or learning opportunities knock. Say yes to the adventure.',
  'Козерог': 'Saturn rewards discipline today. Career recognition is possible. Your long-term plans gain solid ground.',
  'Водолей': 'Uranus sparks originality. Unconventional approaches win. Connect with like-minded souls — collaboration transforms.',
  'Рыбы': 'Neptune deepens intuition. Artistic and spiritual pursuits are blessed. Dreams carry important messages tonight.',
}

const ZODIAC_SIGNS = ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы']

const MODULE_COLORS: Record<string, string> = {
  tarot: 'rgba(201,168,76,1)',
  astrology: 'rgba(100,180,255,1)',
  numerology: 'rgba(255,160,80,1)',
  compatibility: 'rgba(192,112,255,1)',
}
const MODULE_ICONS: Record<string, string> = {
  tarot: '🃏', astrology: '⭐', numerology: '🔢', compatibility: '💫',
}
const MODULE_NAMES: Record<string, string> = {
  tarot: 'Таро', astrology: 'Астрология', numerology: 'Нумерология', compatibility: 'Совместимость',
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])
  const [zodiac, setZodiac] = useState('')
  const [isPro, setIsPro] = useState(false)
  const router = useRouter()

  const moon = getMoonPhase()
  const today = new Date()
  const cardIdx = (today.getDate() + today.getMonth() * 31) % DAILY_CARDS.length
  const dailyCard = DAILY_CARDS[cardIdx]

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      // Load chat history
      const { data: msgs } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(5)
      if (msgs) setHistory(msgs)

      // Load profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()
      if (profile?.subscription_status === 'active') setIsPro(true)

      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '14px', letterSpacing: '3px', color: 'rgba(200,180,255,0.5)' }}>ЗАГРУЗКА...</div>
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
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#080510}
        ::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.2);border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.5}}
        @keyframes moonGlow{0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.3)}50%{box-shadow:0 0 40px rgba(201,168,76,0.5)}}
        .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:24px;animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both}
        .module-btn{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:20px;cursor:pointer;text-decoration:none;display:block;transition:all 0.3s;position:relative;overflow:hidden}
        .module-btn:hover{transform:translateY(-4px)}
        .pro-badge{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:4px;background:rgba(255,160,30,0.12);border:1px solid rgba(255,160,30,0.3);font-family:'Playfair Display',serif;font-size:10px;font-weight:700;color:rgba(255,180,60,0.9);letter-spacing:1px}
        select{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:#EDE8F5;font-family:'Lora',serif;font-size:14px;padding:10px 14px;outline:none;cursor:pointer;width:100%}
        select option{background:#1A0F3A;color:#EDE8F5}
      `}</style>

      {/* Stars bg */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${(i * 41 + 17) % 100}%`, top: `${(i * 67 + 9) % 100}%`,
            width: '1px', height: '1px', borderRadius: '50%', background: 'rgba(230,220,255,0.8)',
            animation: `twinkle ${3 + i % 5}s ease-in-out infinite`, animationDelay: `${(i * 0.3) % 4}s`,
          }} />
        ))}
        <div style={{ position: 'absolute', top: '-20%', left: '20%', width: '70vw', height: '70vw', maxWidth: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(60,20,120,0.10) 0%,transparent 70%)', pointerEvents: 'none' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '32px 28px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ fontFamily: '"Playfair Display",serif', fontSize: '20px', fontWeight: 900, color: 'rgba(200,180,255,0.5)', textDecoration: 'none', letterSpacing: '1px' }}>
            MYSTIC<span style={{ fontSize: '12px', fontWeight: 400, verticalAlign: 'super', marginLeft: '2px', color: 'rgba(150,100,255,0.5)' }}>AI</span>
          </Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {isPro && <span className="pro-badge">⚡ PRO</span>}
            <button onClick={handleLogout} style={{ padding: '8px 18px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontFamily: '"Playfair Display",serif', fontSize: '11px', letterSpacing: '2px', color: 'rgba(200,185,240,0.4)', cursor: 'pointer', transition: 'all 0.3s' }}>ВЫЙТИ</button>
          </div>
        </div>

        {/* Welcome */}
        <div style={{ marginBottom: '40px', animation: 'fadeUp 0.5s ease both' }}>
          <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '11px', letterSpacing: '4px', color: 'rgba(180,150,255,0.45)', marginBottom: '10px', textTransform: 'uppercase' }}>Добро пожаловать</div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, color: '#EDE8F5', marginBottom: '6px' }}>{name}</h1>
          <p style={{ fontFamily: '"Lora",serif', fontSize: '16px', fontStyle: 'italic', color: 'rgba(200,185,240,0.4)' }}>
            {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* TOP ROW — Daily card + Moon + Horoscope */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>

          {/* Daily Tarot Card */}
          <div className="card" style={{ animationDelay: '0.1s', position: 'relative', overflow: 'hidden' }}>
            {!isPro && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,22,0.85)', zIndex: 5, borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: '28px' }}>🔒</div>
                <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '13px', fontWeight: 700, color: 'rgba(200,180,255,0.7)', textAlign: 'center', letterSpacing: '1px' }}>Только для подписчиков</div>
                <Link href="/#pricing" style={{ padding: '8px 18px', borderRadius: '6px', background: 'linear-gradient(135deg,#6030B0,#9060E0)', fontFamily: '"Playfair Display",serif', fontSize: '11px', fontWeight: 700, color: '#EDE8F5', textDecoration: 'none', letterSpacing: '1px' }}>Подписаться</Link>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '11px', letterSpacing: '3px', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase' }}>Карта дня</div>
              <div style={{ fontSize: '20px' }}>🃏</div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '22px', fontWeight: 900, color: '#C9A84C', marginBottom: '4px' }}>{dailyCard.name}</div>
              <div style={{ fontFamily: '"Lora",serif', fontSize: '12px', fontStyle: 'italic', color: 'rgba(201,168,76,0.5)' }}>Аркан {dailyCard.number}</div>
            </div>
            <p style={{ fontFamily: '"Lora",serif', fontSize: '13.5px', lineHeight: 1.7, color: 'rgba(220,210,245,0.6)', fontStyle: 'italic' }}>{dailyCard.meaning}</p>
          </div>

          {/* Moon Calendar */}
          <div className="card" style={{ animationDelay: '0.2s', position: 'relative', overflow: 'hidden' }}>
            {!isPro && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,22,0.85)', zIndex: 5, borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: '28px' }}>🔒</div>
                <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '13px', fontWeight: 700, color: 'rgba(200,180,255,0.7)', textAlign: 'center', letterSpacing: '1px' }}>Только для подписчиков</div>
                <Link href="/#pricing" style={{ padding: '8px 18px', borderRadius: '6px', background: 'linear-gradient(135deg,#6030B0,#9060E0)', fontFamily: '"Playfair Display",serif', fontSize: '11px', fontWeight: 700, color: '#EDE8F5', textDecoration: 'none', letterSpacing: '1px' }}>Подписаться</Link>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '11px', letterSpacing: '3px', color: 'rgba(180,150,255,0.6)', textTransform: 'uppercase' }}>Луна сегодня</div>
              <div style={{ fontSize: '20px' }}>{moon.icon}</div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px', animation: 'moonGlow 3s ease-in-out infinite' }}>{moon.icon}</div>
              <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '18px', fontWeight: 700, color: '#EDE8F5', marginBottom: '4px' }}>{moon.name}</div>
            </div>
            <p style={{ fontFamily: '"Lora",serif', fontSize: '13.5px', lineHeight: 1.7, color: 'rgba(220,210,245,0.6)', fontStyle: 'italic' }}>{moon.energy}</p>
          </div>

          {/* Horoscope */}
          <div className="card" style={{ animationDelay: '0.3s', position: 'relative', overflow: 'hidden' }}>
            {!isPro && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,5,22,0.85)', zIndex: 5, borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', backdropFilter: 'blur(4px)' }}>
                <div style={{ fontSize: '28px' }}>🔒</div>
                <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '13px', fontWeight: 700, color: 'rgba(200,180,255,0.7)', textAlign: 'center', letterSpacing: '1px' }}>Только для подписчиков</div>
                <Link href="/#pricing" style={{ padding: '8px 18px', borderRadius: '6px', background: 'linear-gradient(135deg,#6030B0,#9060E0)', fontFamily: '"Playfair Display",serif', fontSize: '11px', fontWeight: 700, color: '#EDE8F5', textDecoration: 'none', letterSpacing: '1px' }}>Подписаться</Link>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '11px', letterSpacing: '3px', color: 'rgba(100,180,255,0.6)', textTransform: 'uppercase' }}>Гороскоп</div>
              <div style={{ fontSize: '20px' }}>⭐</div>
            </div>
            {!horoscope ? (
              <div>
                <p style={{ fontFamily: '"Lora",serif', fontSize: '14px', fontStyle: 'italic', color: 'rgba(200,185,240,0.45)', marginBottom: '14px' }}>Выберите ваш знак зодиака</p>
                <select value={zodiac} onChange={e => setZodiac(e.target.value)}>
                  <option value="">— Выбрать знак —</option>
                  {ZODIAC_SIGNS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '16px', fontWeight: 700, color: '#64B4FF' }}>{zodiac}</div>
                  <button onClick={() => setZodiac('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(200,185,240,0.35)', fontSize: '18px' }}>×</button>
                </div>
                <p style={{ fontFamily: '"Lora",serif', fontSize: '13.5px', lineHeight: 1.7, color: 'rgba(220,210,245,0.6)', fontStyle: 'italic' }}>{horoscope}</p>
              </div>
            )}
          </div>
        </div>

        {/* MODULES */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '11px', letterSpacing: '4px', color: 'rgba(180,150,255,0.45)', marginBottom: '16px', textTransform: 'uppercase' }}>Консультации</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
            {[
              { key: 'tarot', title: 'Таро', sub: 'Расклад на вопрос', price: '£3', href: '/chat/tarot' },
              { key: 'astrology', title: 'Астрология', sub: 'Натальный чарт', price: '£5', href: '/chat/astrology' },
              { key: 'numerology', title: 'Нумерология', sub: 'Числа судьбы', price: '£4', href: '/chat/numerology' },
              { key: 'compatibility', title: 'Совместимость', sub: 'Анализ пары', price: '£4', href: '/chat/compatibility' },
            ].map((m, i) => (
              <Link key={i} href={m.href} className="module-btn" style={{ animationDelay: `${0.1 + i * 0.08}s`, borderTop: `2px solid ${MODULE_COLORS[m.key].replace('1)', '0.5)')}` }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{MODULE_ICONS[m.key]}</div>
                <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '16px', fontWeight: 700, color: MODULE_COLORS[m.key].replace('1)', '0.9)'), marginBottom: '4px' }}>{m.title}</div>
                <div style={{ fontFamily: '"Lora",serif', fontSize: '12px', fontStyle: 'italic', color: 'rgba(200,185,240,0.4)', marginBottom: '12px' }}>{m.sub}</div>
                <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '18px', fontWeight: 800, color: '#EDE8F5' }}>{m.price}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* HISTORY */}
        <div className="card" style={{ animationDelay: '0.5s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '11px', letterSpacing: '4px', color: 'rgba(180,150,255,0.45)', textTransform: 'uppercase' }}>История консультаций</div>
            {history.length > 0 && (
              <Link href="/chat/tarot" style={{ fontFamily: '"Lora",serif', fontSize: '13px', fontStyle: 'italic', color: 'rgba(150,100,255,0.6)', textDecoration: 'none' }}>Новая консультация →</Link>
            )}
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.4 }}>🃏</div>
              <p style={{ fontFamily: '"Lora",serif', fontSize: '15px', fontStyle: 'italic', color: 'rgba(200,185,240,0.35)' }}>
                У вас ещё нет консультаций.<br />Начните с бесплатного расклада таро.
              </p>
              <Link href="/chat/tarot" style={{ display: 'inline-block', marginTop: '16px', padding: '10px 24px', borderRadius: '8px', background: 'linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.1))', border: '1px solid rgba(201,168,76,0.3)', fontFamily: '"Playfair Display",serif', fontSize: '12px', fontWeight: 700, color: 'rgba(201,168,76,0.8)', textDecoration: 'none', letterSpacing: '1px' }}>Начать бесплатно</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((msg, i) => (
                <Link key={i} href={`/chat/${msg.module}`} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.025)', borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none',
                  transition: 'all 0.2s',
                  borderLeft: `3px solid ${MODULE_COLORS[msg.module]?.replace('1)', '0.5)') || 'rgba(150,100,255,0.5)'}`,
                }}>
                  <div style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{MODULE_ICONS[msg.module] || '💬'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '13px', fontWeight: 700, color: MODULE_COLORS[msg.module]?.replace('1)', '0.8)') || 'rgba(150,100,255,0.8)' }}>
                        {MODULE_NAMES[msg.module] || msg.module}
                      </div>
                      <div style={{ fontFamily: '"Lora",serif', fontSize: '11px', fontStyle: 'italic', color: 'rgba(200,185,240,0.25)', flexShrink: 0, marginLeft: '8px' }}>
                        {new Date(msg.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <div style={{ fontFamily: '"Lora",serif', fontSize: '13px', color: 'rgba(200,185,240,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.content}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(200,185,240,0.2)', flexShrink: 0 }}>→</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade banner if not pro */}
        {!isPro && (
          <div style={{ marginTop: '24px', padding: '24px 28px', borderRadius: '14px', background: 'linear-gradient(135deg,rgba(80,30,160,0.2),rgba(40,10,80,0.15))', border: '1px solid rgba(150,100,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: '"Playfair Display",serif', fontSize: '16px', fontWeight: 700, color: '#EDE8F5', marginBottom: '6px' }}>
                🔓 Разблокируйте карту дня, луну и гороскоп
              </div>
              <div style={{ fontFamily: '"Lora",serif', fontSize: '14px', fontStyle: 'italic', color: 'rgba(200,185,240,0.5)' }}>
                Подписка Initiate — безлимитные консультации + эксклюзивные функции
              </div>
            </div>
            <Link href="/#pricing" style={{ padding: '12px 28px', borderRadius: '8px', background: 'linear-gradient(135deg,#6030B0,#9060E0,#C080FF)', fontFamily: '"Playfair Display",serif', fontSize: '13px', fontWeight: 700, color: '#EDE8F5', textDecoration: 'none', letterSpacing: '1px', whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(100,40,200,0.3)' }}>
              Подписаться — £9.99/мес
            </Link>
          </div>
        )}
      </div>
    </>
  )
}