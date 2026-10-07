import { database,bucket,findProduct } from '@/lib/products';
import {weightMilligrams,groupCode} from '@/lib/pricing';
import { isOwner,sameOrigin } from '@/lib/owner';
export const dynamic='force-dynamic';
const error=(message:string,status:number)=>Response.json({error:message},{status});
export async function POST(request:Request){
 if(!await isOwner())return error('اجازه مدیریت محصولات را ندارید.',403);
 if(!sameOrigin(request))return error('درخواست نامعتبر است.',403);
 let uploaded:string|null=null;
 try{
 if(Number(request.headers.get('content-length')||0)>9*1024*1024)return error('حجم عکس باید کمتر از ۸ مگابایت باشد.',413);
 const form=await request.formData();
 const id=String(form.get('id')||'');
 const existing=id?await findProduct(id):null;
 if(id&&!existing)return error('محصول پیدا نشد.',404);
 const name=String(form.get('name')||'').trim();const description=String(form.get('description')||'').trim();const weight=String(form.get('weight')||'').trim();
 const raw=String(form.get('price')||'').replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[,٬\s]/g,'');
 const price=raw===''?null:Number(raw);
 if(!name||name.length>120||description.length>3000||weight.length>60|| (price!==null&&(!/^\d+$/.test(raw)||!Number.isSafeInteger(price)||price<0||price>100000000000)))return error('نام و قیمت محصول را درست وارد کنید.',400);
 const codeRaw=String(form.get('pricing_code')||'').trim();const code=codeRaw?groupCode(codeRaw):null;const mg=code?weightMilligrams(weight):null;
 if(codeRaw&&(!code||mg===null||!await database().prepare('SELECT code FROM pricing_groups WHERE code=?').bind(code).first()))return error('کد معتبر و وزن مثبت با حداکثر سه رقم اعشار وارد کنید.',400);
 const file=form.get('image');let image=existing?.image;
 if(file instanceof File&&file.size){
 if(file.size>8*1024*1024)return error('حجم عکس باید کمتر از ۸ مگابایت باشد.',413);
 const data=await file.arrayBuffer();const a=new Uint8Array(data);let type='';
 if(a[0]===255&&a[1]===216&&a[2]===255)type='image/jpeg';
 else if(a[0]===137&&a[1]===80&&a[2]===78&&a[3]===71&&a[4]===13&&a[5]===10&&a[6]===26&&a[7]===10)type='image/png';
 else if(String.fromCharCode(...a.slice(0,4))==='RIFF'&&String.fromCharCode(...a.slice(8,12))==='WEBP')type='image/webp';
 if(!type)return error('عکس JPG، PNG یا WebP انتخاب کنید.',400);
 uploaded=crypto.randomUUID();await bucket().put(uploaded,data,{httpMetadata:{contentType:type}});image=uploaded;
 }
 if(!image)return error('عکس محصول را انتخاب کنید.',400);
 const productId=id||crypto.randomUUID();
 if(existing){await database().prepare('UPDATE products SET name=?,description=?,price=?,weight=?,image=?,pricing_code=?,weight_mg=? WHERE id=?').bind(name,description,price,weight,image,code,mg,productId).run();}
 else{await database().prepare('INSERT INTO products (id,name,description,price,weight,image,created,pricing_code,weight_mg) VALUES (?,?,?,?,?,?,?,?,?)').bind(productId,name,description,price,weight,image,Date.now(),code,mg).run();}
 return Response.json({id:productId});
 }catch(e){console.error('Save product failed',e);if(uploaded){try{await bucket().delete(uploaded)}catch{}}return error('ذخیره نشد؛ اطلاعات شما باقی مانده است. دوباره تلاش کنید.',503)}
}
export async function DELETE(request:Request){if(!await isOwner()||!sameOrigin(request))return error('اجازه انجام این کار را ندارید.',403);try{const {id}=await request.json() as {id?:unknown};if(typeof id!=='string'||id.length>64)return error('محصول نامعتبر است.',400);const product=await findProduct(id);if(!product)return error('محصول پیدا نشد.',404);await database().prepare('DELETE FROM products WHERE id=?').bind(id).run();try{await bucket().delete(product.image)}catch(e){console.error('Image cleanup failed',e)}return Response.json({ok:true})}catch(e){console.error(e);return error('حذف انجام نشد. دوباره تلاش کنید.',503)}}

