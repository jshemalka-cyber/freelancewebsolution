
// Lightweight helper to load config and populate common elements
async function loadConfig(){
  try{
    const res = await fetch('site.config.json', {cache:'no-store'});
    const cfg = await res.json();
    document.querySelectorAll('[data-bind=businessName]').forEach(el => el.textContent = cfg.businessName);
    document.querySelectorAll('[data-bind=headline]').forEach(el => el.textContent = cfg.headline);
    document.querySelectorAll('[data-bind=valueProp]').forEach(el => el.textContent = cfg.valueProposition);
    document.querySelectorAll('[data-bind=targetClient]').forEach(el => el.textContent = cfg.targetClient);
    document.querySelectorAll('[data-bind=ctaLabel]').forEach(el => el.textContent = cfg.primaryCTA.label);
    document.querySelectorAll('[data-bind=ctaHref]').forEach(el => el.setAttribute('href', cfg.primaryCTA.url));
    document.querySelectorAll('[data-bind=contactEmail]').forEach(el => {
      el.textContent = cfg.contact.email; el.setAttribute('href', 'mailto:'+cfg.contact.email);
    });
    document.querySelectorAll('[data-bind=contactPhone]').forEach(el => {
      el.textContent = cfg.contact.phone; el.setAttribute('href', 'tel:'+cfg.contact.phone.replace(/\s+/g,''));
    });
    document.querySelectorAll('[data-bind=contactLinkedIn]').forEach(el => {
      el.textContent = 'LinkedIn'; el.setAttribute('href', cfg.contact.linkedin);
    });
  }catch(e){ console.warn('Config load failed', e); }
}

// Project data for Portfolio & Featured Work & Case Study
window.SITE_PROJECTS = [
  {
    id: "swift-sme-site",
    title: "Swift Logistics — SME Website",
    summary: "Ultra-fast static site for an SME logistics brand with SEO-first architecture.",
    tags: ["HTML5","CSS3","Vanilla JS","SEO"],
    thumb: "./assets/img/p1.svg",
    challenge: "Client needed a modern, high-performance site to replace a slow builder template, with better mobile UX and visibility.",
    solution: "Rebuilt from scratch with semantic HTML, modular CSS, and lazy-loaded assets. Implemented schema.org and on-page SEO.",
    techStack: ["HTML5","CSS3","JavaScript","Netlify","Cloudflare CDN"],
    results: [
      "Lighthouse Performance 99/100 on mobile",
      "Reduced page weight by 68%",
      "Lead conversions up 2.1x month-over-month"
    ],
    live: "https://example.com/",
    repo: "https://github.com/your/repo"
  },
  {
    id: "vue-cafe-app",
    title: "Brew Café — Vue Web App",
    summary: "Order-ahead PWA for a local café with real-time menu updates.",
    tags: ["Vue","PWA","Firebase"],
    thumb: "./assets/img/p2.svg",
    challenge: "Peak-hour queues were hurting sales; needed mobile-first ordering with simple admin updates.",
    solution: "Built a Vue PWA with offline cache and Firebase for menu + orders. Added analytics to track bottlenecks.",
    techStack: ["Vue 3","Vite","Firebase","Workbox"],
    results: [
      "Average wait time down 43%",
      "Return users up 3.4x",
      "Owner updates menu in under 60 seconds"
    ],
    live: "https://example.com/",
    repo: "https://github.com/your/repo"
  },
  {
    id: "react-storefront",
    title: "GlowSkin — React Storefront",
    summary: "Headless e-commerce storefront with blazing-fast product pages.",
    tags: ["React","Headless","Stripe"],
    thumb: "./assets/img/p3.svg",
    challenge: "Legacy store was slow and hurting SEO; needed a modern UX and secure checkout.",
    solution: "React front-end with headless CMS and Stripe payments; edge caching and image optimization pipeline.",
    techStack: ["React","Vite","Stripe","Headless CMS","Vercel"],
    results: [
      "SEO traffic +62% within 90 days",
      "Checkout completion +27%",
      "TTFB < 100ms globally via edge network"
    ],
    live: "https://example.com/",
    repo: "https://github.com/your/repo"
  }
];

function renderFeatured(container){
  const list = window.SITE_PROJECTS.slice(0,3).map(p => `
    <article class="card">
      <div class="thumb">
        <img src="${p.thumb}" alt="${p.title} thumbnail" width="300" height="180" />
      </div>
      <div class="body">
        <h3>${p.title}</h3>
        <p class="mt-2" style="color:var(--muted)">${p.summary}</p>
        <div class="tags mt-2">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="row mt-3">
          <a class="btn" href="./case-study.html?id=${p.id}">View case study</a>
          <a class="btn outline" href="${p.live}" target="_blank" rel="noopener">Live site</a>
        </div>
      </div>
    </article>
  `).join('');
  container.innerHTML = `<div class="grid grid-3">${list}</div>`;
}

function renderPortfolio(container){
  const list = window.SITE_PROJECTS.map(p => `
    <a class="card" href="./case-study.html?id=${p.id}" aria-label="Read case study: ${p.title}">
      <div class="thumb"><img src="${p.thumb}" alt="${p.title} thumbnail" width="400" height="250" /></div>
      <div class="body">
        <h3>${p.title}</h3>
        <p class="mt-2" style="color:var(--muted)">${p.summary}</p>
        <div class="tags mt-2">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      </div>
    </a>
  `).join('');
  container.innerHTML = `<div class="grid grid-3">${list}</div>`;
}

function renderCaseStudy(container, id){
  const p = window.SITE_PROJECTS.find(x => x.id === id);
  if(!p){ container.innerHTML = "<p>Case study not found.</p>"; return; }
  container.innerHTML = `
    <div class="card">
      <div class="thumb"><img src="${p.thumb}" alt="${p.title} thumbnail" width="800" height="450" /></div>
      <div class="body">
        <h1 style="margin:6px 0 8px">${p.title}</h1>
        <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <div class="grid grid-2 mt-4">
          <div class="panel">
            <h3>The Challenge</h3>
            <p class="mt-2" style="color:var(--muted)">${p.challenge}</p>
          </div>
          <div class="panel">
            <h3>The Solution</h3>
            <p class="mt-2" style="color:var(--muted)">${p.solution}</p>
            <div class="kpis mt-2">${p.techStack.map(t=>`<span class="kpi">${t}</span>`).join('')}</div>
          </div>
        </div>
        <div class="panel mt-4">
          <h3>The Results</h3>
          <ul class="mt-2" style="color:var(--muted)">${p.results.map(r=>`<li style="margin:.4rem 0">${r}</li>`).join('')}</ul>
        </div>
        <div class="row mt-4">
          <a class="btn" href="${p.live}" target="_blank" rel="noopener">Live Site</a>
          <a class="btn outline" href="${p.repo}" target="_blank" rel="noopener">GitHub Repository</a>
        </div>
      </div>
    </div>
  `;
}

// Simple util to set active nav link
function setActiveNav(){
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[data-page]').forEach(a => {
    a.style.color = (a.getAttribute('data-page')===here) ? 'var(--text)' : 'var(--muted)';
  });
}

// Contact form handler (Netlify will catch it; this prevents empty submits locally)
function attachContactGuard(){
  const form = document.querySelector('form[data-form=contact]');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    const name = form.querySelector('[name=name]').value.trim();
    const email = form.querySelector('[name=email]').value.trim();
    const msg = form.querySelector('[name=message]').value.trim();
    if(!name || !email || !msg){ e.preventDefault(); alert('Please complete all fields.'); }
  });
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await loadConfig();
  setActiveNav();
  attachContactGuard();
  // Page specific mounts
  const feat = document.querySelector('#featured');
  if(feat) renderFeatured(feat);
  const port = document.querySelector('#portfolioGrid');
  if(port) renderPortfolio(port);
  const cs = document.querySelector('#caseStudy');
  if(cs){
    const id = new URLSearchParams(location.search).get('id');
    renderCaseStudy(cs, id);
  }
});
