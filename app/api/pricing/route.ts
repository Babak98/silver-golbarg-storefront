import {database} from '@/lib/products';
import {isOwner,sameOrigin} from '@/lib/owner';
import {groupCode,rateValue} from '@/lib/pricing';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!await isOwner()||!sameOrigin(request))return Response.json({error:'اجازه مدیریت قیمت‌ها را ندارید.'},{status:403});
 try{
  const body=await request.json() as {code?:unknown;rate?:unknown;initialize?:unknown};
  const code=groupCode(String(body.code??'')),rate=rateValue(String(body.rate??''));
  if(!code||rate===null)return Response.json({error:'کد و نرخ مثبت و معتبر وارد کنید؛ سقف نرخ هر گرم ۱۰ میلیون تومان است.'},{status:400});
  const db=database();
  if(body.initialize===true){
   if(code!=='1'||rate!==1500000)return Response.json({error:'مقادیر اولیه نامعتبر است.'},{status:400});
   const originals:[string,number,string][]=[['demo-product-54be58a8',5500,'2'],['demo-product-30e7a352',9620,'3'],['demo-product-a4bb89d0',12150,'1'],['demo-product-80c32b80',13730,'2']];
   await db.batch([...[['1',1500000],['2',1600000],['3',700000]].map(([group,groupRate])=>db.prepare('INSERT INTO pricing_groups(code,rate) VALUES (?,?) ON CONFLICT(code) DO NOTHING').bind(group,groupRate)),...originals.map(([id,weight,assignedCode])=>db.prepare('UPDATE products SET pricing_code=?,weight_mg=? WHERE id=? AND pricing_code IS NULL').bind(assignedCode,weight,id))]);
  }else await db.prepare('INSERT INTO pricing_groups(code,rate) VALUES (?,?) ON CONFLICT(code) DO UPDATE SET rate=excluded.rate').bind(code,rate).run();
  return Response.json({ok:true});
 }catch(e){console.error('Pricing update failed',e);return Response.json({error:'تغییر نرخ ذخیره نشد؛ دوباره تلاش کنید.'},{status:503});}
}

