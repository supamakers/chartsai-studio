import {describe,it,expect} from 'vitest';
import {editorialTemplates,templatesFor,templateById} from '../src/data/editorial-templates';
import {templateKinds,templateId,templateEditorPath,templateCollectionPath} from '../src/lib/editorial-template-ids';
import {validateProject,editorialOption,publicationFrames} from '../src/lib/editorial';
import {usageEvent,showcaseDownloadEvent,analyticsUrl} from '../src/lib/analytics-policy';
import {renderOptionSvg} from '../src/lib/echarts';
describe('editorial templates',()=>{
 it('provides twelve complete, distinct, correctly attributed renderable projects',()=>{
  expect(editorialTemplates).toHaveLength(12);expect(new Set(editorialTemplates.map(t=>t.id)).size).toBe(12);
  for(const kind of ['dumbbell','slopegraph','small-multiples'])expect(templatesFor(kind)).toHaveLength(4);
  for(const t of editorialTemplates){
   expect(validateProject(t.project)).toEqual(t.project);expect(templateKinds[t.id]).toBe(t.project.kind);
   const f=publicationFrames[t.project.frame],svg=renderOptionSvg(editorialOption(t.project,f.width,f.height),f.width,f.height);
   expect(svg).not.toMatch(/NaN|Infinity/);expect(svg).toContain(t.project.title.replaceAll('&','&amp;'));
   if(t.provenance==='Fictional teaching data')expect(t.project.source).toContain('fictional');
   expect(templateEditorPath(t.id)).toContain(`?template=${t.id}#editor`);
  }
 });
 it('backs key interpretations with actual signed differences and rankings',()=>{
  const p=templateById('commute-gap').project.table;expect(Number(p[1][1])-Number(p[1][2])).toBe(14);expect(Number(p[3][1])).toBeLessThan(Number(p[3][2]));
  const league=templateById('league-points').project.table.slice(1);expect([...league].sort((a,b)=>+b[1]-+a[1])[0][0]).toBe('Harbour');expect([...league].sort((a,b)=>+b[2]-+a[2])[0][0]).toBe('Forest');
  const library=templateById('library-access').project.table;expect(+library[1][1]-+library[1][2]).toBe(22);
  const seasonal=templateById('seasonal-orders').project;expect(seasonal.xMode).toBe('number');expect(seasonal.table.slice(1).map(r=>+r[0])).toEqual([1,3,5,7,9,11]);
 });
 it('accepts only fixed matching template identifiers and canonical collection paths',()=>{
  for(const bad of ['PRIVATE filename','__proto__','constructor','life-expectancy-gap?secret=1'])expect(templateId(bad)).toBeUndefined();
  expect(usageEvent({tool:'dumbbell',action:'template',template:'commute-gap',title:'SECRET'})).toEqual({name:'Template Selected',props:{tool:'dumbbell',template:'commute-gap'}});
  expect(usageEvent({tool:'line',action:'template',template:'commute-gap'})).toBeNull();
  expect(usageEvent({tool:'dumbbell',action:'export',format:'png',template:'SECRET'})).toEqual({name:'Chart Download',props:{tool:'dumbbell',format:'png'}});
  expect(showcaseDownloadEvent('/editorial/templates/commute-gap.svg')).toEqual({name:'Chart Download',props:{tool:'dumbbell',format:'svg',template:'commute-gap'}});
  expect(showcaseDownloadEvent('/editorial/templates/SECRET.svg')).toBeNull();
  expect(analyticsUrl(`https://www.chartsai.com${templateCollectionPath('dumbbell')}?private=1#commute-gap`)).toBe('https://www.chartsai.com/editorial-charts/dumbbell-examples/');
 });
});
