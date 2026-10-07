'use client';
import {normalizeNumber} from '@/lib/pricing';
import {useState} from 'react';
import type {PricingGroup,Product} from '@/lib/products';
export default function Pricing({groups,products}:{groups:PricingGroup[];products:Product[]}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 async function save(code:string,rate:string,initialize=false){setBusy(true);setError('');try{const response=await fetch('/api/pricing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,rate,initialize})});const result=await response.json() as {error?:string};if(!response.ok)throw Error(result.error||'ذخیره نشد.');window.location.reload()}catch(e){setError(e instanceof Error?e.message:'ذخیره نشد.')}finally{setBusy(false)}}
 return <section className="pricing-panel" aria-label="کدهای قیمت"><h2>کدهای قیمت</h2><p>قیمت هر محصول = وزن به گرم × نرخ کد آن. تغییر نرخ، قیمت همهٔ محصولات همان کد را به‌روز می‌کند.</p>
 {groups.map(group=><form className="rate-row" key={group.code} onSubmit={e=>{e.preventDefault();void save(group.code,String(new FormData(e.currentTarget).get('rate')))}}><strong>کد {Number(group.code).toLocaleString('fa-IR')} · {products.filter(p=>p.pricing_code===group.code).length.toLocaleString('fa-IR')} محصول</strong><label>نرخ هر گرم کد {Number(group.code).toLocaleString('fa-IR')} (تومان)<input required name="rate" inputMode="numeric" defaultValue={group.rate}/></label><button className="button" disabled={busy}>ذخیره نرخ</button></form>)}
 {!groups.length&&<button className="button" disabled={busy} onClick={()=>void save('1','1500000',true)}>ثبت کدهای ۱، ۲ و ۳ برای چهار محصول فعلی</button>}
 <form className="rate-row" onSubmit={e=>{e.preventDefault();const form=new FormData(e.currentTarget);const code=normalizeNumber(String(form.get('code')));if(groups.some(g=>g.code===code)){setError('این کد موجود است؛ نرخ آن را در ردیف بالا تغییر دهید.');return}void save(code,String(form.get('rate')))}}><label>کد جدید<input required name="code" inputMode="numeric" placeholder="مثلاً ۲"/></label><label>نرخ هر گرم (تومان)<input required name="rate" inputMode="numeric" placeholder="مثلاً ۱۵۰۰۰۰۰"/></label><button className="button" disabled={busy}>افزودن کد</button></form>{error&&<p className="error" role="alert">{error}</p>}{busy&&<p role="status">در حال ذخیره نرخ…</p>}</section>
}
