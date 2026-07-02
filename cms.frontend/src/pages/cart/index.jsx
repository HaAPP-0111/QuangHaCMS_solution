import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // Lấy dữ liệu giỏ hàng từ localStorage khi tải trang
    useEffect(() => {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        } else {
            // Dữ liệu mẫu (mock data) nếu giỏ hàng trống để test UI
            // Gỡ bỏ đoạn này ở thực tế
            const mockData = [
                {
                    id: 1,
                    name: 'Máy cắt móng tay cho thú cưng',
                    price: 320000,
                    quantity: 1,
                    imageUrl: '/images/products/may_cat_mong.jpg' // Thay thế bằng đường dẫn ảnh thực tế
                },
                {
                    id: 2,
                    name: 'Lược chải lông chống rối',
                    price: 85000,
                    quantity: 2,
                    imageUrl: '/images/products/luoc_chai_long.jpg'
                }
            ];
            setCartItems(mockData);
            localStorage.setItem('cartItems', JSON.stringify(mockData));
        }
    }, []);

    // Hàm lưu giỏ hàng vào localStorage mỗi khi có thay đổi
    const saveCart = (items) => {
        setCartItems(items);
        localStorage.setItem('cartItems', JSON.stringify(items));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // Tăng số lượng
    const increaseQuantity = (id) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id) {
                // Kiểm tra tồn kho (nếu có trường stockQuantity)
                if (item.stockQuantity !== undefined && item.quantity >= item.stockQuantity) {
                    alert(`Không thể thêm! Sản phẩm này chỉ còn tối đa ${item.stockQuantity} cái trong kho.`);
                    return item;
                }
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        saveCart(updatedCart);
    };

    // Giảm số lượng
    const decreaseQuantity = (id) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        saveCart(updatedCart);
    };

    // Xóa sản phẩm khỏi giỏ
    const removeItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        saveCart(updatedCart);
    };

    // Tính tổng tiền
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Xử lý thanh toán
    const handleCheckout = () => {
        const user = localStorage.getItem('user');
        if (!user) {
            alert('Vui lòng đăng nhập để tiến hành thanh toán!');
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    return (
        <div className="container py-5 my-3">
            <h2 className="fw-bold mb-4 text-primary">
                <i className="fas fa-shopping-cart mr-2"></i> Giỏ Hàng Của Bạn
            </h2>

            {cartItems.length === 0 ? (
                <div className="text-center py-5 bg-white shadow-sm rounded">
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
                        alt="Empty Cart" 
                        style={{ width: '150px', opacity: '0.6' }} 
                        className="mb-4"
                    />
                    <h4 className="text-muted">Giỏ hàng của bạn đang trống</h4>
                    <p className="mb-4">Hãy tiếp tục mua sắm để tìm sản phẩm ưng ý nhé!</p>
                    <Link to="/shop" className="btn btn-primary px-4 py-2 fw-bold">
                        Quay lại Cửa hàng
                    </Link>
                </div>
            ) : (
                <div className="row">
                    {/* Cột danh sách sản phẩm */}
                    <div className="col-lg-8 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th scope="col" className="ps-4">Sản phẩm</th>
                                                <th scope="col" className="text-center">Đơn giá</th>
                                                <th scope="col" className="text-center">Số lượng</th>
                                                <th scope="col" className="text-center">Thành tiền</th>
                                                <th scope="col" className="text-center pe-4">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map(item => (
                                                <tr key={item.id}>
                                                    <td className="ps-4 py-3">
                                                        <div className="d-flex align-items-center">
                                                            <div 
                                                                style={{ 
                                                                    width: '60px', 
                                                                    height: '60px', 
                                                                    backgroundColor: '#f8f9fa',
                                                                    borderRadius: '8px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    overflow: 'hidden'
                                                                }} 
                                                                className="mr-3 flex-shrink-0"
                                                            >
                                                                <img 
                                                                    src={item.imageUrl} 
                                                                    alt={item.name}
                                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60?text=Pet' }}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Link to={`/product/${item.id}`} className="text-dark text-decoration-none fw-bold" style={{ fontSize: '15px' }}>
                                                                    {item.name}
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-center fw-bold text-secondary">
                                                        {item.price.toLocaleString('vi-VN')} ₫
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="btn-group btn-group-sm" role="group">
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-outline-secondary px-2"
                                                                onClick={() => decreaseQuantity(item.id)}
                                                            >
                                                                <i className="fas fa-minus" style={{fontSize: '10px'}}></i>
                                                            </button>
                                                            <span className="btn btn-outline-secondary px-3" style={{ pointerEvents: 'none', fontWeight: 'bold' }}>
                                                                {item.quantity}
                                                            </span>
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-outline-secondary px-2"
                                                                onClick={() => increaseQuantity(item.id)}
                                                            >
                                                                <i className="fas fa-plus" style={{fontSize: '10px'}}></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="text-center fw-bold text-danger">
                                                        {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                                                    </td>
                                                    <td className="text-center pe-4">
                                                        <button 
                                                            className="btn btn-light text-danger btn-sm rounded-circle"
                                                            onClick={() => removeItem(item.id)}
                                                            title="Xóa sản phẩm"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-3">
                            <Link to="/shop" className="text-decoration-none text-primary fw-bold">
                                <i className="fas fa-arrow-left mr-1"></i> Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>

                    {/* Cột Tổng kết (Tạm tính) */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 bg-white">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4 border-bottom pb-2">Tóm tắt đơn hàng</h5>
                                
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Tạm tính ({cartItems.length} sản phẩm):</span>
                                    <span className="fw-bold">{calculateTotal().toLocaleString('vi-VN')} ₫</span>
                                </div>
                                
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Phí giao hàng:</span>
                                    <span className="text-success fw-bold">Miễn phí</span>
                                </div>
                                
                                <div className="d-flex justify-content-between mb-4 border-top pt-3">
                                    <span className="fw-bold" style={{ fontSize: '18px' }}>Tổng cộng:</span>
                                    <span className="fw-bold text-danger" style={{ fontSize: '22px' }}>
                                        {calculateTotal().toLocaleString('vi-VN')} ₫
                                    </span>
                                </div>
                                
                                <button 
                                    className="btn btn-primary w-100 btn-lg fw-bold shadow-sm"
                                    onClick={handleCheckout}
                                >
                                    TIẾN HÀNH THANH TOÁN
                                </button>
                                
                                <div className="mt-4 pt-3 border-top text-center">
                                    <p className="text-muted small mb-2">Chấp nhận thanh toán qua:</p>
                                    <div className="d-flex justify-content-center gap-2">
                                        <img src="https://cdn-icons-png.flaticon.com/32/196/196566.png" alt="Paypal" className="mx-1" />
                                        <img src="https://cdn-icons-png.flaticon.com/32/196/196578.png" alt="Visa" className="mx-1" />
                                        <img src="https://cdn-icons-png.flaticon.com/32/196/196561.png" alt="Mastercard" className="mx-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
