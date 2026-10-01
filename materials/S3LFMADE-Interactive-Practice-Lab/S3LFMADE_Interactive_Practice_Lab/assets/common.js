
(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  function msg(el,text,type){
    let m=el.closest('.field')?.querySelector('.field-msg');
    if(m){m.textContent=text;m.className='field-msg '+(type||'');}
  }
  function validateField(el){
    let v=(el.value||'').trim(); let error='';
    if(el.required && !v) error='This field is required.';
    if(!error && el.type==='email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) error='Enter a complete email address.';
    if(!error && el.type==='tel' && v && v.replace(/\D/g,'').length<10) error='Enter at least 10 digits.';
    if(!error && el.dataset.minwords && v.split(/\s+/).filter(Boolean).length < +el.dataset.minwords) error=`Use at least ${el.dataset.minwords} words.`;
    if(!error && el.dataset.minlen && v.length < +el.dataset.minlen) error=`Use at least ${el.dataset.minlen} characters.`;
    if(!error && el.type==='number' && v!=='' && el.min!=='' && +v < +el.min) error=`Enter ${el.min} or more.`;
    el.classList.toggle('invalid',!!error); el.classList.toggle('valid',!error && !!v);
    msg(el,error,error?'error':(v?'Looks good.':''),error?'error':(v?'ok':''));
    return !error;
  }
  function validateForm(form){
    let ok=true; $$('input,select,textarea',form).forEach(el=>{if(el.type!=='button'&&el.type!=='submit'&&el.type!=='reset'&&!validateField(el)) ok=false;});
    const st=$('.status',form.parentElement)||$('#status');
    if(st){st.textContent=ok?'✓ Nice work — all required fields pass the checks.':'Fix the highlighted fields, then press Check My Work again.';st.className='status '+(ok?'good':'bad');}
    return ok;
  }
  function formData(form){let o={}; new FormData(form).forEach((v,k)=>{if(o[k]) o[k]=[].concat(o[k],v); else o[k]=v}); return o;}
  function save(form,key){localStorage.setItem(key,JSON.stringify(formData(form))); alert('Practice draft saved on this device.');}
  function load(form,key){let raw=localStorage.getItem(key); if(!raw){alert('No saved draft yet.');return;} let d=JSON.parse(raw); Object.entries(d).forEach(([k,v])=>{let els=$$(`[name="${CSS.escape(k)}"]`,form); els.forEach(el=>{if(el.type==='checkbox'||el.type==='radio') el.checked=[].concat(v).includes(el.value); else el.value=Array.isArray(v)?v[0]:v;});});}
  function clearValidation(form){$$('.invalid,.valid',form).forEach(e=>e.classList.remove('invalid','valid'));$$('.field-msg',form).forEach(e=>{e.textContent='';e.className='field-msg'});let st=$('.status',form.parentElement);if(st){st.style.display='none';st.className='status';}}
  window.Lab={$, $$, validateField, validateForm, formData, save, load, clearValidation};
  document.addEventListener('input',e=>{if(e.target.matches('input,select,textarea')&&e.target.closest('form')) validateField(e.target)});
})();
