// Personal downloadable edition: local browser storage, separate from the live account.
async function wonderworldOfflineFetch(path, options) {
  const isPassport=path==='/api/passport';
  const key=isPassport?'wonderworld-passport-v1':'templars-wonderworld-offline-progress-v1';
  const response=(body,ok=true)=>({ok,json:async()=>body});
  try {
    const saved=JSON.parse(localStorage.getItem(key)||'{}');
    if(!saved||typeof saved!=='object'||Array.isArray(saved))throw new Error('Invalid saved data');
    if(options?.method==='POST') {
      const b=JSON.parse(options.body),date=new Date().toISOString();
      if(isPassport){saved[b.id]={title:b.title,score:b.score,total:b.total,attempts:Number(saved[b.id]?.attempts||0)+1,date};}
      else{saved[b.resourceId]={position:b.position,completed:b.completed,updated_at:date};}
      localStorage.setItem(key,JSON.stringify(saved));
      return response({saved:true,date,updatedAt:date});
    }
    if(isPassport)return response({stamps:Object.entries(saved).map(([id,r])=>({activity_id:id,title:r.title,score:r.score,total:r.total,attempts:r.attempts,updated_at:r.date}))});
    return response({progress:Object.entries(saved).map(([id,r])=>({resource_id:id,position:r.position,completed:JSON.stringify(r.completed),updated_at:r.updated_at}))});
  } catch {
    return response({error:'This browser cannot save or load local progress. Try a regular Chrome or Edge window. You can still read and play.'},false);
  }
}
