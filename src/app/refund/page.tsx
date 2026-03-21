import Link from 'next/link'

export default function RefundPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#080510;color:#EDE8F5;font-family:'Lora',serif}
        h1,h2{font-family:'Playfair Display',serif;color:#EDE8F5}
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
          <h1 style={{fontSize:'clamp(28px,5vw,42px)',fontWeight:900,marginBottom:'8px'}}>Refund Policy</h1>
          <p style={{color:'rgba(200,185,240,0.4)',fontStyle:'italic',marginBottom:'40px'}}>Last updated: March 2026</p>

          <h2>Our Commitment</h2>
          <p>At Mystic AI, we want you to be completely satisfied with your purchase. We understand that digital services can be different from physical products, so we have a fair and transparent refund policy.</p>

          <h2>Subscriptions</h2>
          <ul>
            <li><strong>First 24 hours:</strong> Full refund if you cancel within 24 hours of your first subscription charge</li>
            <li><strong>After 24 hours:</strong> No refund for the current billing period, but you can cancel to prevent future charges</li>
            <li><strong>How to cancel:</strong> Go to Settings → Subscription → Cancel</li>
          </ul>

          <h2>Premium PDF Reports</h2>
          <ul>
            <li><strong>Technical errors:</strong> Full refund if the report was not generated due to a technical error</li>
            <li><strong>Duplicate charges:</strong> Full refund for any duplicate payment</li>
            <li><strong>Dissatisfied with content:</strong> We will regenerate the report once at no charge</li>
          </ul>

          <h2>How to Request a Refund</h2>
          <p>Email us at <a href="mailto:support@mystic-ai.app">support@mystic-ai.app</a> with:</p>
          <ul>
            <li>Your account email</li>
            <li>Order ID or transaction ID</li>
            <li>Reason for refund request</li>
          </ul>
          <p>We process refund requests within 3 business days. Refunds are returned to the original payment method within 5-10 business days.</p>

          <h2>Exceptions</h2>
          <p>We cannot provide refunds for:</p>
          <ul>
            <li>Dissatisfaction with AI-generated content (subjective interpretation)</li>
            <li>Requests made more than 7 days after purchase</li>
            <li>Accounts that have violated our Terms of Service</li>
          </ul>

          <h2>Contact</h2>
          <p>Questions? Contact us at <a href="mailto:support@mystic-ai.app">support@mystic-ai.app</a></p>
        </div>
      </div>
    </>
  )
}