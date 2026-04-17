'use client'
import Link from 'next/link'

export default function PremiumPage() {
  const reports = [
    {
      icon: '🔯',
      name: 'Матрица Судьбы',
      expert: 'Аркана',
      price: '$34.99',
      pages: '15–18 страниц',
      time: '5–7 минут',
      color: 'rgba(192,112,255,1)',
      tagline: 'Кармические задачи и предназначение',
      desc: 'Матрица Судьбы — это система анализа личности через числовой код даты рождения. Каждое число в матрице несёт информацию о кармических задачах, талантах и предназначении в этой жизни.',
      includes: [
        { icon: '🎯', title: 'Центральное число', desc: 'Главная жизненная миссия и путь' },
        { icon: '🔄', title: 'Кармические задачи', desc: 'Что нужно проработать в этой жизни' },
        { icon: '💎', title: 'Природные таланты', desc: 'Скрытые способности и зоны успеха' },
        { icon: '❤️', title: 'Любовь и отношения', desc: 'Паттерны в любви и кармические уроки' },
        { icon: '💰', title: 'Финансы и карьера', desc: 'Денежные блоки и как открыть поток' },
        { icon: '✨', title: 'Аффирмации и практики', desc: 'Персональные практики для роста' },
      ],
      reviews: [
        { text: 'Матрица открыла мне почему я всегда попадаю в одни и те же ситуации. 35 страниц — и всё про меня.', name: 'Карина М.', city: 'Київ' },
        { text: 'Самый точный анализ который я читала. Число кармы 13 описало мои уроки так что я плакала.', name: 'Оксана В.', city: 'Варшава' },
      ],
    },
    {
      icon: '⭐',
      name: 'Натальная Карта',
      expert: 'Орион',
      price: '$34.99',
      pages: '15–18 страниц',
      time: '5–7 минут',
      color: 'rgba(100,180,255,1)',
      tagline: 'Полный астрологический портрет личности',
      desc: 'Натальная карта — это снимок неба в момент вашего рождения. Положение планет раскрывает характер, эмоциональную природу, любовные паттерны, карьерные таланты и кармическую миссию.',
      includes: [
        { icon: '☀️', title: 'Солнечный знак', desc: 'Ядро характера и жизненная сила' },
        { icon: '🌙', title: 'Лунный знак', desc: 'Эмоциональная природа и подсознание' },
        { icon: '💕', title: 'Венера и Марс', desc: 'Любовь, сексуальность и деньги' },
        { icon: '🪐', title: 'Юпитер и Сатурн', desc: 'Зоны удачи и кармические уроки' },
        { icon: '🌐', title: 'Кармические узлы', desc: 'Жизненная миссия и прошлые жизни' },
        { icon: '📅', title: 'Текущие транзиты', desc: 'Что происходит прямо сейчас' },
      ],
      reviews: [
        { text: 'Орион описал мой характер точнее чем годы психотерапии. Теперь понимаю себя по-настоящему.', name: 'Наталья Р.', city: 'Лондон' },
        { text: 'Натальная карта объяснила почему я такая эмоциональная — Луна в Раке в 4-м доме. Всё встало на места.', name: 'Світлана П.', city: 'Варшава' },
      ],
    },
    {
      icon: '🌟',
      name: 'Годовой Прогноз',
      expert: 'Аркана + Орион',
      price: '$89.99',
      pages: '30–40 страниц',
      time: '8–12 минут',
      color: 'rgba(255,160,60,1)',
      tagline: 'Астрология + Нумерология + Матрица Судьбы',
      desc: 'Самый полный отчёт: три системы анализа в одном документе. Подробный прогноз по каждому месяцу года для всех сфер жизни. Это не гороскоп — это ваш личный навигатор на целый год.',
      featured: true,
      badge: 'ULTRA PREMIUM',
      includes: [
        { icon: '🌅', title: 'Общая энергия года', desc: 'Главная тема и возможности года' },
        { icon: '❤️', title: 'Любовь и отношения', desc: 'Прогноз и лучшие периоды' },
        { icon: '💼', title: 'Карьера и финансы', desc: 'Возможности и лучшее время для действий' },
        { icon: '🌿', title: 'Здоровье и энергия', desc: 'Уязвимые места и периоды восстановления' },
        { icon: '📆', title: 'Прогноз по 12 месяцам', desc: 'Каждый месяц — отдельный разбор' },
        { icon: '🔯', title: 'Матрица в этом году', desc: 'Как ваши числа проявятся именно сейчас' },
        { icon: '🌙', title: 'Нумерологический цикл', desc: 'Личный год и его возможности' },
        { icon: '✨', title: 'Духовные практики', desc: 'Аффирмации и практики на весь год' },
      ],
      reviews: [
        { text: 'Годовой прогноз купила скептически. Прошло 3 месяца — всё что написано про январь и февраль сбылось.', name: 'Ольга Д.', city: 'Единбург' },
        { text: 'Читаю каждый месяц как инструкцию. Уже сделала несколько решений благодаря этому отчёту.', name: 'Аліна К.', city: 'Київ' },
      ],
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif;overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(150,100,255,0.3);border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.5}}
        .nav-a{font-family:'Playfair Display',serif;font-size:14px;color:rgba(200,185,240,0.5);text-decoration:none;transition:color .25s;letter-spacing:.3px}
        .nav-a:hover{color:#EDE8F5}
        @media(max-width:900px){.report-grid{grid-template-columns:1fr!important}.pad{padding-left:20px!important;padding-right:20px!important}}
      `}</style>

      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:60}).map((_,i)=>(
          <div key={i} style={{position:'absolute',left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,width:'1px',height:'1px',borderRadius:'50%',background:'rgba(230,220,255,0.8)',animation:`twinkle ${3+i%5}s ease-in-out infinite`,animationDelay:`${(i*0.3)%4}s`}}/>
        ))}
        <div style={{position:'absolute',top:'-20%',left:'20%',width:'70vw',height:'70vw',maxWidth:'800px',borderRadius:'50%',background:'radial-gradient(circle,rgba(100,30,180,0.1) 0%,transparent 70%)'}}/>
      </div>

      <div style={{position:'relative',zIndex:10}}>
        {/* Nav */}
        <nav style={{padding:'16px 52px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(8,5,16,0.97)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(255,255,255,0.07)',position:'sticky',top:0,zIndex:100}} className="pad">
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:900,color:'rgba(200,180,255,0.5)',textDecoration:'none',letterSpacing:'1px'}}>
            MYSTIC<span style={{fontSize:'12px',fontWeight:400,verticalAlign:'super',marginLeft:'2px'}}>AI</span>
          </Link>
          <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
            {[['Таро','/tarot'],['Астрология','/astrology'],['Нумерология','/numerology'],['Совместимость','/compatibility'],['Премиум','/premium']].map(([l,h])=>(
              <Link key={l} href={h} className="nav-a" style={{color:h==='/premium'?'rgba(200,160,255,0.9)':undefined}}>{l}</Link>
            ))}
            <a href="/#pricing" className="nav-a">Тарифы</a>
            <a href="/#reviews" className="nav-a">Отзывы</a>
            <a href="/#faq" className="nav-a">Вопросы</a>
          </div>
          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <Link href="/dashboard" style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',color:'rgba(200,185,240,0.4)',textDecoration:'none'}}>Кабинет</Link>
            <Link href="/auth/login" className="nav-a">Войти</Link>
            <Link href="/auth/register" style={{padding:'8px 20px',borderRadius:'6px',background:'linear-gradient(135deg,#6030B0,#9060E0)',fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'#EDE8F5',textDecoration:'none'}}>Начать</Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{padding:'80px 52px 60px',textAlign:'center',maxWidth:'900px',margin:'0 auto'}} className="pad">
          <div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',letterSpacing:'2px',color:'rgba(200,160,255,0.5)',marginBottom:'16px',textTransform:'uppercase'}}>Персональные PDF-отчёты</div>
          <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(36px,6vw,72px)',fontWeight:900,color:'#FFFFFF',lineHeight:1.05,marginBottom:'20px'}}>
            Премиум<br/><span style={{background:'linear-gradient(135deg,rgba(200,140,255,0.95),rgba(150,100,255,0.8))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Отчёты</span>
          </h1>
          <p style={{fontFamily:'"Lora",serif',fontSize:'18px',lineHeight:1.85,color:'rgba(210,200,245,0.6)',marginBottom:'40px',maxWidth:'600px',margin:'0 auto 40px'}}>
            Персональные отчёты на 15–40 страниц. AI составляет за 5–12 минут на основе вашей даты рождения и имени.
          </p>
          <div style={{display:'flex',gap:'32px',justifyContent:'center',flexWrap:'wrap'}}>
            {[['🔯','Матрица Судьбы','$34.99'],['⭐','Натальная Карта','$34.99'],['🌟','Годовой Прогноз','$89.99']].map(([icon,name,price])=>(
              <div key={name} style={{textAlign:'center'}}>
                <div style={{fontSize:'28px',marginBottom:'4px'}}>{icon}</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:'rgba(200,185,240,0.7)'}}>{name}</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:900,color:'#FFFFFF'}}>{price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Reports */}
        {reports.map((report, ri) => (
          <section key={ri} style={{padding:'60px 52px',background:ri%2===1?'rgba(255,255,255,0.015)':'transparent'}} className="pad">
            <div style={{maxWidth:'1100px',margin:'0 auto'}}>
              {/* Header */}
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'40px',flexWrap:'wrap',gap:'20px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                  <div style={{width:'64px',height:'64px',borderRadius:'16px',background:report.color.replace('1)','0.12)'),border:`1px solid ${report.color.replace('1)','0.3)')}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',flexShrink:0,boxShadow:`0 0 24px ${report.color.replace('1)','0.2)')}`}}>
                    {report.icon}
                  </div>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
                      <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(22px,3vw,36px)',fontWeight:900,color:'#EDE8F5'}}>{report.name}</h2>
                      {(report as any).featured && <div style={{padding:'4px 12px',borderRadius:'4px',background:'rgba(255,160,40,0.15)',border:'1px solid rgba(255,160,40,0.35)',fontFamily:'"Playfair Display",serif',fontSize:'11px',fontWeight:700,color:'rgba(255,180,80,0.95)',letterSpacing:'1px'}}>{(report as any).badge}</div>}
                    </div>
                    <div style={{fontFamily:'"Lora",serif',fontSize:'15px',fontStyle:'italic',color:report.color.replace('1)','0.65)')}}>{report.tagline}</div>
                    <div style={{display:'flex',gap:'16px',marginTop:'8px'}}>
                      {[['📄',report.pages],['⏱️',report.time],['🤖',`Эксперт: ${report.expert}`]].map(([icon,val])=>(
                        <div key={val} style={{display:'flex',alignItems:'center',gap:'5px',fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.4)'}}>
                          <span>{icon}</span><span>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,4vw,48px)',fontWeight:900,color:'#FFFFFF',marginBottom:'12px'}}>{report.price}</div>
                  <Link href="/auth/register" style={{display:'inline-block',padding:'12px 28px',borderRadius:'8px',background:`linear-gradient(135deg,${report.color.replace('1)','0.9)')},${report.color.replace('1)','0.65)')})`,fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:'#0C0818',textDecoration:'none',letterSpacing:'0.5px',boxShadow:`0 4px 20px ${report.color.replace('1)','0.35)')}`}}>
                    Заказать отчёт →
                  </Link>
                </div>
              </div>

              {/* Description + includes */}
              <div className="report-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'32px',marginBottom:'32px'}}>
                <div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'16px',lineHeight:1.9,color:'rgba(210,200,245,0.65)',marginBottom:'24px'}}>{report.desc}</p>
                  {/* Reviews */}
                  <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                    {report.reviews.map((rev,j)=>(
                      <div key={j} style={{padding:'18px',background:'rgba(255,255,255,0.03)',border:`1px solid ${report.color.replace('1)','0.1)')}`,borderRadius:'12px'}}>
                        <div style={{color:report.color.replace('1)','0.8)'),fontSize:'12px',marginBottom:'8px'}}>★★★★★</div>
                        <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.75,color:'rgba(220,210,245,0.7)',fontStyle:'italic',marginBottom:'8px'}}>"{rev.text}"</p>
                        <div style={{fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:report.color.replace('1)','0.6)')}}>{rev.name} · <span style={{fontWeight:400,color:'rgba(200,185,240,0.3)'}}>{rev.city}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'12px',letterSpacing:'3px',color:report.color.replace('1)','0.5)'),textTransform:'uppercase',marginBottom:'16px'}}>Что входит в отчёт</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    {report.includes.map((item,j)=>(
                      <div key={j} style={{padding:'14px',background:'rgba(255,255,255,0.03)',border:`1px solid ${report.color.replace('1)','0.1)')}`,borderRadius:'10px'}}>
                        <div style={{fontSize:'20px',marginBottom:'6px'}}>{item.icon}</div>
                        <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'#EDE8F5',marginBottom:'3px'}}>{item.title}</div>
                        <div style={{fontFamily:'"Lora",serif',fontSize:'11px',lineHeight:1.6,color:'rgba(200,185,240,0.45)'}}>{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              {ri < reports.length - 1 && (
                <div style={{height:'1px',background:'linear-gradient(90deg,transparent,rgba(150,100,255,0.15),transparent)',marginTop:'20px'}}/>
              )}
            </div>
          </section>
        ))}

        {/* FAQ */}
        <section style={{padding:'80px 52px',background:'rgba(255,255,255,0.015)'}} className="pad">
          <div style={{maxWidth:'700px',margin:'0 auto'}}>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(24px,3.5vw,40px)',fontWeight:900,color:'#FFFFFF',marginBottom:'36px',textAlign:'center'}}>Вопросы об отчётах</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              {[
                ['Как получить отчёт?','После оплаты вы вводите имя и дату рождения. AI генерирует отчёт за 5–12 минут. Готовый отчёт открывается в браузере — сохраните как PDF через печать.'],
                ['Нужно ли регистрироваться?','Да, нужна регистрация чтобы отчёт был привязан к вашему аккаунту и вы могли просмотреть его снова.'],
                ['Оплата разовая или подписка?','Каждый отчёт — разовая оплата. Никаких скрытых подписок.'],
                ['Можно ли заказать отчёт на другого человека?','Да — укажите имя и дату рождения того человека на кого заказываете.'],
                ['Что если отчёт не сгенерировался?','Напишите нам — мы перегенерируем бесплатно или вернём деньги.'],
              ].map(([q,a],i)=>(
                <div key={i} style={{padding:'20px 24px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px'}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'#EDE8F5',marginBottom:'8px'}}>{q}</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.75,color:'rgba(200,185,240,0.55)'}}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{padding:'100px 52px',textAlign:'center'}} className="pad">
          <div style={{maxWidth:'560px',margin:'0 auto'}}>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,4vw,52px)',fontWeight:900,color:'#FFFFFF',marginBottom:'16px'}}>Раскройте тайны своей судьбы</h2>
            <p style={{fontFamily:'"Lora",serif',fontSize:'17px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'40px'}}>Персональный отчёт готов через 5–12 минут</p>
            <div style={{display:'flex',gap:'14px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/auth/register" style={{padding:'16px 36px',borderRadius:'8px',background:'linear-gradient(135deg,rgba(150,80,220,0.9),rgba(200,120,255,0.7))',fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'0.5px',boxShadow:'0 4px 30px rgba(150,80,220,0.4)'}}>
                Заказать отчёт →
              </Link>
              <Link href="/" style={{padding:'16px 28px',borderRadius:'8px',border:'1px solid rgba(200,185,240,0.15)',fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'rgba(200,185,240,0.5)',textDecoration:'none'}}>
                На главную
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{padding:'24px 52px',borderTop:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}} className="pad">
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:900,color:'rgba(200,180,255,0.3)',textDecoration:'none',letterSpacing:'1px'}}>MYSTIC AI</Link>
          <div style={{display:'flex',gap:'18px',flexWrap:'wrap'}}>
            {[['Главная','/'],['Таро','/tarot'],['Астрология','/astrology'],['Нумерология','/numerology'],['Совместимость','/compatibility']].map(([l,h])=>(
              <Link key={l} href={h} style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.3)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
          <div style={{display:'flex',gap:'14px'}}>
            {[['Privacy','/privacy'],['Terms','/terms'],['Refund','/refund']].map(([l,h])=>(
              <Link key={l} href={h} style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.25)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
        </footer>
      </div>
    </>
  )
}