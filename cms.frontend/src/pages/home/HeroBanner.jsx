import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

// Nội dung cho từng slide banner
const slides = [
    {
        badge: '🔥 HOT DEAL',
        title: <>Chăm sóc <span className="highlight">Thú Cưng</span> của bạn tốt nhất!</>,
        subtitle: 'Cung cấp thức ăn, phụ kiện, đồ chơi cao cấp cho chó mèo. Miễn phí giao hàng cho đơn từ 500K.',
    },
    {
        badge: '🐾 MỚI VỀ',
        title: <>Bộ sưu tập <span className="highlight">Mùa Hè 2025</span> đã có mặt!</>,
        subtitle: 'Quần áo, phụ kiện thời trang cho thú cưng. Chất liệu mát mẻ, thoáng khí, đủ size cho boss.',
    },
    {
        badge: '⭐ BEST SELLER',
        title: <>Thức ăn <span className="highlight">Hạt Nhập Khẩu</span> chính hãng</>,
        subtitle: 'Royal Canin, Whiskas, Zenith — đầy đủ dòng sản phẩm cho chó và mèo mọi lứa tuổi.',
    },
];

// Dữ liệu feature cards bên phải
const features = [
    { icon: '🚚', title: 'Giao hàng miễn phí', desc: 'Đơn hàng từ 500.000₫' },
    { icon: '🔄', title: 'Đổi trả trong 7 ngày', desc: 'Nếu sản phẩm lỗi từ nhà sản xuất' },
    { icon: '💬', title: 'Tư vấn 24/7', desc: 'Hotline: 090.xxx.xxx' },
];

function HeroBanner() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    // Danh sách từ khóa typing effect
    const typingWords = ['Chó cưng 🐕', 'Mèo xinh 🐱', 'Hamster 🐹', 'Thỏ bông 🐰'];
    const [wordIndex, setWordIndex] = useState(0);

    // Auto-slide mỗi 5 giây
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Typing animation effect
    const animateTyping = useCallback(() => {
        const word = typingWords[wordIndex];
        let charIndex = 0;
        let deleting = false;

        const typeInterval = setInterval(() => {
            if (!deleting) {
                // Đang gõ
                setTypingText(word.substring(0, charIndex + 1));
                charIndex++;
                if (charIndex === word.length) {
                    deleting = true;
                    // Dừng 1.5s trước khi xóa
                    setTimeout(() => {}, 1500);
                }
            } else {
                // Đang xóa
                setTypingText(word.substring(0, charIndex - 1));
                charIndex--;
                if (charIndex === 0) {
                    clearInterval(typeInterval);
                    setWordIndex(prev => (prev + 1) % typingWords.length);
                }
            }
        }, deleting ? 50 : 100);

        return () => clearInterval(typeInterval);
    }, [wordIndex]);

    useEffect(() => {
        const cleanup = animateTyping();
        return cleanup;
    }, [animateTyping]);

    return (
        <section className="hero-banner">
            {/* Background Slides */}
            <div className="hero-slides">
                {slides.map((_, idx) => (
                    <div key={idx} className={`hero-slide hero-slide-${idx + 1} ${idx === currentSlide ? 'active' : ''}`} />
                ))}
            </div>

            {/* Overlay gradient */}
            <div className="hero-overlay" />

            {/* Floating Paw Particles */}
            <div className="hero-particles">
                {[...Array(8)].map((_, i) => (
                    <span key={i} className="paw">🐾</span>
                ))}
            </div>

            {/* Main Content */}
            <div className="hero-content">
                {/* Left: Text */}
                <div className="hero-text">
                    <span className="hero-badge">{slides[currentSlide].badge}</span>
                    <h1 className="hero-title">{slides[currentSlide].title}</h1>
                    <p className="hero-subtitle">
                        {slides[currentSlide].subtitle}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontSize: '0.95rem' }}>
                        Dành cho:{' '}
                        <span className="hero-typing">{typingText}</span>
                    </p>

                    <div className="hero-buttons">
                        <Link to="/shop" className="hero-btn-primary">
                            🛒 Mua sắm ngay
                        </Link>
                        <Link to="/blog" className="hero-btn-secondary">
                            📰 Xem tin tức
                        </Link>
                    </div>
                </div>

                {/* Right: Feature Cards */}
                <div className="hero-features">
                    {features.map((f, idx) => (
                        <div key={idx} className="hero-feature-card">
                            <div className="hero-feature-icon">{f.icon}</div>
                            <div className="hero-feature-info">
                                <h5>{f.title}</h5>
                                <p>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="hero-indicators">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default HeroBanner;
