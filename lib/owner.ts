import { getChatGPTUser } from '@/app/chatgpt-auth';
export async function isOwner(){const u=await getChatGPTUser();return !!u && u.email.toLowerCase()==='owner@example.com';}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return origin===new URL(request.url).origin;}

