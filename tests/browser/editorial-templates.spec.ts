import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {editorialTemplates,templateById} from '../../src/data/editorial-templates';
import {templateCollectionPath,templateEditorPath} from '../../src/lib/editorial-template-ids';
async function projectDownload(page:any){await page.getByLabel('Publication download format').selectOption('json');const d=page.waitForEvent('download');await page.getByRole('button',{name:'Download publication chart',exact:true}).click();return JSON.parse(await readFile(await(await d).path(),'utf8'));}
for(const t of editorialTemplates)test(`template ${t.id} opens its exact reusable project`,async({page})=>{
 await page.goto(templateCollectionPath(t.project.kind as 'dumbbell'|'slopegraph'|'small-multiples'));
 await page.locator(`#${t.id}`).getByRole('link',{name:'Use this chart',exact:true}).click();
 await expect(page.locator('[data-chart-ready="true"]')).toBeVisible();
 await expect(page.locator('.template-import-hint')).toContainText(t.name);
 expect(await projectDownload(page)).toEqual(t.project);
});
for(const id of ['commute-gap','league-points','seasonal-orders'] as const)test(`${id} replacement keeps design and clears sample interpretation`,async({page})=>{
 const t=templateById(id);await page.goto(templateEditorPath(id));await expect(page.locator('[data-chart-ready="true"]')).toBeVisible();
 await page.getByRole('button',{name:'Design & details',exact:true}).click();
 await page.getByLabel('Source credit',{exact:true}).fill('My verified source');
 await page.getByRole('button',{name:'Edit values',exact:true}).click();
 const table=t.project.kind==='small-multiples'?[['Month','A','B','C'],['1','2','4','6'],['3','3','5','7']]:[['Group','Before','After'],['A','2','4'],['B','3','5']];
 await page.getByLabel('Publication CSV data').fill(table.map(r=>r.join(',')).join('\n'));
 await page.getByRole('button',{name:'Apply data',exact:true}).click();
 await expect(page.locator('.publication-origin')).toContainText('Your data');
 const next=await projectDownload(page);
 expect(next.table).toEqual(table);expect(next.theme).toBe(t.project.theme);expect(next.frame).toBe(t.project.frame);expect(next.decimals).toBe(t.project.decimals);expect(next.directLabels).toBe(t.project.directLabels);expect(next.zero).toBe(t.project.zero);
 expect(next.source).toBe('My verified source');expect(next.subtitle).toBe('');expect(next.caption).toBe('');expect(next.date).toBe('');expect(next.sourceUrl).toBe('');expect(next.unit).toBe('Value');expect(next.annotations).toEqual([]);expect(next.title).not.toBe(t.project.title);
});
test('collections are usable without JavaScript and fit mobile',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();
 for(const kind of ['dumbbell','slopegraph','small-multiples'] as const){await page.goto(templateCollectionPath(kind));await page.evaluate(()=>document.fonts.ready);expect(await page.locator('main').count()).toBe(1);await expect(page.locator('.template-example')).toHaveCount(4);await expect(page.getByRole('link',{name:'Use this chart',exact:true})).toHaveCount(4);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('.template-table summary').first().click();await expect(page.locator('.template-table table').first()).toBeVisible();}
 await context.close();
});
test('unknown and wrong-family query IDs retain the default chart',async({page})=>{
 for(const query of ['SECRET-name','league-points','__proto__']){await page.goto(`/dumbbell-chart-maker/?template=${query}`);await expect(page.locator('[data-chart-ready="true"]')).toBeVisible();const p=await projectDownload(page);expect(p.title).toBe('Life expectancy rose in all four selected countries');}
});
