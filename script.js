/* ============================================================
   PORTFOLIO SCRIPT
   Renders everything in content.js into the page and wires up
   interactions. No editing needed here for content changes —
   see content.js.
   ============================================================ */

const D = PORTFOLIO_DATA;

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------- HERO ---------------- */
(function renderHero() {
  document.getElementById('heroName').innerHTML =
    `${D.profile.name.split(' ')[0]} <span class="highlight">${D.profile.name.split(' ').slice(1).join(' ')}</span>`;
  document.getElementById('heroStatement').textContent = D.profile.heroStatement;

  // Ambient hero background: flowing node/line pattern
  const svg = document.getElementById('heroBg');
  const NS = 'http://www.w3.org/2000/svg';
  const w = 1200, h = 800;
  const points = [];
  for (let i = 0; i < 14; i++) {
    points.push({ x: Math.random() * w, y: Math.random() * h, r: 1.5 + Math.random() * 2.5 });
  }
  points.forEach((p, i) => {
    // connect to nearest 2 points
    const others = points
      .map((q, j) => ({ q, j, d: Math.hypot(p.x - q.x, p.y - q.y) }))
      .filter(o => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    others.forEach(o => {
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', p.x); line.setAttribute('y1', p.y);
      line.setAttribute('x2', o.q.x); line.setAttribute('y2', o.q.y);
      line.setAttribute('stroke', '#6C8CFF');
      line.setAttribute('stroke-opacity', '0.12');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    });
  });
  points.forEach(p => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', p.r);
    c.setAttribute('fill', '#6C8CFF');
    c.setAttribute('fill-opacity', '0.35');
    svg.appendChild(c);
  });
})();

/* ---------------- SKILL TREE ---------------- */
(function renderSkillTree() {
  const svg = document.getElementById('skillTreeSvg');
  const NS = 'http://www.w3.org/2000/svg';
  const groups = ['foundation', 'data', 'engineering', 'ai', 'tools'];
  const groupX = { foundation: 110, data: 330, engineering: 570, ai: 790, tools: 930 };
  const W = 1000, H = 480, topPad = 40, bottomPad = 40;

  const byGroup = {};
  groups.forEach(g => byGroup[g] = D.skills.filter(s => s.group === g));

  const positioned = {};
  groups.forEach(g => {
    const arr = byGroup[g];
    const usable = H - topPad - bottomPad;
    const step = usable / (arr.length + 1);
    arr.forEach((skill, i) => {
      positioned[skill.name] = {
        x: groupX[g],
        y: topPad + step * (i + 1),
        ...skill,
      };
    });
  });

  const linkGroup = document.createElementNS(NS, 'g');
  svg.appendChild(linkGroup);

  // chain within group
  groups.forEach(g => {
    const arr = byGroup[g];
    for (let i = 0; i < arr.length - 1; i++) {
      const a = positioned[arr[i].name], b = positioned[arr[i + 1].name];
      drawLink(a, b);
    }
  });

  // branch: Python -> first node of data, engineering, ai
  const root = positioned['Python'];
  ['data', 'engineering', 'ai'].forEach(g => {
    if (byGroup[g].length) drawLink(root, positioned[byGroup[g][0].name]);
  });
  // tools connects off the AI/backend branch (Git sits alongside FastAPI in practice)
  if (byGroup.tools.length && byGroup.ai.length) {
    drawLink(positioned[byGroup.ai[byGroup.ai.length - 1].name], positioned[byGroup.tools[0].name]);
  }

  function drawLink(a, b) {
    const path = document.createElementNS(NS, 'path');
    const midX = (a.x + b.x) / 2;
    path.setAttribute('d', `M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}`);
    path.setAttribute('class', 'skill-link');
    linkGroup.appendChild(path);
  }

  // nodes
  const detailBox = document.getElementById('skillDetail');
  Object.values(positioned).forEach(skill => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', `skill-node ${skill.level}`);
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `${skill.name}, ${skill.level}`);

    const r = skill.name === 'Python' ? 9 : 6.5;
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', skill.x);
    circle.setAttribute('cy', skill.y);
    circle.setAttribute('r', r);
    g.appendChild(circle);

    const text = document.createElementNS(NS, 'text');
    const labelAbove = skill.group === 'tools' || skill.group === 'ai';
    text.setAttribute('x', skill.x);
    text.setAttribute('y', skill.y + (labelAbove ? -14 : 20));
    text.setAttribute('text-anchor', 'middle');
    text.textContent = skill.name;
    g.appendChild(text);

    function select() {
      document.querySelectorAll('.skill-node.selected').forEach(n => n.classList.remove('selected'));
      g.classList.add('selected');
      const relatedProjects = D.projects.filter(p => p.stack.some(s => s.toLowerCase().includes(skill.name.toLowerCase().split(' ')[0])));
      detailBox.innerHTML = `
        <div>
          <span class="skill-detail-name">${skill.name}</span>
          <span class="skill-detail-tag ${skill.level}" style="margin-left:12px;">${skill.level}</span>
        </div>
        <div style="color:var(--text-secondary); font-size:13px; font-family:var(--font-mono);">
          ${relatedProjects.length ? 'Used in: ' + relatedProjects.map(p => p.name).join(', ') : skill.level === 'learning' ? 'Actively learning — not yet used in a shipped project.' : 'Core skill, used across projects.'}
        </div>
      `;
    }
    g.addEventListener('click', select);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
    svg.appendChild(g);
  });
})();

/* ---------------- PROJECTS ---------------- */
const CATEGORY_LABELS = { ai: 'AI', 'data-engineering': 'Data Engineering', backend: 'Backend', other: 'Other' };

function renderProjects(filter) {
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = '';
  const list = filter === 'all' ? D.projects : D.projects.filter(p => p.category.includes(filter));
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-card-top">
        <h3>${p.name}</h3>
        <span class="project-year">${p.year}</span>
      </div>
      <p class="project-tagline">${p.tagline}</p>
      <div class="project-tags">${p.stack.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <div class="project-card-cta">View case study
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </div>
    `;
    card.addEventListener('click', () => openModal(p.id));
    grid.appendChild(card);
  });
}

(function renderFilterBar() {
  const bar = document.getElementById('filterBar');
  const cats = ['all', ...new Set(D.projects.flatMap(p => p.category))];
  cats.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (i === 0 ? ' active' : '');
    btn.textContent = c === 'all' ? 'All Projects' : (CATEGORY_LABELS[c] || c);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(c);
    });
    bar.appendChild(btn);
  });
  renderProjects('all');
})();

/* ---------------- PROJECT MODAL ---------------- */
const overlay = document.getElementById('modalOverlay');

function openModal(id) {
  const p = D.projects.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalTagline').textContent = p.tagline;

  const links = document.getElementById('modalLinks');
  links.innerHTML = '';
  if (p.github) links.innerHTML += `<a href="${p.github}" target="_blank" rel="noopener" class="btn btn-ghost">GitHub ↗</a>`;
  if (p.demo) links.innerHTML += `<a href="${p.demo}" target="_blank" rel="noopener" class="btn btn-ghost">Live demo ↗</a>`;

  const tabs = [
    ['overview', 'Overview'],
    ['architecture', 'Architecture'],
    ['stack', 'Stack'],
    ['results', 'Results'],
    ['learned', 'Learned & Next'],
  ];
  const tabsEl = document.getElementById('modalTabs');
  const panesEl = document.getElementById('modalPanes');
  tabsEl.innerHTML = '';
  panesEl.innerHTML = '';

  tabs.forEach(([key, label], i) => {
    const tabBtn = document.createElement('button');
    tabBtn.className = 'modal-tab' + (i === 0 ? ' active' : '');
    tabBtn.textContent = label;
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.modal-pane').forEach(t => t.classList.remove('active'));
      tabBtn.classList.add('active');
      document.getElementById(`pane-${key}`).classList.add('active');
    });
    tabsEl.appendChild(tabBtn);

    const pane = document.createElement('div');
    pane.className = 'modal-pane' + (i === 0 ? ' active' : '');
    pane.id = `pane-${key}`;

    if (key === 'overview') {
      pane.innerHTML = `
        <p><strong style="color:var(--text-primary)">Problem — </strong>${p.problem}</p>
        <p><strong style="color:var(--text-primary)">Solution — </strong>${p.solution}</p>
        <p><strong style="color:var(--text-primary)">What I built — </strong>${p.whatIBuilt}</p>
        ${p.challenges.length ? `<p style="color:var(--text-primary); font-weight:600; margin-top:20px;">Engineering challenges</p><ul>${p.challenges.map(c => `<li>${c}</li>`).join('')}</ul>` : ''}
      `;
    } else if (key === 'architecture') {
      pane.innerHTML = `<div class="arch-flow">${p.architecture.map((a, idx) => `
        <div class="arch-step">
          <div class="arch-step-name">${a.stage}</div>
          <div class="arch-step-detail">${a.detail}</div>
        </div>
        ${idx < p.architecture.length - 1 ? '<div class="arch-connector"></div>' : ''}
      `).join('')}</div><p style="margin-top:16px; font-size:12px; color:var(--text-tertiary); font-family:var(--font-mono);">Hover a stage for detail</p>`;
    } else if (key === 'stack') {
      pane.innerHTML = `<div class="project-tags">${p.stack.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
    } else if (key === 'results') {
      if (p.results.length) {
        pane.innerHTML = `<ul>${p.results.map(r => `<li>${r}</li>`).join('')}</ul>`;
      } else {
        pane.innerHTML = `<div class="metric-empty">
          <strong>No verified metrics yet for this project.</strong>
          Rather than invent numbers, here's what would be worth measuring:
          <ul style="margin-top:10px;">${p.suggestedMetrics.map(m => `<li>${m}</li>`).join('')}</ul>
        </div>`;
      }
    } else if (key === 'learned') {
      pane.innerHTML = `
        <p><strong style="color:var(--text-primary)">What I learned — </strong>${p.learned}</p>
        <p style="color:var(--text-primary); font-weight:600; margin-top:20px;">Future improvements</p>
        <ul>${p.future.map(f => `<li>${f}</li>`).join('')}</ul>
      `;
    }
    panesEl.appendChild(pane);
  });

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---------------- HOW I THINK ---------------- */
(function renderWorkflow() {
  const track = document.getElementById('workflowTrack');
  D.workflow.forEach((w, i) => {
    const el = document.createElement('div');
    el.className = 'workflow-step';
    el.innerHTML = `
      <div class="workflow-step-num">0${i + 1}</div>
      <div class="workflow-step-name">${w.stage}</div>
      <div class="workflow-step-detail">${w.detail}</div>
    `;
    track.appendChild(el);
  });
})();

/* ---------------- DASHBOARD ---------------- */
(function renderMetrics() {
  const grid = document.getElementById('metricGrid');
  const items = [
    [D.metrics.projectsCompleted, 'Projects shipped'],
    [D.metrics.technologiesUsed, 'Technologies used'],
    [D.metrics.yearsLearning, 'Years learning'],
    [D.metrics.certifications, 'Certifications'],
  ];
  items.forEach(([num, label]) => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `<div class="metric-number" data-target="${num}">0</div><div class="metric-label">${label}</div>`;
    grid.appendChild(card);
  });
})();

/* ---------------- TIMELINE ---------------- */
(function renderTimeline() {
  const list = document.getElementById('timelineList');
  D.timeline.forEach(t => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.innerHTML = `
      <div class="timeline-period">${t.period}</div>
      <div class="timeline-dot-col"><div class="timeline-dot"></div></div>
      <div>
        <div class="timeline-label">${t.label}</div>
        <div class="timeline-detail">${t.detail}</div>
      </div>
    `;
    list.appendChild(el);
  });
})();

/* ---------------- BEYOND / BUILDING ---------------- */
(function renderBeyond() {
  document.getElementById('bioText').textContent = D.profile.bio;
  if (D.profile.photo) {
    document.getElementById('photoFrame').innerHTML = `<img src="${D.profile.photo}" alt="${D.profile.name}" style="width:100%;height:100%;object-fit:cover;border-radius:9px;">`;
  }

  const b = D.currentlyBuilding;
  document.getElementById('buildingCard').innerHTML = `
    <div class="building-status"><span class="pulse"></span> ${b.active ? 'Active' : 'Paused'}</div>
    <div class="building-project">${b.project}</div>
    <div class="building-detail">${b.detail}</div>
    <div class="building-milestone">Next milestone: <span>${b.nextMilestone}</span></div>
  `;
})();

/* ---------------- CONTACT ---------------- */
(function renderContact() {
  const links = document.getElementById('contactLinks');
  const items = [
    ['Email', 'https://mail.google.com/mail/?view=cm&fs=1&to=as0448380@gmail.com'],
    ['GitHub', D.profile.github],
    ['LinkedIn', D.profile.linkedin],
  ];
  items.forEach(([label, href]) => {
    const a = document.createElement('a');
    a.href = href;
    a.target = href.startsWith('http') ? '_blank' : '_self';
    a.rel = 'noopener';
    a.className = 'btn btn-ghost';
    a.textContent = label;
    links.appendChild(a);
  });
})();

/* ---------------- RESUME VIEW ---------------- */
(function renderResume() {
  document.getElementById('resumeName').textContent = D.profile.name;
  document.getElementById('resumeContact').textContent =
    `${D.profile.email} · ${D.profile.phone} · ${D.profile.location}`;
  document.getElementById('resumeDownload').href = D.profile.resumeFile;
  document.getElementById('resumeProfile').textContent = D.profile.bio;

  document.getElementById('resumeProjects').innerHTML = D.projects.map(p => `
    <div class="resume-entry">
      <div class="resume-entry-title">${p.name}</div>
      <div class="resume-entry-meta">${p.stack.join(', ')}</div>
      <div class="resume-entry-detail">${p.solution}</div>
    </div>
  `).join('');

  const levels = { strong: 'Strong', comfortable: 'Comfortable', learning: 'Learning' };
  const grouped = {};
  D.skills.forEach(s => { (grouped[s.level] = grouped[s.level] || []).push(s.name); });
  document.getElementById('resumeSkills').innerHTML = Object.entries(grouped).map(([lvl, names]) => `
    <div class="resume-entry">
      <div class="resume-entry-meta">${levels[lvl]}</div>
      <div class="resume-entry-detail">${names.join(', ')}</div>
    </div>
  `).join('');

  document.getElementById('resumeEducation').innerHTML = D.education.map(e => `
    <div class="resume-entry">
      <div class="resume-entry-title">${e.institution}</div>
      <div class="resume-entry-meta">${e.credential} · ${e.location} · ${e.period}</div>
      <div class="resume-entry-detail">${e.detail}</div>
    </div>
  `).join('');

  document.getElementById('resumeCerts').innerHTML = D.certifications.map(c => `
    <div class="resume-entry">
      <div class="resume-entry-title">${c.name}</div>
      <div class="resume-entry-meta">${c.issuer}</div>
    </div>
  `).join('');
})();

const viewPortfolioBtn = document.getElementById('viewPortfolioBtn');
const viewResumeBtn = document.getElementById('viewResumeBtn');
const portfolioView = document.getElementById('portfolioView');
const resumeView = document.getElementById('resumeView');

viewPortfolioBtn.addEventListener('click', () => {
  portfolioView.classList.remove('hidden');
  resumeView.classList.remove('active');
  viewPortfolioBtn.classList.add('active'); viewPortfolioBtn.setAttribute('aria-selected', 'true');
  viewResumeBtn.classList.remove('active'); viewResumeBtn.setAttribute('aria-selected', 'false');
  window.scrollTo(0, 0);
});
viewResumeBtn.addEventListener('click', () => {
  portfolioView.classList.add('hidden');
  resumeView.classList.add('active');
  viewResumeBtn.classList.add('active'); viewResumeBtn.setAttribute('aria-selected', 'true');
  viewPortfolioBtn.classList.remove('active'); viewPortfolioBtn.setAttribute('aria-selected', 'false');
  window.scrollTo(0, 0);
});

/* ---------------- MOBILE MENU ---------------- */
const navHamburger = document.getElementById('navHamburger');
const navMobileMenu = document.getElementById('navMobileMenu');
navHamburger.addEventListener('click', () => {
  const open = navMobileMenu.classList.toggle('open');
  navHamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navMobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navMobileMenu.classList.remove('open');
  navHamburger.setAttribute('aria-expanded', 'false');
}));

/* ---------------- SCROLL REVEAL ---------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Metric count-up when visible */
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = target; return; }
        el.textContent = cur;
        requestAnimationFrame(tick);
      };
      tick();
      metricObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.metric-number').forEach(el => metricObserver.observe(el));

/* ---------------- PIPELINE THREAD (signature scroll element) ---------------- */
const pipelineFill = document.getElementById('pipelineFill');
const pipelineThread = document.querySelector('.pipeline-thread');
const sectionIds = ['hero', 'skills', 'projects', 'thinking', 'dashboard', 'timeline', 'beyond', 'building', 'contact'];

// build nodes along the thread at each section's position
function layoutPipelineNodes() {
  pipelineThread.querySelectorAll('.pipeline-node').forEach(n => n.remove());
  const docHeight = document.body.scrollHeight;
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.offsetTop;
    const pct = (top / docHeight) * 100;
    const node = document.createElement('div');
    node.className = 'pipeline-node';
    node.style.top = pct + '%';
    node.dataset.section = id;
    pipelineThread.appendChild(node);
  });
}
layoutPipelineNodes();
window.addEventListener('resize', layoutPipelineNodes);

function updatePipeline() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
  pipelineFill.style.height = pct + '%';

  const scrollCenter = scrollTop + window.innerHeight * 0.4;
  let activeId = sectionIds[0];
  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollCenter) activeId = id;
  });
  pipelineThread.querySelectorAll('.pipeline-node').forEach(n => {
    n.classList.toggle('active', n.dataset.section === activeId);
  });
}
window.addEventListener('scroll', updatePipeline, { passive: true });
updatePipeline();
