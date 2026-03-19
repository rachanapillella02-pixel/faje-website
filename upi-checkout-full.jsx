import { useState, useEffect, useRef } from "react";

const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", desc: "Premium noise-cancellation", price: 1299, emoji: "🎧" },
  { id: 2, name: "Smart Watch", desc: "Health & fitness tracking", price: 2499, emoji: "⌚" },
  { id: 3, name: "Laptop Stand", desc: "Ergonomic aluminium design", price: 799, emoji: "💻" },
  { id: 4, name: "Mechanical Keyboard", desc: "RGB backlit, tactile switches", price: 1599, emoji: "⌨️" },
];
const DELIVERY = 40;
const TAX_RATE = 0.085;

function genOrderId() {
  return "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function Spinner({ size = 16, light = true }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid ${light ? "rgba(255,255,255,0.25)" : "rgba(67,97,238,0.2)"}`,
      borderTopColor: light ? "white" : "#4361ee",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
      display: "inline-block"
    }} />
  );
}

const UPI_PA = process.env.NEXT_PUBLIC_UPI_ID ? `${process.env.NEXT_PUBLIC_UPI_ID}@ybl` : '9618848356@ybl';
const UPI_NAME_STORE = 'FAJE Store';

function UPIQRCode({ size = 160, amount, orderId }) {
  const upiString = `upi://pay?pa=${UPI_PA}&pn=${encodeURIComponent(UPI_NAME_STORE)}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderId)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(upiString)}&color=111111&bgcolor=ffffff&margin=6`;
  return (
    <img
      src={qrUrl}
      width={size}
      height={size}
      alt="UPI QR Code"
      style={{ display: 'block', borderRadius: 6 }}
    />
  );
}

// ── SHOP PAGE ────────────────────────────────────────────────────────────────
function ShopPage({ onCheckout }) {
  const [cart, setCart] = useState({});
  const add = id => setCart(p => ({ ...p, [id]: (p[id]||0)+1 }));
  const rem = id => setCart(p => { const n={...p}; n[id]>1?n[id]--:delete n[id]; return n; });
  const count = Object.values(cart).reduce((a,b)=>a+b,0);
  const subtotal = Object.entries(cart).reduce((s,[id,q])=>s+(PRODUCTS.find(p=>p.id===+id)?.price||0)*q,0);
  const total = subtotal + DELIVERY + Math.round(subtotal*TAX_RATE);

  return (
    <div style={{minHeight:"100%",background:"linear-gradient(150deg,#f7f9ff 0%,#fafafa 55%,#f0f4ff 100%)"}}>
      {/* Header */}
      <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.07)",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"white",fontWeight:800}}>✦</div>
          <span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.03em"}}>MyStore</span>
        </div>
        {count>0&&<div style={{background:"#4361ee",color:"white",borderRadius:100,padding:"4px 12px",fontSize:12,fontWeight:700}}>🛒 {count} · ₹{total.toLocaleString()}</div>}
      </div>

      <div style={{padding:"24px 20px 120px"}}>
        <div style={{marginBottom:24}}>
          <p style={{fontSize:10,fontWeight:800,letterSpacing:"0.12em",color:"#4361ee",textTransform:"uppercase",marginBottom:6}}>FEATURED COLLECTION</p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:30,lineHeight:1.1,letterSpacing:"-0.02em",color:"#0a0a0a"}}>Premium picks,<br/><em style={{color:"#4361ee"}}>just for you.</em></h1>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {PRODUCTS.map((p,i)=>(
            <div key={p.id} style={{background:"white",borderRadius:18,padding:"16px 18px",border:"1px solid #ebebeb",boxShadow:"0 1px 3px rgba(0,0,0,0.04),0 6px 20px rgba(0,0,0,0.05)",display:"flex",alignItems:"center",gap:14,animation:`fadeUp 0.4s ${i*0.06}s both`}}>
              <div style={{width:50,height:50,background:"#f0f4ff",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{p.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:700,fontSize:13,letterSpacing:"-0.01em",marginBottom:2}}>{p.name}</p>
                <p style={{fontSize:11,color:"#aaa"}}>{p.desc}</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                <span style={{fontWeight:800,fontSize:14,letterSpacing:"-0.02em"}}>₹{p.price.toLocaleString()}</span>
                {cart[p.id]?(
                  <div style={{display:"flex",alignItems:"center",gap:5,background:"#f0f4ff",borderRadius:100,padding:"3px 4px"}}>
                    <button onClick={()=>rem(p.id)} style={{width:26,height:26,borderRadius:"50%",background:"white",border:"none",cursor:"pointer",fontSize:16,fontWeight:700,color:"#4361ee",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.1)"}}>−</button>
                    <span style={{fontWeight:800,fontSize:13,minWidth:14,textAlign:"center"}}>{cart[p.id]}</span>
                    <button onClick={()=>add(p.id)} style={{width:26,height:26,borderRadius:"50%",background:"#4361ee",border:"none",cursor:"pointer",fontSize:16,fontWeight:700,color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                ):(
                  <button onClick={()=>add(p.id)} style={{width:32,height:32,borderRadius:"50%",background:"#4361ee",border:"none",cursor:"pointer",fontSize:18,color:"white",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(67,97,238,0.4)"}}>+</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {count>0&&(
          <div style={{marginTop:20,animation:"fadeUp 0.3s both"}}>
            <div style={{background:"white",borderRadius:20,padding:"20px 20px",border:"1px solid #ebebeb",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,color:"#aaa"}}>{count} item{count>1?"s":""}</span><span style={{fontSize:13,color:"#aaa"}}>₹{subtotal.toLocaleString()}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:13,color:"#aaa"}}>Delivery + Tax</span><span style={{fontSize:13,color:"#aaa"}}>₹{DELIVERY+Math.round(subtotal*TAX_RATE)}</span></div>
              <div style={{height:1,background:"#f0f0f0",marginBottom:14}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <span style={{fontWeight:700,fontSize:14}}>Total</span>
                <span style={{fontWeight:800,fontSize:20,letterSpacing:"-0.03em",color:"#4361ee"}}>₹{total.toLocaleString()}</span>
              </div>
              <button onClick={()=>onCheckout({items:Object.entries(cart).map(([id,q])=>{const p=PRODUCTS.find(x=>x.id===+id);return{name:p.name,qty:q,price:p.price};}),subtotal})} style={{width:"100%",background:"linear-gradient(135deg,#4361ee,#5b73f5)",color:"white",border:"none",borderRadius:13,padding:"15px",fontSize:14,fontWeight:700,cursor:"pointer",letterSpacing:"-0.01em",boxShadow:"0 4px 14px rgba(67,97,238,0.4)"}}>
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
        {count===0&&<p style={{textAlign:"center",color:"#ccc",fontSize:13,marginTop:40}}>Add items to get started ↑</p>}
      </div>
    </div>
  );
}

// ── CHECKOUT PAGE ────────────────────────────────────────────────────────────
function CheckoutPage({ orderData, onProceed, onBack }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const tax = Math.round(orderData.subtotal * TAX_RATE);
  const total = orderData.subtotal + DELIVERY + tax;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name required";
    if (!form.email.trim()||!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()||form.phone.replace(/\D/g,"").length<10) e.phone = "10-digit number required";
    setErrors(e); return !Object.keys(e).length;
  };

  const proceed = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(()=>{ setLoading(false); onProceed({...form,total,tax}); },1200);
  };

  return (
    <div style={{minHeight:"100%",background:"linear-gradient(150deg,#f7f9ff 0%,#fafafa 55%,#f0f4ff 100%)"}}>
      <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.07)",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,color:"#888",fontWeight:600,padding:0}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"white",fontWeight:800}}>✦</div><span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.03em"}}>MyStore</span></div>
        <div style={{fontSize:11,color:"#ccc",display:"flex",alignItems:"center",gap:4}}>🔒 Secure</div>
      </div>

      <div style={{padding:"24px 20px 60px"}}>
        <div style={{marginBottom:22}}>
          <p style={{fontSize:10,fontWeight:800,letterSpacing:"0.12em",color:"#4361ee",textTransform:"uppercase",marginBottom:6}}>STEP 1 OF 2</p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:26,letterSpacing:"-0.02em",lineHeight:1.1}}>Review your order</h1>
        </div>

        <div style={{background:"white",borderRadius:18,padding:20,border:"1px solid #ebebeb",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:12,animation:"fadeUp 0.4s both"}}>
          <p style={{fontSize:10,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"#ccc",marginBottom:14}}>Order Summary</p>
          {orderData.items.map((item,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
              <div><p style={{fontSize:13,fontWeight:600}}>{item.name}</p><p style={{fontSize:11,color:"#bbb"}}>Qty {item.qty} × ₹{item.price.toLocaleString()}</p></div>
              <span style={{fontSize:13,fontWeight:700}}>₹{(item.qty*item.price).toLocaleString()}</span>
            </div>
          ))}
          <div style={{height:1,background:"#f0f0f0",margin:"12px 0"}}/>
          {[["Subtotal",`₹${orderData.subtotal.toLocaleString()}`],["Delivery",`₹${DELIVERY}`],[`Tax (8.5%)`,`₹${tax}`]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:12,color:"#aaa"}}>{k}</span><span style={{fontSize:12,color:"#aaa"}}>{v}</span></div>
          ))}
          <div style={{height:1,background:"#f0f0f0",margin:"12px 0"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontWeight:700,fontSize:14}}>Total</span>
            <span style={{fontWeight:800,fontSize:20,letterSpacing:"-0.03em",color:"#4361ee"}}>₹{total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{background:"white",borderRadius:18,padding:20,border:"1px solid #ebebeb",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:18,animation:"fadeUp 0.4s 0.08s both"}}>
          <p style={{fontSize:10,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"#ccc",marginBottom:14}}>Contact Details</p>
          {[{k:"name",l:"Full Name",p:"Arjun Sharma",t:"text"},{k:"email",l:"Email",p:"arjun@example.com",t:"email"},{k:"phone",l:"Phone",p:"+91 98765 43210",t:"tel"}].map(f=>(
            <div key={f.k} style={{marginBottom:11}}>
              <label style={{fontSize:11,fontWeight:700,color:"#999",display:"block",marginBottom:5}}>{f.l}</label>
              <input type={f.t} placeholder={f.p} value={form[f.k]}
                onChange={e=>{setForm(p=>({...p,[f.k]:e.target.value}));setErrors(p=>({...p,[f.k]:""}));}}
                style={{width:"100%",padding:"11px 13px",border:`1.5px solid ${errors[f.k]?"#e17055":"#e8e8e8"}`,borderRadius:10,fontSize:13,fontFamily:"inherit",outline:"none",background:"#fafafa",boxSizing:"border-box",transition:"all 0.2s"}}
                onFocus={e=>{e.target.style.borderColor="#4361ee";e.target.style.background="white";e.target.style.boxShadow="0 0 0 3px rgba(67,97,238,0.1)";}}
                onBlur={e=>{e.target.style.borderColor=errors[f.k]?"#e17055":"#e8e8e8";e.target.style.background="#fafafa";e.target.style.boxShadow="none";}}
              />
              {errors[f.k]&&<p style={{fontSize:11,color:"#e17055",marginTop:3}}>{errors[f.k]}</p>}
            </div>
          ))}
        </div>

        <button onClick={proceed} disabled={loading} style={{width:"100%",background:loading?"#a0aef5":"linear-gradient(135deg,#4361ee,#5b73f5)",color:"white",border:"none",borderRadius:13,padding:"15px",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:loading?"none":"0 4px 14px rgba(67,97,238,0.4)",animation:"fadeUp 0.4s 0.14s both"}}>
          {loading?<><Spinner/>Creating Order...</>:`Proceed to Payment — ₹${total.toLocaleString()}`}
        </button>
        <p style={{textAlign:"center",fontSize:11,color:"#ccc",marginTop:10}}>🔒 Encrypted & secure</p>
      </div>
    </div>
  );
}

// ── PAYMENT PAGE ─────────────────────────────────────────────────────────────
function PaymentPage({ orderId, total, onPaid, onBack }) {
  const [timer, setTimer] = useState(600);
  const [modal, setModal] = useState(false);
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  useEffect(()=>{ const t=setInterval(()=>setTimer(p=>p>0?p-1:0),1000); return()=>clearInterval(t); },[]);

  return (
    <div style={{minHeight:"100%",background:"linear-gradient(150deg,#f7f9ff 0%,#fafafa 55%,#f0f4ff 100%)"}}>
      <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.07)",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,color:"#888",fontWeight:600,padding:0}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"white",fontWeight:800}}>✦</div><span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.03em"}}>MyStore</span></div>
        <div style={{fontSize:11,color:"#ccc",display:"flex",alignItems:"center",gap:4}}>🔒 Secure</div>
      </div>

      <div style={{padding:"24px 20px 60px"}}>
        <div style={{marginBottom:22}}>
          <p style={{fontSize:10,fontWeight:800,letterSpacing:"0.12em",color:"#4361ee",textTransform:"uppercase",marginBottom:6}}>STEP 2 OF 2</p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:26,letterSpacing:"-0.02em"}}>Complete payment</h1>
        </div>

        {/* Amount Card */}
        <div style={{background:"linear-gradient(135deg,#4361ee 0%,#7c3aed 100%)",borderRadius:20,padding:"20px 22px",marginBottom:12,position:"relative",overflow:"hidden",animation:"fadeUp 0.4s both"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:90,height:90,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
          <div style={{position:"absolute",bottom:-15,left:-10,width:60,height:60,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
          <p style={{fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.5)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>AMOUNT DUE</p>
          <p style={{fontSize:38,fontWeight:800,color:"white",letterSpacing:"-0.04em",marginBottom:12}}>₹{total.toLocaleString()}</p>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:timer<60?"#ff6b6b":"#00e676",animation:"blink 2s infinite"}}/>
            <span style={{fontSize:12,color:"rgba(255,255,255,0.6)",fontWeight:500}}>Session expires in {fmt(timer)}</span>
          </div>
        </div>

        {/* QR Card */}
        <div style={{background:"white",borderRadius:20,padding:"22px 20px",border:"1px solid #ebebeb",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:10,textAlign:"center",animation:"fadeUp 0.4s 0.08s both"}}>
          <p style={{fontSize:10,fontWeight:800,color:"#ccc",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:16}}>Scan QR to Pay</p>
          <div style={{display:"inline-block",padding:12,background:"white",borderRadius:14,border:"1px solid #ebebeb",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",marginBottom:12}}>
            <UPIQRCode size={148} amount={total} orderId={orderId}/>
          </div>
          <p style={{fontSize:13,color:"#555",marginBottom:2}}>Pay to <strong style={{color:"#111"}}>{UPI_PA}</strong></p>
          <p style={{fontSize:11,color:"#ccc",marginBottom:16}}>Order #{orderId}</p>
          <div style={{display:"flex",justifyContent:"center",gap:5,flexWrap:"wrap"}}>
            {[{n:"GPay",c:"#4285F4"},{n:"PhonePe",c:"#5f259f"},{n:"Paytm",c:"#002970"},{n:"BHIM",c:"#0b3d8c"}].map(a=>(
              <span key={a.n} style={{display:"inline-flex",alignItems:"center",gap:4,background:"#f5f5f5",borderRadius:100,padding:"3px 9px",fontSize:11,fontWeight:500,color:"#555"}}>
                <span style={{width:12,height:12,borderRadius:3,background:a.c,display:"inline-block"}}/>
                {a.n}
              </span>
            ))}
          </div>
        </div>

        <button onClick={()=>{ window.location.href = `upi://pay?pa=${UPI_PA}&pn=${encodeURIComponent(UPI_NAME_STORE)}&am=${total}&cu=INR&tn=${encodeURIComponent(orderId)}`; }} style={{width:"100%",background:"white",color:"#4361ee",border:"1.5px solid #4361ee",borderRadius:13,padding:"14px",fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all 0.2s",animation:"fadeUp 0.4s 0.12s both"}}
          onMouseEnter={e=>e.currentTarget.style.background="#f0f4ff"}
          onMouseLeave={e=>e.currentTarget.style.background="white"}>
          Pay with UPI App
        </button>

        <button onClick={()=>setModal(true)} style={{width:"100%",background:"linear-gradient(135deg,#4361ee,#5b73f5)",color:"white",border:"none",borderRadius:13,padding:"15px",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(67,97,238,0.4)",animation:"fadeUp 0.4s 0.16s both"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 22px rgba(67,97,238,0.5)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 14px rgba(67,97,238,0.4)";}}>
          ✓ I Have Paid
        </button>
      </div>

      {/* Confirm Modal */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:50,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(4px)",animation:"fadeIn 0.2s both"}} onClick={()=>setModal(false)}>
          <div style={{background:"white",borderRadius:"22px 22px 0 0",padding:"22px 22px 32px",width:"100%",maxWidth:480,animation:"slideUp 0.3s cubic-bezier(0.25,0.46,0.45,0.94)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:34,height:4,background:"#e0e0e0",borderRadius:2,margin:"0 auto 18px"}}/>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:18,marginBottom:7,letterSpacing:"-0.02em"}}>Confirm payment?</h3>
            <p style={{fontSize:13,color:"#888",marginBottom:20,lineHeight:1.6}}>Make sure your UPI payment of <strong style={{color:"#111"}}>₹{total.toLocaleString()}</strong> is complete.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setModal(false)} style={{flex:1,background:"#f5f5f5",color:"#777",border:"none",borderRadius:10,padding:"13px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Not Yet</button>
              <button onClick={()=>{setModal(false);onPaid();}} style={{flex:2,background:"#4361ee",color:"white",border:"none",borderRadius:10,padding:"13px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Yes, Submit Proof →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PROOF PAGE ───────────────────────────────────────────────────────────────
function ProofPage({ orderId, total, onSubmit, onBack }) {
  const [txId, setTxId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState("");

  const handleFile = f => {
    if (!f||!f.type.startsWith("image/")) { setError("Please upload an image"); return; }
    setFile(f); setError("");
    const r = new FileReader(); r.onloadend=()=>setPreview(r.result); r.readAsDataURL(f);
  };

  const submit = () => {
    if (!txId.trim()&&!file) { setError("Provide a Transaction ID or upload a screenshot"); return; }
    // Build WhatsApp message with order details and open WhatsApp to send screenshot
    const msg = `Hi! I've paid ₹${total.toLocaleString()} for FAJE Order #${orderId} via UPI.\n\n` +
                (txId.trim() ? `UPI Transaction ID: ${txId.trim()}\n\n` : '') +
                `Please verify and confirm my order. Thank you!`;
    const waUrl = `https://wa.me/919618848356?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
    setLoading(true); setTimeout(()=>{ setLoading(false); onSubmit(); },1000);
  };

  return (
    <div style={{minHeight:"100%",background:"linear-gradient(150deg,#f7f9ff 0%,#fafafa 55%,#f0f4ff 100%)"}}>
      <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.07)",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontSize:13,color:"#888",fontWeight:600,padding:0}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"white",fontWeight:800}}>✦</div><span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.03em"}}>MyStore</span></div>
        <div style={{fontSize:11,color:"#ccc"}}>🔒 Secure</div>
      </div>

      <div style={{padding:"24px 20px 60px"}}>
        <div style={{marginBottom:22}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#f0fdf4",borderRadius:100,padding:"4px 12px",marginBottom:12}}>
            <div style={{width:6,height:6,background:"#00b894",borderRadius:"50%",animation:"blink 2s infinite"}}/>
            <span style={{fontSize:11,fontWeight:700,color:"#00b894"}}>Payment Sent</span>
          </div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:26,letterSpacing:"-0.02em",lineHeight:1.1,marginBottom:8}}>Submit payment<br/>reference</h1>
          <p style={{fontSize:13,color:"#aaa",lineHeight:1.6}}>Help us verify your ₹{total.toLocaleString()} payment.</p>
        </div>

        <div style={{background:"white",borderRadius:18,padding:20,border:"1px solid #ebebeb",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:10,animation:"fadeUp 0.4s both"}}>
          <p style={{fontSize:10,fontWeight:800,color:"#ccc",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>UPI Transaction ID</p>
          <input type="text" placeholder="e.g. 415678901234" value={txId}
            onChange={e=>{setTxId(e.target.value);setError("");}}
            style={{width:"100%",padding:"11px 13px",border:"1.5px solid #e8e8e8",borderRadius:10,fontSize:14,fontFamily:"inherit",outline:"none",background:"#fafafa",boxSizing:"border-box",letterSpacing:"0.02em",transition:"all 0.2s"}}
            onFocus={e=>{e.target.style.borderColor="#4361ee";e.target.style.background="white";e.target.style.boxShadow="0 0 0 3px rgba(67,97,238,0.1)";}}
            onBlur={e=>{e.target.style.borderColor="#e8e8e8";e.target.style.background="#fafafa";e.target.style.boxShadow="none";}}
          />
          <p style={{fontSize:11,color:"#ccc",marginTop:7}}>Find this in your UPI app under payment history</p>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:12,margin:"8px 0"}}>
          <div style={{flex:1,height:1,background:"#e8e8e8"}}/><span style={{fontSize:11,color:"#ccc",fontWeight:500}}>or</span><div style={{flex:1,height:1,background:"#e8e8e8"}}/>
        </div>

        <div style={{background:"white",borderRadius:18,padding:20,border:"1px solid #ebebeb",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:18,animation:"fadeUp 0.4s 0.08s both"}}>
          <p style={{fontSize:10,fontWeight:800,color:"#ccc",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Payment Screenshot</p>
          {preview?(
            <div style={{position:"relative"}}>
              <img src={preview} alt="preview" style={{width:"100%",borderRadius:10,maxHeight:160,objectFit:"cover"}}/>
              <button onClick={()=>{setFile(null);setPreview(null);}} style={{position:"absolute",top:7,right:7,width:26,height:26,borderRadius:"50%",background:"rgba(0,0,0,0.55)",color:"white",border:"none",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              <p style={{fontSize:12,color:"#00b894",marginTop:7,fontWeight:600}}>✓ Screenshot attached</p>
            </div>
          ):(
            <label onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
              style={{display:"block",border:`2px dashed ${drag?"#4361ee":"#e0e0e0"}`,borderRadius:14,padding:"24px 20px",textAlign:"center",cursor:"pointer",background:drag?"#f0f4ff":"#fafafa",transition:"all 0.2s"}}>
              <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
              <div style={{fontSize:26,marginBottom:8}}>📷</div>
              <p style={{fontSize:13,fontWeight:600,color:"#555",marginBottom:3}}>Upload screenshot</p>
              <p style={{fontSize:11,color:"#bbb"}}>Click or drag & drop · PNG, JPG, WEBP</p>
            </label>
          )}
        </div>

        {error&&<p style={{fontSize:12,color:"#e17055",marginBottom:12,textAlign:"center",fontWeight:500}}>⚠ {error}</p>}

        <button onClick={submit} disabled={loading} style={{width:"100%",background:loading?"#a0aef5":"linear-gradient(135deg,#4361ee,#5b73f5)",color:"white",border:"none",borderRadius:13,padding:"15px",fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:loading?"none":"0 4px 14px rgba(67,97,238,0.4)",animation:"fadeUp 0.4s 0.12s both"}}>
          {loading?<><Spinner/>Submitting...</>:"Submit Payment Proof →"}
        </button>
      </div>
    </div>
  );
}

// ── STATUS PAGE ──────────────────────────────────────────────────────────────
function StatusPage({ orderId, total, name, onHome }) {
  const [status, setStatus] = useState("verification_pending");
  const [dots, setDots] = useState("");
  useEffect(()=>{ const t=setTimeout(()=>setStatus("confirmed"),8000); return()=>clearTimeout(t); },[]);
  useEffect(()=>{ if(status!=="confirmed"){ const t=setInterval(()=>setDots(p=>p.length>=3?"":p+"."),500); return()=>clearInterval(t); } },[status]);

  const steps = [{key:"sent",label:"Payment sent"},{key:"review",label:"Under review"},{key:"confirmed",label:"Order confirmed"}];
  const getS = k => {
    if(status==="confirmed") return "done";
    if(k==="sent") return "done";
    if(k==="review") return "active";
    return "pending";
  };

  return (
    <div style={{minHeight:"100%",background:"linear-gradient(150deg,#f7f9ff 0%,#fafafa 55%,#f0f4ff 100%)"}}>
      <div style={{background:"rgba(255,255,255,0.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.07)",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"white",fontWeight:800}}>✦</div><span style={{fontWeight:800,fontSize:15,letterSpacing:"-0.03em"}}>MyStore</span></div>
      </div>

      <div style={{padding:"36px 20px 60px"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          {status==="confirmed"?(
            <div style={{width:72,height:72,background:"#f0fdf4",borderRadius:"50%",margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>✅</div>
          ):(
            <div style={{width:72,height:72,background:"#f0f4ff",borderRadius:"50%",margin:"0 auto 18px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:32,height:32,border:"3px solid #e0e7ff",borderTopColor:"#4361ee",borderRadius:"50%",animation:"spin 1.2s linear infinite"}}/>
            </div>
          )}
          <h1 style={{fontFamily:"Georgia,serif",fontSize:24,letterSpacing:"-0.02em",marginBottom:8,transition:"all 0.4s"}}>
            {status==="confirmed"?"Payment confirmed! 🎉":`Verifying your payment${dots}`}
          </h1>
          <p style={{fontSize:13,color:"#aaa",lineHeight:1.6,maxWidth:260,margin:"0 auto"}}>
            {status==="confirmed"?"Your order has been placed. Thank you!":"Our team is reviewing. This takes less than a minute."}
          </p>
          {status==="verification_pending"&&<p style={{fontSize:11,color:"#ccc",marginTop:10}}>⟳ Auto-refreshing · Will confirm in ~8s (demo)</p>}
        </div>

        <div style={{background:"white",borderRadius:18,padding:20,border:"1px solid #ebebeb",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:12,animation:"fadeUp 0.4s 0.1s both"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div><p style={{fontSize:10,fontWeight:700,color:"#ccc",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>ORDER ID</p><p style={{fontSize:14,fontWeight:700}}>{orderId}</p></div>
            <span style={{padding:"4px 11px",borderRadius:100,fontSize:11,fontWeight:700,background:status==="confirmed"?"#f0fdf4":"#eff6ff",color:status==="confirmed"?"#15803d":"#1d4ed8",transition:"all 0.3s"}}>
              {status==="confirmed"?"CONFIRMED":"UNDER REVIEW"}
            </span>
          </div>
          <div style={{height:1,background:"#f0f0f0",marginBottom:12}}/>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontSize:12,color:"#aaa"}}>Customer</span><span style={{fontSize:13,fontWeight:600}}>{name}</span></div>
          <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:"#aaa"}}>Amount</span><span style={{fontSize:18,fontWeight:800,letterSpacing:"-0.03em",color:"#4361ee"}}>₹{total.toLocaleString()}</span></div>
        </div>

        <div style={{background:"white",borderRadius:18,padding:20,border:"1px solid #ebebeb",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:20,animation:"fadeUp 0.4s 0.14s both"}}>
          <p style={{fontSize:10,fontWeight:800,color:"#ccc",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:16}}>Order Progress</p>
          {steps.map((s,i)=>{
            const st=getS(s.key);
            return (
              <div key={s.key} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:i<steps.length-1?16:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:st==="done"?"#00b894":st==="active"?"#4361ee":"#f0f0f0",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.4s",boxShadow:st==="active"?"0 0 0 4px rgba(67,97,238,0.15)":"none",flexShrink:0}}>
                    {st==="done"?<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    :st==="active"?<div style={{width:6,height:6,background:"white",borderRadius:"50%",animation:"blink 1.5s infinite"}}/>
                    :<div style={{width:6,height:6,background:"#ccc",borderRadius:"50%"}}/>}
                  </div>
                  {i<steps.length-1&&<div style={{width:2,height:16,marginTop:3,background:st==="done"?"#00b894":"#f0f0f0",transition:"background 0.4s"}}/>}
                </div>
                <p style={{fontSize:13,fontWeight:st==="pending"?400:600,color:st==="pending"?"#ccc":"#111",paddingTop:3,transition:"all 0.3s"}}>{s.label}</p>
              </div>
            );
          })}
        </div>

        {status==="confirmed"&&(
          <button onClick={onHome} style={{width:"100%",background:"linear-gradient(135deg,#4361ee,#5b73f5)",color:"white",border:"none",borderRadius:13,padding:"15px",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(67,97,238,0.4)",animation:"fadeUp 0.4s both"}}>
            Continue Shopping →
          </button>
        )}
      </div>
    </div>
  );
}

// ── ADMIN PAGE ───────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  {id:"ORD-A1B2C3",name:"Priya Mehta",email:"priya@example.com",amount:3838,status:"verification_pending",txId:"417892034561",time:"2 min ago",items:"Smart Watch × 1, Laptop Stand × 1"},
  {id:"ORD-D4E5F6",name:"Rahul Gupta",email:"rahul@example.com",amount:1299,status:"verification_pending",txId:"",screenshot:true,time:"8 min ago",items:"Wireless Headphones × 1"},
  {id:"ORD-G7H8I9",name:"Sneha Iyer",email:"sneha@example.com",amount:5797,status:"verification_pending",txId:"419834760213",time:"15 min ago",items:"Smart Watch × 2, Keyboard × 1"},
  {id:"ORD-J1K2L3",name:"Arjun Shah",email:"arjun@example.com",amount:799,status:"confirmed",txId:"416234890175",time:"34 min ago",items:"Laptop Stand × 1"},
  {id:"ORD-M4N5O6",name:"Kavya Reddy",email:"kavya@example.com",amount:2499,status:"rejected",txId:"411000000001",time:"1 hr ago",items:"Smart Watch × 1"},
];

function AdminPage({ onBack }) {
  const [key,setKey]=useState("");
  const [authed,setAuthed]=useState(false);
  const [orders,setOrders]=useState(MOCK_ORDERS);
  const [filter,setFilter]=useState("all_pending");
  const [processing,setProcessing]=useState(null);
  const [rejectModal,setRejectModal]=useState(null);
  const [rejectReason,setRejectReason]=useState("");
  const [toast,setToast]=useState(null);

  const showToast=(msg,type="success")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
  const stats={ total:orders.length, pending:orders.filter(o=>o.status==="verification_pending").length, confirmed:orders.filter(o=>o.status==="confirmed").length, revenue:orders.filter(o=>o.status==="confirmed").reduce((s,o)=>s+o.amount,0) };
  const filtered=orders.filter(o=>{ if(filter==="all_pending") return o.status==="verification_pending"; if(filter==="all") return true; return o.status===filter; });

  const approve=id=>{ setProcessing(id+"_a"); setTimeout(()=>{ setOrders(p=>p.map(o=>o.id===id?{...o,status:"confirmed"}:o)); setProcessing(null); showToast("✅ Payment approved!"); },1100); };
  const reject=id=>{ setProcessing(id+"_r"); setTimeout(()=>{ setOrders(p=>p.map(o=>o.id===id?{...o,status:"rejected"}:o)); setProcessing(null); setRejectModal(null); setRejectReason(""); showToast("Payment rejected.","error"); },1000); };

  if(!authed) return (
    <div style={{minHeight:"100%",background:"#0c0c0f",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#16161a",border:"1px solid #222",borderRadius:22,padding:"36px 30px",width:"100%",maxWidth:340,animation:"fadeUp 0.4s both"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:50,height:50,background:"linear-gradient(135deg,#4361ee,#7c3aed)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"white",margin:"0 auto 14px"}}>✦</div>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:22,color:"white",marginBottom:6}}>Admin Access</h1>
          <p style={{fontSize:12,color:"#555"}}>Enter your admin key to continue</p>
        </div>
        <input type="password" placeholder='Try: admin123' value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&key==="admin123"&&setAuthed(true)}
          style={{width:"100%",padding:"11px 13px",background:"#1e1e24",border:"1.5px solid #2a2a35",borderRadius:10,fontSize:14,color:"white",fontFamily:"inherit",outline:"none",marginBottom:12,boxSizing:"border-box",transition:"border-color 0.2s"}}
          onFocus={e=>e.target.style.borderColor="#4361ee"} onBlur={e=>e.target.style.borderColor="#2a2a35"}
        />
        <button onClick={()=>{ if(key==="admin123") setAuthed(true); else{ const inp=document.querySelector("input[type=password]"); if(inp){inp.style.borderColor="#e17055"; inp.style.animation="shake 0.3s"; setTimeout(()=>{inp.style.animation="";inp.style.borderColor="#2a2a35";},400); } } }}
          style={{width:"100%",background:"linear-gradient(135deg,#4361ee,#5b73f5)",color:"white",border:"none",borderRadius:10,padding:"13px",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:10}}>
          Enter Dashboard →
        </button>
        <button onClick={onBack} style={{width:"100%",background:"transparent",color:"#444",border:"none",padding:"8px",fontSize:13,cursor:"pointer"}}>← Back to Store</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100%",background:"#f8f9fa"}}>
      {toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:toast.type==="error"?"#e17055":"#00b894",color:"white",borderRadius:100,padding:"9px 18px",fontSize:13,fontWeight:600,zIndex:100,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",whiteSpace:"nowrap",animation:"fadeUp 0.3s both"}}>{toast.msg}</div>}

      <div style={{background:"white",borderBottom:"1px solid #ebebeb",padding:"0 20px",height:52,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <div style={{width:26,height:26,borderRadius:7,background:"linear-gradient(135deg,#4361ee,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"white"}}>✦</div>
          <span style={{fontWeight:800,fontSize:14,letterSpacing:"-0.02em"}}>Admin Dashboard</span>
        </div>
        <div style={{display:"flex",gap:7}}>
          <button onClick={onBack} style={{background:"#f0f4ff",color:"#4361ee",border:"none",borderRadius:7,padding:"5px 11px",fontSize:11,fontWeight:700,cursor:"pointer"}}>← Store</button>
          <button onClick={()=>setAuthed(false)} style={{background:"#f5f5f5",color:"#888",border:"none",borderRadius:7,padding:"5px 11px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Log out</button>
        </div>
      </div>

      <div style={{padding:"18px 16px"}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[{l:"Total Orders",v:stats.total,c:"#0a0a0a"},{l:"Needs Review",v:stats.pending,c:"#1d4ed8",bg:"#eff6ff"},{l:"Confirmed",v:stats.confirmed,c:"#15803d",bg:"#f0fdf4"},{l:"Revenue",v:`₹${stats.revenue.toLocaleString()}`,c:"#4361ee"}].map(s=>(
            <div key={s.l} style={{background:s.bg||"white",border:"1px solid #ebebeb",borderRadius:13,padding:"14px 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
              <p style={{fontSize:9,fontWeight:800,color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>{s.l}</p>
              <p style={{fontSize:22,fontWeight:800,color:s.c,letterSpacing:"-0.03em"}}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:3}}>
          {[{k:"all_pending",l:"Needs Review"},{k:"verification_pending",l:"Verification"},{k:"confirmed",l:"Confirmed"},{k:"rejected",l:"Rejected"},{k:"all",l:"All"}].map(t=>(
            <button key={t.k} onClick={()=>setFilter(t.k)} style={{background:filter===t.k?"#4361ee":"white",color:filter===t.k?"white":"#777",border:"1px solid",borderColor:filter===t.k?"#4361ee":"#e8e8e8",borderRadius:100,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s"}}>
              {t.l}{t.k==="all_pending"&&stats.pending>0?` (${stats.pending})`:""}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filtered.length===0?(
          <div style={{textAlign:"center",padding:"40px 20px",background:"white",borderRadius:16,border:"1px solid #ebebeb"}}>
            <p style={{fontSize:24,marginBottom:7}}>📭</p>
            <p style={{fontSize:13,color:"#aaa",fontWeight:500}}>No orders found</p>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {filtered.map((o,i)=>(
              <div key={o.id} style={{background:"white",borderRadius:15,padding:"16px 18px",border:"1px solid #ebebeb",boxShadow:"0 1px 3px rgba(0,0,0,0.03)",animation:`fadeUp 0.35s ${i*0.04}s both`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontSize:12,fontWeight:800}}>{o.id}</span>
                      <span style={{padding:"2px 8px",borderRadius:100,fontSize:10,fontWeight:700,background:o.status==="confirmed"?"#f0fdf4":o.status==="rejected"?"#fef2f2":"#eff6ff",color:o.status==="confirmed"?"#15803d":o.status==="rejected"?"#dc2626":"#1d4ed8"}}>
                        {o.status==="verification_pending"?"NEEDS REVIEW":o.status.toUpperCase()}
                      </span>
                    </div>
                    <p style={{fontSize:12,color:"#444",marginBottom:1}}><strong>{o.name}</strong> · <span style={{color:"#aaa",fontWeight:400,fontSize:11}}>{o.email}</span></p>
                    <p style={{fontSize:10,color:"#ccc"}}>{o.items} · {o.time}</p>
                  </div>
                  <span style={{fontSize:18,fontWeight:800,letterSpacing:"-0.03em",color:"#4361ee",flexShrink:0}}>₹{o.amount.toLocaleString()}</span>
                </div>

                {(o.txId||o.screenshot)&&(
                  <div style={{padding:"10px 12px",background:"#fafafa",borderRadius:9,display:"flex",gap:14,flexWrap:"wrap",marginBottom:10}}>
                    {o.txId&&<div><p style={{fontSize:9,fontWeight:800,color:"#ccc",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>TXID</p><code style={{fontSize:12,fontWeight:700,color:"#333",background:"white",border:"1px solid #e8e8e8",borderRadius:6,padding:"2px 8px"}}>{o.txId}</code></div>}
                    {o.screenshot&&<div><p style={{fontSize:9,fontWeight:800,color:"#ccc",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>SCREENSHOT</p><span style={{display:"inline-flex",alignItems:"center",gap:4,background:"#4361ee",color:"white",borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:600}}>📷 View</span></div>}
                  </div>
                )}

                {o.status==="verification_pending"&&(
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>approve(o.id)} disabled={!!processing} style={{flex:1,background:processing===o.id+"_a"?"#a7f3d0":"#00b894",color:"white",border:"none",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,cursor:processing?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all 0.2s"}}>
                      {processing===o.id+"_a"?<><Spinner size={12}/>Approving...</>:"✓ Approve"}
                    </button>
                    <button onClick={()=>{setRejectModal(o.id);setRejectReason("");}} style={{flex:1,background:"#fef2f2",color:"#dc2626",border:"1px solid #fca5a5",borderRadius:9,padding:"10px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✕ Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)",animation:"fadeIn 0.2s both"}} onClick={()=>setRejectModal(null)}>
          <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:18,padding:"24px 22px",width:"100%",maxWidth:360,animation:"popIn 0.3s both"}}>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:18,marginBottom:7}}>Reject payment?</h3>
            <p style={{fontSize:12,color:"#aaa",marginBottom:14,lineHeight:1.6}}>Provide an optional reason for the customer.</p>
            <textarea placeholder="e.g. Transaction ID mismatch..." value={rejectReason} onChange={e=>setRejectReason(e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1.5px solid #e8e8e8",borderRadius:9,fontSize:13,fontFamily:"inherit",resize:"vertical",minHeight:65,outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
            <div style={{display:"flex",gap:9}}>
              <button onClick={()=>setRejectModal(null)} style={{flex:1,background:"#f5f5f5",color:"#777",border:"none",borderRadius:9,padding:"11px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
              <button onClick={()=>reject(rejectModal)} disabled={!!processing} style={{flex:1,background:"#dc2626",color:"white",border:"none",borderRadius:9,padding:"11px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                {processing?<><Spinner size={12}/>Rejecting...</>:"Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("shop");
  const [orderData, setOrderData] = useState(null);
  const [orderId] = useState(genOrderId);
  const [customerInfo, setCustomerInfo] = useState(null);

  const go = p => setPage(p);

  const pages = [
    {id:"shop",label:"🛍 Shop"},
    {id:"checkout",label:"📋 Checkout"},
    {id:"payment",label:"💳 Payment"},
    {id:"proof",label:"📤 Proof"},
    {id:"status",label:"⏳ Status"},
    {id:"admin",label:"🔐 Admin"},
  ];

  const DEMO_ORDER = {items:[{name:"Wireless Headphones",qty:1,price:1299},{name:"Smart Watch",qty:1,price:2499}],subtotal:3798};

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body,#root{font-family:'DM Sans',-apple-system,sans-serif;font-size:14px;}
        input,button,textarea,select{font-family:'DM Sans',-apple-system,sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes slideUp{from{transform:translateY(60px);}to{transform:translateY(0);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
        @keyframes popIn{from{opacity:0;transform:scale(0.88);}to{opacity:1;transform:scale(1);}}
        @keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#ddd;border-radius:2px;}
      `}</style>

      <div style={{display:"flex",height:"100vh",background:"#e8eaf0",fontFamily:"'DM Sans',sans-serif",gap:0}}>

        {/* Left: Phone Frame */}
        <div style={{flex:"0 0 auto",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 16px",background:"linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",minWidth:360}}>
          <div style={{position:"relative"}}>
            {/* Phone shell */}
            <div style={{width:340,height:680,borderRadius:40,background:"#111",padding:10,boxShadow:"0 30px 80px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.08),inset 0 0 0 1px rgba(255,255,255,0.04)"}}>
              {/* Screen */}
              <div style={{width:"100%",height:"100%",borderRadius:32,background:"white",overflow:"hidden",position:"relative"}}>
                {/* Notch */}
                <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:90,height:22,background:"#111",borderRadius:"0 0 16px 16px",zIndex:20}}/>
                {/* Scrollable content */}
                <div style={{height:"100%",overflowY:"auto",overflowX:"hidden"}}>
                  {page==="shop"&&<ShopPage onCheckout={d=>{setOrderData(d);go("checkout");}}/>}
                  {page==="checkout"&&<CheckoutPage orderData={orderData||DEMO_ORDER} onProceed={info=>{setCustomerInfo(info);go("payment");}} onBack={()=>go("shop")}/>}
                  {page==="payment"&&<PaymentPage orderId={orderId} total={customerInfo?.total||3948} onPaid={()=>go("proof")} onBack={()=>go("checkout")}/>}
                  {page==="proof"&&<ProofPage orderId={orderId} total={customerInfo?.total||3948} onSubmit={()=>go("status")} onBack={()=>go("payment")}/>}
                  {page==="status"&&<StatusPage orderId={orderId} total={customerInfo?.total||3948} name={customerInfo?.name||"Arjun Sharma"} onHome={()=>go("shop")}/>}
                  {page==="admin"&&<AdminPage onBack={()=>go("shop")}/>}
                </div>
              </div>
            </div>
            {/* Home bar */}
            <div style={{width:100,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,margin:"10px auto 0"}}/>
          </div>
        </div>

        {/* Right: Controls Panel */}
        <div style={{flex:1,display:"flex",flexDirection:"column",padding:"28px 28px",overflow:"auto",background:"#f0f2f8"}}>
          <div style={{marginBottom:24}}>
            <h2 style={{fontSize:20,fontWeight:800,letterSpacing:"-0.03em",color:"#0a0a0a",marginBottom:4}}>UPI Checkout — Live Preview</h2>
            <p style={{fontSize:13,color:"#888"}}>Click any page below to navigate, or use the flow buttons.</p>
          </div>

          {/* Page Nav */}
          <div style={{background:"white",borderRadius:18,padding:18,border:"1px solid #e0e0e8",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:18}}>
            <p style={{fontSize:10,fontWeight:800,color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12}}>Navigate Pages</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7}}>
              {pages.map(p=>(
                <button key={p.id} onClick={()=>go(p.id)} style={{background:page===p.id?"linear-gradient(135deg,#4361ee,#5b73f5)":"#f5f6fa",color:page===p.id?"white":"#555",border:"1px solid",borderColor:page===p.id?"#4361ee":"#e0e0e8",borderRadius:11,padding:"10px 8px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.15s",display:"flex",flexDirection:"column",alignItems:"center",gap:4,boxShadow:page===p.id?"0 3px 10px rgba(67,97,238,0.3)":"none"}}>
                  <span style={{fontSize:18}}>{p.label.split(" ")[0]}</span>
                  <span style={{fontSize:10}}>{p.label.split(" ").slice(1).join(" ")}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Flow Guide */}
          <div style={{background:"white",borderRadius:18,padding:18,border:"1px solid #e0e0e8",boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:18}}>
            <p style={{fontSize:10,fontWeight:800,color:"#bbb",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Customer Flow</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {step:"1",page:"shop",title:"Browse & Add to Cart",desc:"Tap + to add products, cart totals update live"},
                {step:"2",page:"checkout",title:"Fill Contact Details",desc:"Order summary + form validation on submit"},
                {step:"3",page:"payment",title:"Scan QR or Tap Pay",desc:"10-min countdown, UPI deeplink, confirm modal"},
                {step:"4",page:"proof",title:"Submit Proof",desc:"Enter Transaction ID or drag & drop screenshot"},
                {step:"5",page:"status",title:"Wait for Approval",desc:"Auto-approves in ~8 sec in this demo"},
              ].map(s=>(
                <div key={s.step} onClick={()=>go(s.page)} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"10px 12px",borderRadius:11,cursor:"pointer",transition:"background 0.15s",border:`1px solid ${page===s.page?"#4361ee":"transparent"}`,background:page===s.page?"#f0f4ff":"#fafafa"}}
                  onMouseEnter={e=>e.currentTarget.style.background=page===s.page?"#f0f4ff":"#f0f0f0"}
                  onMouseLeave={e=>e.currentTarget.style.background=page===s.page?"#f0f4ff":"#fafafa"}>
                  <div style={{width:24,height:24,borderRadius:8,background:page===s.page?"#4361ee":"#e8eaf0",color:page===s.page?"white":"#999",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{s.step}</div>
                  <div><p style={{fontSize:12,fontWeight:700,color:"#333",marginBottom:2}}>{s.title}</p><p style={{fontSize:11,color:"#aaa",lineHeight:1.4}}>{s.desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Note */}
          <div style={{background:"linear-gradient(135deg,#1a1a2e,#16213e)",borderRadius:18,padding:18,border:"1px solid #222"}}>
            <p style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Admin Dashboard</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6,marginBottom:12}}>Full order management panel with approve/reject, revenue stats, and order filtering.</p>
            <button onClick={()=>go("admin")} style={{background:"linear-gradient(135deg,#4361ee,#5b73f5)",color:"white",border:"none",borderRadius:10,padding:"10px 16px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,boxShadow:"0 3px 10px rgba(67,97,238,0.4)"}}>
              🔐 Open Admin Panel <span style={{opacity:0.7,fontSize:11}}>· key: admin123</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
