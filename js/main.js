/**
 * 仏壇修復サービス - メインスクリプト
 * Apple風の洗練されたアニメーションと高級感のあるインタラクション
 */
document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // 1. スクロールアニメーション（強化版 Intersection Observer）
  // ============================================
  function initScrollAnimations() {
    var animElements = document.querySelectorAll('[data-animate], .data-animate');
    if (animElements.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;

          // data-animate-delay 属性があれば transition-delay に設定（スタッガー用）
          var delay = el.getAttribute('data-animate-delay');
          if (delay) {
            el.style.transitionDelay = delay;
          }

          // 表示領域に入ったらアニメーションクラスを付与
          el.classList.add('animate-in');

          // 一度表示したら監視を解除
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15 // 少し深めに入ってから発火
    });

    animElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================
  // 2. ハンバーガーメニュー制御
  // ============================================
  function initHamburgerMenu() {
    var toggle = document.getElementById('menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    if (!toggle || !mobileMenu) return;

    var bar1 = document.getElementById('bar1');
    var bar2 = document.getElementById('bar2');
    var bar3 = document.getElementById('bar3');
    var isOpen = false;

    toggle.addEventListener('click', function () {
      isOpen = !isOpen;

      if (isOpen) {
        // メニューを開く
        mobileMenu.classList.remove('hidden');
        // body に menu-open クラスを追加（スクロールロック）
        document.body.classList.add('menu-open');
        // ハンバーガーアイコンを × に変形
        if (bar1) bar1.style.transform = 'rotate(45deg) translate(4px, 4px)';
        if (bar2) bar2.style.opacity = '0';
        if (bar3) bar3.style.transform = 'rotate(-45deg) translate(4px, -4px)';
        toggle.setAttribute('aria-label', 'メニューを閉じる');
      } else {
        closeMenu();
      }
    });

    // メニュー内のリンクをクリックしたらメニューを閉じる
    var menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (isOpen) {
          isOpen = false;
          closeMenu();
        }
      });
    });

    function closeMenu() {
      mobileMenu.classList.add('hidden');
      // menu-open クラスを削除（スクロール復帰）
      document.body.classList.remove('menu-open');
      if (bar1) bar1.style.transform = '';
      if (bar2) bar2.style.opacity = '';
      if (bar3) bar3.style.transform = '';
      toggle.setAttribute('aria-label', 'メニューを開く');
    }
  }

  // ============================================
  // 3. ヘッダースクロール制御（強化版）
  //    - requestAnimationFrame でスロットリング
  //    - scrolled クラスの追加/削除
  // ============================================
  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    var headerLinks = header.querySelectorAll('.header-link');
    var hamburgerLines = header.querySelectorAll('.hamburger-line');
    var ticking = false; // RAF スロットリング用フラグ

    function updateHeader() {
      if (window.scrollY > 50) {
        // スクロール量が50pxを超えたら scrolled クラスを追加
        header.classList.add('scrolled');
        headerLinks.forEach(function (link) {
          link.style.color = '#3C2415';
          link.style.textShadow = 'none';
        });
        hamburgerLines.forEach(function (line) {
          line.style.backgroundColor = '#3C2415';
        });
      } else {
        // スクロール量 <= 50px で scrolled クラスを削除
        header.classList.remove('scrolled');
        headerLinks.forEach(function (link) {
          link.style.color = '#FFFFFF';
          link.style.textShadow = '0 1px 4px rgba(0,0,0,0.6)';
        });
        hamburgerLines.forEach(function (line) {
          line.style.backgroundColor = '#FFFFFF';
        });
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }

    // 初回実行
    updateHeader();
    // passive: true でパフォーマンス最適化
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ============================================
  // 4. Before/After スライダー
  // ============================================
  function initBeforeAfterSlider() {
    var container = document.getElementById('before-after-slider');
    if (!container) return;

    var afterImage = container.querySelector('.after-image');
    var handle = container.querySelector('.slider-handle');
    if (!afterImage || !handle) return;

    var isDragging = false;

    // 初期位置を50%に設定
    setSliderPosition(50);

    function setSliderPosition(percent) {
      // 0〜100の範囲にクランプ
      percent = Math.max(0, Math.min(100, percent));
      afterImage.style.clipPath = 'inset(0 0 0 ' + percent + '%)';
      handle.style.left = percent + '%';
    }

    function getPercentFromEvent(e) {
      var rect = container.getBoundingClientRect();
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      var x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    // マウス操作
    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      isDragging = true;
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      setSliderPosition(getPercentFromEvent(e));
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    // タッチ操作
    handle.addEventListener('touchstart', function (e) {
      e.preventDefault();
      isDragging = true;
    });

    document.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      setSliderPosition(getPercentFromEvent(e));
    }, { passive: false });

    document.addEventListener('touchend', function () {
      isDragging = false;
    });
  }

  // ============================================
  // 5. スムーズスクロール（ヘッダーオフセット80px）
  // ============================================
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      // ヘッダー高さ分オフセット（80px）
      var offset = 80;
      var targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // 6. 写真プレビュー（contact.html用）
  //    - ドラッグ&ドロップ対応
  //    - サムネイルプレビューと削除ボタン
  // ============================================
  function initPhotoUpload() {
    var fileInput = document.getElementById('photo-upload');
    var dropZone = document.getElementById('drop-zone');
    var previewContainer = document.getElementById('photo-preview');
    if (!fileInput || !dropZone || !previewContainer) return;

    // 選択済みファイルを管理する配列
    var selectedFiles = [];

    // ドロップゾーンのクリックでファイル選択を開く
    dropZone.addEventListener('click', function () {
      fileInput.click();
    });

    // ファイル選択時
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files.length > 0) {
        addFiles(fileInput.files);
      }
    });

    // ドラッグ&ドロップ対応
    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('drag-over');

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    });

    // ファイルを追加してプレビューを更新
    function addFiles(files) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        // 画像ファイルのみ受け付ける
        if (!file.type.startsWith('image/')) continue;
        selectedFiles.push(file);
      }
      renderPreviews();
    }

    // プレビュー描画
    function renderPreviews() {
      previewContainer.innerHTML = '';

      selectedFiles.forEach(function (file, index) {
        var wrapper = document.createElement('div');
        wrapper.className = 'relative group';

        var img = document.createElement('img');
        img.className = 'w-full h-24 sm:h-28 object-cover rounded-lg border border-washi';
        img.alt = file.name;

        // FileReaderで画像を読み込み
        var reader = new FileReader();
        reader.onload = function (e) {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // 削除ボタン
        var deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-80 hover:opacity-100 transition-opacity shadow';
        deleteBtn.textContent = '\u00D7';
        deleteBtn.setAttribute('aria-label', file.name + 'を削除');
        deleteBtn.addEventListener('click', function () {
          selectedFiles.splice(index, 1);
          renderPreviews();
        });

        wrapper.appendChild(img);
        wrapper.appendChild(deleteBtn);
        previewContainer.appendChild(wrapper);
      });
    }
  }

  // ============================================
  // 7. フォーム送信制御（contact.html用）
  // ============================================
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // HTML5バリデーションを手動チェック
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      alert('テストサイトのため、送信は行われません。');
    });
  }

  // ============================================
  // 8. 郵便番号→住所自動入力（zipcloud API / JSONP）
  // ============================================
  function initZipcodeSearch() {
    var zipcodeInput = document.getElementById('zipcode');
    var searchBtn = document.getElementById('zipcode-search');
    var statusEl = document.getElementById('zipcode-status');
    var prefectureSelect = document.getElementById('prefecture');
    var cityInput = document.getElementById('city');
    if (!zipcodeInput || !prefectureSelect || !cityInput) return;

    // 郵便番号で住所を検索する関数
    function searchAddress(zipcode) {
      // ハイフンを除去し、数字のみにする
      var cleaned = zipcode.replace(/[^0-9]/g, '');
      if (cleaned.length !== 7) {
        if (statusEl) {
          statusEl.textContent = '7桁の郵便番号を入力してください';
          statusEl.className = 'text-sm text-red-500';
          statusEl.classList.remove('hidden');
        }
        return;
      }

      if (statusEl) {
        statusEl.textContent = '検索中...';
        statusEl.className = 'text-sm text-walnut/60';
        statusEl.classList.remove('hidden');
      }

      // zipcloud API（JSONP呼び出し）
      var script = document.createElement('script');
      var callbackName = 'zipcloudCallback_' + Date.now();

      window[callbackName] = function (data) {
        // コールバック関数をクリーンアップ
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);

        if (data.status === 200 && data.results && data.results.length > 0) {
          var result = data.results[0];
          // 都道府県をセレクトボックスにセット
          var options = prefectureSelect.options;
          for (var i = 0; i < options.length; i++) {
            if (options[i].value === result.address1) {
              prefectureSelect.selectedIndex = i;
              break;
            }
          }
          // 市区町村+町域を入力
          cityInput.value = result.address2 + result.address3;

          if (statusEl) {
            statusEl.textContent = '住所を入力しました';
            statusEl.className = 'text-sm text-matcha font-medium';
          }
        } else {
          if (statusEl) {
            statusEl.textContent = '該当する住所が見つかりませんでした';
            statusEl.className = 'text-sm text-red-500';
          }
        }
      };

      script.src = 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=' + cleaned + '&callback=' + callbackName;
      script.onerror = function () {
        delete window[callbackName];
        if (statusEl) {
          statusEl.textContent = '検索に失敗しました。手動で入力してください。';
          statusEl.className = 'text-sm text-red-500';
        }
      };
      document.body.appendChild(script);
    }

    // ボタンクリックで検索
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        searchAddress(zipcodeInput.value);
      });
    }

    // 7桁入力時に自動検索
    zipcodeInput.addEventListener('input', function () {
      var cleaned = zipcodeInput.value.replace(/[^0-9]/g, '');
      if (cleaned.length === 7) {
        searchAddress(cleaned);
      } else if (statusEl) {
        statusEl.classList.add('hidden');
      }
    });
  }

  // ============================================
  // 9. 金箔パーティクル効果（ヒーローセクション）
  //    - 微かな金色の光点がゆっくり浮遊
  //    - div要素による軽量実装
  //    - GPU加速で60fpsを維持
  // ============================================
  function initGoldParticles() {
    // 最初の section をヒーローセクションとして取得
    var heroSection = document.querySelector('section');
    if (!heroSection) return;

    // ヒーローセクションに relative を確保（パーティクルの絶対配置用）
    var computedPosition = window.getComputedStyle(heroSection).position;
    if (computedPosition === 'static') {
      heroSection.style.position = 'relative';
    }
    // パーティクルがはみ出さないように
    heroSection.style.overflow = 'hidden';

    // パーティクルの設定（5〜8個）
    var particleCount = 5 + Math.floor(Math.random() * 4);

    for (var i = 0; i < particleCount; i++) {
      var particle = document.createElement('div');

      // サイズは3〜6pxのランダム
      var size = 3 + Math.random() * 3;
      // 位置はランダム
      var startX = Math.random() * 100;
      var startY = Math.random() * 100;
      // アニメーション時間は8〜15秒（ゆっくり浮遊）
      var duration = 8 + Math.random() * 7;
      // 開始遅延をランダムに設定して一斉発火を防ぐ
      var delay = Math.random() * duration;

      particle.style.cssText = [
        'position: absolute',
        'width: ' + size + 'px',
        'height: ' + size + 'px',
        'left: ' + startX + '%',
        'top: ' + startY + '%',
        'background: radial-gradient(circle, rgba(212, 175, 55, 0.8) 0%, rgba(212, 175, 55, 0) 70%)',
        'border-radius: 50%',
        'pointer-events: none',
        'will-change: transform, opacity',
        'animation: goldFloat ' + duration + 's ease-in-out ' + delay + 's infinite',
        'opacity: 0',
        'z-index: 1'
      ].join('; ');

      heroSection.appendChild(particle);
    }

    // アニメーション用キーフレームを動的に注入
    if (!document.getElementById('gold-particle-keyframes')) {
      var styleSheet = document.createElement('style');
      styleSheet.id = 'gold-particle-keyframes';
      styleSheet.textContent = [
        '@keyframes goldFloat {',
        '  0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }',
        '  10% { opacity: 0.6; transform: scale(1); }',
        '  50% { transform: translateY(-30px) translateX(15px) scale(1.2); opacity: 0.8; }',
        '  90% { opacity: 0.4; transform: scale(0.8); }',
        '  100% { transform: translateY(-60px) translateX(-10px) scale(0); opacity: 0; }',
        '}'
      ].join('\n');
      document.head.appendChild(styleSheet);
    }
  }

  // ============================================
  // 10. 文字のスタッガーアニメーション
  //     - class="stagger-text" の要素を1文字ずつ分割
  //     - 画面内に入ったら順番にフェードイン
  //     - 各文字に0.05sずつ遅延
  // ============================================
  function initStaggerText() {
    var staggerElements = document.querySelectorAll('.stagger-text');
    if (staggerElements.length === 0) return;

    staggerElements.forEach(function (el) {
      var text = el.textContent;
      // テキストノードをクリアして span でラップ
      el.textContent = '';
      el.setAttribute('aria-label', text); // アクセシビリティ用に元テキストを保持

      for (var i = 0; i < text.length; i++) {
        var span = document.createElement('span');
        span.textContent = text[i];
        span.style.cssText = [
          'display: inline-block',
          'opacity: 0',
          'transform: translateY(20px)',
          'transition: opacity 0.5s ease, transform 0.5s ease',
          'transition-delay: ' + (i * 0.05) + 's'
        ].join('; ');

        // 空白文字は幅を保持
        if (text[i] === ' ') {
          span.style.width = '0.3em';
        }

        el.appendChild(span);
      }
    });

    // Intersection Observer で画面内に入ったらアニメーション開始
    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var spans = entry.target.querySelectorAll('span');
          spans.forEach(function (span) {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    staggerElements.forEach(function (el) {
      staggerObserver.observe(el);
    });
  }

  // ============================================
  // 11. カウンターアニメーション
  //     - class="counter" の要素を検出
  //     - data-target の値までカウントアップ
  //     - 1.5秒で完了、easeOut イージング
  // ============================================
  function initCounterAnimation() {
    var counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      var duration = 1500; // 1.5秒
      var startTime = null;

      function easeOutQuart(t) {
        // easeOut カーブ：後半ほどゆっくり
        return 1 - Math.pow(1 - t, 4);
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);

        // easeOut を適用して現在値を計算
        var current = Math.floor(easeOutQuart(progress) * target);
        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // 最終値を確定
          el.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(step);
    }
  }

  // ============================================
  // 12. ヒーロースライドショー（Apple風クロスフェード）
  //     - 6秒間隔で自動切り替え
  //     - インジケータークリックで手動切り替え
  //     - プログレスバー付きインジケーター
  // ============================================
  function initHeroSlideshow() {
    var slideshow = document.getElementById('hero-slideshow');
    var indicatorContainer = document.getElementById('slide-indicators');
    if (!slideshow || !indicatorContainer) return;

    var slides = slideshow.querySelectorAll('.hero-slide');
    var indicators = indicatorContainer.querySelectorAll('.slide-indicator');
    if (slides.length === 0) return;

    var currentIndex = 0;
    var interval = 6000; // 6秒間隔
    var timer = null;

    function goToSlide(index) {
      // 現在のスライドを非アクティブに
      slides[currentIndex].classList.remove('active');
      indicators[currentIndex].classList.remove('active');

      // 新しいスライドをアクティブに
      currentIndex = index;
      slides[currentIndex].classList.add('active');
      indicators[currentIndex].classList.add('active');
    }

    function nextSlide() {
      var next = (currentIndex + 1) % slides.length;
      goToSlide(next);
    }

    function startAutoPlay() {
      if (timer) clearInterval(timer);
      timer = setInterval(nextSlide, interval);
    }

    // インジケータークリックで手動切り替え
    indicators.forEach(function (indicator) {
      indicator.addEventListener('click', function () {
        var index = parseInt(indicator.getAttribute('data-slide'), 10);
        if (index === currentIndex) return;
        goToSlide(index);
        // タイマーをリセット
        startAutoPlay();
      });
    });

    // 自動再生開始
    startAutoPlay();

    // タブ非表示時にタイマー停止、表示時に再開（省電力）
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (timer) clearInterval(timer);
      } else {
        startAutoPlay();
      }
    });
  }

  // ============================================
  // 13. スクロールプログレスバー + トップへ戻る + フローティングボタン
  // ============================================
  function initScrollUI() {
    var progressBar = document.getElementById('scroll-progress');
    var backToTop = document.getElementById('back-to-top');
    var ticking = false;

    function updateScrollUI() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      // プログレスバー更新
      if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
      }

      // 300px以上スクロールしたらボタンを表示
      var isScrolled = scrollTop > 300;
      if (backToTop) {
        if (isScrolled) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateScrollUI);
        ticking = true;
      }
    }, { passive: true });

    // トップへ戻るクリック
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 初回実行
    updateScrollUI();
  }

  // ============================================
  // 14. LINE告知バナーの閉じるボタン
  // ============================================
  function initLineBanner() {
    var banner = document.getElementById('line-banner');
    var closeBtn = document.getElementById('close-line-banner');
    if (!banner || !closeBtn) return;

    closeBtn.addEventListener('click', function () {
      banner.classList.add('hidden-banner');
      document.body.classList.remove('banner-active');
    });
  }

  // ============================================
  // 全機能の初期化
  // ============================================
  initScrollAnimations();
  initHamburgerMenu();
  initHeaderScroll();
  initBeforeAfterSlider();
  initSmoothScroll();
  initPhotoUpload();
  initContactForm();
  initZipcodeSearch();
  initGoldParticles();
  initStaggerText();
  initCounterAnimation();
  initHeroSlideshow();
  initScrollUI();
  initLineBanner();

});
