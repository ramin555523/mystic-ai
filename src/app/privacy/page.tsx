import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif}
        h1,h2,h3{font-family:'Playfair Display',serif;color:#EDE8F5}
        p,li{line-height:1.8;color:rgba(220,210,245,0.75);margin-bottom:12px}
        h2{font-size:20px;margin:32px 0 12px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08)}
        ul{padding-left:20px;margin-bottom:12px}
        a{color:rgba(150,100,255,0.8);text-decoration:none}
      `}</style>
      <div style={{minHeight:'100vh',background:'#080510'}}>
        <div style={{maxWidth:'760px',margin:'0 auto',padding:'60px 32px 100px'}}>
          <Link href="/" style={{fontFamily:'"Playfair Display",serif',fontSize:'18px',fontWeight:900,color:'rgba(200,180,255,0.4)',textDecoration:'none',letterSpacing:'1px',display:'block',marginBottom:'48px'}}>
            MYSTIC<span style={{fontSize:'11px',verticalAlign:'super',marginLeft:'2px',fontWeight:400}}>AI</span>
          </Link>
          <h1 style={{fontSize:'clamp(28px,5vw,42px)',fontWeight:900,marginBottom:'8px'}}>Privacy Policy</h1>
          <p style={{color:'rgba(200,185,240,0.4)',fontStyle:'italic',marginBottom:'40px'}}>Last updated: March 2026</p>

          <h2>1. Information We Collect</h2>
          <p>We collect the following information when you use Mystic AI:</p>
          <ul>
            <li>Email address and name (for account creation)</li>
            <li>Date of birth and name (for consultation purposes only)</li>
            <li>Payment information (processed by Stripe, we do not store card details)</li>
            <li>Chat history with our AI consultants</li>
            <li>Usage data and analytics</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our AI consultation services</li>
            <li>To process payments and manage subscriptions</li>
            <li>To send service-related emails</li>
            <li>To personalise your experience</li>
          </ul>

          <h2>3. Data Storage</h2>
          <p>Your data is stored securely using Supabase (EU region). We use industry-standard encryption for all data transmission.</p>

          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Paddle</strong> — payment processing</li>
            <li><strong>Supabase</strong> — database and authentication</li>
            <li><strong>Anthropic (Claude AI)</strong> — AI consultation generation</li>
            <li><strong>Vercel</strong> — hosting</li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>We retain your data for as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us.</p>

          <h2>6. Your Rights (GDPR)</h2>
          <p>If you are in the EU/UK, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We do not use advertising or tracking cookies.</p>

          <h2>8. Children's Privacy</h2>
          <p>Our Service is not directed to persons under 18. We do not knowingly collect personal information from minors.</p>

          <h2>9. Contact</h2>
          <p>For privacy-related questions: <a href="mailto:privacy@mystic-ai.app">privacy@mystic-ai.app</a></p>
        </div>
      </div>
    </>
  )
}