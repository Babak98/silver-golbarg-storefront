import { sqliteTable,text,integer } from 'drizzle-orm/sqlite-core';
export const pricingGroups=sqliteTable('pricing_groups',{code:text('code').primaryKey(),rate:integer('rate').notNull()});
export const products=sqliteTable('products',{id:text('id').primaryKey(),name:text('name').notNull(),description:text('description').notNull(),price:integer('price'),weight:text('weight').notNull(),image:text('image').notNull(),created:integer('created').notNull(),pricingCode:text('pricing_code').references(()=>pricingGroups.code),weightMg:integer('weight_mg')});
