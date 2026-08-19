import { useEffect, useRef } from "react";

export default function Landing() {
  const barcodeRef = useRef(null);

  useEffect(() => {
    const bc = barcodeRef.current;
    if (!bc) return;

    const widths = [2,4,2,2,6,2,4,2,2,2,6,4,2,2,4,2,6,2,2,4,2,2,6,2,4,2,2,2,4,2];

    widths.forEach((w) => {
      const bar = document.createElement("span");
      bar.style.width = `${w}px`;
      bar.style.height = `${14 + Math.random() * 16}px`;
      bc.appendChild(bar);
    });

    const features = document.querySelectorAll(".feature");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    features.forEach((el, i) => {
      el.style.transitionDelay = `${i * 40}ms`;
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
  :root{
    --bg:#F0FBF5;
    --paper:#FFFEF9;
    --ink:#0A2A1E;
    --ink-soft:#4C6B5D;
    --violet-900:#064E3B;
    --violet-600:#059669;
    --violet-500:#10B981;
    --violet-400:#34D399;
    --violet-100:#D1FAE5;
    --mint:#059669;
    --line:#CBEEDD;
    --radius:18px;
    --max:1160px;
  }

  *{box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{
    margin:0;
    background:var(--bg);
    color:var(--ink);
    font-family:'Inter',sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  h1,h2,h3,.display{
    font-family:'Space Grotesk',sans-serif;
    letter-spacing:-0.01em;
    margin:0;
  }
  .mono{font-family:'IBM Plex Mono',monospace;}
  a{color:inherit;text-decoration:none;}
  img{max-width:100%;display:block;}
  .wrap{max-width:var(--max);margin:0 auto;padding:0 28px;}
  .eyebrow{
    display:inline-flex;align-items:center;gap:8px;
    font-family:'IBM Plex Mono',monospace;
    font-size:12.5px;letter-spacing:.08em;text-transform:uppercase;
    color:var(--violet-600);
  }
  .eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--violet-500);display:inline-block;}

  /* ---------- NAV ---------- */
  header.nav{
    position:sticky;top:0;z-index:50;
    background:rgba(247,245,250,.82);
    backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line);
  }
  .nav-inner{
    display:flex;align-items:center;justify-content:space-between;
    padding:16px 28px;max-width:var(--max);margin:0 auto;
  }
  .brand{display:flex;align-items:center;gap:10px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:19px;}
  .brand .mark{
    width:30px;height:30px;border-radius:8px;
    background:linear-gradient(155deg,var(--violet-500),var(--violet-900));
    position:relative;flex:none;
  }
  .brand .mark::after{
    content:"";position:absolute;inset:7px;border:2px solid rgba(255,255,255,.85);border-radius:3px;
  }
  nav.links{display:flex;gap:32px;font-size:14.5px;color:var(--ink-soft);}
  nav.links a:hover{color:var(--violet-600);}
  .btn{
    display:inline-flex;align-items:center;gap:8px;
    padding:11px 20px;border-radius:999px;
    font-size:14.5px;font-weight:600;cursor:pointer;border:none;
  }
  .btn-primary{background:var(--ink);color:#fff;}
  .btn-primary:hover{background:var(--violet-900);}
  .btn-ghost{border:1px solid var(--line);color:var(--ink);display:none;}

  /* ---------- HERO ---------- */
  .hero{padding:88px 0 60px;}
  .hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center;}
  .hero h1{font-size:clamp(34px,4.6vw,54px);line-height:1.06;font-weight:700;margin:18px 0 20px;}
  .hero h1 .hl{color:var(--violet-600);}
  .hero p.lead{font-size:17.5px;line-height:1.65;color:var(--ink-soft);max-width:480px;margin-bottom:32px;}
  .hero-cta{display:flex;align-items:center;gap:22px;flex-wrap:wrap;}
  .hero-note{font-size:13.5px;color:var(--ink-soft);}
  .hero-stats{display:flex;gap:34px;margin-top:46px;flex-wrap:wrap;}
  .hero-stats div b{display:block;font-family:'Space Grotesk',sans-serif;font-size:24px;}
  .hero-stats div span{font-size:12.5px;color:var(--ink-soft);}

  /* ---------- RECEIPT (signature element) ---------- */
  .receipt-stage{display:flex;justify-content:center;position:relative;}
  .receipt{
    width:320px;background:var(--paper);
    padding:26px 24px 34px;
    box-shadow:0 30px 60px -20px rgba(46,16,101,.35), 0 2px 0 rgba(46,16,101,.06);
    transform:rotate(-3deg);
    transition:transform .5s cubic-bezier(.2,.7,.2,1);
    clip-path:polygon(0% 0%,100% 0%,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0% 97%);
    position:relative;
  }
  .receipt-stage:hover .receipt{transform:rotate(0deg) translateY(-4px);}
  .receipt .r-top{text-align:center;border-bottom:1px dashed var(--line);padding-bottom:14px;margin-bottom:14px;}
  .receipt .r-top b{font-family:'Space Grotesk',sans-serif;font-size:17px;letter-spacing:.03em;}
  .receipt .r-top span{display:block;font-family:'IBM Plex Mono',monospace;font-size:10.5px;color:var(--ink-soft);margin-top:4px;}
  .receipt .r-line{
    display:flex;justify-content:space-between;gap:10px;
    font-family:'IBM Plex Mono',monospace;font-size:12px;
    padding:6px 0;color:var(--ink);
  }
  .receipt .r-line .check{color:var(--mint);flex:none;}
  .receipt .r-total{
    display:flex;justify-content:space-between;
    border-top:1px dashed var(--line);margin-top:10px;padding-top:12px;
    font-family:'IBM Plex Mono',monospace;font-weight:600;font-size:13px;
  }
  .barcode{display:flex;gap:2px;align-items:flex-end;height:30px;margin-top:18px;justify-content:center;}
  .barcode span{background:var(--ink);width:2px;display:block;}
  .receipt .r-foot{text-align:center;font-family:'IBM Plex Mono',monospace;font-size:9.5px;color:var(--ink-soft);margin-top:10px;letter-spacing:.08em;}

  /* ---------- SECTION HEADERS ---------- */
  .section{padding:76px 0;}
  .section-head{max-width:600px;margin-bottom:48px;}
  .section-head h2{font-size:clamp(26px,3.2vw,36px);margin:14px 0 12px;font-weight:700;}
  .section-head p{color:var(--ink-soft);font-size:15.5px;line-height:1.6;}

  /* ---------- FEATURES ---------- */
  .feature-grid{
    display:grid;grid-template-columns:repeat(4,1fr);gap:1px;
    background:var(--line);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;
  }
  .feature{
    background:var(--paper);padding:30px 26px;
    opacity:0;transform:translateY(14px);
    transition:opacity .6s ease, transform .6s ease;
  }
  .feature.is-visible{opacity:1;transform:translateY(0);}
  .feature .ic{
    width:38px;height:38px;border-radius:10px;background:var(--violet-100);
    display:flex;align-items:center;justify-content:center;margin-bottom:18px;color:var(--violet-600);
  }
  .feature h3{font-size:16.5px;font-weight:600;margin-bottom:8px;}
  .feature p{font-size:13.8px;color:var(--ink-soft);line-height:1.55;margin:0;}

  @media (max-width:920px){.feature-grid{grid-template-columns:repeat(2,1fr);}}
  @media (max-width:560px){.feature-grid{grid-template-columns:1fr;}}

  /* ---------- HOW IT WORKS ---------- */
  .flow{background:var(--violet-900);color:#fff;border-radius:24px;padding:56px 44px;position:relative;overflow:hidden;}
  .flow::before{
    content:"";position:absolute;inset:0;
    background:radial-gradient(600px 240px at 85% -10%, rgba(52,211,153,.35), transparent 60%);
  }
  .flow-head{position:relative;max-width:520px;margin-bottom:44px;}
  .flow-head .eyebrow{color:var(--violet-400);}
  .flow-head h2{color:#fff;font-size:clamp(24px,3vw,32px);margin-top:12px;}
  .flow-steps{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
  .flow-step .num{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--violet-400);margin-bottom:14px;}
  .flow-step h3{color:#fff;font-size:17px;margin-bottom:8px;font-weight:600;}
  .flow-step p{color:rgba(255,255,255,.68);font-size:13.8px;line-height:1.55;margin:0;}
  @media (max-width:800px){.flow-steps{grid-template-columns:1fr;}.flow{padding:40px 26px;}}

  /* ---------- PAYMENT METHODS ---------- */
  .methods{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;}
  .pill{
    display:flex;align-items:center;gap:8px;
    padding:10px 18px;border-radius:999px;background:var(--paper);
    border:1px solid var(--line);font-size:14px;font-weight:500;
  }
  .pill .dot{width:8px;height:8px;border-radius:50%;background:var(--violet-500);}

  /* ---------- FOOTER ---------- */
  footer{border-top:1px solid var(--line);padding:44px 0 30px;}
  .footer-grid{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;flex-wrap:wrap;}
  footer .brand{font-size:16px;}
  footer .foot-note{color:var(--ink-soft);font-size:13px;max-width:420px;line-height:1.6;text-align:right;}
  footer .foot-note .credit{
    font-family:'IBM Plex Mono',monospace;font-size:11.5px;color:var(--ink-soft);
    margin-top:10px;display:block;
  }
  @media (max-width:640px){footer .foot-note{text-align:left;}}

  @media (max-width:900px){
    .hero-grid{grid-template-columns:1fr;}
    .receipt-stage{order:-1;margin-bottom:10px;}
    nav.links{display:none;}
  }

  @media (prefers-reduced-motion: reduce){
    *{transition:none !important;scroll-behavior:auto !important;}
  }
`}</style>
      <div className="landing-page">


<header className="nav">
  <div className="nav-inner">
    <div className="brand"><span className="mark"></span>Cashier-in</div>
    <nav className="links">
      <a href="#fitur">Fitur</a>
      <a href="#cara-kerja">Cara Kerja</a>
      <a href="#pembayaran">Pembayaran</a>
    </nav>
    <a href="/login" className="btn btn-primary">Masuk ke Dashboard</a>
  </div>
</header>

<section className="hero">
  <div className="wrap hero-grid">
    <div>
      <span className="eyebrow">Aplikasi Kasir Digital</span>
      <h1>Satu layar untuk<br />jualan, bayar, dan<br /><span className="hl">catat semuanya.</span></h1>
      <p className="lead">Cashier-in merapikan kerja kasir harian — dari transaksi di meja kasir sampai laporan penjualan bulanan — dalam satu aplikasi yang ringan dipakai.</p>
      <div className="hero-cta">
        <a href="/login" className="btn btn-primary">Masuk ke Dashboard Kasir →</a>
        <a href="#fitur" className="hero-note" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>Lihat semua fitur dulu</a>
      </div>
      <div className="hero-stats">
        <div><b>8</b><span>Modul inti</span></div>
        <div><b>5</b><span>Metode pembayaran</span></div>
        <div><b>2</b><span>Format ekspor laporan</span></div>
      </div>
    </div>

    <div className="receipt-stage">
      <div className="receipt">
        <div className="r-top">
          <b>CASHIER-IN</b>
          <span>STRUK FITUR &middot; 001/VIII/26</span>
        </div>
        <div className="r-line"><span>Dashboard Penjualan</span><span className="check">✓</span></div>
        <div className="r-line"><span>Manajemen Produk</span><span className="check">✓</span></div>
        <div className="r-line"><span>Keranjang &amp; Bayar</span><span className="check">✓</span></div>
        <div className="r-line"><span>Cetak Struk</span><span className="check">✓</span></div>
        <div className="r-line"><span>Riwayat Transaksi</span><span className="check">✓</span></div>
        <div className="r-line"><span>Statistik Toko</span><span className="check">✓</span></div>
        <div className="r-total"><span>TOTAL REPOT</span><span>Rp 0</span></div>
        <div className="barcode" ref={barcodeRef}></div>
        <div className="r-foot">TERIMA KASIH &middot; SIMPAN STRUK INI</div>
      </div>
    </div>
  </div>
</section>

<section className="section" id="fitur">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow">Fitur</span>
      <h2>Semua yang dibutuhkan kasir toko, dalam satu tempat.</h2>
      <p>Delapan modul yang saling terhubung — dari melayani pembeli sampai membaca laporan bulan lalu.</p>
    </div>

    <div className="feature-grid">
      <div className="feature">
        <div className="ic">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/><path d="M7 13h4"/></svg>
        </div>
        <h3>Dashboard Penjualan</h3>
        <p>Ringkasan pendapatan, jumlah transaksi, dan sisa stok terlihat begitu aplikasi dibuka, lengkap dengan filter kategori produk yang cepat.</p>
      </div>

      <div className="feature">
        <div className="ic">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.5 8.5 12 3 3.5 8.5 12 14z"/><path d="M3.5 8.5V17L12 21l8.5-4V8.5"/></svg>
        </div>
        <h3>Manajemen Produk</h3>
        <p>Tambah, ubah, dan hapus produk dengan pencarian, filter kategori, dan pengurutan. Data produk bisa diekspor ke PDF maupun Excel.</p>
      </div>

      <div className="feature">
        <div className="ic">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2.5 3h2l2.4 12.2A2 2 0 0 0 8.9 17h8.4a2 2 0 0 0 2-1.6L21 7H6"/></svg>
        </div>
        <h3>Keranjang &amp; Checkout</h3>
        <p>Kumpulkan pesanan pembeli ke keranjang, lalu selesaikan transaksi dengan kembalian otomatis untuk pembayaran tunai.</p>
      </div>

      <div className="feature">
        <div className="ic">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
        </div>
        <h3>Multi Metode Pembayaran</h3>
        <p>Terima Tunai, QRIS, Debit, Transfer, atau E-Wallet dalam satu alur pembayaran yang sama, tanpa berpindah aplikasi.</p>
      </div>

      <div className="feature">
        <div className="ic">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2h9l3 3v17H6z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>
        </div>
        <h3>Struk &amp; Invoice</h3>
        <p>Setiap transaksi otomatis menghasilkan struk digital yang bisa disesuaikan dengan logo, alamat, dan pajak toko.</p>
      </div>

      <div className="feature">
        <div className="ic">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4.3-4.3"/></svg>
        </div>
        <h3>Riwayat Transaksi</h3>
        <p>Cari struk lama berdasarkan nomor invoice, tanggal, atau metode pembayaran, lalu ekspor riwayatnya kapan saja.</p>
      </div>

      <div className="feature">
        <div className="ic">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V9"/><path d="M12 19V4"/><path d="M20 19v-6"/></svg>
        </div>
        <h3>Statistik Penjualan</h3>
        <p>Grafik tren penjualan harian hingga bulanan membantu melihat produk dan jam paling ramai secara sekilas.</p>
      </div>

      <div className="feature">
        <div className="ic">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </div>
        <h3>Pengaturan Toko</h3>
        <p>Atur nama toko, pajak, diskon, notifikasi stok menipis, dan cetak struk otomatis sesuai kebiasaan tokomu.</p>
      </div>
    </div>
  </div>
</section>

<section className="section" id="cara-kerja">
  <div className="wrap">
    <div className="flow">
      <div className="flow-head">
        <span className="eyebrow">Cara Kerja</span>
        <h2>Dari rak ke struk, tiga langkah saja.</h2>
      </div>
      <div className="flow-steps">
        <div className="flow-step">
          <div className="num">01</div>
          <h3>Pilih produk</h3>
          <p>Kasir memilih barang langsung dari dashboard, produk masuk ke keranjang secara otomatis.</p>
        </div>
        <div className="flow-step">
          <div className="num">02</div>
          <h3>Pilih pembayaran</h3>
          <p>Tentukan metode bayar — tunai, QRIS, debit, transfer, atau e-wallet — sistem menghitung totalnya.</p>
        </div>
        <div className="flow-step">
          <div className="num">03</div>
          <h3>Struk tercetak</h3>
          <p>Struk digital langsung tersimpan ke riwayat dan siap dicetak sesuai pengaturan toko.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="section" id="pembayaran">
  <div className="wrap">
    <div className="section-head">
      <span className="eyebrow">Pembayaran</span>
      <h2>Terima cara bayar apa pun yang pembeli pakai.</h2>
    </div>
    <div className="methods">
      <div className="pill"><span className="dot"></span>Tunai</div>
      <div className="pill"><span className="dot"></span>QRIS</div>
      <div className="pill"><span className="dot"></span>Debit</div>
      <div className="pill"><span className="dot"></span>Transfer</div>
      <div className="pill"><span className="dot"></span>E-Wallet</div>
    </div>
  </div>
</section>

<footer>
  <div className="wrap footer-grid">
    <div>
      <div className="brand" style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 700 }}>
        <span className="mark" style={{ width: "24px", height: "24px" }}></span>Cashier-in
      </div>
    </div>
    <div className="foot-note">
      © 2026 Cashier-in. Semua hak cipta dilindungi.
      <span className="credit">This website was developed by Bibin with help from Claude by Anthropic and ChatGPT by OpenAI.</span>
    </div>
  </div>
</footer>

      </div>
    </>
  );
}