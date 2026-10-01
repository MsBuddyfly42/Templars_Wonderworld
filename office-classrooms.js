(() => {
  'use strict';
  const data=window.OFFICE_CLASSROOMS;
  const stage=document.querySelector('#office-stage');
  const apps=Object.keys(data.starters);
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let records={},recordMessage='Loading saved scores…',activeRun=null;
  const stampReady=wonderworldOfflineFetch('/api/passport',{cache:'no-store'}).then(async r=>{
    const body=await r.json();if(!r.ok)throw new Error(body.error||'Saved scores are unavailable.');
    for(const row of body.stamps)records[row.activity_id]=row;
    recordMessage='Scores are saved in this browser for your personal copy.';
  }).catch(e=>{recordMessage=(e.message||'Saved scores are unavailable.')+' You can still do every assignment.';}).finally(()=>{
    if(!activeRun)renderRoute();
  });
  const routeFor=app=>'#'+app.toLowerCase();
  const linkFor=u=>'#assignment/'+u.number;
  const numberLabel=n=>n===5?'Strategy puzzle':'Question '+n;
  function startFocus(){const h=stage.querySelector('h1,h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}window.scrollTo({top:0,behavior:'instant'});}
  function actions(html){return '<div class="office-actions">'+html+'</div>';}
  function assignmentTile(u){const r=records[u.id];return '<a class="office-assignment" href="'+linkFor(u)+'"><span class="office-tag">Assignment '+u.number+' · '+u.app+'</span><h3>'+escape(u.title)+'</h3><p>4 multiple-choice questions + 1 strategy puzzle</p>'+(r?'<p class="office-record">Latest score '+r.score+'/100 · '+r.attempts+' '+(Number(r.attempts)===1?'attempt':'attempts')+'</p>':'<p class="office-record">Ready when you are</p>')+'</a>';}
  function campus(){
    stage.innerHTML='<div class="office-heading"><div><h1>Microsoft Office classrooms</h1><p>Learn a command, follow a clear walkthrough, then solve a puzzle. Choose your classroom to begin.</p></div><a class="button secondary" href="materials/office-classrooms/Microsoft_Office_Classrooms_30_Assignments.docx" download>Download workbook</a></div><div class="office-grid">'+apps.map(app=>'<section class="office-room" data-app="'+app+'"><h2><span class="room-letter" aria-hidden="true">'+app[0]+'</span>'+app+'</h2><p>'+escape(data.starters[app].title)+'. '+data.assignments.filter(u=>u.app===app).length+' assignments about tools, decisions, and common mistakes.</p>'+actions('<a class="button" href="'+routeFor(app)+'">Enter '+app+' classroom</a>')+'</section>').join('')+'</div><p class="office-status">'+escape(recordMessage)+'</p>';
  }
  function classroom(app){
    const s=data.starters[app];
    stage.innerHTML='<a class="breadcrumb" href="#all">All Office classrooms</a><h1>'+app+' classroom</h1><p class="office-scenario">Start with the lesson, or choose an assignment below. No timer and no required score.</p><section class="lesson-board"><h2>Today’s starter lesson</h2><p>'+escape(s.title)+'. '+escape(s.intro)+'</p>'+actions('<a class="button" href="#lesson/'+app.toLowerCase()+'">Open step-by-step lesson</a>')+'</section><h2>Choose a puzzle assignment</h2><p class="office-status">'+escape(recordMessage)+'</p><div class="office-assignments">'+data.assignments.filter(u=>u.app===app).map(assignmentTile).join('')+'</div>';
  }
  function lesson(app){
    const s=data.starters[app];
    stage.innerHTML='<a class="breadcrumb" href="'+routeFor(app)+'">Back to '+app+' classroom</a><h1>'+escape(s.title)+'</h1><p class="office-scenario">'+escape(s.intro)+'</p><article class="office-paper"><h2>One action at a time</h2><p>Check off each action as you go. These checkboxes help during this visit; completed assignment scores are saved separately.</p><p id="step-count" role="status">0 of '+s.steps.length+' steps checked</p>'+s.steps.map((step,i)=>'<label class="office-step"><input type="checkbox" data-step="'+i+'"><span><strong>'+ (i+1)+'.</strong> '+escape(step)+'</span></label>').join('')+'<div class="office-checkpoint"><strong>Checkpoint</strong><p>'+escape(s.checkpoint)+'</p></div><h2>Correct a mistake</h2><ol>'+s.fix.map(x=>'<li>'+escape(x)+'</li>').join('')+'</ol><h2>Save your practice file</h2><ol>'+s.save.map(x=>'<li>'+escape(x)+'</li>').join('')+'</ol>'+(app!=='Access'?'<p>If F12 does not open Save As: click <strong>File</strong>, then <strong>Save As</strong>, then <strong>Browse</strong>. Some laptops require Fn+F12.</p>':'<p>Access saves record changes as you work. Ctrl+S saves object design changes. Check the location beside File Name when you create your database.</p>')+actions('<a class="button" href="'+routeFor(app)+'">Choose an assignment</a>')+'</article>';
    stage.querySelectorAll('[data-step]').forEach(c=>c.addEventListener('change',()=>{stage.querySelector('#step-count').textContent=stage.querySelectorAll('[data-step]:checked').length+' of '+s.steps.length+' steps checked';}));
  }
  function assignment(u){
    activeRun={unit:u,index:0,responses:[],finished:false};
    stage.innerHTML='<a class="breadcrumb" href="'+routeFor(u.app)+'">Back to '+u.app+' classroom</a><p class="office-num">'+u.app+' · Assignment '+u.number+'</p><h1>'+escape(u.title)+'</h1><section class="lesson-board"><h2>Learn before you play</h2><p>'+escape(u.teach)+'</p></section><article class="office-paper"><h2>Your mission</h2><p>'+escape(u.scenario)+'</p><p>Four questions worth 15 points each, followed by a strategy puzzle worth 40 points. Total: 100 points. Your first choice counts; read the explanation after each answer. You can retry the assignment.</p>'+actions('<button class="button" id="office-start">Start assignment</button>')+'</article>';
    stage.querySelector('#office-start').onclick=()=>round(activeRun);
  }
  function round(run){
    if(run!==activeRun)return;
    const u=run.unit,item=u.questions[run.index];let locked=false;
    stage.innerHTML='<a class="breadcrumb" href="'+routeFor(u.app)+'">Back to '+u.app+' classroom</a><p class="office-num">Assignment '+u.number+' · '+escape(u.title)+'</p><article class="office-paper"><p>'+numberLabel(run.index+1)+' · '+item.points+' points</p><progress class="office-progress" value="'+run.index+'" max="5" aria-label="Questions completed"></progress><h2 class="office-question">'+escape(item.question)+'</h2><div class="office-choices">'+item.answers.map((a,n)=>'<button class="office-choice" data-choice="'+n+'"><strong>'+String.fromCharCode(65+n)+'.</strong> '+escape(a)+'</button>').join('')+'</div>'+actions('<button class="button secondary" id="office-reveal">Reveal and learn · 0 points</button>')+'<div class="office-feedback" id="office-feedback" role="status"></div></article>';
    function answer(n){
      if(locked||run!==activeRun)return;locked=true;
      const right=n===item.correct;run.responses.push({answer:n,points:right?item.points:0});
      stage.querySelectorAll('[data-choice]').forEach(b=>{b.disabled=true;const value=Number(b.dataset.choice);if(value===item.correct)b.classList.add('right');else if(value===n)b.classList.add('wrong');});
      stage.querySelector('#office-reveal').disabled=true;
      const f=stage.querySelector('#office-feedback');
      f.innerHTML='<h3>'+(right?'You solved it! +'+item.points+' points':n===-1?'Answer revealed':'Here’s the solution')+'</h3><p><strong>'+escape(item.answers[item.correct])+'</strong></p><p>'+escape(item.why)+'</p><button class="button" id="office-next">'+(run.index===4?'See my score':'Next question')+'</button>';
      stage.querySelector('#office-next').onclick=()=>{if(run!==activeRun)return;run.index++;if(run.index<u.questions.length)round(run);else finish(run);};
      f.scrollIntoView({block:'nearest',behavior:'auto'});
    }
    stage.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.choice)));
    stage.querySelector('#office-reveal').onclick=()=>answer(-1);
    startFocus();
  }
  async function saveScore(u,score){
    await stampReady;
    const r=await wonderworldOfflineFetch('/api/passport',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:u.id,title:u.app+' '+u.number+' · '+u.title,score,total:100})});
    const b=await r.json();if(!r.ok)throw new Error(b.error||'Your score could not save.');
    records[u.id]={activity_id:u.id,title:u.title,score,total:100,attempts:Number(records[u.id]?.attempts||0)+1,updated_at:b.date};
  }
  function finish(run){
    if(run.finished||run!==activeRun)return;run.finished=true;
    const u=run.unit,score=run.responses.reduce((n,r)=>n+r.points,0),correct=run.responses.filter(r=>r.points>0).length;
    const rank=score>=90?'Command Champion':score>=75?'Strong Strategy':score>=60?'Building Skill':'Review and retry';
    stage.innerHTML='<a class="breadcrumb" href="'+routeFor(u.app)+'">Back to '+u.app+' classroom</a><h1>Assignment complete</h1><article class="office-paper"><p>'+escape(u.title)+'</p><div class="office-score">'+score+' / 100</div><h2>'+rank+'</h2><p>You solved '+correct+' of 5 questions. Each question earns 15 points; the strategy puzzle earns 40. Review the reasoning and try again whenever you like.</p><p id="office-save-status" class="office-save-status" role="status">Saving your score to your Knowledge Passport…</p>'+actions('<button class="button" id="office-again">Try this assignment again</button><a class="button secondary" href="'+routeFor(u.app)+'">Choose another assignment</a><a class="button secondary" href="learning-hub.html#passport">See my Knowledge Passport</a>')+'<h2>Review your answers</h2>'+u.questions.map((item,i)=>'<section class="office-review"><strong>'+numberLabel(i+1)+' · '+run.responses[i].points+'/'+item.points+' points</strong><p>'+escape(item.question)+'</p><p>Your choice: '+(run.responses[i].answer<0?'Answer revealed':escape(item.answers[run.responses[i].answer]))+'</p><p>Solution: <strong>'+escape(item.answers[item.correct])+'</strong></p><p>'+escape(item.why)+'</p></section>').join('')+'</article>';
    stage.querySelector('#office-again').onclick=()=>{assignment(u);startFocus();};startFocus();
    const status=stage.querySelector('#office-save-status');
    const persist=()=>{status.textContent='Saving your score…';saveScore(u,score).then(()=>{status.textContent='Saved to your Knowledge Passport. Latest score: '+score+'/100.';}).catch(e=>{status.textContent=(e.message||'Your score could not save.')+' Your result is still shown here. ';const retry=document.createElement('button');retry.className='button secondary';retry.textContent='Retry saving';retry.onclick=()=>{retry.disabled=true;persist();};status.append(retry);});};
    persist();
  }
  function renderRoute(){
    activeRun=null;
    const [route,value]=location.hash.slice(1).split('/');
    const app=apps.find(a=>a.toLowerCase()===(route==='lesson'?value:route));
    const u=route==='assignment'?data.assignments.find(a=>String(a.number)===value):null;
    if(u)assignment(u);else if(app&&route==='lesson')lesson(app);else if(app)classroom(app);else campus();
    const activeApp=u?.app||app;
    document.querySelectorAll('.office-tabs a').forEach(a=>{if(a.hash===(activeApp?routeFor(activeApp):'#all'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  }
  window.addEventListener('hashchange',()=>{renderRoute();startFocus();});
  renderRoute();
})();
