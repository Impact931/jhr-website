<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Corporate Event Coverage | JHR Photography</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
<!-- FAQ Schema Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"What's the difference between Corporate Event Coverage and Trade-Show Media Services?","acceptedAnswer":{"@type":"Answer","text":"Corporate Event Coverage is designed for events where your organization is the host — conferences, annual meetings, leadership retreats, training summits, and association events. Trade-Show Media Services is designed for exhibitor environments where the focus is on booth coverage, sponsor documentation, and show floor energy."}},
    {"@type":"Question","name":"We have breakout sessions running at the same time. Can you cover all of them?","acceptedAnswer":{"@type":"Answer","text":"Yes. For events with concurrent programming, we deploy additional operators so sessions happening simultaneously all receive professional coverage."}},
    {"@type":"Question","name":"How quickly do we receive our photos?","acceptedAnswer":{"@type":"Answer","text":"Same-day highlights — 5 to 10 curated images — are delivered during or immediately after each day's programming. Your full curated gallery is delivered within 72 hours of event completion."}},
    {"@type":"Question","name":"Can you also capture video at our event?","acceptedAnswer":{"@type":"Answer","text":"Yes. We offer several Event Video Systems that pair directly with photography coverage — including highlight reels, attendee testimonials, and dedicated executive interview production."}},
    {"@type":"Question","name":"What Nashville venues do you work in?","acceptedAnswer":{"@type":"Answer","text":"We've covered corporate events at virtually every major Nashville venue including Gaylord Opryland, Music City Center, Renaissance Nashville, JW Marriott, Grand Hyatt, Omni, Loews Vanderbilt, and dozens more."}}
  ]
}
</script>
<style>
  :root {
    --bg-primary: #0B0C0F;
    --bg-secondary: #111318;
    --bg-card: #16181D;
    --gold: #C9A84C;
    --gold-dim: rgba(201, 168, 76, 0.15);
    --gold-glow: rgba(201, 168, 76, 0.3);
    --text-primary: #F2F0EB;
    --text-secondary: #9A978F;
    --text-muted: #5E5C57;
    --light-bg: #F5F3EE;
    --light-text: #1A1A1A;
    --light-sub: #555;
    --light-muted: #888;
    --serif: 'DM Serif Display', Georgia, serif;
    --sans: 'Outfit', system-ui, sans-serif;
    --border: rgba(255,255,255,0.06);
    --max-w: 1240px;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior:smooth; scrollbar-width:thin; scrollbar-color:var(--gold-dim) var(--bg-primary); }
  body { background:var(--bg-primary); color:var(--text-primary); font-family:var(--sans); font-weight:300; line-height:1.7; overflow-x:hidden; -webkit-font-smoothing:antialiased; }

  /* NAV */
  nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:1.25rem 3rem; display:flex; justify-content:space-between; align-items:center; transition:background 0.4s, backdrop-filter 0.4s; }
  nav.scrolled { background:rgba(11,12,15,0.85); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); }
  .nav-logo { font-family:var(--serif); font-size:1.25rem; color:var(--text-primary); text-decoration:none; letter-spacing:0.02em; }
  .nav-logo span { color:var(--gold); }
  .nav-links { display:flex; gap:2.5rem; align-items:center; list-style:none; }
  .nav-links a { color:var(--text-secondary); text-decoration:none; font-size:0.85rem; font-weight:400; letter-spacing:0.04em; transition:color 0.3s; }
  .nav-links a:hover { color:var(--text-primary); }
  .nav-cta { background:var(--gold)!important; color:var(--bg-primary)!important; padding:0.6rem 1.4rem; border-radius:6px; font-weight:500!important; transition:transform 0.2s, box-shadow 0.3s!important; }
  .nav-cta:hover { transform:translateY(-1px); box-shadow:0 4px 20px var(--gold-glow); }

  /* BUTTONS */
  .btn-primary { display:inline-flex; align-items:center; gap:0.5rem; background:var(--gold); color:var(--bg-primary); padding:0.85rem 1.8rem; border-radius:6px; text-decoration:none; font-weight:500; font-size:0.9rem; letter-spacing:0.02em; transition:transform 0.2s, box-shadow 0.3s; border:none; cursor:pointer; font-family:var(--sans); }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 6px 30px var(--gold-glow); }
  .btn-primary svg { transition:transform 0.2s; }
  .btn-primary:hover svg { transform:translateX(3px); }
  .btn-secondary { display:inline-flex; align-items:center; gap:0.5rem; background:transparent; color:var(--text-primary); padding:0.85rem 1.8rem; border-radius:6px; text-decoration:none; font-weight:400; font-size:0.9rem; letter-spacing:0.02em; border:1px solid rgba(255,255,255,0.15); transition:border-color 0.3s, background 0.3s; cursor:pointer; font-family:var(--sans); }
  .btn-secondary:hover { border-color:rgba(255,255,255,0.3); background:rgba(255,255,255,0.04); }
  .arrow-svg { width:16px; height:16px; }

  /* HERO */
  .hero { position:relative; height:100vh; min-height:700px; display:flex; align-items:center; overflow:hidden; }
  .hero-bg { position:absolute; inset:0; background:url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80') center/cover no-repeat; transform:scale(1.1); transition:transform 8s ease-out; filter:brightness(0.35); }
  .hero.visible .hero-bg { transform:scale(1); }
  .hero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(11,12,15,0.3) 0%, rgba(11,12,15,0.1) 40%, rgba(11,12,15,0.7) 80%, rgba(11,12,15,1) 100%); }
  .hero-content { position:relative; z-index:2; padding:0 3rem; max-width:780px; margin-left:8%; }
  .hero-label { display:inline-flex; align-items:center; gap:0.5rem; color:var(--gold); font-size:0.8rem; font-weight:500; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:1.5rem; opacity:0; transform:translateY(20px); animation:fadeUp 0.8s 0.3s forwards; }
  .hero-label::before { content:''; width:28px; height:1px; background:var(--gold); }
  .hero h1 { font-family:var(--serif); font-size:clamp(2.8rem,5.5vw,4.2rem); line-height:1.12; font-weight:400; margin-bottom:1.5rem; opacity:0; transform:translateY(30px); animation:fadeUp 0.8s 0.5s forwards; }
  .hero h1 em { font-style:italic; color:var(--gold); }
  .hero-sub { font-size:1.05rem; color:var(--text-secondary); line-height:1.8; max-width:580px; margin-bottom:1rem; opacity:0; transform:translateY(30px); animation:fadeUp 0.8s 0.7s forwards; }
  .hero-context { font-size:0.88rem; color:var(--text-muted); line-height:1.7; max-width:580px; margin-bottom:2.5rem; opacity:0; transform:translateY(30px); animation:fadeUp 0.8s 0.85s forwards; }
  .hero-actions { display:flex; gap:1rem; flex-wrap:wrap; opacity:0; transform:translateY(30px); animation:fadeUp 0.8s 1s forwards; }
  .hero-scroll { position:absolute; bottom:2.5rem; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:0.5rem; opacity:0; animation:fadeUp 0.8s 1.2s forwards; z-index:2; }
  .hero-scroll span { font-size:0.7rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-muted); }
  .scroll-line { width:1px; height:40px; background:linear-gradient(to bottom, var(--gold), transparent); animation:scrollPulse 2s infinite; }
  @keyframes scrollPulse { 0%,100%{opacity:0.3;transform:scaleY(0.6)} 50%{opacity:1;transform:scaleY(1)} }
  @keyframes fadeUp { to{opacity:1;transform:translateY(0)} }

  /* LOGO MARQUEE */
  .logo-marquee { padding:2.5rem 0; border-bottom:1px solid var(--border); border-top:1px solid var(--border); overflow:hidden; position:relative; }
  .logo-marquee::before, .logo-marquee::after { content:''; position:absolute; top:0; bottom:0; width:120px; z-index:2; pointer-events:none; }
  .logo-marquee::before { left:0; background:linear-gradient(to right, var(--bg-primary), transparent); }
  .logo-marquee::after { right:0; background:linear-gradient(to left, var(--bg-primary), transparent); }
  .marquee-track { display:flex; align-items:center; gap:4rem; animation:marqueeScroll 30s linear infinite; width:max-content; }
  .marquee-track:hover { animation-play-state:paused; }
  .marquee-item { opacity:0.3; transition:opacity 0.3s; font-family:var(--sans); font-weight:600; font-size:0.9rem; letter-spacing:0.1em; color:var(--text-secondary); text-transform:uppercase; white-space:nowrap; flex-shrink:0; }
  .marquee-item:hover { opacity:0.7; }
  @keyframes marqueeScroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

  /* SECTIONS */
  section { padding:7rem 3rem; }
  .section-inner { max-width:var(--max-w); margin:0 auto; }
  .section-label { display:inline-flex; align-items:center; gap:0.5rem; color:var(--gold); font-size:0.75rem; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; margin-bottom:1.25rem; }
  .section-label::before { content:''; width:20px; height:1px; background:var(--gold); }
  .section-title { font-family:var(--serif); font-size:clamp(1.8rem,3.5vw,2.6rem); line-height:1.2; margin-bottom:1.25rem; max-width:700px; }
  .section-subtitle { color:var(--text-secondary); font-size:1rem; max-width:640px; line-height:1.8; }
  .centered { text-align:center; }
  .centered .section-title, .centered .section-subtitle { margin-left:auto; margin-right:auto; }

  /* SECTION 2: PROBLEM */
  .pain-section { background:var(--bg-secondary); }
  .pain-section .section-subtitle { margin-bottom:0.75rem; }
  .pain-supporting { color:var(--text-muted); font-size:0.95rem; font-style:italic; margin-top:0.5rem; max-width:640px; }
  .centered .pain-supporting { margin-left:auto; margin-right:auto; }

  /* SECTION 3: SOLUTION - 4 VALUE BLOCKS */
  .solution-section { background:var(--bg-primary); }
  .value-grid { display:grid; grid-template-columns:repeat(2, 1fr); gap:1.5rem; margin-top:3.5rem; }
  .value-card { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:2.5rem 2rem; transition:transform 0.3s, border-color 0.3s; position:relative; overflow:hidden; }
  .value-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(to right, var(--gold), transparent); opacity:0; transition:opacity 0.3s; }
  .value-card:hover { transform:translateY(-4px); border-color:rgba(201,168,76,0.15); }
  .value-card:hover::before { opacity:1; }
  .value-card h3 { font-family:var(--sans); font-size:1.15rem; font-weight:500; margin-bottom:0.75rem; color:var(--gold); }
  .value-card p { color:var(--text-secondary); font-size:0.9rem; line-height:1.75; }

  /* SECTION 4: EVENT TYPES */
  .events-section { background:var(--bg-secondary); }
  .event-types-grid { display:grid; grid-template-columns:repeat(1, 1fr); gap:1.25rem; margin-top:3.5rem; max-width:900px; margin-left:auto; margin-right:auto; }
  .event-type-card { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:2.25rem 2.5rem; transition:transform 0.3s, border-color 0.3s; }
  .event-type-card:hover { transform:translateY(-3px); border-color:rgba(201,168,76,0.12); }
  .event-type-card h3 { font-family:var(--sans); font-size:1.1rem; font-weight:500; margin-bottom:0.6rem; }
  .event-type-card p { color:var(--text-secondary); font-size:0.9rem; line-height:1.75; margin-bottom:0.75rem; }
  .event-type-tags { font-size:0.78rem; color:var(--gold); letter-spacing:0.04em; font-weight:400; }

  /* SECTION 5: SOCIAL CROSSOVER */
  .crossover-section { background:var(--bg-primary); }
  .crossover-layout { display:grid; grid-template-columns:1fr 1fr; gap:3.5rem; margin-top:3rem; align-items:start; }
  .crossover-text .section-subtitle { margin-bottom:1.25rem; }
  .crossover-includes { list-style:none; margin:1.5rem 0 2rem; }
  .crossover-includes li { padding:0.4rem 0; padding-left:1.5rem; position:relative; color:var(--text-secondary); font-size:0.9rem; }
  .crossover-includes li::before { content:''; position:absolute; left:0; top:0.85rem; width:8px; height:8px; border-radius:50%; background:var(--gold-dim); border:1.5px solid var(--gold); }
  .crossover-pairing { font-size:0.88rem; color:var(--text-muted); font-style:italic; margin-top:1rem; }
  .crossover-image { border-radius:12px; overflow:hidden; height:480px; }
  .crossover-image img { width:100%; height:100%; object-fit:cover; display:block; filter:brightness(0.9); transition:transform 0.5s; }
  .crossover-image:hover img { transform:scale(1.03); }

  /* GALLERY - LIGHT BG */
  .gallery-section { padding:5rem 3rem; background:var(--light-bg); }
  .gallery-section .section-label { color:#8B7D3C; }
  .gallery-section .section-label::before { background:#8B7D3C; }
  .gallery-section .section-title { color:var(--bg-primary); }
  .gallery-section .section-inner { max-width:1300px; }
  .gallery-grid { display:grid; grid-template-columns:repeat(4,1fr); grid-auto-rows:260px; gap:6px; margin-top:3rem; }
  .gallery-item { overflow:hidden; position:relative; border-radius:4px; }
  .gallery-item img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.6s cubic-bezier(0.25,0,0.25,1); filter:brightness(0.85); }
  .gallery-item:hover img { transform:scale(1.06); filter:brightness(1); }
  .gallery-item.tall { grid-row:span 2; }
  .gallery-item.wide { grid-column:span 2; }
  .gallery-overlay { position:absolute; bottom:0; left:0; right:0; padding:1.25rem; background:linear-gradient(to top, rgba(0,0,0,0.75), transparent); opacity:0; transition:opacity 0.3s; }
  .gallery-item:hover .gallery-overlay { opacity:1; }
  .gallery-overlay span { font-size:0.78rem; font-weight:500; letter-spacing:0.06em; color:white; }

  /* HORIZONTAL SCROLL */
  .hscroll-section { padding:5rem 0; background:var(--bg-secondary); overflow:hidden; }
  .hscroll-header { max-width:var(--max-w); margin:0 auto 2.5rem; padding:0 3rem; display:flex; justify-content:space-between; align-items:flex-end; }
  .hscroll-nav { display:flex; gap:0.5rem; }
  .hscroll-btn { width:44px; height:44px; border-radius:50%; border:1px solid rgba(255,255,255,0.15); background:transparent; color:var(--text-secondary); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:border-color 0.3s, color 0.3s, background 0.3s; }
  .hscroll-btn:hover { border-color:var(--gold); color:var(--gold); background:var(--gold-dim); }
  .hscroll-track-wrapper { padding:0 3rem; }
  .hscroll-track { display:flex; gap:16px; overflow-x:auto; scroll-behavior:smooth; scrollbar-width:none; padding-bottom:1rem; }
  .hscroll-track::-webkit-scrollbar { display:none; }
  .hscroll-card { flex:0 0 320px; height:420px; border-radius:10px; overflow:hidden; position:relative; cursor:pointer; }
  .hscroll-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s; filter:brightness(0.9); }
  .hscroll-card:hover img { transform:scale(1.04); filter:brightness(1); }
  .hscroll-card-overlay { position:absolute; bottom:0; left:0; right:0; padding:1.5rem; background:linear-gradient(to top, rgba(0,0,0,0.8), transparent); }
  .hscroll-card-overlay span { font-size:0.85rem; font-weight:500; color:white; }
  .hscroll-card-overlay small { display:block; font-size:0.75rem; color:rgba(255,255,255,0.6); margin-top:0.25rem; }

  /* PROCESS */
  .process-section { background:var(--bg-primary); }
  .process-steps { display:grid; grid-template-columns:repeat(3,1fr); gap:0; margin-top:3.5rem; position:relative; }
  .process-steps::before { content:''; position:absolute; top:38px; left:15%; right:15%; height:1px; background:linear-gradient(to right, transparent, var(--gold-dim), var(--gold), var(--gold-dim), transparent); }
  .process-step { text-align:center; padding:0 2rem; position:relative; }
  .step-number { width:76px; height:76px; border-radius:50%; background:var(--bg-card); border:2px solid var(--gold); display:flex; align-items:center; justify-content:center; margin:0 auto 1.5rem; position:relative; z-index:2; }
  .step-num-text { font-family:var(--sans); font-weight:600; font-size:1rem; color:var(--gold); letter-spacing:0.05em; }
  .process-step h3 { font-family:var(--sans); font-size:1.1rem; font-weight:500; margin-bottom:0.75rem; }
  .process-step p { color:var(--text-secondary); font-size:0.88rem; line-height:1.75; }

  /* DELIVERABLES */
  .deliverables-section { background:var(--bg-secondary); }
  .deliverables-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.25rem; margin-top:3.5rem; }
  .deliverable-card { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:2rem; display:flex; gap:1.25rem; align-items:flex-start; transition:transform 0.3s, border-color 0.3s; }
  .deliverable-card:hover { transform:translateY(-3px); border-color:rgba(201,168,76,0.12); }
  .deliverable-check { width:36px; height:36px; border-radius:8px; background:var(--gold-dim); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--gold); }
  .deliverable-card h3 { font-family:var(--sans); font-size:1.02rem; font-weight:500; margin-bottom:0.35rem; }
  .deliverable-card p { color:var(--text-secondary); font-size:0.86rem; line-height:1.7; }

  /* MULTI-DAY CALLOUT */
  .multiday-section { background:var(--bg-primary); padding:5rem 3rem; }
  .multiday-card { max-width:900px; margin:0 auto; background:var(--bg-card); border:1px solid var(--border); border-left:3px solid var(--gold); border-radius:0 12px 12px 0; padding:3rem 3rem; }
  .multiday-card .section-label { margin-bottom:1rem; }
  .multiday-card h2 { font-family:var(--serif); font-size:clamp(1.4rem,2.5vw,1.8rem); line-height:1.3; margin-bottom:1rem; }
  .multiday-card p { color:var(--text-secondary); font-size:0.92rem; line-height:1.8; margin-bottom:0.75rem; }
  .multiday-card .supporting { color:var(--text-muted); font-size:0.88rem; font-style:italic; }

  /* VIDEO BUNDLING */
  .video-section { background:var(--bg-secondary); }
  .video-options { display:grid; grid-template-columns:repeat(3,1fr); gap:1.25rem; margin-top:2.5rem; }
  .video-option { background:var(--bg-card); border:1px solid var(--border); border-radius:12px; padding:2rem; transition:transform 0.3s, border-color 0.3s; }
  .video-option:hover { transform:translateY(-3px); border-color:rgba(201,168,76,0.12); }
  .video-option h3 { font-family:var(--sans); font-size:1rem; font-weight:500; margin-bottom:0.6rem; color:var(--gold); }
  .video-option p { color:var(--text-secondary); font-size:0.88rem; line-height:1.75; margin-bottom:1rem; }
  .video-option a { color:var(--gold); font-size:0.85rem; text-decoration:none; font-weight:500; transition:opacity 0.3s; }
  .video-option a:hover { opacity:0.7; }
  .video-pairing { text-align:center; margin-top:2rem; color:var(--text-muted); font-size:0.9rem; font-style:italic; }

  /* TESTIMONIALS LIGHT */
  .testimonials-section { background:var(--light-bg); padding:6rem 3rem; overflow:hidden; }
  .testimonials-section .section-label { color:#8B7D3C; }
  .testimonials-section .section-label::before { background:#8B7D3C; }
  .testimonials-section .section-title { color:var(--bg-primary); }
  .testimonials-slider { position:relative; max-width:800px; margin:3rem auto 0; overflow:hidden; }
  .testimonials-track { display:flex; transition:transform 0.5s cubic-bezier(0.25,0,0.25,1); }
  .testimonial-slide { flex:0 0 100%; padding:0 1rem; }
  .testimonial-card-light { background:white; border-radius:16px; padding:3rem; box-shadow:0 2px 20px rgba(0,0,0,0.06); text-align:center; }
  .testimonial-quote-light { font-family:var(--serif); font-size:2.5rem; color:var(--gold); line-height:1; margin-bottom:1.25rem; opacity:0.5; }
  .testimonial-card-light blockquote { font-size:1.05rem; line-height:1.85; color:#3A3A3A; font-style:italic; margin-bottom:2rem; font-family:var(--sans); font-weight:300; }
  .testimonial-divider { width:40px; height:2px; background:var(--gold); margin:0 auto 1.5rem; border-radius:1px; }
  .testimonial-name-light { font-weight:500; font-size:0.95rem; color:var(--bg-primary); }
  .testimonial-role-light { font-size:0.82rem; color:var(--light-muted); }
  .slider-controls { display:flex; justify-content:center; align-items:center; gap:1.5rem; margin-top:2.5rem; }
  .slider-arrow { width:44px; height:44px; border-radius:50%; border:1px solid rgba(0,0,0,0.12); background:white; color:#333; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:border-color 0.3s, box-shadow 0.3s; }
  .slider-arrow:hover { border-color:var(--gold); box-shadow:0 2px 12px rgba(201,168,76,0.15); }
  .slider-dots { display:flex; gap:0.5rem; }
  .slider-dot { width:10px; height:10px; border-radius:50%; background:rgba(0,0,0,0.12); border:none; cursor:pointer; transition:background 0.3s, transform 0.3s; }
  .slider-dot.active { background:var(--gold); transform:scale(1.2); }

  /* FAQ */
  .faq-section { background:var(--bg-primary); }
  .faq-list { max-width:780px; margin:3rem auto 0; }
  .faq-item { border-bottom:1px solid var(--border); }
  .faq-question { display:flex; justify-content:space-between; align-items:center; padding:1.5rem 0; cursor:pointer; font-size:0.95rem; font-weight:400; color:var(--text-primary); background:none; border:none; width:100%; text-align:left; font-family:var(--sans); transition:color 0.3s; gap:1rem; }
  .faq-question:hover { color:var(--gold); }
  .faq-icon { width:24px; height:24px; color:var(--text-muted); transition:transform 0.3s, color 0.3s; flex-shrink:0; }
  .faq-item.open .faq-icon { transform:rotate(45deg); color:var(--gold); }
  .faq-answer { max-height:0; overflow:hidden; transition:max-height 0.5s ease; }
  .faq-item.open .faq-answer { max-height:400px; }
  .faq-answer-inner { padding-bottom:1.5rem; }
  .faq-answer p { color:var(--text-secondary); font-size:0.9rem; line-height:1.8; }
  .faq-answer a { color:var(--gold); text-decoration:none; }
  .faq-answer a:hover { text-decoration:underline; }

  /* FINAL CTA */
  .final-cta { background:var(--bg-secondary); padding:6rem 3rem; text-align:center; position:relative; overflow:hidden; }
  .final-cta::before { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%); width:600px; height:600px; background:radial-gradient(circle, var(--gold-dim) 0%, transparent 70%); opacity:0.4; pointer-events:none; }
  .final-cta .micro-tag { font-size:0.75rem; color:var(--text-muted); letter-spacing:0.1em; margin-bottom:1.5rem; position:relative; }
  .final-cta .section-title { max-width:550px; margin:0 auto 1rem; position:relative; }
  .final-cta .section-subtitle { margin:0 auto 2.5rem; position:relative; }
  .final-cta-actions { display:flex; justify-content:center; gap:1rem; flex-wrap:wrap; position:relative; }

  /* SCROLL ANIMATIONS */
  .reveal { opacity:0; transform:translateY(40px); transition:opacity 0.7s cubic-bezier(0.25,0,0.25,1), transform 0.7s cubic-bezier(0.25,0,0.25,1); }
  .reveal.visible { opacity:1; transform:translateY(0); }
  .reveal-delay-1 { transition-delay:0.1s; }
  .reveal-delay-2 { transition-delay:0.2s; }
  .reveal-delay-3 { transition-delay:0.3s; }
  .reveal-delay-4 { transition-delay:0.4s; }
  .reveal-delay-5 { transition-delay:0.5s; }
  .reveal-scale { opacity:0; transform:scale(0.95); transition:opacity 0.6s, transform 0.6s cubic-bezier(0.25,0,0.25,1); }
  .reveal-scale.visible { opacity:1; transform:scale(1); }

  /* FOOTER */
  footer { padding:4rem 3rem 2rem; border-top:1px solid var(--border); background:var(--bg-primary); }
  .footer-inner { max-width:var(--max-w); margin:0 auto; display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr; gap:3rem; }
  .footer-brand p { color:var(--text-secondary); font-size:0.85rem; margin-top:1rem; line-height:1.7; max-width:280px; }
  .footer-col h4 { font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-muted); margin-bottom:1rem; }
  .footer-col a { display:block; color:var(--text-secondary); text-decoration:none; font-size:0.88rem; padding:0.3rem 0; transition:color 0.3s; }
  .footer-col a:hover { color:var(--text-primary); }
  .footer-bottom { max-width:var(--max-w); margin:3rem auto 0; padding-top:2rem; border-top:1px solid var(--border); display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); }
  .footer-bottom a { color:var(--text-muted); text-decoration:none; }

  /* RESPONSIVE */
  @media (max-width:900px) {
    section { padding:5rem 1.5rem; }
    nav { padding:1rem 1.5rem; }
    .hero-content { margin-left:0; padding:0 1.5rem; }
    .value-grid, .process-steps, .video-options { grid-template-columns:1fr; }
    .deliverables-grid { grid-template-columns:1fr; }
    .gallery-grid { grid-template-columns:repeat(2,1fr); grid-auto-rows:200px; }
    .gallery-item.tall { grid-row:span 2; }
    .gallery-item.wide { grid-column:span 2; }
    .process-steps::before { display:none; }
    .crossover-layout { grid-template-columns:1fr; }
    .crossover-image { height:300px; }
    .footer-inner { grid-template-columns:1fr 1fr; }
    .nav-links { display:none; }
    .hscroll-card { flex:0 0 260px; height:340px; }
    .hscroll-header { flex-direction:column; align-items:flex-start; gap:1rem; }
    .multiday-card { padding:2rem; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav id="nav">
  <a href="/" class="nav-logo">JHR <span>Photography</span></a>
  <ul class="nav-links">
    <li><a href="/">Home</a></li>
    <li><a href="/services">Services</a></li>
    <li><a href="/venues">Venues</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/blog">Nashville Insider</a></li>
    <li><a href="/faqs">FAQs</a></li>
    <li><a href="/schedule" class="nav-cta">Schedule a Strategy Call</a></li>
  </ul>
</nav>

<!-- SECTION 1: HERO -->
<section class="hero" id="hero">
  <div class="hero-bg"></div>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="hero-label">Corporate Event Coverage™</div>
    <h1>Your Event Took Months to Plan. The Media Should <em>Prove It.</em></h1>
    <p class="hero-sub">When your organization invests in bringing people together — for a conference, an annual meeting, a leadership retreat, or a training summit — the media should capture more than what happened. It should capture why it mattered. We help internal teams and event owners deliver professional, on-brand documentation that serves your organization long after the last session ends.</p>
    <p class="hero-context">Photography and media coverage for conferences, off-sites, association events, training programs, and corporate milestones — executed by certified, Nashville-based operators who understand executive audiences and organizational standards.</p>
    <div class="hero-actions">
      <a href="/schedule" class="btn-primary">Talk With Our Team <svg class="arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
      <a href="/contact" class="btn-secondary">Check Availability</a>
    </div>
  </div>
  <div class="hero-scroll"><span>Scroll</span><div class="scroll-line"></div></div>
</section>

<!-- LOGO MARQUEE -->
<div class="logo-marquee">
  <div class="marquee-track">
    <div class="marquee-item">Nissan</div><div class="marquee-item">Bridgestone</div><div class="marquee-item">HCA Healthcare</div><div class="marquee-item">Deloitte</div><div class="marquee-item">Vanderbilt</div><div class="marquee-item">Asurion</div><div class="marquee-item">Amazon</div><div class="marquee-item">Nashville Convention Bureau</div><div class="marquee-item">Pinnacle Financial</div><div class="marquee-item">Ingram Industries</div>
    <div class="marquee-item">Nissan</div><div class="marquee-item">Bridgestone</div><div class="marquee-item">HCA Healthcare</div><div class="marquee-item">Deloitte</div><div class="marquee-item">Vanderbilt</div><div class="marquee-item">Asurion</div><div class="marquee-item">Amazon</div><div class="marquee-item">Nashville Convention Bureau</div><div class="marquee-item">Pinnacle Financial</div><div class="marquee-item">Ingram Industries</div>
  </div>
</div>

<!-- SECTION 2: THE PROBLEM -->
<section class="pain-section">
  <div class="section-inner centered">
    <div class="section-label reveal">The Real Cost</div>
    <h2 class="section-title reveal reveal-delay-1">Months of Work Shouldn't Vanish When the Lights Go Down</h2>
    <p class="section-subtitle reveal reveal-delay-2">You coordinated the speakers, managed the budget, aligned the stakeholders, and made sure every detail landed. But without intentional media coverage, a three-day conference becomes a memory instead of an asset. The photos end up in a folder no one opens. The keynote moments go undocumented. The content your marketing and recruiting teams could have used for the next twelve months never gets captured.</p>
    <p class="pain-supporting reveal reveal-delay-3">The event happened. But without the right media, the value of the event stays in the room.</p>
  </div>
</section>

<!-- SECTION 3: THE SOLUTION -->
<section class="solution-section">
  <div class="section-inner centered">
    <div class="section-label reveal">What We Deliver</div>
    <h2 class="section-title reveal reveal-delay-1">A Professional Media Library From a Single Event</h2>
    <p class="section-subtitle reveal reveal-delay-2">Corporate Event Coverage isn't just "having a photographer there." It's intentional documentation designed to produce assets your organization can use across marketing, recruiting, internal communications, and stakeholder reporting — all year long.</p>
    <div class="value-grid">
      <div class="value-card reveal reveal-delay-1">
        <h3>The Big Stage</h3>
        <p>General sessions, keynote speakers, panel discussions, and main stage programming. We document the moments your attendees came for — and the ones your leadership team wants to see reflected in every piece of content that follows.</p>
      </div>
      <div class="value-card reveal reveal-delay-2">
        <h3>The Breakout Rooms</h3>
        <p>Workshops, training sessions, certification programs, and smaller group programming. These are the rooms where real engagement happens, and they're often the most underdocumented part of any event. We cover them because we know they matter to your stakeholders.</p>
      </div>
      <div class="value-card reveal reveal-delay-3">
        <h3>The In-Between</h3>
        <p>Hallway conversations, registration energy, attendee interactions, sponsor moments, and the unscripted connections that make an event feel alive. This is where the culture of your organization shows — and where your best social and recruiting content comes from.</p>
      </div>
      <div class="value-card reveal reveal-delay-4">
        <h3>The Branded Details</h3>
        <p>Signage, stage design, sponsor recognition, environmental branding, and the visual details your team spent weeks building. These images serve your sponsors, your partners, and your internal reporting — proof that the investment showed up in the room.</p>
      </div>
    </div>
  </div>
</section>

<!-- GALLERY - LIGHT BG -->
<section class="gallery-section">
  <div class="section-inner centered">
    <div class="section-label reveal">Our Work</div>
    <h2 class="section-title reveal reveal-delay-1">Coverage That Tells the Full Story</h2>
    <div class="gallery-grid">
      <div class="gallery-item tall reveal-scale"><img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80" alt="Keynote speaker" loading="lazy"><div class="gallery-overlay"><span>Keynote Sessions</span></div></div>
      <div class="gallery-item reveal-scale reveal-delay-1"><img src="https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80" alt="Conference networking" loading="lazy"><div class="gallery-overlay"><span>Networking</span></div></div>
      <div class="gallery-item reveal-scale reveal-delay-2"><img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80" alt="Panel discussion" loading="lazy"><div class="gallery-overlay"><span>Panels</span></div></div>
      <div class="gallery-item reveal-scale reveal-delay-3"><img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80" alt="Main stage" loading="lazy"><div class="gallery-overlay"><span>Main Stage</span></div></div>
      <div class="gallery-item wide reveal-scale reveal-delay-2"><img src="https://images.unsplash.com/photo-1560439514-4e9645039924?w=1200&q=80" alt="Breakout session" loading="lazy"><div class="gallery-overlay"><span>Breakout Sessions</span></div></div>
      <div class="gallery-item reveal-scale reveal-delay-3"><img src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80" alt="Candid moment" loading="lazy"><div class="gallery-overlay"><span>Candid Moments</span></div></div>
    </div>
  </div>
</section>

<!-- SECTION 4: EVENT TYPES -->
<section class="events-section">
  <div class="section-inner centered">
    <div class="section-label reveal">Events We Cover</div>
    <h2 class="section-title reveal reveal-delay-1">Built for the Events That Define Your Organization</h2>
    <p class="section-subtitle reveal reveal-delay-2">Every organization brings people together differently. Here's how we support the events that matter most to yours.</p>
    <div class="event-types-grid">
      <div class="event-type-card reveal reveal-delay-1">
        <h3>Annual Conferences & Association Events</h3>
        <p>Your annual meeting is the one event your members, employees, or stakeholders judge your organization by. We capture the keynotes, the awards, the networking, and the energy — delivering a media library that supports member communications, marketing, and leadership reporting for the year ahead.</p>
        <div class="event-type-tags">Associations · Professional organizations · Member-driven nonprofits · Industry groups</div>
      </div>
      <div class="event-type-card reveal reveal-delay-2">
        <h3>Leadership Off-Sites & Retreats</h3>
        <p>Smaller audiences, higher stakes. These events produce the strategic conversations and team-building moments your leadership team wants documented — but documented carefully. We understand executive audiences and the discretion that comes with working in those rooms.</p>
        <div class="event-type-tags">C-suite retreats · Board meetings · Strategic planning sessions · Leadership development</div>
      </div>
      <div class="event-type-card reveal reveal-delay-3">
        <h3>Training & Certification Programs</h3>
        <p>When your organization invests in developing its people, the media should reflect that investment. We document the sessions, the instructors, the participants, and the moments of engagement — content your HR and L&D teams can use for recruiting, internal promotion, and stakeholder reporting.</p>
        <div class="event-type-tags">Corporate training summits · Certification programs · Professional development · Continuing education</div>
      </div>
      <div class="event-type-card reveal reveal-delay-4">
        <h3>Milestones, Awards & Recognition Events</h3>
        <p>Company anniversaries, award ceremonies, employee recognition programs, and milestone celebrations. These events tell your organization's story — and the media should match the significance. We capture the formality and the joy with equal care.</p>
        <div class="event-type-tags">Award galas · Anniversary celebrations · Employee recognition · Company milestones</div>
      </div>
      <div class="event-type-card reveal reveal-delay-5">
        <h3>Multi-Day Conventions & Summits</h3>
        <p>Multi-day events require a different approach — consistent documentation across the full arc of the program, not just a single day of highlights. We maintain coverage quality and energy from opening session to closing remarks, delivering a unified gallery that tells the complete story.</p>
        <div class="event-type-tags">Industry conventions · Multi-day summits · Annual meetings with extended programming</div>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 5: SOCIAL & NETWORKING CROSSOVER -->
<section class="crossover-section">
  <div class="section-inner">
    <div class="crossover-layout">
      <div class="crossover-text">
        <div class="section-label reveal">After Hours</div>
        <h2 class="section-title reveal reveal-delay-1">Your Event Doesn't Stop When the Sessions End</h2>
        <p class="section-subtitle reveal reveal-delay-2">Most corporate events include a social component — a welcome reception, a networking dinner, a happy hour, a closing celebration. These moments produce some of the most shareable, authentic content of the entire program. But they require a different approach than daytime session coverage.</p>
        <p class="section-subtitle reveal reveal-delay-2" style="margin-top:1rem;">Our Social & Networking Media Package™ is designed specifically for these high-energy, fast-moving environments. We capture the candid interactions, the group photos, the venue atmosphere, and the brand moments — then deliver same-day highlights and ready-to-post social content so your marketing team can share while the event is still trending.</p>
        <ul class="crossover-includes reveal reveal-delay-3">
          <li>Up to 3 hours of dedicated social event coverage</li>
          <li>Same-day highlight delivery (5–10 images for immediate posting)</li>
          <li>2 Instagram Reels (rapid-produced video/photo compilations)</li>
          <li>24-hour full gallery delivery</li>
          <li>Designed for social media and marketing collateral — not just documentation</li>
        </ul>
        <a href="/services/social-networking-media" class="btn-primary reveal reveal-delay-4">Learn More About Social & Networking Media <svg class="arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
        <p class="crossover-pairing reveal reveal-delay-4">Or ask about bundling it with your event coverage — most multi-day events include both.</p>
      </div>
      <div class="crossover-image reveal-scale reveal-delay-2">
        <img src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80" alt="Networking reception at corporate event" loading="lazy">
      </div>
    </div>
  </div>
</section>

<!-- HORIZONTAL SCROLL GALLERY -->
<div class="hscroll-section">
  <div class="hscroll-header">
    <div>
      <div class="section-label reveal">Event Highlights</div>
      <h2 class="section-title reveal reveal-delay-1" style="margin-bottom:0;">Moments That Define the Experience</h2>
    </div>
    <div class="hscroll-nav reveal reveal-delay-2">
      <button class="hscroll-btn" onclick="scrollGallery(-1)" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
      <button class="hscroll-btn" onclick="scrollGallery(1)" aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
    </div>
  </div>
  <div class="hscroll-track-wrapper">
    <div class="hscroll-track" id="hscrollTrack">
      <div class="hscroll-card"><img src="https://images.unsplash.com/photo-1559223607-a43c990c692c?w=640&q=80" alt="Speaker on stage" loading="lazy"><div class="hscroll-card-overlay"><span>Keynote Address</span><small>Annual Leadership Summit</small></div></div>
      <div class="hscroll-card"><img src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=640&q=80" alt="Team group photo" loading="lazy"><div class="hscroll-card-overlay"><span>Team Recognition</span><small>Awards Gala</small></div></div>
      <div class="hscroll-card"><img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=640&q=80" alt="Audience engaged" loading="lazy"><div class="hscroll-card-overlay"><span>Audience Engagement</span><small>National Conference</small></div></div>
      <div class="hscroll-card"><img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=640&q=80" alt="Networking" loading="lazy"><div class="hscroll-card-overlay"><span>Executive Networking</span><small>Industry Reception</small></div></div>
      <div class="hscroll-card"><img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&q=80" alt="Conference wide shot" loading="lazy"><div class="hscroll-card-overlay"><span>Venue Coverage</span><small>Music City Center</small></div></div>
      <div class="hscroll-card"><img src="https://images.unsplash.com/photo-1587825140708-dfaf18c4f4d4?w=640&q=80" alt="Award ceremony" loading="lazy"><div class="hscroll-card-overlay"><span>Award Presentation</span><small>Corporate Gala</small></div></div>
      <div class="hscroll-card"><img src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=640&q=80" alt="Breakout session" loading="lazy"><div class="hscroll-card-overlay"><span>Breakout Sessions</span><small>Training Workshop</small></div></div>
      <div class="hscroll-card"><img src="https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=640&q=80" alt="Sponsor activation" loading="lazy"><div class="hscroll-card-overlay"><span>Sponsor Activation</span><small>Trade Show</small></div></div>
    </div>
  </div>
</div>

<!-- SECTION 6: PROCESS -->
<section class="process-section">
  <div class="section-inner centered">
    <div class="section-label reveal">How It Works</div>
    <h2 class="section-title reveal reveal-delay-1">A Clear Process From Planning to Delivery</h2>
    <p class="section-subtitle reveal reveal-delay-2">We've covered hundreds of corporate events in Nashville. The process is simple because it's been refined through repetition.</p>
    <div class="process-steps">
      <div class="process-step reveal reveal-delay-1">
        <div class="step-number"><span class="step-num-text">01</span></div>
        <h3>We Align on What Matters</h3>
        <p>A focused conversation about your event — the programming, the stakeholders, the moments that matter most, and how the media will be used afterward. We build our coverage plan around your priorities, not a generic shot list.</p>
      </div>
      <div class="process-step reveal reveal-delay-2">
        <div class="step-number"><span class="step-num-text">02</span></div>
        <h3>We Deploy and Execute</h3>
        <p>Our certified operators arrive prepared — familiar with the venue, aligned to your brand standards, and ready to integrate into your event flow. You won't need to direct us. We know what to capture and when.</p>
      </div>
      <div class="process-step reveal reveal-delay-3">
        <div class="step-number"><span class="step-num-text">03</span></div>
        <h3>You Receive a Curated Gallery</h3>
        <p>A professionally curated gallery delivered within 72 hours — organized, retouched, and ready for your marketing team, your sponsors, your internal comms, and your leadership. Same-day highlights available for immediate social posting.</p>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 7: DELIVERABLES -->
<section class="deliverables-section">
  <div class="section-inner centered">
    <div class="section-label reveal">What's Included</div>
    <h2 class="section-title reveal reveal-delay-1">Complete Coverage. Professional Delivery. No Gaps.</h2>
    <p class="section-subtitle reveal reveal-delay-2">Every Corporate Event Coverage engagement is designed to capture the full story of your event — not just the highlights. Here's what your organization receives.</p>
    <div class="deliverables-grid">
      <div class="deliverable-card reveal reveal-delay-1"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Certified Operator, Full Day</h3><p>A JHR certified operator deployed for the full duration of your event. Trained, vetted, and experienced with Nashville's top corporate venues.</p></div></div>
      <div class="deliverable-card reveal reveal-delay-2"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Keynote & General Session Coverage</h3><p>Main stage programming documented with attention to speaker moments, audience engagement, and environmental context.</p></div></div>
      <div class="deliverable-card reveal reveal-delay-3"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Breakout & Workshop Coverage</h3><p>Smaller sessions captured with the same professionalism as the main stage. We rotate through your programming to ensure full representation.</p></div></div>
      <div class="deliverable-card reveal reveal-delay-4"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Networking & Candid Documentation</h3><p>The hallway conversations, the registration energy, the coffee break connections. These moments produce some of your most valuable content.</p></div></div>
      <div class="deliverable-card reveal reveal-delay-1"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Sponsor & Brand Imaging</h3><p>Signage, branding, sponsor activations, and exhibitor presence documented for partner reporting and stakeholder communications.</p></div></div>
      <div class="deliverable-card reveal reveal-delay-2"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Same-Day Highlights</h3><p>5–10 curated images delivered the same day for immediate social media posting and real-time event promotion.</p></div></div>
      <div class="deliverable-card reveal reveal-delay-3"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Curated Gallery — 72-Hour Delivery</h3><p>Your full event gallery, professionally curated and retouched, delivered within 72 hours of event completion.</p></div></div>
      <div class="deliverable-card reveal reveal-delay-4"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Full Commercial License</h3><p>Every image delivered with a Standard Commercial License covering website, social media, internal communications, recruiting, and partner sharing.</p></div></div>
      <div class="deliverable-card reveal reveal-delay-1" style="grid-column:1/-1;max-width:600px;margin:0 auto;"><div class="deliverable-check"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div><div><h3>Final Frame Guarantee™</h3><p>Every delivered image meets JHR's professional quality standard. If it doesn't meet the mark, we make it right.</p></div></div>
    </div>
  </div>
</section>

<!-- SECTION 8: MULTI-DAY CALLOUT -->
<div class="multiday-section">
  <div class="multiday-card reveal">
    <div class="section-label">Scaled for Your Program</div>
    <h2>Multi-Day Events and Concurrent Sessions? We've Done This Before.</h2>
    <p>If your event spans multiple days, runs concurrent breakout sessions, or requires coverage across different venue spaces, we scale to match. Additional operators deploy seamlessly — coordinated through a single JHR team, delivering a unified gallery that covers the full scope of your program.</p>
    <p>You don't manage multiple vendors. You don't brief separate photographers. You talk to one team, and the coverage matches the complexity of your event.</p>
    <p class="supporting">We'll discuss your event's format during our planning conversation and recommend the right operator count and coverage structure based on your programming.</p>
  </div>
</div>

<!-- SECTION 9: VIDEO BUNDLING -->
<section class="video-section">
  <div class="section-inner centered">
    <div class="section-label reveal">Complete Your Media</div>
    <h2 class="section-title reveal reveal-delay-1">Photography + Video. One Team. One Coordinated Delivery.</h2>
    <p class="section-subtitle reveal reveal-delay-2">Most corporate events benefit from more than photography alone. When you add an Event Video System — whether it's a highlight reel, attendee testimonials, or executive leadership messaging — you get a complete media library from one coordinated team. No separate video vendor. No conflicting timelines. No double-briefing.</p>
    <div class="video-options">
      <div class="video-option reveal reveal-delay-1">
        <h3>Event Highlight System™</h3>
        <p>A professionally edited 2-minute video capturing the energy and story of your event. Ideal for post-event marketing, social media, and member communications.</p>
        <a href="/services/event-video-systems">→ Learn about Event Video Systems</a>
      </div>
      <div class="video-option reveal reveal-delay-2">
        <h3>Event Highlight + Vox System™</h3>
        <p>Everything in the Highlight System plus up to 4 on-site attendee or speaker interviews. Adds authentic voices to your event story.</p>
        <a href="/services/event-video-systems">→ Learn about Event Video Systems</a>
      </div>
      <div class="video-option reveal reveal-delay-3">
        <h3>Executive Story System™</h3>
        <p>Dedicated multi-camera interview production for leadership messaging, recruiting content, and brand storytelling. Evergreen content your organization can use for 12–18 months.</p>
        <a href="/services/event-video-systems">→ Learn about Event Video Systems</a>
      </div>
    </div>
    <p class="video-pairing reveal reveal-delay-4">Ask about bundling photography and video for your event — most multi-day programs include both.</p>
  </div>
</section>

<!-- SECTION 10: TESTIMONIALS -->
<section class="testimonials-section">
  <div class="section-inner centered">
    <div class="section-label reveal">From the Teams We've Worked With</div>
    <h2 class="section-title reveal reveal-delay-1">The Media Matched the Event</h2>
    <div class="testimonials-slider reveal reveal-delay-2">
      <div class="testimonials-track" id="testimonialTrack">
        <div class="testimonial-slide">
          <div class="testimonial-card-light">
            <div class="testimonial-quote-light">"</div>
            <blockquote>"JHR covered our three-day annual conference and delivered a gallery our marketing team has used every month since. That's never happened with a photographer before."</blockquote>
            <div class="testimonial-divider"></div>
            <div class="testimonial-name-light">Conference Director</div>
            <div class="testimonial-role-light">National Association</div>
          </div>
        </div>
        <div class="testimonial-slide">
          <div class="testimonial-card-light">
            <div class="testimonial-quote-light">"</div>
            <blockquote>"They operated like part of our team. No direction needed, no missed moments. Our sponsors were thrilled with the documentation they received."</blockquote>
            <div class="testimonial-divider"></div>
            <div class="testimonial-name-light">Event Manager</div>
            <div class="testimonial-role-light">Enterprise Marketing</div>
          </div>
        </div>
        <div class="testimonial-slide">
          <div class="testimonial-card-light">
            <div class="testimonial-quote-light">"</div>
            <blockquote>"The media supported our member engagement all year. Sponsors saw their visibility documented professionally, and our board finally had content that reflected the scale of what we produce."</blockquote>
            <div class="testimonial-divider"></div>
            <div class="testimonial-name-light">Executive Director</div>
            <div class="testimonial-role-light">Industry Association</div>
          </div>
        </div>
      </div>
      <div class="slider-controls">
        <button class="slider-arrow" onclick="slideTestimonial(-1)" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
        <div class="slider-dots" id="sliderDots"><button class="slider-dot active" onclick="goToSlide(0)"></button><button class="slider-dot" onclick="goToSlide(1)"></button><button class="slider-dot" onclick="goToSlide(2)"></button></div>
        <button class="slider-arrow" onclick="slideTestimonial(1)" aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 11: FAQ -->
<section class="faq-section">
  <div class="section-inner centered">
    <div class="section-label reveal">Common Questions</div>
    <h2 class="section-title reveal reveal-delay-1">Corporate Event Coverage FAQs</h2>
    <div class="faq-list">

      <div class="faq-item reveal reveal-delay-1"><button class="faq-question" onclick="toggleFaq(this)">What's the difference between Corporate Event Coverage and Trade-Show Media Services?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>Corporate Event Coverage is designed for events where your organization is the host — conferences, annual meetings, leadership retreats, training summits, and association events. The focus is on your programming, your speakers, your attendees, and your organizational brand. Trade-Show Media Services is designed for exhibitor environments where the focus is on booth coverage, sponsor documentation, and show floor energy. If you're hosting the event, Corporate Event Coverage is the right fit. If you're exhibiting at someone else's event, <a href="/services/trade-show-media">Trade-Show Media Services</a> is built for that. We can also help if you're doing both at the same event.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-1"><button class="faq-question" onclick="toggleFaq(this)">We have breakout sessions running at the same time. Can you cover all of them?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>Yes. For events with concurrent programming, we deploy additional operators so sessions happening simultaneously all receive professional coverage. We'll discuss your schedule during planning and recommend the right number of operators. You'll receive a single unified gallery — not separate deliveries from separate photographers.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-2"><button class="faq-question" onclick="toggleFaq(this)">How do you decide what to cover during a full-day event?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>We build a coverage plan based on your priorities during our alignment conversation. We ask about the moments that matter most to your stakeholders — the keynote speakers, the CEO address, the breakout content, the sponsor activations, the networking interactions. We don't need a shot list from you — we need to understand what success looks like for your organization.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-2"><button class="faq-question" onclick="toggleFaq(this)">Our event includes a networking reception and a social dinner. Is that covered?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>It can be. If your event includes social functions — welcome receptions, happy hours, dinners, award galas — we offer our <a href="/services/social-networking-media">Social & Networking Media Package™</a> specifically designed for those environments. It's a different format than daytime session coverage: faster pace, social-first content, same-day highlights, and ready-to-post reels. Most multi-day events bundle it with Corporate Event Coverage so the full program is documented by one team.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-3"><button class="faq-question" onclick="toggleFaq(this)">How quickly do we receive our photos?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>Same-day highlights — 5 to 10 curated images — are delivered during or immediately after each day's programming for real-time social media posting. Your full curated gallery is delivered within 72 hours of event completion. For multi-day events, we can deliver day-by-day galleries if your marketing team needs assets rolling out during the event.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-3"><button class="faq-question" onclick="toggleFaq(this)">Can we use the photos for our website, social media, and marketing materials?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>Yes. Every Corporate Event Coverage engagement includes a Standard Commercial License that covers your owned media — website, social channels, internal presentations, member communications, recruiting materials, and sponsor or partner sharing. If you need extended rights for broadcast or paid advertising, we can discuss Extended Licensing.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-4"><button class="faq-question" onclick="toggleFaq(this)">Do you understand executive audiences? Our leadership team will be front and center.<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>We do — and this is one of the reasons organizations choose JHR over general event photographers. Our operators are trained to work in executive environments with discretion, professionalism, and awareness of how leadership wants to be represented. If your event includes dedicated executive headshots, those are handled through our <a href="/services/corporate-headshot-program">Executive Imaging™</a> service, which can be bundled with event coverage.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-4"><button class="faq-question" onclick="toggleFaq(this)">We're an association with annual events. Can you handle recurring coverage year over year?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>Yes, and this is where a long-term partnership creates real value. When we cover your event year after year, we already know the venue, the programming rhythm, the stakeholders, and the brand standards. There's no ramp-up. Your second year with JHR is smoother than the first, and it keeps getting better.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-5"><button class="faq-question" onclick="toggleFaq(this)">Can you also capture video at our event?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>Yes. We offer several <a href="/services/event-video-systems">Event Video Systems™</a> that pair directly with photography coverage — including highlight reels, attendee testimonials, and dedicated executive interview production. When bundled, photography and video are coordinated by a single team with a unified delivery timeline.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-5"><button class="faq-question" onclick="toggleFaq(this)">What Nashville venues do you work in?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>We've covered corporate events at virtually every major Nashville venue — including <a href="/venues/gaylord-opryland">Gaylord Opryland</a>, <a href="/venues/music-city-center">Music City Center</a>, <a href="/venues/renaissance-hotel-nashville">Renaissance Nashville</a>, the JW Marriott, the Grand Hyatt, the Omni, Loews Vanderbilt, and dozens of others. We know the layouts, the lighting conditions, the load-in logistics, and the staff.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-5"><button class="faq-question" onclick="toggleFaq(this)">How far in advance should we book event coverage?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>For major conferences and multi-day events, we recommend 6–8 weeks minimum. For single-day events, 3–4 weeks is usually sufficient. Nashville's convention calendar fills up fast — especially during peak season (spring and fall) — so earlier is always better. Reach out even if your timeline is tight. We'll be direct about whether we can support it.</p></div></div></div>

      <div class="faq-item reveal reveal-delay-5"><button class="faq-question" onclick="toggleFaq(this)">Do we need to provide a detailed shot list?<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="faq-answer"><div class="faq-answer-inner"><p>No. We don't work from prescriptive shot lists — we work from a shared understanding of your priorities and stakeholders. During our alignment conversation, we'll learn what matters most and build our coverage plan around that. Our operators are trained to recognize and capture the moments that serve your brand. That said, if there are specific must-capture moments, we absolutely want to know about them in advance.</p></div></div></div>

    </div>
  </div>
</section>

<!-- SECTION 12: FINAL CTA -->
<section class="final-cta">
  <p class="micro-tag reveal">Corporate Event Coverage™ — Nashville conference and event media</p>
  <h2 class="section-title reveal reveal-delay-1">Your Organization's Next Event Deserves Media That Lasts.</h2>
  <p class="section-subtitle reveal reveal-delay-2">Tell us about your event — the venue, the timeline, and what your team needs from the media. We'll show you exactly how we support it and give you a clear picture of what to expect.</p>
  <div class="final-cta-actions reveal reveal-delay-3">
    <a href="/schedule" class="btn-primary">Talk With Our Team <svg class="arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
    <a href="/contact" class="btn-secondary">Check Availability</a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="/" class="nav-logo">JHR <span>Photography</span></a>
      <p>Nashville's trusted partner for corporate event photography, headshot activations, and conference media coverage. Agency-grade execution. Zero friction.</p>
    </div>
    <div class="footer-col">
      <h4>Services</h4>
      <a href="/services/headshot-activation">Headshot Activation</a>
      <a href="/services/corporate-event-coverage">Corporate Event Coverage</a>
      <a href="/services/corporate-headshot-program">Corporate Headshot Program</a>
      <a href="/services/event-video-systems">Event Video Systems</a>
      <a href="/services/social-networking-media">Social & Networking Media</a>
    </div>
    <div class="footer-col">
      <h4>Venues</h4>
      <a href="/venues/music-city-center">Music City Center</a>
      <a href="/venues/gaylord-opryland">Gaylord Opryland</a>
      <a href="/venues/renaissance-hotel-nashville">Renaissance Hotel</a>
      <a href="/venues">All Venues</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="/about">About</a>
      <a href="/blog">Nashville Insider</a>
      <a href="/faqs">FAQs</a>
      <a href="/contact">Contact</a>
      <a href="/schedule">Schedule a Call</a>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 JHR Photography. All rights reserved.</span>
    <span><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a></span>
  </div>
</footer>

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));
  window.addEventListener('load', () => document.querySelector('.hero').classList.add('visible'));
  window.addEventListener('scroll', () => { document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60); });

  function toggleFaq(btn) {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  }

  function scrollGallery(dir) {
    document.getElementById('hscrollTrack').scrollBy({ left: dir * 340, behavior: 'smooth' });
  }

  let currentSlide = 0;
  const totalSlides = 3;
  function slideTestimonial(dir) { currentSlide = (currentSlide + dir + totalSlides) % totalSlides; updateSlider(); }
  function goToSlide(i) { currentSlide = i; updateSlider(); }
  function updateSlider() {
    document.getElementById('testimonialTrack').style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }
  setInterval(() => slideTestimonial(1), 6000);
</script>
</body>
</html>