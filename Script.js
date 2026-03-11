const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, input, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform   = 'translate(-50%, -50%) scale(1.8)';
        cursorRing.style.opacity = '0.2';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform   = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.opacity = '0.5';
      });
    });

     const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));

    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector('.skill-bar-fill');
          if (bar) bar.style.width = bar.dataset.width + '%';
          barObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.skill-card').forEach(c => barObs.observe(c));

    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
      navLinks.forEach(a => { a.style.color = a.href.includes(current) ? 'var(--ink)' : ''; });
    }, { passive: true });

    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.textContent);
        const suffix = el.textContent.replace(/\d/g, '');
        let current  = 0;
        const step   = Math.ceil(target / 30);
        const timer  = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 40);
        countObs.unobserve(el);
      });
    }, { threshold: 0.8 });
    document.querySelectorAll('.stat-num').forEach(el => countObs.observe(el));

    emailjs.init('bVNltusSPa3-UoPEu');

    function handleSubmit(e) {
      e.preventDefault();
      const form    = e.target;
      const btn     = form.querySelector('.form-submit');
      const success = document.getElementById('formSuccess');
      const errBox  = document.getElementById('formError');

      errBox.style.display  = 'none';
      success.style.display = 'none';
      btn.disabled  = true;
      btn.innerHTML = 'Sending&hellip; <span class="btn-spinner"></span>';

      emailjs.sendForm('service_React2025', 'contact_template', form)
        .then(() => {
          success.textContent   = '\u2713 Message sent! I\'ll get back to you within 24 hours.';
          success.style.display = 'block';
          btn.style.display     = 'none';
          form.reset();
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          errBox.textContent   = '\u2715 Failed to send \u2014 please try again or email me directly.';
          errBox.style.display = 'block';
          btn.disabled  = false;
          btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
        });
    }