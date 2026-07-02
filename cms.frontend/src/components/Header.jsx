import React from 'react';
// Import thành phần Link để chuyển trang mượt mà không bị tải lại trang (Hard-Reload)
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
    // Dùng hook useLocation của react-router-dom để bắt đường dẫn URL hiện tại
    const location = useLocation();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = React.useState(0);
    const [keyword, setKeyword] = React.useState('');

    // Lắng nghe thay đổi của giỏ hàng để cập nhật badge số lượng
    React.useEffect(() => {
        const updateCartCount = () => {
            const storedCart = localStorage.getItem('cartItems');
            if (storedCart) {
                const cart = JSON.parse(storedCart);
                const count = cart.reduce((total, item) => total + item.quantity, 0);
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        };

        // Chạy lần đầu
        updateCartCount();

        // Lắng nghe event custom từ ProductDetail và Cart
        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    // Hàm xử lý tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/shop?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    // Hàm hỗ trợ kiểm tra trang hiện tại để gán hiệu ứng làm sáng (Active) menu chuẩn v4
    const isActive = (path) => {
        return location.pathname === path ? 'active font-weight-bold text-primary' : 'text-dark';
    };
    return (
        <header className="main-header-wrapper bg-white shadow-sm sticky-top">
            {/* TẦNG TIỆN ÍCH 1: THANH TOP BAR */}
            <div className="top-bar bg-dark py-2 text-white" style={{ fontSize: '13px' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="top-bar-left">
                        <span className="mr-3">
                            <i className="fas fa-phone-alt mr-1"></i> Hotline: 090x.xxx.xxx
                        </span>
                        <span>
                            <i className="fas fa-envelope mr-1"></i> Email: support@thaicms.retail
                        </span>
                    </div>
                    <div className="top-bar-right">
                        {localStorage.getItem('user') ? (
                            <>
                                <span className="text-white mr-3">
                                    <i className="fas fa-user-circle mr-1"></i> Xin chào, <b>{JSON.parse(localStorage.getItem('user')).fullName}</b>!
                                </span>
                                <button 
                                    className="btn btn-link text-white text-decoration-none p-0"
                                    onClick={() => {
                                        localStorage.removeItem('user');
                                        window.location.reload();
                                    }}
                                >
                                    <i className="fas fa-sign-out-alt mr-1"></i> Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white mr-3 text-decoration-none">
                                    <i className="fas fa-user mr-1"></i> Đăng nhập
                                </Link>
                                <Link to="/register" className="text-white text-decoration-none">
                                    <i className="fas fa-user-plus mr-1"></i> Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* TẦNG TIỆN ÍCH 2: KHU VỰC CHÍNH (Logo, Search Bar & Giỏ hàng) */}
            <div className="main-header py-3 border-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-3 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="font-weight-bold m-0" style={{ color: '#005088', letterSpacing: '1px' }}>
                                    QuangHa<span style={{ color: '#11CAA0' }}>.Pet</span>
                                </h3>
                            </Link>
                        </div>
                        <div className="col-md-6 d-none d-md-block">
                            <form className="input-group" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    className="form-control border-right-0"
                                    placeholder="Tìm kiếm mẫu đầm dạ hội, sơ mi công sở..."
                                    style={{ borderRadius: '20px 0 0 20px', fontSize: '14px' }}
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary border-left-0 px-4"
                                        type="submit"
                                        style={{
                                            borderRadius: '0 20px 20px 0',
                                            backgroundColor: '#005088',
                                            borderColor: '#005088'
                                        }}
                                    >
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-3 col-6 text-right">
                            <Link to="/cart" className="btn position-relative p-2" style={{ color: '#005088', fontSize: '22px' }}>
                                <i className="fas fa-shopping-bag"></i>
                                <span
                                    className="badge badge-pill position-absolute"
                                    style={{
                                        top: '0',
                                        right: '0',
                                        backgroundColor: '#11CAA0',
                                        color: '#fff',
                                        fontSize: '11px',
                                        padding: '4px 6px'
                                    }}
                                >
                                    {cartCount}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* TẦNG TIỆN ÍCH 3: THANH MENU ĐIỀU HƯỚNG CHÍNH */}
            <div className="main-navigation bg-white py-2">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        <ul className="navbar-nav w-100">
                            <li className="nav-item mr-4">
                                <Link to="/" className={`nav-link p-0 text-decoration-none ${isActive('/')}`}>
                                    Trang Chủ
                                </Link>
                            </li>
                            <li className="nav-item mr-4">
                                <Link to="/shop" className={`nav-link p-0 text-decoration-none ${isActive('/shop')}`}>
                                    Cửa Hàng
                                </Link>
                            </li>
                            <li className="nav-item mr-4">
                                <Link to="/blog" className={`nav-link p-0 text-decoration-none ${isActive('/blog')}`}>
                                    Tin Tức / Blog
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className={`nav-link p-0 text-decoration-none ${isActive('/about')}`}>
                                    Về Chúng Tôi
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
