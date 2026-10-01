function formatReadingContent(content,category){
 const template=document.createElement('template');template.innerHTML=content;
 const instructional=['Classrooms','Practice Labs','Help Desk','Reference Center','Assignments & Writing'].includes(category);
 for(const p of template.content.querySelectorAll('p')){
  const text=p.textContent.trim();
  if(instructional&&/^\d+(?:\.\d+)*[.)]\s/.test(text)){
   p.classList.add('lesson-step');
   const number=text.match(/^\d+(?:\.\d+)*[.)]/)[0];
   const badge=document.createElement('span');badge.className='step-number';badge.textContent=number.replace(/[.)]$/,'');const numberWalker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);const first=numberWalker.nextNode();if(first)first.textContent=first.textContent.replace(/^\s*\d+(?:\.\d+)*[.)]\s*/, '');p.prepend(badge);
  }
  if(/^(Checkpoint|Check your work|Success check|Before you continue)\s*:/i.test(text))p.classList.add('checkpoint');
  else if(/^(Warning|Important|Safety|Caution|Stop)\s*:/i.test(text))p.classList.add('important-note');
  else if(/^(Tip|Note|Memory Cue|College \/ Professional Tip)\s*:/i.test(text))p.classList.add('study-note');
  else if(/^(Make this|Practice brief|You are practicing|Goal|Objective|What you need)\s*:/i.test(text))p.classList.add('lesson-brief');
  else if(/^Click-by-click breakdown\s*:?$/i.test(text)){p.classList.add('breakdown-label');}
  if(instructional){
   // Emphasize existing labels and exact quoted text without changing the lesson.
   const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
   for(const node of nodes){
    if(node.parentElement.closest('strong,em,mark,code,.step-number'))continue;
    const pattern=/(^[A-Za-z][A-Za-z /’'\-]{1,55}:)|([“"][^”"\n]{1,180}[”"])|(\bCtrl\s*\+\s*[A-Za-z0-9]+\b)/g;
    const value=node.textContent;let match,last=0;const frag=document.createDocumentFragment();let found=false;
    while((match=pattern.exec(value))){found=true;frag.append(value.slice(last,match.index));const el=document.createElement(match[3]?'kbd':match[2]?'mark':'strong');el.textContent=match[0];frag.append(el);last=pattern.lastIndex;}
    if(found){frag.append(value.slice(last));node.replaceWith(frag);}
   }
  }
 }
 return template.innerHTML;
}
