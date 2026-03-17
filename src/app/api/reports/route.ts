import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

function calcDestiny(birthDate: string) {
  const parts = birthDate.split('.')
  const day = parseInt(parts[0])
  const month = parseInt(parts[1])
  const year = parseInt(parts[2])
  const digitSum = (n: number): number => {
    const s = String(n).split('').reduce((a, b) => a + parseInt(b), 0)
    return s > 22 ? digitSum(s) : s
  }
  const d = digitSum(day)
  const m = digitSum(month)
  const y = digitSum(String(year).split('').reduce((a, b) => a + parseInt(b), 0))
  return {
    center: digitSum(d + m + y),
    purpose: digitSum(d + m),
    karma: digitSum(m + y),
    talent: digitSum(d + y),
    personal: d,
    social: m,
    spiritual: y,
  }
}

function getZodiac(day: number, month: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Овен'
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Телец'
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Близнецы'
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Рак'
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Лев'
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Дева'
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Весы'
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Скорпион'
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Стрелец'
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Козерог'
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Водолей'
  return 'Рыбы'
}

async function generateSection(prompt: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })
  return response.content[0].type === 'text' ? response.content[0].text : ''
}

function formatContent(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .split('\n\n')
    .map(p => p.trim() ? '<p>' + p + '</p>' : '')
    .join('')
}

function buildHTML(
  title: string,
  subtitle: string,
  name: string,
  sections: Array<{ title: string; content: string }>,
  reportType: string
): string {
  const colors: Record<string, string> = {
    destiny: '#C070FF',
    natal: '#64B4FF',
    yearly: '#FFA050',
  }
  const accent = colors[reportType] || '#C070FF'
  const icons: Record<string, string> = { destiny: '🔯', natal: '⭐', yearly: '🌟' }
  const icon = icons[reportType] || '✨'
  const date = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  const sectionsHTML = sections.map((s, i) => `
    <div style="padding:60px 56px;page-break-after:always;min-height:100vh;background:#080510;">
      <div style="margin-bottom:36px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="font-family:serif;font-size:12px;letter-spacing:4px;color:${accent}66;margin-bottom:8px;text-transform:uppercase;">Раздел ${i + 1}</div>
        <h2 style="font-family:serif;font-size:28px;font-weight:900;color:#EDE8F5;line-height:1.2;">${s.title}</h2>
      </div>
      <div style="font-family:sans-serif;font-size:15px;line-height:1.9;color:rgba(220,210,245,0.8);">
        ${formatContent(s.content)}
      </div>
    </div>
  `).join('')

  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>${title} — ${name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080510; color: #EDE8F5; font-family: Georgia, serif; }
  p { margin-bottom: 16px; }
  strong { font-weight: 700; color: #FFFFFF; }
  em { color: ${accent}; font-style: italic; }
  @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#080510,#120820,#080510);padding:60px 48px;page-break-after:always;">
  <div style="font-family:serif;font-size:14px;font-weight:900;letter-spacing:4px;color:${accent}99;margin-bottom:60px;">✦ MYSTIC AI</div>
  <div style="font-size:80px;margin-bottom:32px;">${icon}</div>
  <h1 style="font-family:serif;font-size:42px;font-weight:900;color:#EDE8F5;margin-bottom:16px;line-height:1.15;">${title}</h1>
  <p style="font-family:sans-serif;font-size:18px;font-style:italic;color:rgba(200,185,240,0.55);margin-bottom:48px;">${subtitle}</p>
  <div style="width:120px;height:1px;background:${accent}66;margin:0 auto 32px;"></div>
  <div style="font-family:serif;font-size:24px;font-weight:700;color:${accent};padding:12px 32px;border:1px solid ${accent}44;border-radius:8px;background:${accent}11;">${name}</div>
  <p style="font-family:sans-serif;font-size:14px;font-style:italic;color:rgba(200,185,240,0.3);margin-top:24px;">Составлено ${date}</p>
</div>
${sectionsHTML}
<div style="padding:24px 56px;border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;background:#080510;">
  <div style="font-family:serif;font-size:14px;font-weight:900;color:rgba(200,185,240,0.25);letter-spacing:2px;">MYSTIC AI</div>
  <div style="font-family:sans-serif;font-size:11px;font-style:italic;color:rgba(200,185,240,0.2);">Персональный отчёт · Конфиденциально</div>
</div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reportType, name, birthDate, userId } = body

    if (!reportType || !name || !birthDate || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const parts = birthDate.split('.')
    const day = parseInt(parts[0])
    const month = parseInt(parts[1])
    const zodiac = getZodiac(day, month)
    const destiny = calcDestiny(birthDate)
    const currentYear = new Date().getFullYear()

    let sections: Array<{ title: string; content: string }> = []
    let title = ''
    let subtitle = ''

    if (reportType === 'destiny') {
      title = 'Матрица Судьбы'
      subtitle = 'Кармические задачи и предназначение'
      const prompts = [
        `Ты эксперт по Матрице Судьбы. Составь раздел "Введение" для ${name}, дата рождения ${birthDate}. Числа: центр ${destiny.center}, предназначение ${destiny.purpose}, карма ${destiny.karma}. Объясни что такое Матрица Судьбы и общую энергию этого человека. 400 слов. Используй **жирный** для ключевых понятий.`,
        `Ты эксперт по Матрице Судьбы. Составь раздел "Центральное Число" для ${name}. Центральное число ${destiny.center} — главная миссия в жизни. Дай глубокий анализ числа ${destiny.center}: архетип, сильные стороны, испытания. 400 слов.`,
        `Ты эксперт по Матрице Судьбы. Составь раздел "Кармические Задачи" для ${name}. Число кармы ${destiny.karma}, личности ${destiny.personal}, социальной миссии ${destiny.social}. Какие уроки несёт эта жизнь, практические советы. 400 слов.`,
        `Ты эксперт по Матрице Судьбы. Составь раздел "Таланты и Ресурсы" для ${name}. Число таланта ${destiny.talent}, знак ${zodiac}. Природные таланты, скрытые способности, сферы успеха. 400 слов.`,
        `Ты эксперт по Матрице Судьбы. Составь раздел "Отношения и Любовь" для ${name}. Числа: центр ${destiny.center}, личность ${destiny.personal}. Паттерны в отношениях, кармические уроки в любви. 400 слов.`,
        `Ты эксперт по Матрице Судьбы. Составь раздел "Финансы и Карьера" для ${name}. Число предназначения ${destiny.purpose}. Отношения с деньгами, денежные блоки, как открыть финансовый поток. 400 слов.`,
        `Ты эксперт по Матрице Судьбы. Составь раздел "Рекомендации и Аффирмации" для ${name}. На основе чисел (центр ${destiny.center}, карма ${destiny.karma}, талант ${destiny.talent}): 5 рекомендаций, 3 вещи которых избегать, 5 аффирмаций. 400 слов.`,
      ]
      const titles = ['Введение в Матрицу Судьбы', 'Центральное Число и Главная Миссия', 'Кармические Задачи', 'Таланты и Природные Ресурсы', 'Отношения и Любовь', 'Финансы и Карьера', 'Рекомендации и Аффирмации']
      for (let i = 0; i < prompts.length; i++) {
        sections.push({ title: titles[i], content: await generateSection(prompts[i]) })
      }
    } else if (reportType === 'natal') {
      title = 'Натальная Карта'
      subtitle = 'Астрологический портрет личности'
      const prompts = [
        `Ты профессиональный астролог. Составь раздел "Введение" для ${name}, рождённого ${birthDate}, знак ${zodiac}. Общая энергия и характер. 400 слов.`,
        `Ты профессиональный астролог. Составь раздел "Солнечный Знак" для ${name}, ${zodiac}. Полный архетип: характер, сильные и слабые стороны, жизненная миссия. 450 слов.`,
        `Ты профессиональный астролог. Составь раздел "Лунный Знак" для ${name}, рождённого ${birthDate}. Эмоциональный мир, страхи, что даёт безопасность. 450 слов.`,
        `Ты профессиональный астролог. Составь раздел "Венера и Марс" для ${name}, знак ${zodiac}. Стиль любви, сексуальность, отношение к деньгам. 450 слов.`,
        `Ты профессиональный астролог. Составь раздел "Юпитер и Сатурн" для ${name}, знак ${zodiac}. Где удача, главные испытания, как работать с ограничениями. 450 слов.`,
        `Ты профессиональный астролог. Составь раздел "Кармические Узлы" для ${name}, рождённого ${birthDate}. Жизненная миссия, от чего уйти, к чему двигаться. 450 слов.`,
        `Ты профессиональный астролог. Составь раздел "Прогноз и Рекомендации" для ${name}, знак ${zodiac}. Благоприятные периоды, рекомендации по сферам жизни, аффирмации. 450 слов.`,
      ]
      const titles = ['Введение в Натальную Карту', 'Солнечный Знак — Ядро Личности', 'Лунный Знак — Эмоциональная Природа', 'Венера и Марс — Любовь и Действие', 'Юпитер и Сатурн — Удача и Испытания', 'Кармические Узлы и Жизненная Миссия', 'Прогноз и Рекомендации']
      for (let i = 0; i < prompts.length; i++) {
        sections.push({ title: titles[i], content: await generateSection(prompts[i]) })
      }
    } else if (reportType === 'yearly') {
      title = 'Годовой Прогноз'
      subtitle = `Полный астро-нумерологический разбор на ${currentYear}`
      const prompts = [
        `Ты мастер астрологии и нумерологии. Составь раздел "Общая Энергия ${currentYear}" для ${name}, знак ${zodiac}, личный год ${destiny.center}. Главная тема года, возможности и испытания. 450 слов.`,
        `Ты астролог. Составь раздел "Любовь и Отношения в ${currentYear}" для ${name}, знак ${zodiac}. Подробный прогноз для одиноких и пар, важные периоды. 450 слов.`,
        `Ты астролог. Составь раздел "Карьера и Финансы в ${currentYear}" для ${name}, знак ${zodiac}. Карьерные возможности, финансовые прогнозы, лучшее время для шагов. 450 слов.`,
        `Ты астролог. Составь раздел "Здоровье и Энергия в ${currentYear}" для ${name}, знак ${zodiac}. Уязвимые места, периоды восстановления, практики для здоровья. 450 слов.`,
        `Ты нумеролог. Составь раздел "Прогноз по Месяцам ${currentYear}" для ${name}, личный год ${destiny.center}. Для каждого месяца (январь-декабрь) 3-4 предложения о теме и рекомендациях. 550 слов.`,
        `Ты мастер Матрицы Судьбы. Составь раздел "Матрица Судьбы в ${currentYear}" для ${name}. Числа: центр ${destiny.center}, карма ${destiny.karma}, предназначение ${destiny.purpose}. Как энергия матрицы проявится в этом году. 450 слов.`,
        `Ты духовный наставник. Составь раздел "Духовный Путь и Практики на ${currentYear}" для ${name}, знак ${zodiac}. Духовные задачи года, медитации, аффирмации, лучшие периоды для решений. 500 слов.`,
      ]
      const titles = [`Общая Энергия ${currentYear} Года`, 'Любовь и Отношения', 'Карьера и Финансы', 'Здоровье и Жизненная Энергия', 'Прогноз по Месяцам', `Матрица Судьбы в ${currentYear} Году`, 'Духовный Путь и Практики']
      for (let i = 0; i < prompts.length; i++) {
        sections.push({ title: titles[i], content: await generateSection(prompts[i]) })
      }
    }

    const html = buildHTML(title, subtitle, name, sections, reportType)

    const { data: report } = await supabase
      .from('reports')
      .insert({ user_id: userId, report_type: reportType, name, birth_date: birthDate, html_content: html, status: 'completed' })
      .select()
      .single()

    return NextResponse.json({ success: true, reportId: report?.id, html })

  } catch (error: any) {
    console.error('Report error:', error?.message)
    return NextResponse.json({ error: 'Generation failed', details: error?.message }, { status: 500 })
  }
}