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

// ── 모바일 stats 그리드 강제 적용 ──
function fixMobileStats() {
  const grid = document.querySelector('.stats-grid-v2');
  if (!grid) return;

  if (window.innerWidth <= 768) {
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = '1fr 1fr';
  } else {
    grid.style.gridTemplateColumns = '';
  }
}

fixMobileStats();
window.addEventListener('resize', fixMobileStats);

// ── 팝업 상담 신청 ──
const popupOverlay = document.getElementById('popupOverlay');

function openPopup() {
  popupOverlay.classList.add('active');
}
function closePopup() {
  popupOverlay.classList.remove('active');
}

document.getElementById('stickyOpenBtn').addEventListener('click', openPopup);
document.getElementById('popupClose').addEventListener('click', closePopup);
popupOverlay.addEventListener('click', function (e) {
  if (e.target === popupOverlay) closePopup();
});

document.getElementById('popupSubmit').addEventListener('click', function() {
  const name = document.getElementById('popupName').value.trim();
  const phone = document.getElementById('popupPhone').value.trim();
  const region = document.getElementById('popupRegion').value.trim();

  if (!name || !phone) {
    alert('이름과 연락처를 입력해주세요.');
    return;
  }

  const submitBtn = document.getElementById('popupSubmit');
  submitBtn.textContent = '신청 중...';
  submitBtn.disabled = true;

  fetch('https://script.google.com/macros/s/AKfycbxT2OENUD1MU978JYfowZmOF-RotN-VKr9fy6ljWNQrUzuHu-RzzuRmS2mV5rBRaOVU/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name, phone: phone, region: region || '' })
  })
  .then(() => {
    window.location.href = '/thankyou.html';
  })
  .catch(() => {
    window.location.href = '/thankyou.html';
  });
});

// ── 상담 버튼 팝업 연결 (nav, 히어로, fullscreen 등) ──
document.querySelectorAll('.nav-cta, .btn-primary, .fs-btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    openPopup();
  });
});


// ── 폰 목업 슬라이더 ──
document.addEventListener('DOMContentLoaded', function () {
  const phoneSlider = document.getElementById('phoneSlider');
  const phoneDots = document.querySelectorAll('.phone-dot');
  if (!phoneSlider) return;

  let currentSlide = 0;
  const totalSlides = 5;

  function moveToSlide(index) {
    currentSlide = index;
    phoneSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
    phoneDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // 자동 슬라이드 3초마다
  let autoSlide = setInterval(() => {
    let next = (currentSlide + 1) % totalSlides;
    moveToSlide(next);
  }, 3000);

  // 버튼 클릭
  document.getElementById('phonePrev').addEventListener('click', () => {
    clearInterval(autoSlide);
    let prev = (currentSlide - 1 + totalSlides) % totalSlides;
    moveToSlide(prev);
    autoSlide = setInterval(() => {
      let next = (currentSlide + 1) % totalSlides;
      moveToSlide(next);
    }, 3000);
  });

  document.getElementById('phoneNext').addEventListener('click', () => {
    clearInterval(autoSlide);
    let next = (currentSlide + 1) % totalSlides;
    moveToSlide(next);
    autoSlide = setInterval(() => {
      let next2 = (currentSlide + 1) % totalSlides;
      moveToSlide(next2);
    }, 3000);
  });

  // 점 클릭
  phoneDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(autoSlide);
      moveToSlide(i);
      autoSlide = setInterval(() => {
        let next = (currentSlide + 1) % totalSlides;
        moveToSlide(next);
      }, 3000);
    });
  });
});

// ── 리뷰 인용구 롤링 ──
document.addEventListener('DOMContentLoaded', function () {
  const quotes = document.querySelectorAll('.rps-quote');
  if (!quotes.length) return;
  let currentQuote = 0;

  quotes.forEach((q, i) => {
    q.style.display = i === 0 ? 'block' : 'none';
    q.style.transition = 'opacity 0.5s ease';
    q.style.opacity = i === 0 ? '1' : '0';
  });

  function moveToQuote(index) {
    quotes[currentQuote].style.opacity = '0';
    setTimeout(() => {
      quotes[currentQuote].style.display = 'none';
      currentQuote = index;
      quotes[currentQuote].style.display = 'block';
      setTimeout(() => {
        quotes[currentQuote].style.opacity = '1';
      }, 50);
    }, 400);
  }

  setInterval(() => {
    let next = (currentQuote + 1) % quotes.length;
    moveToQuote(next);
  }, 3000);
});

// ── 리뷰 평점 바 애니메이션 ──
document.addEventListener('DOMContentLoaded', function () {
  const rslBars = document.querySelectorAll('.rsl-bar');
  if (!rslBars.length) return;

  const rslObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        rslBars.forEach((bar, i) => {
          const targetWidth = bar.dataset.width;
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, i * 200);
        });
        rslObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  rslObserver.observe(document.querySelector('.review-stat-list'));
});

// ── 누적 리뷰 카운트업 ──
document.addEventListener('DOMContentLoaded', function () {
  const reviewCount = document.querySelector('.rcb-num');
  if (!reviewCount) return;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let count = 0;
        const target = 9999;
        const duration = 2000;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(timer);
            reviewCount.textContent = '9,999+';
          } else {
            reviewCount.textContent = Math.floor(count).toLocaleString();
          }
        }, 16);
        countObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  countObserver.observe(reviewCount);
});

// ── 메뉴 카드 순차 등장 애니메이션 ──
document.addEventListener('DOMContentLoaded', function () {
  const menuCards = document.querySelectorAll('.menu-card');
  if (!menuCards.length) return;

  menuCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const menuObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        menuCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 150);
        });
        menuObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  menuObserver.observe(menuCards[0].closest('section') || menuCards[0].parentElement);
});

// ── 창업 비용 카드 순차 등장 애니메이션 ──
document.addEventListener('DOMContentLoaded', function () {
  const costCards = document.querySelectorAll('.cost-card');
  if (!costCards.length) return;

  costCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const costObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        costCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 200);
        });
        costObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  costObserver.observe(costCards[0].closest('section') || costCards[0].parentElement);
});

// ── 수익 모델 카드 순차 등장 애니메이션 ──
document.addEventListener('DOMContentLoaded', function () {
  const revenueCards = document.querySelectorAll('.revenue-card');
  if (!revenueCards.length) return;

  revenueCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const revenueObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revenueCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 200);
        });
        revenueObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  revenueObserver.observe(revenueCards[0].closest('section') || revenueCards[0].parentElement);
});

// ── 직영점 매출 카드 순차 등장 애니메이션 ──
document.addEventListener('DOMContentLoaded', function () {
  const salesCards = document.querySelectorAll('.sales-card-item');
  if (!salesCards.length) return;

  salesCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const salesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        salesCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 200);
        });
        salesObserver.disconnect();
      }
    });
  }, { threshold: 0.1 });

  salesObserver.observe(salesCards[0].closest('section') || salesCards[0].parentElement);
});
