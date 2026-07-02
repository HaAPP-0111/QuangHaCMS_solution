import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        // Lấy giỏ hàng hiện tại
        const storedCart = localStorage.getItem('cartItems');
        let cart = storedCart ? JSON.parse(storedCart) : [];

        // Kiểm tra xem sản phẩm đã có trong giỏ chưa
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        const currentQtyInCart = existingItemIndex >= 0 ? cart[existingItemIndex].quantity : 0;

        // TIÊU CHÍ 42: Kiểm tra tồn kho trước khi thêm
        const totalRequestedQty = currentQtyInCart + quantity;
        if (totalRequestedQty > product.stockQuantity) {
            alert(`Lỗi: Số lượng sản phẩm trong kho không đủ! Chỉ còn ${product.stockQuantity} sản phẩm (Bạn đã có ${currentQtyInCart} trong giỏ).`);
            return;
        }

        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity,
                stockQuantity: product.stockQuantity
            });
        }

        // Lưu và phát sự kiện cập nhật Header
        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));

        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
        navigate('/cart');
    };

    if (loading) {
        return <div className="container py-5 text-center"><h5>Đang tải dữ liệu sản phẩm...</h5></div>;
    }

    if (!product) {
        return (
            <div className="container py-5 text-center">
                <h3 className="text-danger">Không tìm thấy sản phẩm!</h3>
                <Link to="/shop" className="btn btn-primary mt-3">Quay lại Cửa hàng</Link>
            </div>
        );
    }

    return (
        <div className="container py-5 my-4">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent px-0">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/shop" className="text-decoration-none">Cửa hàng</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="row g-5 mt-2 bg-white p-4 shadow-sm rounded-4">
                {/* Cột ảnh sản phẩm */}
                <div className="col-md-5 text-center">
                    <div className="position-relative">
                        {product.stockQuantity <= 0 && (
                            <span className="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2 fs-6 z-1" style={{ zIndex: 10 }}>HẾT HÀNG</span>
                        )}
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="img-fluid rounded shadow-sm w-100 object-fit-cover"
                            style={{ maxHeight: '450px' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/450?text=Pet' }}
                        />
                    </div>
                </div>

                {/* Cột thông tin chi tiết */}
                <div className="col-md-7">
                    <span className="text-uppercase text-muted small fw-bold tracking-wider">
                        {product.categoryProduct?.name || 'Danh mục chung'}
                    </span>
                    <h2 className="fw-bold mt-2 text-dark">{product.name}</h2>
                    
                    <div className="d-flex align-items-center mb-3">
                        <div className="text-warning mr-2">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star-half-alt"></i>
                        </div>
                        <span className="text-muted small">(150 đánh giá)</span>
                    </div>

                    <h3 className="text-danger fw-bold mb-4">
                        {product.price.toLocaleString('vi-VN')} ₫
                    </h3>

                    <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                        {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                    </p>

                    <div className="d-flex align-items-center mb-4 mt-4">
                        <span className="fw-bold mr-3">Trạng thái:</span>
                        {product.stockQuantity > 0 ? (
                            <span className="badge bg-success-subtle text-success px-3 py-2 fs-6">
                                <i className="fas fa-check-circle mr-1"></i> Còn {product.stockQuantity} sản phẩm
                            </span>
                        ) : (
                            <span className="badge bg-danger-subtle text-danger px-3 py-2 fs-6">
                                <i className="fas fa-times-circle mr-1"></i> Hết hàng
                            </span>
                        )}
                    </div>

                    <hr className="my-4" />

                    {/* Khối Đặt hàng */}
                    <div className="d-flex align-items-center mb-4">
                        <div className="mr-4">
                            <label className="form-label text-muted fw-bold mb-2">Số lượng</label>
                            <div className="input-group" style={{ width: '130px' }}>
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={product.stockQuantity <= 0}
                                >
                                    <i className="fas fa-minus"></i>
                                </button>
                                <input 
                                    type="text" 
                                    className="form-control text-center fw-bold" 
                                    value={quantity} 
                                    readOnly 
                                />
                                <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={product.stockQuantity <= 0 || quantity >= product.stockQuantity}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-grow-1 align-self-end">
                            <button 
                                className="btn btn-primary btn-lg w-100 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                                onClick={handleAddToCart}
                                disabled={product.stockQuantity <= 0}
                                style={{ height: '48px' }}
                            >
                                <i className="fas fa-cart-plus"></i>
                                THÊM VÀO GIỎ HÀNG
                            </button>
                        </div>
                    </div>

                    {/* Quyền lợi */}
                    <div className="row mt-5 pt-3 border-top">
                        <div className="col-4 text-center">
                            <i className="fas fa-truck fs-3 text-info mb-2"></i>
                            <p className="small mb-0 fw-bold">Giao hàng toàn quốc</p>
                        </div>
                        <div className="col-4 text-center border-start border-end">
                            <i className="fas fa-sync fs-3 text-info mb-2"></i>
                            <p className="small mb-0 fw-bold">Đổi trả 7 ngày</p>
                        </div>
                        <div className="col-4 text-center">
                            <i className="fas fa-shield-alt fs-3 text-info mb-2"></i>
                            <p className="small mb-0 fw-bold">Thanh toán an toàn</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
