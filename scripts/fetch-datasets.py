"""Refresh pinned public UCI files intentionally; normal builds never access the network."""
import csv,hashlib,io,json,urllib.request,zipfile
from pathlib import Path
sources=[('iris',53,'iris','bezdekIris.data',['sepal_length','sepal_width','petal_length','petal_width','species'],150),('wine',109,'wine','wine.data',['class','alcohol','malic_acid','ash','alcalinity_of_ash','magnesium','total_phenols','flavanoids','nonflavanoid_phenols','proanthocyanins','color_intensity','hue','od280_od315','proline'],178),('glass',42,'glass%2Bidentification','glass.data',['id','refractive_index','sodium','magnesium','aluminum','silicon','potassium','calcium','barium','iron','class'],214),('seeds',236,'seeds','seeds_dataset.txt',['area','perimeter','compactness','kernel_length','kernel_width','asymmetry','groove_length','class'],210),('abalone',1,'abalone','abalone.data',['sex','length','diameter','height','whole_weight','shucked_weight','viscera_weight','shell_weight','rings'],4177)]
meta=[]
for slug,num,name,file,headers,expected in sources:
 url=f'https://archive.ics.uci.edu/static/public/{num}/{name}.zip';raw=urllib.request.urlopen(url).read();z=zipfile.ZipFile(io.BytesIO(raw));data=z.read(file);lines=[l.strip() for l in data.decode().splitlines() if l.strip()];rows=[l.split() if slug=='seeds' else l.split(',') for l in lines];assert len(rows)==expected and all(len(r)==len(headers) for r in rows)
 selected=list(range(len(rows))) if slug!='abalone' else [i*(len(rows)-1)//299 for i in range(300)]
 x,y={'iris':(2,3),'wine':(1,10),'glass':(2,1),'seeds':(0,1),'abalone':(1,8)}[slug]
 chart=[[headers[x],headers[y]],*[[rows[i][x],rows[i][y]] for i in selected]]
 out=Path('public/datasets/assets');out.mkdir(parents=True,exist_ok=True)
 for suffix,table in [('',[headers,*rows]),('-chart',chart)]:
  with (out/f'{slug}{suffix}.csv').open('w',newline='') as f:csv.writer(f).writerows(table)
 meta.append(dict(id=slug,sourceUrl=f'https://archive.ics.uci.edu/dataset/{num}/{name}',archiveUrl=url,sourceFile=file,sha256=hashlib.sha256(data).hexdigest(),archiveSha256=hashlib.sha256(raw).hexdigest(),retrieved='2026-09-08',rows=len(rows),columns=headers,chartRows=len(selected),selectedRows=[i+1 for i in selected],selection='All source rows' if slug!='abalone' else '300 evenly spaced row positions including first and last; deterministic, not a random or representative sample',missingCells=sum(not v.strip() or v=='?' for r in rows for v in r),preview=rows[:8],chartPreview=chart[:9]))
 print(slug,len(rows),len(selected),hashlib.sha256(data).hexdigest())
Path('src/data/dataset-manifest.json').write_text(json.dumps(meta,indent=2)+'\n')
