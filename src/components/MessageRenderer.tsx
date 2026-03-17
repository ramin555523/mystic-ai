'use client'

// Renders AI messages beautifully - replaces *, **, bullet points with styled elements
export default function MessageRenderer({ content, color }: { content: string; color: string }) {
  const lines = content.split('\n')
  
  const renderInline = (text: string, key: number) => {
    // Bold **text**
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|£\d+[\d.,]*|[\d]+[%]|[\d]{1,2}[:/][\d]{1,2})/g)
    return (
      <span key={key}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} style={{ color: '#FFFFFF', fontWeight: 800, fontFamily: '"Playfair Display",serif' }}>{part.slice(2, -2)}</strong>
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i} style={{ color: color.replace('1)', '0.9)'), fontStyle: 'italic' }}>{part.slice(1, -1)}</em>
          }
          // Numbers with £, %, time
          if (/^£[\d.,]+$/.test(part) || /^[\d]+%$/.test(part) || /^[\d]{1,2}[:/][\d]{1,2}$/.test(part)) {
            return <span key={i} style={{ color: color.replace('1)', '0.95)'), fontWeight: 800, fontFamily: '"Playfair Display",serif', fontSize: '1.05em' }}>{part}</span>
          }
          return <span key={i}>{part}</span>
        })}
      </span>
    )
  }

  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) {
      elements.push(<div key={i} style={{ height: '8px' }} />)
      i++
      continue
    }

    // Heading with ### or ##
    if (line.startsWith('### ') || line.startsWith('## ')) {
      const text = line.replace(/^#+\s/, '')
      elements.push(
        <div key={i} style={{ fontFamily: '"Playfair Display",serif', fontSize: '16px', fontWeight: 800, color: color.replace('1)', '0.95)'), marginTop: '12px', marginBottom: '6px', letterSpacing: '0.3px' }}>
          {text}
        </div>
      )
      i++
      continue
    }

    // Bullet points - * or - or •
    if (/^[\*\-•]\s/.test(line)) {
      const bulletLines: string[] = []
      while (i < lines.length && /^[\*\-•]\s/.test(lines[i].trim())) {
        bulletLines.push(lines[i].trim().replace(/^[\*\-•]\s/, ''))
        i++
      }
      elements.push(
        <div key={i} style={{ marginTop: '8px', marginBottom: '8px' }}>
          {bulletLines.map((bl, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
              <span style={{ color: color.replace('1)', '0.7)'), fontSize: '8px', flexShrink: 0, marginTop: '6px' }}>◆</span>
              <span style={{ fontFamily: '"Lora",serif', fontSize: '14.5px', lineHeight: 1.7, color: 'rgba(230,222,255,0.85)' }}>
                {renderInline(bl, j)}
              </span>
            </div>
          ))}
        </div>
      )
      continue
    }

    // Numbered list
    if (/^\d+[\.\)]\s/.test(line)) {
      const numLines: { num: string; text: string }[] = []
      while (i < lines.length && /^\d+[\.\)]\s/.test(lines[i].trim())) {
        const match = lines[i].trim().match(/^(\d+)[\.\)]\s(.*)/)
        if (match) numLines.push({ num: match[1], text: match[2] })
        i++
      }
      elements.push(
        <div key={i} style={{ marginTop: '8px', marginBottom: '8px' }}>
          {numLines.map((nl, j) => (
            <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
              <span style={{ color: color.replace('1)', '0.9)'), fontFamily: '"Playfair Display",serif', fontWeight: 800, fontSize: '14px', flexShrink: 0, minWidth: '20px' }}>{nl.num}.</span>
              <span style={{ fontFamily: '"Lora",serif', fontSize: '14.5px', lineHeight: 1.7, color: 'rgba(230,222,255,0.85)' }}>
                {renderInline(nl.text, j)}
              </span>
            </div>
          ))}
        </div>
      )
      continue
    }

    // Divider line ---
    if (/^-{3,}$/.test(line) || /^_{3,}$/.test(line) || /^\*{3,}$/.test(line)) {
      elements.push(
        <div key={i} style={{ height: '1px', background: `linear-gradient(90deg,transparent,${color.replace('1)', '0.3)')},transparent)`, margin: '12px 0' }} />
      )
      i++
      continue
    }

    // Card name highlight (e.g. "Луна · Влюблённые · Колесница")
    if (line.includes(' · ') && line.split(' · ').length >= 2 && line.length < 80) {
      const cards = line.split(' · ')
      elements.push(
        <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '10px 0' }}>
          {cards.map((card, j) => (
            <span key={j} style={{
              padding: '4px 12px', borderRadius: '20px',
              background: color.replace('1)', '0.12)'),
              border: `1px solid ${color.replace('1)', '0.3)')}`,
              fontFamily: '"Playfair Display",serif', fontSize: '13px', fontWeight: 700,
              color: color.replace('1)', '0.9)'), letterSpacing: '0.3px',
            }}>{card}</span>
          ))}
        </div>
      )
      i++
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={i} style={{ fontFamily: '"Lora",serif', fontSize: '15px', lineHeight: 1.8, color: 'rgba(230,222,255,0.85)', marginBottom: '4px' }}>
        {renderInline(line, i)}
      </p>
    )
    i++
  }

  return <div>{elements}</div>
}