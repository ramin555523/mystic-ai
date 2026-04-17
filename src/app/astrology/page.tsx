'use client'
import Link from 'next/link'

export default function AstrologyPage() {
  const reviews = [
    { text: 'Орион точно описал мой характер и объяснил почему я всегда попадаю в одни ситуации.', name: 'Наталья Р.', city: 'Київ' },
    { text: 'Прогноз на год оказался очень точным. Транзит Юпитера действительно принёс новые отношения.', name: 'Светлана П.', city: 'Варшава' },
    { text: 'Наконец поняла почему так сложно принимать решения. Ретроградный Меркурий в натале — всё встало на места.', name: 'Ірина К.', city: 'Лондон' },
  ]

  const faqs = [
    { q: 'Нужно ли знать время рождения?', a: 'Желательно но не обязательно. Без времени Орион построит солнечную карту — она даст 80% информации.' },
    { q: 'Что такое транзиты?', a: 'Текущее положение планет относительно вашей натальной карты. Объясняют почему сейчас именно такой период.' },
    { q: 'Можно спросить про конкретную дату?', a: 'Да — спросите про любую дату: когда начинать проект, путешествовать, благоприятен ли период.' },
    { q: 'Астрология — это наука?', a: 'Астрология — древняя система символов и архетипов. Многие находят её точным инструментом. Попробуйте сами.' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif;overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(100,180,255,0.3);border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:.1}50%{opacity:.5}}
        .nav-a{font-family:'Playfair Display',serif;font-size:14px;color:rgba(200,185,240,0.5);text-decoration:none;transition:color .25s;letter-spacing:.3px}
        .nav-a:hover{color:#EDE8F5}
        @media(max-width:768px){.hero-grid{grid-template-columns:1fr!important}.features-grid{grid-template-columns:1fr 1fr!important}.pad{padding-left:20px!important;padding-right:20px!important}}
      `}</style>

      {/* Stars */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {Array.from({length:60}).map((_,i)=>(
          <div key={i} style={{position:'absolute',left:`${(i*41+17)%100}%`,top:`${(i*67+9)%100}%`,width:'1px',height:'1px',borderRadius:'50%',background:'rgba(230,220,255,0.8)',animation:`twinkle ${3+i%5}s ease-in-out infinite`,animationDelay:`${(i*0.3)%4}s`}}/>
        ))}
        <div style={{position:'absolute',top:'-10%',left:'30%',width:'60vw',height:'60vw',maxWidth:'700px',borderRadius:'50%',background:'radial-gradient(circle,rgba(100,180,255,0.08) 0%,transparent 70%)'}}/>
      </div>

      <div style={{position:'relative',zIndex:10}}>
        {/* Nav */}
        <nav style={{padding:'16px 52px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.07)',background:'rgba(8,5,16,0.97)',backdropFilter:'blur(20px)',position:'sticky',top:0,zIndex:100}} className="pad">
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'20px',fontWeight:900,color:'rgba(200,180,255,0.5)',textDecoration:'none',letterSpacing:'1px'}}>
            MYSTIC<span style={{fontSize:'12px',fontWeight:400,verticalAlign:'super',marginLeft:'2px'}}>AI</span>
          </Link>
          <div style={{display:'flex',gap:'28px',alignItems:'center'}}>
            {[['Таро','/tarot'],['Астрология','/astrology'],['Нумерология','/numerology'],['Совместимость','/compatibility']].map(([l,h])=>(
              <Link key={l} href={h} className="nav-a" style={{color:h==='/astrology'?'rgba(100,180,255,0.9)':undefined}}><span>{l}</span></Link>
            ))}
            <Link href="/premium" style={{padding:'6px 14px',borderRadius:'6px',background:'rgba(150,80,255,0.08)',border:'1px solid rgba(150,80,255,0.2)',fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'rgba(200,160,255,0.9)',textDecoration:'none',transition:'all 0.2s'}}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background='rgba(150,80,255,0.15)';el.style.borderColor='rgba(150,80,255,0.5)'}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background='rgba(150,80,255,0.08)';el.style.borderColor='rgba(150,80,255,0.2)'}}>
              ✦ Премиум
            </Link>            <a href="/#pricing" className="nav-a">Тарифы</a>
            <a href="/#reviews" className="nav-a">Отзывы</a>
            <a href="/#faq" className="nav-a">Вопросы</a>
          </div>
          <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
            <Link href="/dashboard" style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',color:'rgba(200,185,240,0.4)',textDecoration:'none'}}>Кабинет</Link>
            <Link href="/auth/login" className="nav-a">Войти</Link>
            <Link href="/auth/register" style={{padding:'8px 20px',borderRadius:'6px',background:'linear-gradient(135deg,#6030B0,#9060E0)',fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'0.5px'}}>Начать</Link>
          </div>
        </nav>

        {/* Hero */}
        <section style={{padding:'80px 52px 100px',maxWidth:'1200px',margin:'0 auto'}} className="pad">
          <div className="hero-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'60px',alignItems:'center'}}>
            <div style={{animation:'fadeUp 0.7s ease both'}}>
              <div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',letterSpacing:'2px',color:'rgba(100,180,255,0.6)',marginBottom:'16px',textTransform:'uppercase'}}>Консультация с ИИ</div>
              <h1 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(36px,5vw,64px)',fontWeight:900,color:'#FFFFFF',lineHeight:1.1,marginBottom:'20px'}}>
                Астрология<br/><span style={{color:'rgba(100,180,255,0.9)'}}>Натальный</span><br/>чарт и транзиты
              </h1>
              <p style={{fontFamily:'"Lora",serif',fontSize:'17px',lineHeight:1.85,color:'rgba(210,200,245,0.65)',marginBottom:'36px'}}>
                Орион — астролог с доступом к полной натальной карте по дате рождения. Узнайте о своём характере, транзитах планет и что вас ждёт в ближайшем будущем.
              </p>
              <div style={{display:'flex',gap:'14px',flexWrap:'wrap',marginBottom:'32px'}}>
                <Link href="/auth/register" style={{padding:'14px 32px',borderRadius:'8px',background:'linear-gradient(135deg,rgba(100,180,255,0.9),rgba(100,180,255,0.65))',fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:'#0C0818',textDecoration:'none',letterSpacing:'0.5px',boxShadow:'0 4px 24px rgba(100,180,255,0.35)'}}>
                  Начать бесплатно
                </Link>
                <button onClick={()=>{const el=document.getElementById('how');if(el){el.scrollIntoView({behavior:'smooth'})}}} style={{padding:'14px 28px',borderRadius:'8px',border:'1px solid rgba(100,180,255,0.3)',background:'transparent',fontFamily:'"Playfair Display",serif',fontSize:'14px',fontWeight:700,color:'rgba(100,180,255,0.8)',cursor:'pointer'}}>
                  Как это работает
                </button>
              </div>
              <div style={{display:'flex',gap:'28px'}}>
                {[['12','знаков зодиака'],
    ['10','планет в карте'],
    ['5','бесплатных']].map(([v,l])=>(
                  <div key={l}>
                    <div style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:800,color:'rgba(100,180,255,0.9)'}}>{v}</div>
                    <div style={{fontFamily:'"Lora",serif',fontSize:'12px',fontStyle:'italic',color:'rgba(200,185,240,0.35)'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card visual */}
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',animation:'fadeUp 0.7s ease 0.2s both',opacity:0}}>
              <div style={{position:'relative',width:'280px',height:'420px'}}>
                {[{r:-12,y:-20,x:-30,z:0},{r:6,y:-10,x:20,z:1},{r:0,y:0,x:0,z:2}].map((c,i)=>(
                  <div key={i} style={{
                    position:'absolute',inset:0,
                    transform:`rotate(${c.r}deg) translate(${c.x}px,${c.y}px)`,
                    zIndex:c.z,
                    background:'linear-gradient(145deg,rgba(100,180,255,0.15),rgba(60,20,100,0.8))',
                    border:'1px solid rgba(100,180,255,0.3)',
                    borderRadius:'16px',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
                  }}>
                    {i===2 && <div style={{textAlign:'center'}}>
                      <div style={{fontSize:'72px',marginBottom:'16px'}}>⭐</div>
                      <div style={{fontFamily:'"Playfair Display",serif',fontSize:'22px',fontWeight:900,color:'rgba(100,180,255,0.9)'}}>Таро</div>
                      <div style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(100,180,255,0.5)',marginTop:'6px'}}>Натальный чарт и транзиты</div>
                    </div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" style={{padding:'80px 52px',background:'rgba(255,255,255,0.02)'}} className="pad">
          <div style={{maxWidth:'1000px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'52px'}}>
              <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(26px,4vw,44px)',fontWeight:900,color:'#FFFFFF',marginBottom:'12px'}}>Как работает расклад</h2>
              <p style={{fontFamily:'"Lora",serif',fontSize:'16px',fontStyle:'italic',color:'rgba(200,185,240,0.45)'}}>Три шага от вопроса до ответа</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'24px'}}>
              {[
                {num:'01',icon:'💬',title:'Задайте вопрос',desc:'Опишите свою ситуацию. Чем конкретнее вопрос — тем точнее расклад. Можно задавать о любой сфере жизни.'},
                {num:'02',icon:'⭐',title:'Карты открываются',desc:'Орион вытягивает карты специально для вашей ситуации. Каждая карта — это зеркало вашей реальности.'},
                {num:'03',icon:'✨',title:'Получите ответ',desc:'Глубокая интерпретация каждой карты с практическими советами именно для вашей ситуации.'},
              ].map((s,i)=>(
                <div key={i} style={{padding:'28px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(100,180,255,0.12)',borderRadius:'14px',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(100,180,255,0.5),transparent)'}}/>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'11px',letterSpacing:'3px',color:'rgba(100,180,255,0.4)',marginBottom:'14px'}}>{s.num}</div>
                  <div style={{fontSize:'32px',marginBottom:'12px'}}>{s.icon}</div>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'18px',fontWeight:700,color:'#EDE8F5',marginBottom:'10px'}}>{s.title}</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.75,color:'rgba(200,185,240,0.55)'}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{padding:'80px 52px'}} className="pad">
          <div style={{maxWidth:'1000px',margin:'0 auto'}}>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(24px,3.5vw,40px)',fontWeight:900,color:'#FFFFFF',marginBottom:'40px',textAlign:'center'}}>Что умеет Орион</h2>
            <div className="features-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
              {[
                {icon:'🔮',title:'Расклад на вопрос',desc:'Один чёткий вопрос — один точный ответ карт'},
                {icon:'❤️',title:'Любовь и отношения',desc:'Что происходит в ваших отношениях и чего ждать'},
                {icon:'💼',title:'Карьера и деньги',desc:'Правильный ли путь и когда ждать перемен'},
                {icon:'🌙',title:'Духовный путь',desc:'Ваши уроки и предназначение в этой жизни'},
                {icon:'⚡',title:'Срочный совет',desc:'Что делать прямо сейчас в сложной ситуации'},
                {icon:'🗓️',title:'Прогноз на период',desc:'Что ждёт вас в ближайший месяц или год'},
              ].map((f,i)=>(
                <div key={i} style={{padding:'22px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px'}}>
                  <div style={{fontSize:'28px',marginBottom:'10px'}}>{f.icon}</div>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'#EDE8F5',marginBottom:'6px'}}>{f.title}</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'13px',lineHeight:1.65,color:'rgba(200,185,240,0.5)'}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section style={{padding:'80px 52px',background:'rgba(255,255,255,0.02)'}} className="pad">
          <div style={{maxWidth:'600px',margin:'0 auto',textAlign:'center'}}>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(24px,3.5vw,40px)',fontWeight:900,color:'#FFFFFF',marginBottom:'12px'}}>Стоимость</h2>
            <p style={{fontFamily:'"Lora",serif',fontSize:'16px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'40px'}}>Первые 5 сообщений с Selenой — бесплатно</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'24px'}}>
              <div style={{padding:'28px',background:'rgba(100,180,255,0.05)',border:'1px solid rgba(100,180,255,0.2)',borderRadius:'14px'}}>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',letterSpacing:'2px',color:'rgba(100,180,255,0.6)',marginBottom:'8px',textTransform:'uppercase'}}>Initiate</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'36px',fontWeight:900,color:'#EDE8F5',marginBottom:'4px'}}>$9.99<span style={{fontSize:'14px',fontWeight:400,color:'rgba(200,185,240,0.4)'}}>/мес</span></div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'20px'}}>Безлимитные расклады таро</p>
                <Link href="/auth/register" style={{display:'block',padding:'11px',textAlign:'center',borderRadius:'8px',background:'rgba(100,180,255,0.15)',border:'1px solid rgba(100,180,255,0.3)',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'rgba(100,180,255,0.9)',textDecoration:'none',letterSpacing:'0.5px'}}>Выбрать</Link>
              </div>
              <div style={{padding:'28px',background:'rgba(150,100,255,0.05)',border:'1px solid rgba(150,100,255,0.25)',borderRadius:'14px',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:'10px',right:'12px',padding:'3px 10px',borderRadius:'4px',background:'rgba(120,200,80,0.15)',border:'1px solid rgba(120,200,80,0.3)',fontFamily:'"Playfair Display",serif',fontSize:'10px',fontWeight:700,color:'rgba(150,230,100,0.9)',letterSpacing:'1px'}}>ЛУЧШИЙ</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'14px',letterSpacing:'2px',color:'rgba(180,140,255,0.6)',marginBottom:'8px',textTransform:'uppercase'}}>Oracle Pro</div>
                <div style={{fontFamily:'"Playfair Display",serif',fontSize:'36px',fontWeight:900,color:'#EDE8F5',marginBottom:'4px'}}>$16.99<span style={{fontSize:'14px',fontWeight:400,color:'rgba(200,185,240,0.4)'}}>/мес</span></div>
                <p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'20px'}}>Все модули + Premium отчёты</p>
                <Link href="/auth/register" style={{display:'block',padding:'11px',textAlign:'center',borderRadius:'8px',background:'linear-gradient(135deg,rgba(120,60,220,0.8),rgba(180,100,255,0.6))',fontFamily:'"Playfair Display",serif',fontSize:'12px',fontWeight:700,color:'#EDE8F5',textDecoration:'none',letterSpacing:'0.5px'}}>Выбрать</Link>
              </div>
            </div>
            <p style={{fontFamily:'"Lora",serif',fontSize:'13px',fontStyle:'italic',color:'rgba(200,185,240,0.3)'}}>Отмена в любой момент · Без карты при регистрации</p>
          </div>
        </section>

        {/* Reviews */}
        <section style={{padding:'80px 52px'}} className="pad">
          <div style={{maxWidth:'900px',margin:'0 auto'}}>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(24px,3.5vw,40px)',fontWeight:900,color:'#FFFFFF',marginBottom:'40px',textAlign:'center'}}>Что говорят пользователи</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
              {reviews.map((r,i)=>(
                <div key={i} style={{padding:'24px',background:'rgba(255,255,255,0.025)',border:'1px solid rgba(201,168,76,0.1)',borderRadius:'14px'}}>
                  <div style={{color:'rgba(100,180,255,0.8)',fontSize:'16px',marginBottom:'12px'}}>★★★★★</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.75,color:'rgba(220,210,245,0.7)',fontStyle:'italic',marginBottom:'16px'}}>"{r.text}"</p>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'13px',fontWeight:700,color:'rgba(100,180,255,0.7)'}}>{r.name}</div>
                  <div style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.3)'}}>{r.city}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{padding:'80px 52px',background:'rgba(255,255,255,0.02)'}} className="pad">
          <div style={{maxWidth:'700px',margin:'0 auto'}}>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(24px,3.5vw,40px)',fontWeight:900,color:'#FFFFFF',marginBottom:'40px',textAlign:'center'}}>Вопросы и ответы</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {faqs.map((f,i)=>(
                <div key={i} style={{padding:'22px 24px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'12px'}}>
                  <div style={{fontFamily:'"Playfair Display",serif',fontSize:'15px',fontWeight:700,color:'#EDE8F5',marginBottom:'8px'}}>{f.q}</div>
                  <p style={{fontFamily:'"Lora",serif',fontSize:'14px',lineHeight:1.75,color:'rgba(200,185,240,0.55)'}}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{padding:'100px 52px',textAlign:'center'}} className="pad">
          <div style={{maxWidth:'600px',margin:'0 auto'}}>
            <div style={{fontSize:'56px',marginBottom:'24px'}}>⭐</div>
            <h2 style={{fontFamily:'"Playfair Display",serif',fontSize:'clamp(28px,4vw,48px)',fontWeight:900,color:'#FFFFFF',marginBottom:'16px'}}>Карты уже ждут вас</h2>
            <p style={{fontFamily:'"Lora",serif',fontSize:'17px',fontStyle:'italic',color:'rgba(200,185,240,0.45)',marginBottom:'36px'}}>Первые 5 сообщений с Selenой — бесплатно. Без карты.</p>
            <Link href="/auth/register" style={{display:'inline-block',padding:'16px 40px',borderRadius:'8px',background:'linear-gradient(135deg,rgba(100,180,255,0.9),rgba(100,180,255,0.65))',fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:700,color:'#0C0818',textDecoration:'none',letterSpacing:'0.5px',boxShadow:'0 4px 30px rgba(100,180,255,0.35)'}}>
              Начать бесплатно →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{padding:'24px 52px',borderTop:'1px solid rgba(255,255,255,0.05)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}} className="pad">
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'16px',fontWeight:900,color:'rgba(200,180,255,0.3)',textDecoration:'none',letterSpacing:'1px'}}>MYSTIC AI</Link>
          <div style={{display:'flex',gap:'20px'}}>
            {[['Privacy','/privacy'],['Terms','/terms'],['Refund','/refund']].map(([l,h])=>(
              <Link key={l} href={h} style={{fontFamily:'"Lora",serif',fontSize:'12px',color:'rgba(200,185,240,0.3)',textDecoration:'none'}}>{l}</Link>
            ))}
          </div>
        </footer>
      </div>
    </>
  )
}