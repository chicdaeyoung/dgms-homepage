// main.js

// ── 햄버거 메뉴 토글 ──
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.textContent = isOpen ? '✕' : '☰';
    hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  // 메뉴 항목 클릭 시 자동 닫힘
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.textContent = '☰';
      hamburger.setAttribute('aria-label', '메뉴 열기');
    });
  });
});

// ── NAV 스크롤 효과 ──
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    });
  }
});

// ── Smooth Scroll 통합 ──
document.addEventListener('DOMContentLoaded', function () {
  const NAV_HEIGHT = 64;

  function smoothScrollTo(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      smoothScrollTo(href);
    });
  });

  document.querySelectorAll('[data-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      smoothScrollTo(this.getAttribute('data-target'));
    });
  });
});

// ── 섹션 페이드인 (IntersectionObserver) ──
document.addEventListener('DOMContentLoaded', function () {
  const targets = document.querySelectorAll('.section-wrap, section');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) {
    observer.observe(el);
  });
});

// ── 숫자 카운터 애니메이션 (Stats) ──
document.addEventListener('DOMContentLoaded', function () {
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCount(el, target, duration) {
    const emEl = el.querySelector('em');
    const unit  = emEl ? emEl.outerHTML : '';
    const start = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutQuart(progress) * target);
      el.innerHTML   = value + unit;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statEls = document.querySelectorAll('.stat-num-v2');
  if (!statEls.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.replace(/[^0-9]/g, '');
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num > 0) animateCount(el, num, 2000);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statEls.forEach(function (el) {
    observer.observe(el);
  });
});

// ── 매출 카드 바 애니메이션 ──
document.addEventListener('DOMContentLoaded', function () {
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  const bars = document.querySelectorAll('.sales-card-bar');
  if (!bars.length) return;

  // 목표 width 저장 후 초기화
  bars.forEach(function (bar) {
    bar.dataset.targetWidth = bar.style.width || '0%';
    bar.style.width = '0%';
  });

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      // 해당 카드 그리드 안의 바들 순차 실행
      const grid = entry.target.closest('.sales-card-grid');
      const gridBars = grid ? grid.querySelectorAll('.sales-card-bar') : [entry.target];

      gridBars.forEach(function (bar, idx) {
        setTimeout(function () {
          const targetWidth = parseFloat(bar.dataset.targetWidth) / 100;
          const duration    = 1200;
          const start       = performance.now();

          function step(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            bar.style.width = (easeOutCubic(progress) * targetWidth * 100).toFixed(1) + '%';
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }, idx * 200);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  // 첫 번째 바만 observe (그리드 전체 트리거)
  const firstBars = [];
  document.querySelectorAll('.sales-card-grid').forEach(function (grid) {
    const first = grid.querySelector('.sales-card-bar');
    if (first) firstBars.push(first);
  });
  firstBars.forEach(function (bar) { observer.observe(bar); });
});

// ── 수익모델 카운트업 + 행 순차 등장 ──
document.addEventListener('DOMContentLoaded', function () {
  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateRevNum(el, target, duration) {
    const spanEl = el.querySelector('span');
    const unit   = spanEl ? spanEl.outerHTML : '';
    const start  = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutQuart(progress) * target);
      el.innerHTML   = value.toLocaleString('ko-KR') + unit;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const revNums = document.querySelectorAll('.revenue-num');
  if (!revNums.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const card = entry.target.closest('.revenue-card');
      const el   = entry.target;

      // 메인 숫자 카운트업
      const raw = el.textContent.replace(/[^0-9]/g, '');
      const num = parseInt(raw, 10);
      if (!isNaN(num) && num > 0) animateRevNum(el, num, 1800);

      // rev-row 순차 등장
      if (card) {
        card.querySelectorAll('.rev-row').forEach(function (row, idx) {
          setTimeout(function () {
            row.classList.add('visible');
          }, 200 + idx * 110);
        });
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  revNums.forEach(function (el) { observer.observe(el); });
});

// ── 프로세스 순차 등장 ──
document.addEventListener('DOMContentLoaded', function () {
  const grids = document.querySelectorAll('.steps-grid');
  if (!grids.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const steps = entry.target.querySelectorAll('.step-item');
      steps.forEach(function (step, idx) {
        setTimeout(function () {
          step.classList.add('visible');
        }, idx * 160);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  grids.forEach(function (grid) { observer.observe(grid); });
});

// ── 상담 폼 유효성 검사 ──
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const phoneInput = document.getElementById('cf-phone');
  phoneInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    const nameInput = document.getElementById('cf-name');
    [nameInput, phoneInput].forEach(function (input) {
      if (!input.value.trim()) {
        input.classList.add('input-error');
        valid = false;
      } else {
        input.classList.remove('input-error');
      }
    });

    const agreeCheck = document.getElementById('cf-agree');
    if (!agreeCheck.checked) {
      agreeCheck.parentElement.style.color = 'var(--red)';
      valid = false;
    } else {
      agreeCheck.parentElement.style.color = '';
    }

    if (!valid) return;

    alert('상담 신청이 완료되었습니다. 24시간 내 연락드리겠습니다.');
    form.reset();
  });

  form.querySelectorAll('input').forEach(function (input) {
    input.addEventListener('input', function () {
      this.classList.remove('input-error');
    });
  });
});

// ── FAQ 아코디언 ──
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-q');

    const arrow = document.createElement('span');
    arrow.className = 'faq-arrow';
    arrow.textContent = '+';
    question.appendChild(arrow);

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        other.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });
});
