'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, Calendar, ArrowRight, Eye, Clock, Search, Flame, X, ChevronDown } from 'lucide-react';
import { TinTucService } from '@/services/tin-tuc.service';
import { slugTinTuc } from '@/utils/taoSlug';

const CHUYEN_MUC = [
  { ten: 'Tất Cả', loc: '' },
  { ten: 'Tư Vấn Mua Sắm', loc: 'Tư Vấn Mua Sắm' },
  { ten: 'Xu Hướng Công Nghệ', loc: 'Xu Hướng Công Nghệ' },
  { ten: 'Đánh Giá & So Sánh', loc: 'Đánh Giá & So Sánh' },
  { ten: 'Tin Tức Công Nghệ', loc: 'Tin Tức Công Nghệ' },
  { ten: 'Chia Sẻ Kinh Nghiệm', loc: 'Chia Sẻ Kinh Nghiệm' },
];

const ANH_FALLBACK = (cm) => {
  const m = {
    'Tư Vấn Mua Sắm': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80',
    'Xu Hướng Công Nghệ': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&q=80',
    'Đánh Giá & So Sánh': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80',
    'Tin Tức Công Nghệ': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=700&q=80',
    'Chia Sẻ Kinh Nghiệm': 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=700&q=80',
  };
  return m[cm] || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=700&q=80';
};

const MAU_BADGE = (cm) => {
  const m = {
    'Tư Vấn Mua Sắm': '#3b82f6',
    'Xu Hướng Công Nghệ': '#10b981',
    'Đánh Giá & So Sánh': '#f59e0b',
    'Tin Tức Công Nghệ': '#8b5cf6',
    'Chia Sẻ Kinh Nghiệm': '#ef4444',
  };
  return m[cm] || '#64748b';
};

const FAQ_LIST = [
  { hoi: 'Laptop gaming nào phù hợp cho sinh viên ngân sách 15-20 triệu?', tra: 'Với ngân sách này, ASUS TUF Gaming A15, Lenovo IdeaPad Gaming 3, hay Acer Nitro 5 là lựa chọn tuyệt vời — đều có card RTX 3050/4060, đủ chơi game và học tập.' },
  { hoi: 'Sự khác biệt giữa Intel Core Ultra và Core thế hệ 14 là gì?', tra: 'Intel Core Ultra (Meteor Lake) là kiến trúc tile-based hoàn toàn mới với NPU tích hợp cho AI. Thế hệ 14 vẫn dùng kiến trúc cũ nhưng hiệu năng đơn nhân cao hơn ở một số tác vụ.' },
  { hoi: 'Nên chọn laptop AI PC hay laptop gaming thông thường?', tra: 'AI PC phù hợp cho sáng tạo, lập trình AI/ML và đa nhiệm mượt. Laptop gaming phù hợp hơn nếu chơi game là ưu tiên chính nhờ GPU rời mạnh hơn.' },
  { hoi: 'Khi nào cần nâng cấp RAM cho laptop?', tra: 'Khi laptop chậm khi mở nhiều tab, chạy nhiều ứng dụng, hoặc RAM thường xuyên >80% — nâng từ 8GB lên 16GB cải thiện rõ rệt.' },
  { hoi: 'MacBook M3 hay Windows laptop cho lập trình?', tra: 'MacBook M3 xuất sắc về hiệu năng/pin và môi trường Unix native. Windows linh hoạt hơn, dễ nâng cấp. Game dev hoặc cần GPU mạnh: Windows chiếm ưu thế.' },
];

function CardBaiViet({ tin }) {
  const slug = slugTinTuc(tin);
  const hinh = tin.hinh_anh || ANH_FALLBACK(tin.chuyen_muc);
  const mau = MAU_BADGE(tin.chuyen_muc);
  return (
    <Link href={`/tin-tuc/${slug}`} className="card-tin"
      style={{ display: 'flex', flexDirection: 'column', background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', background: '#e2e8f0', overflow: 'hidden' }}>
        <Image src={hinh} alt={tin.tieu_de} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
        <span style={{ position: 'absolute', top: '9px', left: '9px', padding: '3px 9px', borderRadius: '20px', fontSize: '10.5px', fontWeight: '700', background: mau, color: 'white' }}>{tin.chuyen_muc}</span>
        <span style={{ position: 'absolute', bottom: '9px', right: '9px', padding: '2px 7px', borderRadius: '7px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Eye style={{ width: '10px', height: '10px' }} />{tin.luot_xem || 120}
        </span>
      </div>
      <div style={{ padding: '13px 15px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#94a3b8', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Calendar style={{ width: '10px', height: '10px' }} />{tin.ngay_dang || '20/08/2026'}</span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Clock style={{ width: '10px', height: '10px' }} />{tin.thoi_gian_doc || '4 phút'}</span>
        </div>
        <h3 style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a', lineHeight: 1.42, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{tin.tieu_de}</h3>
        <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, flex: 1 }}>{tin.tom_tat}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '9px', borderTop: '1px solid #f8fafc', marginTop: 'auto' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>✍️ {tin.tac_gia || 'TNTP'}</span>
          <span style={{ fontSize: '12px', color: '#1d4ed8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}>Đọc thêm <ArrowRight style={{ width: '12px', height: '12px' }} /></span>
        </div>
      </div>
    </Link>
  );
}

export default function TrangTinTuc() {
  const [danhSachTin, setDanhSachTin] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [locChon, setLocChon] = useState('');
  const [tuKhoa, setTuKhoa] = useState('');
  const [moFaq, setMoFaq] = useState(null);
  const [hienThem, setHienThem] = useState(6);

  useEffect(() => {
    (async () => {
      setDangTai(true);
      try { setDanhSachTin((await TinTucService.layDanhSachTinTucAsync()) || []); }
      catch (e) { console.error(e); }
      finally { setDangTai(false); }
    })();
  }, []);

  const danhSachLoc = useMemo(() => {
    return danhSachTin.filter(t => {
      const khopCM = !locChon || t.chuyen_muc === locChon;
      const khopTK = !tuKhoa || t.tieu_de?.toLowerCase().includes(tuKhoa.toLowerCase()) || t.tom_tat?.toLowerCase().includes(tuKhoa.toLowerCase());
      return khopCM && khopTK;
    });
  }, [danhSachTin, locChon, tuKhoa]);

  const baiNoi = danhSachLoc.find(t => t.la_tieu_diem) || danhSachLoc[0] || null;
  const coBai = baiNoi ? danhSachLoc.filter(t => (t.id || t._id) !== (baiNoi.id || baiNoi._id)) : danhSachLoc;

  return (
    <div className="min-h-screen">
      <style>{`
        .tt-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        @media(max-width:1024px){.tt-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:640px){.tt-grid{grid-template-columns:1fr;}}
        .tt-hero { display:grid; grid-template-columns:1.1fr 0.9fr; }
        @media(max-width:900px){.tt-hero{grid-template-columns:1fr;}}
        .dm-bar { display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; }
        .dm-bar::-webkit-scrollbar{display:none;}
        .card-tin:hover{box-shadow:0 8px 24px rgba(29,78,216,0.12)!important;transform:translateY(-3px)!important;border-color:#93c5fd!important;}
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 16px 48px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', marginBottom: '12px', color: '#64748b' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#64748b', textDecoration: 'none', fontWeight: '600' }}>
            <Home style={{ width: '12px', height: '12px' }} /> Trang Chủ
          </Link>
          <ChevronRight style={{ width: '12px', height: '12px', color: '#cbd5e1' }} />
          <span style={{ fontWeight: '700', color: '#1e293b' }}>Tin Tức & Cẩm Nang</span>
        </nav>

        {/* Header + Search */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '16px 20px', marginBottom: '14px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a', margin: '0 0 2px' }}>📰 Tin Tức & Cẩm Nang Công Nghệ</h1>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Đánh giá laptop • Xu hướng AI PC • Tư vấn mua sắm 2026</p>
          </div>
          <div style={{ position: 'relative', minWidth: '200px' }}>
            <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '13px', height: '13px', color: '#94a3b8' }} />
            <input type="text" value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} placeholder="Tìm bài viết..."
              style={{ width: '100%', padding: '8px 28px 8px 30px', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }} />
            {tuKhoa && <button onClick={() => setTuKhoa('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: '2px' }}><X style={{ width: '12px', height: '12px' }} /></button>}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="dm-bar" style={{ marginBottom: '16px' }}>
          {CHUYEN_MUC.map(({ ten, loc }) => {
            const active = locChon === loc;
            const count = !loc ? danhSachTin.length : danhSachTin.filter(t => t.chuyen_muc === loc).length;
            return (
              <button key={ten} onClick={() => { setLocChon(loc); setHienThem(6); }}
                style={{ padding: '7px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s', flexShrink: 0, background: active ? '#1d4ed8' : 'white', color: active ? 'white' : '#475569', border: active ? '1.5px solid #1d4ed8' : '1.5px solid #e2e8f0', boxShadow: active ? '0 4px 12px rgba(29,78,216,0.25)' : '0 1px 3px rgba(0,0,0,0.06)' }}>
                {ten}
                <span style={{ background: active ? 'rgba(255,255,255,0.22)' : '#f1f5f9', color: active ? 'white' : '#64748b', borderRadius: '8px', padding: '0px 6px', fontSize: '10.5px', fontWeight: '800' }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Bài nổi bật - chỉ hiện khi chưa lọc */}
        {!dangTai && baiNoi && !locChon && !tuKhoa && (
          <Link href={`/tin-tuc/${slugTinTuc(baiNoi)}`}
            style={{ display: 'block', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', textDecoration: 'none', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 10px 28px rgba(29,78,216,0.13)'; e.currentTarget.style.borderColor = '#93c5fd'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
            <div className="tt-hero">
              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#e2e8f0', overflow: 'hidden' }}>
                <Image src={baiNoi.hinh_anh || ANH_FALLBACK(baiNoi.chuyen_muc)} alt={baiNoi.tieu_de} fill sizes="(max-width:900px) 100vw, 55vw" style={{ objectFit: 'cover' }} priority />
                <span style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: '#dc2626', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>
                  <Flame style={{ width: '12px', height: '12px', fill: 'white' }} /> Nổi Bật
                </span>
              </div>
              <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <span style={{ background: MAU_BADGE(baiNoi.chuyen_muc), color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{baiNoi.chuyen_muc}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><Calendar style={{ width: '11px', height: '11px' }} />{baiNoi.ngay_dang || '24/08/2026'}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><Clock style={{ width: '11px', height: '11px' }} />{baiNoi.thoi_gian_doc || '5 phút'}</span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', lineHeight: 1.35, margin: 0 }}>{baiNoi.tieu_de}</h2>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.65, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{baiNoi.tom_tat}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '12.5px', color: '#374151', fontWeight: '600' }}>✍️ {baiNoi.tac_gia || 'Ban Biên Tập TNTP'}</span>
                  <span style={{ fontSize: '13px', color: '#1d4ed8', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>Đọc chi tiết <ArrowRight style={{ width: '14px', height: '14px' }} /></span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Tiêu đề lưới */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
          <span style={{ width: '4px', height: '18px', background: '#1d4ed8', borderRadius: '2px' }} />
          <h2 style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {locChon || tuKhoa ? `Kết Quả Tìm Kiếm` : 'Bài Viết Mới Nhất'}
            <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500', textTransform: 'none', letterSpacing: 0, marginLeft: '6px' }}>({coBai.length} bài)</span>
          </h2>
        </div>

        {/* Loading */}
        {dangTai && (
          <div className="tt-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '16/10', background: '#f1f5f9' }} />
                <div style={{ padding: '13px' }}>
                  <div style={{ height: '11px', background: '#f1f5f9', borderRadius: '5px', marginBottom: '8px', width: '55%' }} />
                  <div style={{ height: '13px', background: '#f1f5f9', borderRadius: '5px', marginBottom: '5px' }} />
                  <div style={{ height: '13px', background: '#f1f5f9', borderRadius: '5px', width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Không có kết quả */}
        {!dangTai && coBai.length === 0 && (
          <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
            <p style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '5px' }}>Không tìm thấy bài viết</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px' }}>Thử từ khóa khác hoặc đổi chuyên mục</p>
            <button onClick={() => { setTuKhoa(''); setLocChon(''); }}
              style={{ padding: '8px 18px', borderRadius: '9px', background: '#1d4ed8', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
              Xem tất cả
            </button>
          </div>
        )}

        {/* Lưới bài viết */}
        {!dangTai && coBai.length > 0 && (
          <>
            <div className="tt-grid">
              {coBai.slice(0, hienThem).map((tin) => <CardBaiViet key={tin.id || tin._id} tin={tin} />)}
            </div>

            {/* Load more */}
            {hienThem < coBai.length && (
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button onClick={() => setHienThem(prev => prev + 6)}
                  style={{ padding: '10px 28px', borderRadius: '12px', background: 'white', border: '1.5px solid #e2e8f0', color: '#1d4ed8', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.target.style.background = '#eff6ff'; e.target.style.borderColor = '#93c5fd'; }}
                  onMouseLeave={e => { e.target.style.background = 'white'; e.target.style.borderColor = '#e2e8f0'; }}>
                  Xem thêm {Math.min(6, coBai.length - hienThem)} bài →
                </button>
              </div>
            )}
          </>
        )}

        {/* FAQ */}
        <div style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '14px' }}>
            <span style={{ width: '4px', height: '18px', background: '#1d4ed8', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '14px', fontWeight: '900', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Câu Hỏi Thường Gặp</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '8px' }}>
            {FAQ_LIST.map((item, idx) => (
              <div key={idx} style={{ background: 'white', borderRadius: '12px', border: moFaq === idx ? '1.5px solid #93c5fd' : '1px solid #e2e8f0', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button onClick={() => setMoFaq(moFaq === idx ? null : idx)}
                  style={{ width: '100%', padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '10px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#0f172a', lineHeight: 1.4 }}>❓ {item.hoi}</span>
                  <ChevronDown style={{ width: '15px', height: '15px', color: '#94a3b8', flexShrink: 0, transform: moFaq === idx ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                </button>
                {moFaq === idx && (
                  <div style={{ padding: '0 16px 14px', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.65, margin: '10px 0 0' }}>{item.tra}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}