const KEY='cv-maker-v2';
const SEC=[['nombre','Nombre'],['puesto','Puesto o profesión'],['foto','Foto'],['contacto','Datos de contacto',1],['perfil','Perfil'],['exp','Experiencia',1],['edu','Educación',1],['hab','Habilidades',1],['idi','Idiomas',1],['cur','Cursos y voluntariado',1],['ref','Referencias',1]];
const NUEVO={exp:()=>({a:'[Puesto]',b:'[Empresa o lugar]',c:'[Inicio] – [Fin]',t:'Describe tus logros o responsabilidades.'}),edu:()=>({a:'[Título o nivel]',b:'[Institución]',c:'[Año] – [Año]'}),hab:()=>'[Habilidad]',idi:()=>'[Idioma] · [Nivel]',cur:()=>'[Curso o actividad] · [Lugar], [Año]',ref:()=>({n:'[Nombre], [Cargo]',c:'[Teléfono o correo]'}),contacto:l=>({l,v:'['+l+']'})};
const base=()=>({tpl:'moderna',color:'#E8A154',foto:'',oculto:[],nombre:'[Tu nombre completo]',puesto:'[Puesto o profesión a la que aspiras]',perfil:'Escribe de 3 a 4 líneas sobre quién eres, tu experiencia principal y lo que puedes aportar.',contacto:['Teléfono','Correo electrónico','Ciudad, País','LinkedIn o portafolio','DUI','Fecha de nacimiento'].map(NUEVO.contacto),exp:[NUEVO.exp(),NUEVO.exp()],edu:[NUEVO.edu(),NUEVO.edu()],hab:[1,2,3,4,5].map(NUEVO.hab),idi:['Español · Nativo',NUEVO.idi()],cur:[NUEVO.cur(),NUEVO.cur()],ref:[NUEVO.ref(),NUEVO.ref()]});
let d=base();
try{Object.assign(d,JSON.parse(localStorage.getItem(KEY))||{})}catch(e){}
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const guardar=()=>{try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}};
const ed=(p,t,ml)=>`<span class="ed" contenteditable="plaintext-only" data-p="${p}"${ml?' data-ml':''}>${esc(t)}</span>`;
const DX=p=>`<button type="button" class="x" data-del="${p}" title="Quitar" aria-label="Quitar">×</button>`;
const SX=k=>`<button type="button" class="x" data-sec="${k}" title="Quitar" aria-label="Quitar">×</button>`;
const oc=k=>d.oculto.includes(k);
const SEL=(k,t,cuerpo,add=1)=>oc(k)?'':`<div class="sc ${k}"><div class="sh"><h3 class="st">${t}</h3><span class="tools">${add?`<button type="button" class="x2" data-add="${k}" title="Agregar" aria-label="Agregar">+</button>`:''}<button type="button" class="x2 q" data-sec="${k}" title="Quitar sección" aria-label="Quitar sección">×</button></span></div>${cuerpo}</div>`;
const S=k=>(v,i)=>`<div class="it">${ed(k+'.'+i,v)}${DX(k+'.'+i)}</div>`;
const R={
contacto:(v,i)=>`<div class="it"><span class="lb">${ed(`contacto.${i}.l`,v.l)}</span> ${ed(`contacto.${i}.v`,v.v)}${DX('contacto.'+i)}</div>`,
exp:(v,i)=>`<div class="it bl"><div class="fl"><b>${ed(`exp.${i}.a`,v.a)} · ${ed(`exp.${i}.b`,v.b)}</b><span>${ed(`exp.${i}.c`,v.c)}</span></div>${ed(`exp.${i}.t`,v.t,1)}${DX('exp.'+i)}</div>`,
edu:(v,i)=>`<div class="it fl bl"><div><b>${ed(`edu.${i}.a`,v.a)}</b> · ${ed(`edu.${i}.b`,v.b)}</div><span>${ed(`edu.${i}.c`,v.c)}</span>${DX('edu.'+i)}</div>`,
hab:S('hab'),idi:S('idi'),cur:S('cur'),
ref:(v,i)=>`<div class="it bl">${ed(`ref.${i}.n`,v.n)}<br>${ed(`ref.${i}.c`,v.c)}${DX('ref.'+i)}</div>`};
const TIT={contacto:'Contacto',exp:'Experiencia',edu:'Educación',hab:'Habilidades',idi:'Idiomas',cur:'Cursos y voluntariado',ref:'Referencias'};
const L=k=>SEL(k,TIT[k],d[k].map(R[k]).join(''));
function ini(){return (d.nombre.replace(/[\[\]]/g,'').trim().split(/\s+/).map(p=>p[0]).slice(0,2).join('')||'TN').toUpperCase()}
const foto=()=>oc('foto')?'':`<div class="fo" data-foto title="Toca para subir tu foto"><span class="ini">${d.foto?`<img src="${d.foto}" alt="Foto">`:esc(ini())}</span>${d.foto?'<button type="button" class="x" data-quitafoto title="Quitar foto" aria-label="Quitar foto">×</button>':SX('foto')}</div>`;
const nom=()=>(oc('nombre')?'':`<h1 class="nom it">${ed('nombre',d.nombre)}${SX('nombre')}</h1>`)+(oc('puesto')?'':`<div class="pue it">${ed('puesto',d.puesto)}${SX('puesto')}</div>`);
const perfil=()=>SEL('perfil','Perfil',`<div>${ed('perfil',d.perfil,1)}</div>`,0);
function hoja(){
  if(d.tpl==='clasica')return `<div class="c"><div class="cab"><div>${nom()}${L('contacto')}</div>${foto()}</div>${perfil()}${L('exp')}${L('edu')}${L('hab')}${L('idi')}${L('cur')}${L('ref')}</div>`;
  return `<div class="m"><div class="lat">${foto()}${L('contacto')}${L('hab')}${L('idi')}${L('ref')}</div><div class="cen"><div>${nom()}</div>${perfil()}${L('exp')}${L('edu')}${L('cur')}</div></div>`;
}
function panel(){
  $('#elementos').innerHTML=SEC.map(([k,n,l])=>`<div class="row"><span>${n}</span><span>${oc(k)?`<button type="button" data-pa="${k}">Agregar</button>`:`${k==='foto'?'<button type="button" data-subir>Subir foto</button>':''}${l?`<button type="button" data-pm="${k}">+ Otro</button>`:''}<button type="button" data-pq="${k}">Quitar</button>`}</span></div>`).join('');
  $('#tpl').value=d.tpl;$('#color').value=d.color;
}
function ajustar(){const m=$('#marco');$('#hoja').style.zoom=Math.max(.7,Math.min(1,m.clientWidth/794))}
function pintar(){const h=$('#hoja');h.style.setProperty('--ac',d.color);h.innerHTML=hoja();document.documentElement.style.setProperty('--acento',d.color);panel();ajustar();guardar()}
function agregar(k){
  if(k==='contacto'){const l=(prompt('¿Qué dato quieres agregar? Ejemplos: NIT, Estado civil, Nacionalidad, Licencia de conducir')||'').trim();if(!l)return;d.contacto.push(NUEVO.contacto(l))}
  else d[k].push(NUEVO[k]());
  d.oculto=d.oculto.filter(x=>x!==k);pintar();
}
const mostrar=k=>{d.oculto=d.oculto.filter(x=>x!==k);if(Array.isArray(d[k])&&!d[k].length)d[k].push(k==='contacto'?NUEVO.contacto('Dato'):NUEVO[k]());pintar()};
const ocultar=k=>{if(!oc(k))d.oculto.push(k);pintar()};
const setP=(p,v)=>{const a=p.split('.');let o=d;while(a.length>1)o=o[a.shift()];o[a[0]]=v};
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset&&t.dataset.p){setP(t.dataset.p,t.innerText.replace(/\n$/,''));if(t.dataset.p==='nombre'&&!d.foto){const i=$('.ini');if(i)i.textContent=ini()}guardar()}
  else if(t.id==='tpl'){d.tpl=t.value;pintar()}
  else if(t.id==='color'){d.color=t.value;pintar()}
});
document.addEventListener('keydown',e=>{const t=e.target;if(e.key==='Enter'&&t.dataset&&t.dataset.p&&!('ml' in t.dataset)){e.preventDefault();t.blur()}});
document.addEventListener('focusin',e=>{const t=e.target;if(t.classList&&t.classList.contains('ed')&&t.innerText.trim().startsWith('[')){const r=document.createRange();r.selectNodeContents(t);const s=getSelection();s.removeAllRanges();s.addRange(r)}});
document.addEventListener('click',e=>{
  const b=e.target.closest('button'),D=b&&b.dataset;
  if(D){
    if(D.add)return agregar(D.add);
    if(D.del){const[k,i]=D.del.split('.');d[k].splice(+i,1);return pintar()}
    if(D.sec||D.pq)return ocultar(D.sec||D.pq);
    if(D.pa)return mostrar(D.pa);
    if(D.pm)return agregar(D.pm);
    if('quitafoto' in D){d.foto='';return pintar()}
    if('subir' in D)return $('#fotoIn').click();
    return;
  }
  if(e.target.closest('[data-foto]'))$('#fotoIn').click();
});
$('#fotoIn').onchange=e=>{
  const f=e.target.files[0];if(!f)return;const img=new Image();
  img.onload=()=>{const c=document.createElement('canvas'),s=Math.min(img.width,img.height),n=320;c.width=c.height=n;c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,n,n);d.foto=c.toDataURL('image/jpeg',.85);d.oculto=d.oculto.filter(x=>x!=='foto');URL.revokeObjectURL(img.src);pintar()};
  img.src=URL.createObjectURL(f);e.target.value='';
};
$('#btnLimpiar').onclick=()=>{if(confirm('¿Volver a la plantilla original? Se borrarán tus cambios.')){d=base();pintar()}};
const vista=v=>{document.body.classList.toggle('ver-vista',v);$('#tabVista').classList.toggle('on',v);$('#tabDatos').classList.toggle('on',!v);ajustar()};
$('#tabDatos').onclick=()=>vista(false);$('#tabVista').onclick=()=>vista(true);
window.addEventListener('resize',ajustar);
$('#btnPdf').onclick=async()=>{
  if(/\[[^\]]+\]/.test($('#hoja').innerText)&&!confirm('Todavía hay textos entre corchetes sin llenar. ¿Descargar de todos modos?'))return;
  const b=$('#btnPdf'),txt=b.textContent;b.textContent='Creando PDF…';b.disabled=true;
  const caja=document.createElement('div');caja.style.cssText='position:fixed;left:-10000px;top:0;width:794px;height:1123px';
  const c=$('#hoja').cloneNode(true);c.style.zoom='1';
  c.querySelectorAll('.x,.tools').forEach(n=>n.remove());c.querySelectorAll('[contenteditable]').forEach(n=>n.removeAttribute('contenteditable'));
  caja.appendChild(c);document.body.appendChild(caja);
  const nombre=(d.nombre.replace(/[\[\]]/g,'').trim()||'curriculum').replace(/\s+/g,'-')+'.pdf';
  try{
    const blob=await html2pdf().set({margin:0,image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:'px',format:[794,1123],hotfixes:['px_scaling']}}).from(c).outputPdf('blob');
    const f=new File([blob],nombre,{type:'application/pdf'});
    if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],title:nombre});
    else{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=nombre;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
  }catch(err){if(err.name!=='AbortError')alert('No se pudo crear el PDF. Intenta de nuevo.')}
  caja.remove();b.textContent=txt;b.disabled=false;
};
pintar();
