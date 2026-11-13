const KEY='cv-maker-datos';
const base={nombre:'',puesto:'',tel:'',correo:'',ciudad:'',enlace:'',perfil:'',habilidades:'',idiomas:'',extra:'',exp:[{}],edu:[{}],tpl:'moderna',color:'#E8A154'};
let d=JSON.parse(JSON.stringify(base));
try{Object.assign(d,JSON.parse(localStorage.getItem(KEY))||{})}catch(e){}
const $=s=>document.querySelector(s);
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ph=(v,t)=>v?esc(v):'<span style="opacity:.55">'+t+'</span>';
const lista=s=>(s||'').split(',').map(x=>x.trim()).filter(Boolean);
const lineas=s=>(s||'').split('\n').map(x=>x.trim()).filter(Boolean);
const guardar=()=>{try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}};

function bloquesForm(tipo,cf){
  const cont=$(tipo==='exp'?'#listaExp':'#listaEdu');
  cont.innerHTML=d[tipo].map((it,i)=>`<div class="item">${cf.map(([f,t,ta])=>`<label>${t}${ta?`<textarea rows="3" data-l="${tipo}" data-i="${i}" data-f="${f}">${esc(it[f])}</textarea>`:`<input data-l="${tipo}" data-i="${i}" data-f="${f}" value="${esc(it[f])}">`}</label>`).join('')}<button type="button" class="quitar" data-q="${tipo}" data-i="${i}">Quitar</button></div>`).join('');
}
const CAMPOS={exp:[['a','Puesto'],['b','Empresa o lugar'],['c','Fechas (ej. 2022 – Actualidad)'],['t','Logros o responsabilidades',1]],edu:[['a','Título o nivel'],['b','Institución'],['c','Años']]};
function formulario(){
  document.querySelectorAll('[data-k]').forEach(e=>e.value=d[e.dataset.k]||'');
  $('#tpl').value=d.tpl;$('#color').value=d.color;
  bloquesForm('exp',CAMPOS.exp);bloquesForm('edu',CAMPOS.edu);
}
function hoja(){
  const ini=(d.nombre.trim().split(/\s+/).map(p=>p[0]).slice(0,2).join('')||'TN').toUpperCase();
  const exp=d.exp.map(e=>`<div class="bl"><div class="fl"><b>${ph(e.a,'[Puesto]')} · ${ph(e.b,'[Empresa]')}</b><span>${ph(e.c,'[Fechas]')}</span></div>${esc(e.t)}</div>`).join('');
  const edu=d.edu.map(e=>`<div class="fl bl"><div><b>${ph(e.a,'[Título]')}</b> · ${ph(e.b,'[Institución]')}</div><span>${ph(e.c,'[Años]')}</span></div>`).join('');
  const ext=lineas(d.extra).map(x=>`<div class="bl">${esc(x)}</div>`).join('');
  const sec=(t,h)=>h?`<div><h3 class="sec-t">${t}</h3>${h}</div>`:'';
  const hab=lista(d.habilidades).map(x=>`<div>${esc(x)}</div>`).join('');
  const idi=lista(d.idiomas).map(x=>`<div>${esc(x)}</div>`).join('');
  const perfil=d.perfil?`<div>${esc(d.perfil)}</div>`:'<div style="opacity:.55">Escribe un resumen breve de quién eres y qué puedes aportar.</div>';
  if(d.tpl==='clasica') return `<div class="c"><header><h1 class="nom">${ph(d.nombre,'[Tu nombre completo]')}</h1><div class="pue">${ph(d.puesto,'[Puesto o profesión]')}</div><div class="con">${[d.tel,d.correo,d.ciudad,d.enlace].filter(Boolean).map(esc).join(' | ')||'[Teléfono | Correo | Ciudad]'}</div></header>
<section>${sec('Perfil',perfil)}</section><section>${sec('Experiencia',exp)}</section><section>${sec('Educación',edu)}</section>
<section>${sec('Habilidades',esc(lista(d.habilidades).join(' · ')))}</section><section>${sec('Idiomas',esc(lista(d.idiomas).join(' · ')))}</section><section>${sec('Cursos y más',ext)}</section></div>`;
  return `<div class="m"><div class="lat"><div class="ini">${esc(ini)}</div>
<div><h3>Contacto</h3>${[d.tel,d.correo,d.ciudad,d.enlace].filter(Boolean).map(x=>`<div>${esc(x)}</div>`).join('')||'<div style="opacity:.6">[Tus datos]</div>'}</div>
${hab?`<div><h3>Habilidades</h3>${hab}</div>`:''}${idi?`<div><h3>Idiomas</h3>${idi}</div>`:''}</div>
<div class="cen"><div><h1 class="nom">${ph(d.nombre,'[Tu nombre completo]')}</h1><div class="pue">${ph(d.puesto,'[Puesto o profesión]')}</div></div>
${sec('Perfil',perfil)}${sec('Experiencia',exp)}${sec('Educación',edu)}${sec('Cursos y más',ext)}</div></div>`;
}
function ajustar(){
  const m=$('#marco'),h=$('#hoja'),s=Math.min(1,m.clientWidth/794);
  h.style.transform=`scale(${s})`;m.style.height=(1123*s)+'px';
}
function pintar(){
  const h=$('#hoja');h.style.setProperty('--ac',d.color);h.innerHTML=hoja();
  document.documentElement.style.setProperty('--acento',d.color);ajustar();guardar();
}
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.k)d[t.dataset.k]=t.value;
  else if(t.dataset.l)d[t.dataset.l][+t.dataset.i][t.dataset.f]=t.value;
  else if(t.id==='tpl')d.tpl=t.value;
  else if(t.id==='color')d.color=t.value;
  else return;
  pintar();
});
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.dataset.add){d[t.dataset.add].push({});formulario();pintar()}
  if(t.dataset.q){const a=d[t.dataset.q];a.splice(+t.dataset.i,1);if(!a.length)a.push({});formulario();pintar()}
});
$('#btnLimpiar').onclick=()=>{if(confirm('¿Borrar todos los datos?')){d=JSON.parse(JSON.stringify(base));formulario();pintar()}};
const vista=v=>{document.body.classList.toggle('ver-vista',v);$('#tabVista').classList.toggle('on',v);$('#tabDatos').classList.toggle('on',!v);ajustar()};
$('#tabDatos').onclick=()=>vista(false);$('#tabVista').onclick=()=>vista(true);
window.addEventListener('resize',ajustar);
$('#btnPdf').onclick=async()=>{
  const b=$('#btnPdf'),txt=b.textContent;b.textContent='Creando PDF…';b.disabled=true;
  const caja=document.createElement('div');caja.style.cssText='position:fixed;left:-10000px;top:0;width:794px;height:1123px';
  const c=$('#hoja').cloneNode(true);c.style.transform='none';c.style.setProperty('--ac',d.color);caja.appendChild(c);document.body.appendChild(caja);
  const nombre=(d.nombre.trim()||'curriculum').replace(/\s+/g,'-')+'.pdf';
  try{
    const blob=await html2pdf().set({margin:0,image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:'px',format:[794,1123],hotfixes:['px_scaling']}}).from(c).outputPdf('blob');
    const f=new File([blob],nombre,{type:'application/pdf'});
    if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:nombre})}
    else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nombre;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
  }catch(err){if(err.name!=='AbortError')alert('No se pudo crear el PDF. Intenta de nuevo.')}
  caja.remove();b.textContent=txt;b.disabled=false;
};
formulario();pintar();
