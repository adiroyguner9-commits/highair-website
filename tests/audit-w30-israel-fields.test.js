/* The Israel sign-up form writes only columns the table really has (audit W30).
   One column Airtable does not know makes it refuse the whole row, so the
   registration is lost. The handler used to send a date in an unusual shape to
   a "notes" column that IsraelCustomers never had. The list below is the
   table's own columns, read from the live table on 12 Nov 2026: a new column
   used by the handler must first exist there, and then be added here. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const REAL_COLUMNS = {
  fldT1DxgwMYHIM5Mx: 'Full Name',
  fldKUy6EYV8bp8cGj: 'Phone',
  fldbFOqas3Ecr7psw: 'Email',
  fldTbZTU62LvmfOBN: 'Trip',
  fldNF5703EdITvcRw: 'Trip Date',
  fldQktU5Y8F420QRe: 'Package',
  fldCrgHvTemf1ze4m: 'Participants',
  fldaASxJJ6xBuiyja: 'Price Paid',
  fldiz7jcYO3GwH7Nh: 'Payment Status',
};

const src = readFileSync(resolve(__dirname, '../api/israel-lead.js'), 'utf8');

describe('Israel sign-up: only real columns', () => {
  it('every field id in the handler is a column of IsraelCustomers', () => {
    const used = [...new Set(src.match(/fld[A-Za-z0-9]{14}/g) || [])];
    expect(used.length).toBeGreaterThan(0);
    expect(used.filter(id => !REAL_COLUMNS[id])).toEqual([]);
  });

  it('no row is written with a field the F map does not name', () => {
    const map = src.slice(src.indexOf('const F = {'), src.indexOf('};', src.indexOf('const F = {')));
    const names = [...map.matchAll(/^\s*([a-zA-Z]+):\s*'fld/gm)].map(m => m[1]);
    const written = [...new Set([...src.matchAll(/F\.([a-zA-Z]+)\b/g)].map(m => m[1]))];
    expect(written.filter(n => !names.includes(n))).toEqual([]);
  });
});
