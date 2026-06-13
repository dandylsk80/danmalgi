// ============================================================
//  danmalgi_worker.js  —  단말기닷컴(danmalgi.com) 동적 발행 워커
//  배포: GitHub Actions(deploy.yml) → wrangler deploy
//  ※ wrangler.toml 의 main 을 이 파일로 지정하세요:
//        main = "danmalgi_worker.js"
//  ※ 한글 도메인(단말기.com)으로 갈 거면 파일명만 바꾸면 됩니다.
//
//  수정 포인트: "단말기닷컴"(업체명), "1600-0000"(전화), 카카오 링크(#), 숫자
// ============================================================

const HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>단말기닷컴 | 카드단말기 설치 · 전국 당일</title>
<meta name="description" content="카드단말기 무료 설치, 당일 방문, 영세가맹점 우대 수수료. 전화 한 통으로 끝내는 카드단말기 설치 서비스.">
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<style>
  :root{
    --ink:#0A1A2F;--ink-2:#15314F;--blue:#1D4ED8;--blue-soft:#E8EFFE;
    --accent:#FF5A2D;--paper:#FFFFFF;--mist:#F4F7FB;--line:#E2E8F0;
    --muted:#5A6B7E;--ok:#16C172;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:"Pretendard",-apple-system,BlinkMacSystemFont,system-ui,sans-serif;color:var(--ink);background:var(--paper);line-height:1.55;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:0 22px}
  a{text-decoration:none;color:inherit}
  header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.85);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
  .nav{display:flex;align-items:center;justify-content:space-between;height:62px}
  .logo{font-weight:800;font-size:19px;letter-spacing:-.02em}
  .logo b{color:var(--blue)}
  .nav-cta{display:inline-flex;align-items:center;gap:7px;background:var(--ink);color:#fff;padding:9px 16px;border-radius:999px;font-weight:700;font-size:14px}
  .nav-cta:hover{background:var(--blue)}
  .hero{position:relative;overflow:hidden;background:linear-gradient(180deg,#fff 0%,var(--mist) 100%)}
  .hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center;padding:64px 0 72px}
  .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--blue);background:var(--blue-soft);padding:7px 13px;border-radius:999px;letter-spacing:-.01em}
  .eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(255,90,45,.18)}
  h1{font-size:clamp(30px,5vw,50px);font-weight:800;letter-spacing:-.035em;line-height:1.12;margin:20px 0 16px}
  h1 .hl{color:var(--blue)}
  .lead{font-size:clamp(15px,1.6vw,18px);color:var(--muted);max-width:30em}
  .btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
  .btn{display:inline-flex;align-items:center;gap:9px;padding:15px 24px;border-radius:13px;font-weight:800;font-size:16px;transition:transform .12s,box-shadow .12s}
  .btn-primary{background:var(--accent);color:#fff;box-shadow:0 10px 24px -8px rgba(255,90,45,.6)}
  .btn-primary:hover{transform:translateY(-2px)}
  .btn-ghost{background:#fff;color:var(--ink);border:1.5px solid var(--line)}
  .btn-ghost:hover{border-color:var(--ink)}
  .hero-note{margin-top:16px;font-size:13px;color:var(--muted)}
  .device{justify-self:center;width:248px;background:var(--ink);border-radius:26px;padding:18px;box-shadow:0 30px 60px -22px rgba(10,26,47,.5);transform:rotate(2.5deg)}
  .device-screen{background:#0E263F;border-radius:14px;padding:20px 18px;color:#fff}
  .ds-top{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#7EA0C4;letter-spacing:.05em}
  .ds-ok{display:flex;align-items:center;gap:6px;color:var(--ok);font-weight:700}
  .ds-ok .led{width:8px;height:8px;border-radius:50%;background:var(--ok);box-shadow:0 0 8px var(--ok);animation:blink 1.6s ease-in-out infinite}
  .ds-amt{font-size:30px;font-weight:800;margin:22px 0 4px;letter-spacing:-.02em}
  .ds-label{font-size:12px;color:#7EA0C4}
  .ds-line{height:1px;background:#1B3A5C;margin:18px 0}
  .ds-row{display:flex;justify-content:space-between;font-size:12px;color:#A9C2DC;margin-top:7px}
  .device-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px}
  .device-keys span{height:26px;border-radius:7px;background:#16314E}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}
  .trust{background:var(--ink);color:#fff}
  .trust-in{display:grid;grid-template-columns:repeat(3,1fr);text-align:center;padding:30px 0}
  .trust .n{font-size:clamp(24px,3vw,32px);font-weight:800;letter-spacing:-.02em}
  .trust .n b{color:#5C8DFF}
  .trust .t{font-size:13px;color:#9DB4CC;margin-top:4px}
  section{padding:74px 0}
  .sec-head{margin-bottom:38px}
  .kicker{font-size:13px;font-weight:800;color:var(--accent);letter-spacing:.04em}
  h2{font-size:clamp(24px,3.4vw,34px);font-weight:800;letter-spacing:-.03em;margin-top:8px}
  .sec-sub{color:var(--muted);margin-top:10px;font-size:15px}
  .cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .card{border:1px solid var(--line);border-radius:16px;padding:24px 20px;transition:border-color .15s,transform .15s,box-shadow .15s}
  .card:hover{border-color:var(--blue);transform:translateY(-3px);box-shadow:0 14px 30px -16px rgba(29,78,216,.4)}
  .card .ic{width:42px;height:42px;border-radius:11px;background:var(--blue-soft);display:flex;align-items:center;justify-content:center;font-size:21px;margin-bottom:14px}
  .card h3{font-size:17px;font-weight:800;letter-spacing:-.02em}
  .card p{font-size:14px;color:var(--muted);margin-top:7px}
  .why{background:var(--mist)}
  .why-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  .why-item{background:#fff;border-radius:16px;padding:26px 22px;border:1px solid var(--line)}
  .why-item .big{font-size:15px;font-weight:800;color:var(--blue);letter-spacing:-.01em}
  .why-item h3{font-size:18px;font-weight:800;margin:10px 0 6px;letter-spacing:-.02em}
  .why-item p{font-size:14px;color:var(--muted)}
  .steps{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
  .step{position:relative;padding:24px 16px;border-radius:14px;border:1px solid var(--line)}
  .step .no{font-size:13px;font-weight:800;color:var(--accent)}
  .step h3{font-size:16px;font-weight:800;margin:10px 0 6px;letter-spacing:-.02em}
  .step p{font-size:13px;color:var(--muted)}
  .cta{background:linear-gradient(120deg,var(--ink) 0%,var(--ink-2) 100%);color:#fff;border-radius:24px;padding:52px 40px;text-align:center;margin:0 22px}
  .cta h2{color:#fff}
  .cta p{color:#A9C2DC;margin:12px 0 26px;font-size:16px}
  .cta .btns{justify-content:center}
  footer{padding:40px 0 56px;border-top:1px solid var(--line);margin-top:74px}
  .foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:14px;color:var(--muted);font-size:13px}
  .foot b{color:var(--ink);font-weight:800;font-size:15px;letter-spacing:-.02em}
  @media(max-width:860px){
    .hero-grid{grid-template-columns:1fr;gap:34px;padding:46px 0 54px}
    .device{transform:rotate(0);width:230px}
    .cards,.why-grid{grid-template-columns:1fr 1fr}
    .steps{grid-template-columns:1fr 1fr}
    .trust-in{grid-template-columns:1fr;gap:22px}
  }
  @media(max-width:520px){
    .cards,.why-grid,.steps{grid-template-columns:1fr}
    .cta{padding:40px 24px;margin:0 16px}
    .btn{flex:1;justify-content:center}
  }
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style>
</head>
<body>
<header>
  <div class="wrap nav">
    <div class="logo">단말기<b>닷컴</b></div>
    <a class="nav-cta" href="tel:1600-0000">📞 1600-0000</a>
  </div>
</header>
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <span class="eyebrow"><span class="dot"></span>카드단말기 설치 · 전국 당일 가능</span>
      <h1>카드단말기,<br><span class="hl">오늘 바로</span> 설치합니다</h1>
      <p class="lead">무료 설치부터 영세·중소가맹점 우대 수수료까지. 복잡한 절차 없이 전화 한 통이면 끝납니다.</p>
      <div class="btns">
        <a class="btn btn-primary" href="tel:1600-0000">📞 전화 상담 신청</a>
        <a class="btn btn-ghost" href="#">💬 카카오 상담</a>
      </div>
      <p class="hero-note">설치비 0원 · 신청 당일 방문 · A/S 연중무휴</p>
    </div>
    <div class="device" aria-hidden="true">
      <div class="device-screen">
        <div class="ds-top"><span>CARD POS</span><span class="ds-ok"><span class="led"></span>승인</span></div>
        <div class="ds-amt">결제 완료</div>
        <div class="ds-label">정상 승인되었습니다</div>
        <div class="ds-line"></div>
        <div class="ds-row"><span>승인번호</span><span>0001</span></div>
        <div class="ds-row"><span>설치 상태</span><span>정상 가동</span></div>
      </div>
      <div class="device-keys"><span></span><span></span><span></span><span></span><span></span><span></span></div>
    </div>
  </div>
</section>
<div class="trust">
  <div class="wrap trust-in">
    <div><div class="n"><b>12,000+</b></div><div class="t">누적 설치 가맹점</div></div>
    <div><div class="n">평균 <b>24시간</b> 이내</div><div class="t">신청부터 설치 완료까지</div></div>
    <div><div class="n">연중무휴 <b>A/S</b></div><div class="t">고장 시 즉시 대응</div></div>
  </div>
</div>
<section>
  <div class="wrap">
    <div class="sec-head">
      <div class="kicker">SERVICE</div>
      <h2>매장에 딱 맞는 단말기로</h2>
      <p class="sec-sub">업종과 운영 방식에 맞춰 최적의 결제 장비를 설치해 드립니다.</p>
    </div>
    <div class="cards">
      <div class="card"><div class="ic">🔌</div><h3>유선 단말기</h3><p>고정 매장에 적합한 안정적인 기본 단말기.</p></div>
      <div class="card"><div class="ic">📶</div><h3>무선 단말기</h3><p>배달·이동·테이블 결제까지 자유롭게.</p></div>
      <div class="card"><div class="ic">🖥️</div><h3>포스(POS)</h3><p>주문·결제·매출관리를 한 번에 처리.</p></div>
      <div class="card"><div class="ic">📱</div><h3>간편·QR 결제</h3><p>모바일·간편결제 연동으로 결제 누수 방지.</p></div>
    </div>
  </div>
</section>
<section class="why">
  <div class="wrap">
    <div class="sec-head"><div class="kicker">WHY US</div><h2>설치 후가 더 다릅니다</h2></div>
    <div class="why-grid">
      <div class="why-item"><div class="big">설치비 0원</div><h3>무료 설치</h3><p>방문 설치 비용 없이 진행합니다.</p></div>
      <div class="why-item"><div class="big">신청 당일</div><h3>당일 설치</h3><p>가능 지역은 신청 당일 방문 설치.</p></div>
      <div class="why-item"><div class="big">최저 구간</div><h3>우대 수수료</h3><p>영세·중소가맹점 우대 수수료 안내.</p></div>
      <div class="why-item"><div class="big">즉시 대응</div><h3>책임 A/S</h3><p>고장·교체 요청 빠르게 처리.</p></div>
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    <div class="sec-head"><div class="kicker">PROCESS</div><h2>신청부터 결제까지, 5단계</h2></div>
    <div class="steps">
      <div class="step"><div class="no">01</div><h3>상담 신청</h3><p>전화 또는 카카오로 문의.</p></div>
      <div class="step"><div class="no">02</div><h3>서류 접수</h3><p>사업자등록증 등 간단 서류.</p></div>
      <div class="step"><div class="no">03</div><h3>카드사 심사</h3><p>가맹점 등록 심사 진행.</p></div>
      <div class="step"><div class="no">04</div><h3>방문 설치</h3><p>기사 방문, 단말기 설치·테스트.</p></div>
      <div class="step"><div class="no">05</div><h3>결제 시작</h3><p>바로 카드 결제 운영 시작.</p></div>
    </div>
  </div>
</section>
<div class="cta">
  <h2>지금 신청하면, 오늘 설치 가능합니다</h2>
  <p>상담은 무료입니다. 부담 없이 문의하세요.</p>
  <div class="btns">
    <a class="btn btn-primary" href="tel:1600-0000">📞 1600-0000 전화하기</a>
    <a class="btn btn-ghost" href="#" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.35)">💬 카카오 상담</a>
  </div>
</div>
<footer>
  <div class="wrap foot">
    <div><b>단말기닷컴</b><br>카드단말기 설치 · 포스 · 결제 솔루션</div>
    <div>대표전화 1600-0000<br>상호 / 사업자등록번호 / 주소 (수정)</div>
  </div>
</footer>
</body>
</html>`;

export default {
  async fetch(request) {
    return new Response(HTML, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=300",
      },
    });
  },
};
