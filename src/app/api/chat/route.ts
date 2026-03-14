import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { SYSTEM_PROMPTS, TAROT_CARDS } from '@/lib/constants'
import { addXP } from '@/lib/xp'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function getRandomCards(count: number) {
  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map(card => ({
    ...card,
    reversed: Math.random() > 0.5,
  }))
}

export async function POST(req: NextRequest) {
  try {
    const { messages, module, userId } = await req.json()

    if (!messages || !module || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, xp')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let systemPrompt = SYSTEM_PROMPTS[module as keyof typeof SYSTEM_PROMPTS]
      || SYSTEM_PROMPTS.general

    if (module === 'tarot') {
      const cards = getRandomCards(3)
      const cardsList = cards
        .map(c => `${c.name} (${c.reversed ? 'перевёрнутая' : 'прямая'}) — ${c.keywords}`)
        .join(', ')
      systemPrompt += `\n\nДля этого расклада выпали карты: ${cardsList}. Используй именно эти карты в своей интерпретации.`
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : ''

    await supabaseAdmin.from('chat_messages').insert([
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

    const xpAction = module === 'tarot' ? 'TAROT_READING'
      : module === 'numerology' ? 'NUMEROLOGY'
      : module === 'astrology' ? 'ASTROLOGY'
      : module === 'humandesign' ? 'HUMAN_DESIGN'
      : 'CHAT_SESSION'

    const xpResult = await addXP(userId, xpAction)

    return NextResponse.json({
      message: assistantMessage,
      xp: xpResult,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}