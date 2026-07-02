import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState('');
    
    // State cho thông tin giao hàng (có thể sửa)
    const [orderName, setOrderName] = useState('');
    const [orderPhone, setOrderPhone] = useState('');
    const [orderAddress, setOrderAddress] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra đăng nhập
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            alert('Vui lòng đăng nhập để thanh toán!');
            navigate('/login');
            return;
        }
        
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Gán giá trị mặc định cho form
        setOrderName(parsedUser.fullName || '');
        setOrderPhone(parsedUser.phone || '');
        setOrderAddress(parsedUser.address || '');

        // Lấy giỏ hàng
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            const items = JSON.parse(storedCart);
            if (items.length === 0) {
                navigate('/cart');
            } else {
                setCartItems(items);
            }
        } else {
            navigate('/cart');
        }
    }, [navigate]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!orderName || !orderPhone || !orderAddress) {
            alert('Vui lòng nhập đầy đủ Tên, Số điện thoại và Địa chỉ giao hàng!');
            return;
        }
        
        setLoading(true);

        try {
            // Gộp thông tin giao hàng vào ghi chú để Backend dễ quản lý (vì DB chỉ có trường Notes)
            const finalNotes = `[Giao đến: ${orderName} - SĐT: ${orderPhone} - ĐC: ${orderAddress}] ${notes ? '| Ghi chú thêm: ' + notes : ''}`;

            const payload = {
                customerId: user.id,
                notes: finalNotes,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            await axiosClient.post('/ordersapi/checkout', payload);
            
            // Xóa giỏ hàng sau khi đặt thành công
            localStorage.removeItem('cartItems');
            window.dispatchEvent(new Event('cartUpdated')); // Update số đếm trên header
            setOrderSuccess(true);
            
        } catch (error) {
            alert('Có lỗi xảy ra khi đặt hàng: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container py-5 my-5 text-center">
                <div className="card shadow-sm border-0 rounded-4 mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="card-body p-5">
                        <img 
                            src="https://cdn-icons-png.flaticon.com/512/5290/5290058.png" 
                            alt="Success" 
                            style={{ width: '120px' }} 
                            className="mb-4"
                        />
                        <h2 className="text-success fw-bold mb-3">ĐẶT HÀNG THÀNH CÔNG!</h2>
                        <p className="text-muted mb-4">
                            Cảm ơn <b>{user?.fullName}</b> đã tin tưởng mua sắm tại QuangHa Pet.<br/>
                            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
                        </p>
                        <Link to="/shop" className="btn btn-primary px-4 py-2 fw-bold rounded-pill">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="fw-bold mb-4 text-primary">
                <i className="fas fa-money-check-alt mr-2"></i> Thanh Toán
            </h2>

            <div className="row">
                {/* Thông tin giao hàng */}
                <div className="col-lg-7 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom fw-bold py-3">
                            THÔNG TIN NHẬN HÀNG
                        </div>
                        <div className="card-body p-4">
                            {user && (
                                <form id="checkout-form" onSubmit={handlePlaceOrder}>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Họ và Tên người nhận <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={orderName} 
                                            onChange={(e) => setOrderName(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <label className="form-label text-muted small fw-bold">Email (Cố định)</label>
                                            <input type="email" className="form-control bg-light" value={user.email} readOnly />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold">Số điện thoại <span className="text-danger">*</span></label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={orderPhone} 
                                                onChange={(e) => setOrderPhone(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold">Địa chỉ giao hàng chi tiết <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={orderAddress} 
                                            onChange={(e) => setOrderAddress(e.target.value)} 
                                            required 
                                        />
                                        <small className="text-info mt-1 d-block">
                                            <i className="fas fa-info-circle"></i> Bạn có thể thay đổi thông tin nhận hàng cho riêng đơn này mà không ảnh hưởng tới hồ sơ gốc.
                                        </small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">Ghi chú cho đơn hàng (Tùy chọn)</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="3" 
                                            placeholder="Ví dụ: Giao ngoài giờ hành chính..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <div className="mt-4 p-3 bg-light rounded border border-info">
                                        <h6 className="fw-bold text-info mb-2"><i className="fas fa-info-circle mr-1"></i> Phương thức thanh toán</h6>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="payment" id="cod" defaultChecked />
                                            <label className="form-check-label" htmlFor="cod">
                                                Thanh toán khi nhận hàng (COD)
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="col-lg-5">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom fw-bold py-3">
                            ĐƠN HÀNG CỦA BẠN ({cartItems.length} SẢN PHẨM)
                        </div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                {cartItems.map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center p-3">
                                        <div className="d-flex align-items-center" style={{ width: '70%' }}>
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name} 
                                                style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '5px' }}
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/45?text=Pet' }}
                                                className="mr-3"
                                            />
                                            <div>
                                                <h6 className="my-0 text-truncate" style={{ fontSize: '14px', maxWidth: '180px' }}>{item.name}</h6>
                                                <small className="text-muted">SL: {item.quantity}</small>
                                            </div>
                                        </div>
                                        <span className="fw-bold" style={{ fontSize: '14px' }}>
                                            {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card-footer bg-white p-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tạm tính:</span>
                                <span className="fw-bold">{calculateTotal().toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                                <span className="text-muted">Phí giao hàng:</span>
                                <span className="text-success fw-bold">Miễn phí</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <strong style={{ fontSize: '18px' }}>Tổng cộng:</strong>
                                <strong className="text-danger" style={{ fontSize: '22px' }}>
                                    {calculateTotal().toLocaleString('vi-VN')} ₫
                                </strong>
                            </div>
                            
                            <button 
                                type="submit" 
                                form="checkout-form"
                                className="btn btn-danger w-100 btn-lg fw-bold rounded-pill shadow"
                                disabled={loading}
                            >
                                {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                            </button>
                            <div className="text-center mt-3">
                                <Link to="/cart" className="text-decoration-none text-muted small">
                                    <i className="fas fa-angle-left mr-1"></i> Quay lại giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
