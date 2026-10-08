import { env } from 'cloudflare:workers';
export type Product={id:string;name:string;description:string;price:number|null;weight:string;image:string;created:number;pricing_code:string|null;weight_mg:number|null};
export type PricingGroup={code:string;rate:number};
export function database(){if(!env.DB)throw Error('Database unavailable');return env.DB;}
export function bucket(){if(!env.BUCKET)throw Error('Storage unavailable');return env.BUCKET;}
const productSelect='SELECT p.id,p.name,p.description,p.weight,p.image,p.created,p.pricing_code,p.weight_mg,CASE WHEN g.code IS NOT NULL AND p.weight_mg IS NOT NULL THEN CAST(ROUND(p.weight_mg*g.rate/1000.0) AS INTEGER) ELSE p.price END AS price FROM products p LEFT JOIN pricing_groups g ON p.pricing_code=g.code';
export async function listProducts(){return (await database().prepare(productSelect+' ORDER BY p.created DESC').all<Product>()).results;}
export async function findProduct(id:string){return database().prepare(productSelect+' WHERE p.id=?').bind(id).first<Product>();}
export async function listPricingGroups(){return (await database().prepare('SELECT code,rate FROM pricing_groups ORDER BY CAST(code AS INTEGER)').all<PricingGroup>()).results;}
