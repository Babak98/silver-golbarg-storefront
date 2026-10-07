import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {isOwner} from '@/lib/owner';
import {listProducts,listPricingGroups} from '@/lib/products';
import {Header,Footer} from '@/app/shared';
import Manager from './manager';
export const dynamic='force-dynamic';
export default async function Admin(){await requireChatGPTUser('/admin');if(!await isOwner())return <><Header/><main className="collection"><h1>این بخش مخصوص مدیر فروشگاه است.</h1><p>با حساب مالک سایت وارد شوید.</p><a className="button" href="/signout-with-chatgpt?return_to=/admin" target="_top">تغییر حساب</a></main><Footer/></>;try{return <><Header/><Manager initial={await listProducts()} groups={await listPricingGroups()}/><Footer/></>}catch(e){console.error(e);return <><Header/><main className="collection"><h1>مدیریت محصولات موقتاً در دسترس نیست</h1><p>اطلاعات شما محفوظ است. کمی بعد دوباره تلاش کنید.</p><a className="button" href="/admin">تلاش دوباره</a></main><Footer/></>}}
