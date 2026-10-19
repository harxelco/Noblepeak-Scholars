const gsapLoaded = (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined');
if(gsapLoaded){ gsap.registerPlugin(ScrollTrigger); }
const reduceMotion = gsapLoaded ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : true;
const animationsOn = gsapLoaded && !reduceMotion;

/* ---------- NAV ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  nav.classList.toggle('menu-open');
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  nav.classList.remove('menu-open');
}));

/* ---------- HERO ENTRANCE ---------- */
if(animationsOn){
  const tl = gsap.timeline({defaults:{ease:'power3.out'}});
  tl.to('.hero-copy .eyebrow', {opacity:1,y:0,duration:.7})
    .to('.hero-copy h1', {opacity:1,y:0,duration:.9}, '-=0.45')
    .to('.hero-copy p', {opacity:1,y:0,duration:.8}, '-=0.5')
    .to('.hero-ctas', {opacity:1,y:0,duration:.7}, '-=0.5')
    .to('.hero-visual', {opacity:1,y:0,duration:1,scale:1}, '-=0.8');
  gsap.set('.hero-visual', {scale:0.96});
}else{
  document.querySelectorAll('.reveal').forEach(el=>{el.style.opacity=1;el.style.transform='none';});
}

/* ---------- GENERIC SCROLL REVEALS ---------- */
if(animationsOn){
  gsap.utils.toArray('.gs-reveal').forEach((el,i)=>{
    gsap.to(el, {
      opacity:1, y:0, duration:0.9, ease:'power3.out',
      scrollTrigger:{trigger:el, start:'top 88%'}
    });
  });
}else{
  document.querySelectorAll('.gs-reveal').forEach(el=>{el.style.opacity=1;el.style.transform='none';});
}

/* ---------- DESTINATION CARD STAGGER ---------- */
if(animationsOn){
  gsap.utils.toArray('.dest-card').forEach((card,i)=>{
    gsap.from(card, {
      opacity:0, y:60, duration:.8, delay:i*0.05, ease:'power3.out',
      scrollTrigger:{trigger:'#destScroller', start:'top 85%'}
    });
  });
}

/* ---------- SERVICES INTERACTIVE (scroll-driven active state) ---------- */
const serviceRows = document.querySelectorAll('.service-row');
const serviceImgs = document.querySelectorAll('.service-visual img');
function setActiveService(idx){
  serviceRows.forEach(r=>r.classList.remove('active'));
  serviceImgs.forEach(im=>im.classList.remove('active'));
  serviceRows[idx].classList.add('active');
  serviceImgs[idx].classList.add('active');
}
serviceRows.forEach((row, idx) => {
  row.addEventListener('mouseenter', () => setActiveService(idx));
  row.addEventListener('click', () => setActiveService(idx));
  if(animationsOn && window.innerWidth > 900){
    ScrollTrigger.create({
      trigger: row,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => setActiveService(idx),
      onEnterBack: () => setActiveService(idx)
    });
  }
});

/* ---------- CRANE BRAND STORY REVEAL ---------- */
if(animationsOn){
  const craneTl = gsap.timeline({
    scrollTrigger:{trigger:'#craneVisual', start:'top 75%'}
  });
  craneTl.to('#fanGroup path', {strokeDashoffset:0, duration:1.4, stagger:0.12, ease:'power2.out'}, 0)
         .to('#craneGroup path, #craneGroup circle', {strokeDashoffset:0, duration:1.6, ease:'power2.out'}, 0.4)
         .to('#craneMeanings span', {opacity:1, y:0, duration:.5, stagger:0.06}, '-=0.6');

  // set up pathLength for stroke draw
  document.querySelectorAll('.crane-path').forEach(p=>{
    const len = p.getTotalLength ? p.getTotalLength() : 300;
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
  gsap.set('#craneGroup path, #craneGroup circle', {strokeDashoffset:(i,t)=> t.getTotalLength ? t.getTotalLength() : 300});
}else{
  document.querySelectorAll('.crane-path').forEach(p=>{p.style.strokeDasharray='none';p.style.strokeDashoffset=0;});
  document.querySelectorAll('#craneMeanings span').forEach(s=>{s.style.opacity=1;s.style.transform='none';});
}

/* ---------- PROCESS TIMELINE ---------- */
const steps = document.querySelectorAll('.process-step');
const fill = document.getElementById('processFill');
if(animationsOn){
  ScrollTrigger.create({
    trigger:'#processTrack',
    start:'top 60%',
    end:'bottom 70%',
    onUpdate:(self)=>{ fill.style.height = (self.progress*100)+'%'; }
  });
  steps.forEach((step,i)=>{
    ScrollTrigger.create({
      trigger:step, start:'top 65%', end:'bottom 65%',
      onEnter:()=>step.classList.add('active'),
      onEnterBack:()=>step.classList.add('active'),
      onLeaveBack:()=>step.classList.remove('active')
    });
  });
}else{
  steps.forEach(s=>s.classList.add('active'));
  fill.style.height='100%';
}

/* ---------- SMOOTH ANCHOR SCROLL (accounts for fixed nav) ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1 && document.querySelector(id)){
      e.preventDefault();
      const y = document.querySelector(id).getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({top:y, behavior: reduceMotion ? 'auto' : 'smooth'});
    }
  });
});
