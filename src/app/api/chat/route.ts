import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { SYSTEM_PROMPTS, TAROT_CARDS } from '@/lib/constants'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function getRandomCards(count: number) {
  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((card: { name: string; keywords: string }) => ({
    ...card,
    reversed: Math.random() > 0.5,
  }))
}

// ── PROGRAMMATIC CALCULATIONS ─────────────────────────────

function calcAge(dateStr: string): number {
  const m = dateStr.match(/(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})/)
  if (!m) return 0
  const birth = new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1]))
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--
  return age
}

function reduceNum(n: number): number {
  if (n <= 22) return n
  const s = String(n).split('').reduce((a, b) => a + parseInt(b), 0)
  return reduceNum(s)
}

function calcNumerology(name: string, dateStr: string) {
  const m = dateStr.match(/(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})/)
  if (!m) return null
  const day = parseInt(m[1]), month = parseInt(m[2]), year = parseInt(m[3])
  
  // Life path number
  const lifePath = reduceNum(
    String(day).split('').reduce((a,b)=>a+parseInt(b),0) +
    String(month).split('').reduce((a,b)=>a+parseInt(b),0) +
    String(year).split('').reduce((a,b)=>a+parseInt(b),0)
  )
  
  // Destiny number (full name)
  const LETTER_MAP: Record<string,number> = {
    'а':1,'б':2,'в':6,'г':3,'д':4,'е':5,'ё':5,'ж':2,'з':7,'и':1,'й':1,
    'к':2,'л':3,'м':4,'н':5,'о':7,'п':8,'р':9,'с':1,'т':2,'у':3,'ф':8,
    'х':5,'ц':6,'ч':7,'ш':8,'щ':9,'ъ':1,'ы':1,'ь':1,'э':5,'ю':3,'я':1,
    'a':1,'b':2,'c':3,'d':4,'e':5,'f':8,'g':3,'h':5,'i':1,'j':1,'k':2,
    'l':3,'m':4,'n':5,'o':7,'p':8,'q':1,'r':9,'s':1,'t':2,'u':3,'v':6,
    'w':6,'x':5,'y':1,'z':7
  }
  const nameSum = name.toLowerCase().split('').reduce((a,c) => a + (LETTER_MAP[c] || 0), 0)
  const destinyNum = reduceNum(nameSum)
  
  // Soul number (vowels only)
  const vowels = 'аеёиоуыэюяaeiouy'
  const vowelSum = name.toLowerCase().split('').reduce((a,c) => vowels.includes(c) ? a + (LETTER_MAP[c] || 0) : a, 0)
  const soulNum = reduceNum(vowelSum)
  
  // Personality number (consonants only)
  const consonantSum = name.toLowerCase().split('').reduce((a,c) => !vowels.includes(c) && LETTER_MAP[c] ? a + (LETTER_MAP[c] || 0) : a, 0)
  const personalityNum = reduceNum(consonantSum)
  
  // Personal year
  const today = new Date()
  const personalYear = reduceNum(day + month + today.getFullYear())
  
  return { lifePath, destinyNum, soulNum, personalityNum, personalYear, day, month, year }
}

function calcZodiac(day: number, month: number): string {
  if ((month===3&&day>=21)||(month===4&&day<=19)) return 'Овен ♈'
  if ((month===4&&day>=20)||(month===5&&day<=20)) return 'Телец ♉'
  if ((month===5&&day>=21)||(month===6&&day<=20)) return 'Близнецы ♊'
  if ((month===6&&day>=21)||(month===7&&day<=22)) return 'Рак ♋'
  if ((month===7&&day>=23)||(month===8&&day<=22)) return 'Лев ♌'
  if ((month===8&&day>=23)||(month===9&&day<=22)) return 'Дева ♍'
  if ((month===9&&day>=23)||(month===10&&day<=22)) return 'Весы ♎'
  if ((month===10&&day>=23)||(month===11&&day<=21)) return 'Скорпион ♏'
  if ((month===11&&day>=22)||(month===12&&day<=21)) return 'Стрелец ♐'
  if ((month===12&&day>=22)||(month===1&&day<=19)) return 'Козерог ♑'
  if ((month===1&&day>=20)||(month===2&&day<=18)) return 'Водолей ♒'
  return 'Рыбы ♓'
}

function calcDestinyMatrix(dateStr: string) {
  const m = dateStr.match(/(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})/)
  if (!m) return null
  const day = parseInt(m[1]), month = parseInt(m[2]), year = parseInt(m[3])
  const d = reduceNum(day), mo = reduceNum(month)
  const y = reduceNum(String(year).split('').reduce((a,b)=>a+parseInt(b),0))
  return {
    center: reduceNum(d + mo + y),
    purpose: reduceNum(d + mo),
    karma: reduceNum(mo + y),
    talent: reduceNum(d + y),
    personal: d, social: mo, spiritual: y
  }
}

function getMoonPhaseText(): string {
  const now = new Date()
  const jd = now.getTime() / 86400000 + 2440587.5
  const phase = ((jd - 2451549.5) / 29.53058867 % 1 + 1) % 1
  if (phase < 0.03 || phase > 0.97) return 'Новолуние'
  if (phase < 0.22) return 'Растущий серп'
  if (phase < 0.28) return 'Первая четверть'
  if (phase < 0.47) return 'Прибывающая луна'
  if (phase < 0.53) return 'Полнолуние'
  if (phase < 0.72) return 'Убывающая луна'
  if (phase < 0.78) return 'Последняя четверть'
  return 'Убывающий серп'
}

function buildSystemContext(module: string, userMessage: string): string {
  const today = new Date()
  const todayStr = today.toLocaleDateString('ru-RU', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  const moonPhase = getMoonPhaseText()
  
  // Extract all dates from message
  const datePattern = /(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})/g
  const dates: string[] = []
  let match
  while ((match = datePattern.exec(userMessage)) !== null) {
    dates.push(match[0])
  }
  
  let context = `

[ТОЧНЫЕ ДАННЫЕ — используй ТОЛЬКО эти числа, не пересчитывай самостоятельно]
`
  context += `Сегодня: ${todayStr}
`
  context += `Фаза луны: ${moonPhase}
`
  
  if (dates.length > 0) {
    context += `
Даты и расчёты:
`
    dates.forEach(dateStr => {
      const age = calcAge(dateStr)
      const dm = dateStr.match(/(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})/)
      if (!dm) return
      const d = parseInt(dm[1]), mo = parseInt(dm[2])
      const zodiac = calcZodiac(d, mo)
      context += `• ${dateStr}: возраст ${age} лет, знак зодиака ${zodiac}
`
      
      if (module === 'numerology') {
        // Extract name from message (word before or after date)
        const words = userMessage.split(/[\s,]+/)
        const dateIdx = words.findIndex(w => w.includes(dm[0].split('/')[0]))
        const nameParts: string[] = []
        for (let i = Math.max(0, dateIdx-3); i < dateIdx; i++) {
          if (words[i] && /[а-яёА-ЯЁa-zA-Z]{2,}/.test(words[i])) nameParts.push(words[i])
        }
        const name = nameParts.join(' ') || 'пользователь'
        const num = calcNumerology(name, dateStr)
        if (num) {
          context += `  Нумерология для "${name}":
`
          context += `  - Число жизненного пути: ${num.lifePath}
`
          context += `  - Число судьбы: ${num.destinyNum}
`
          context += `  - Число души: ${num.soulNum}
`
          context += `  - Число личности: ${num.personalityNum}
`
          context += `  - Личный год ${today.getFullYear()}: ${num.personalYear}
`
        }
      }
      
      if (module === 'destiny') {
        const matrix = calcDestinyMatrix(dateStr)
        if (matrix) {
          context += `  Матрица судьбы:
`
          context += `  - Центральное число: ${matrix.center}
`
          context += `  - Число предназначения: ${matrix.purpose}
`
          context += `  - Число кармы: ${matrix.karma}
`
          context += `  - Число таланта: ${matrix.talent}
`
        }
      }
    })
  }
  
  context += `
ВАЖНО: Используй ТОЛЬКО числа из этого блока. Не вычисляй возраст и числа самостоятельно.`
  return context
}

export async function POST(req: NextRequest) {
  try {
    const { messages, module, userId } = await req.json()

    if (!messages || !module || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const DESTINY_PROMPT = `Ты Аркана — мастер Матрицы Судьбы. Ты анализируешь дату рождения человека по системе Матрицы Судьбы (квадрат Пифагора в интерпретации эзотерики). 
Рассчитывай ключевые числа: число личности, число предназначения, кармические задачи, таланты, зоны роста.
Отвечай на русском языке. Используй форматирование: **жирный** для ключевых понятий, числа выделяй отдельно.
Будь конкретным и давай практические советы. Не выдавай всё сразу — задавай уточняющие вопросы.`

    let systemPrompt = module === 'destiny' 
      ? DESTINY_PROMPT 
      : (SYSTEM_PROMPTS[module as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general)

    if (module === 'tarot') {
      const cards = getRandomCards(3)
      const cardsList = cards
        .map((c: { name: string; reversed: boolean; keywords: string }) => `${c.name} (${c.reversed ? 'перевёрнутая' : 'прямая'}) — ${c.keywords}`)
        .join(', ')
      systemPrompt += `\n\nДля этого расклада выпали карты: ${cardsList}. Используй именно эти карты.`
    }

    // Inject programmatic calculations into system prompt
    const lastUserMsg = messages[messages.length - 1]?.content || ''
    const calculatedContext = buildSystemContext(module, lastUserMsg)
    const enrichedSystemPrompt = systemPrompt + calculatedContext
    
    const enrichedMessages = messages

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: enrichedSystemPrompt,
      messages: enrichedMessages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    await supabase.from('chat_messages').insert([
      {
        user_id: userId,
        module,
        role: 'user',
        content: messages[messages.length - 1].content,
      },
      {
        user_id: userId,
        module,
        role: 'assistant',
        content: assistantMessage,
      },
    ])

    return NextResponse.json({ message: assistantMessage })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}