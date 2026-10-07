import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'نقره گلبرگ | Silver Golbarg',description:'ویترین زیورآلات نقره گلبرگ؛ مشاهده محصولات و ارتباط با فروشگاه.',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="fa" dir="rtl"><body>{children}</body></html>}
