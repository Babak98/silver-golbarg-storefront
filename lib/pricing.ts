export function normalizeNumber(value:string){return value.trim().replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/٫/g,'.').replace(/[,٬]/g,'');}
export function weightMilligrams(value:string){const raw=normalizeNumber(value).replace(/\s*گرم$/,'').trim();if(!/^\d+(\.\d{1,3})?$/.test(raw))return null;const weight=Math.round(Number(raw)*1000);return Number.isSafeInteger(weight)&&weight>0&&weight<=10000000?weight:null;}
export function rateValue(value:string){const raw=normalizeNumber(value);const rate=Number(raw);return /^\d+$/.test(raw)&&Number.isSafeInteger(rate)&&rate>0&&rate<=10000000?rate:null;}
export function groupCode(value:string){const raw=normalizeNumber(value);return /^[1-9]\d{0,5}$/.test(raw)?raw:null;}
export function calculatedPrice(weight:number,rate:number){return Math.round(weight*rate/1000);}
