import React from 'react';

const IMAGE_BASE_URL = "https://localhost:7083"; // đổi đúng port Backend của bạn

// Hàm bổ trợ: Hỗ trợ cả 2 trường hợp - ảnh URL đầy đủ (online) hoặc ảnh lưu trên Backend (đường dẫn tương đối)
const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/400x500/eeeeee/999999?text=No+Image';
    if (path.startsWith('http')) return path; // Đã là URL đầy đủ (Unsplash, Pexels...)
    return IMAGE_BASE_URL + path; // Ảnh tương đối lưu trên Backend (wwwroot)
};

// Component nhận vào đối tượng 'item' từ component cha truyền xuống
function ProductCard({ item }) {

    // Hàm bổ trợ: Định dạng số thô thành chuỗi tiền tệ VNĐ (450.000 ₫)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    return (
        <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden', transition: '0.3s' }}>

            {/* Khối 1: Hình ảnh trang phục + Nhãn tồn kho */}
            <div className="position-relative overflow-hidden" style={{ height: '320px', backgroundColor: '#f8fafc' }}>
                <img
                    src={getImageUrl(item.imageUrl)}
                    className="card-img-top w-100 h-100"
                    alt={item.name}
                    style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />

                {/* Nếu tồn kho thấp (<= 5) thì đóng dấu cảnh báo */}
                {item.stockQuantity <= 5 && (
                    <span className="badge badge-danger position-absolute px-2 py-1" style={{ top: '15px', left: '15px', borderRadius: '4px', fontSize: '11px' }}>
                        Bán chạy / Còn {item.stockQuantity} chiếc
                    </span>
                )}
            </div>
            {/* Khối 2: Nội dung thông tin chi tiết trang phục */}
            <div className="card-body d-flex flex-column p-3">
                <h6 className="card-title font-weight-bold text-dark text-truncate mb-1" title={item.name} style={{ fontSize: '16px' }}>
                    {item.name}
                </h6>

                <p className="card-text font-weight-bold text-danger mb-3" style={{ fontSize: '17px' }}>
                    {formatCurrency(item.price)}
                </p>
                {/* Cụm nút bấm tương tác đẩy sát đáy thẻ */}
                <div className="mt-auto pt-2 border-top d-flex justify-content-between">
                    <a
                        href={`/product/${item.id}`}
                        className="btn btn-sm btn-outline-primary font-weight-bold px-3"
                        style={{ borderRadius: '20px', flexGrow: 1, textAlign: 'center' }}
                    >
                        <i className="fas fa-eye mr-1"></i> Chi tiết
                    </a>
                    <button
                        className="btn btn-sm text-white font-weight-bold px-3 ml-2"
                        style={{ borderRadius: '20px', backgroundColor: '#11CAA0', borderColor: '#11CAA0', flexGrow: 1 }}
                        onClick={() => {
                            if (item.stockQuantity <= 0) {
                                alert(`Rất tiếc! Mẫu [${item.name}] hiện đã hết hàng.`);
                                return;
                            }
                            
                            const storedCart = localStorage.getItem('cartItems');
                            let cart = storedCart ? JSON.parse(storedCart) : [];
                            
                            const existingItemIndex = cart.findIndex(c => c.id === item.id);
                            const currentQty = existingItemIndex >= 0 ? cart[existingItemIndex].quantity : 0;
                            
                            if (currentQty + 1 > item.stockQuantity) {
                                alert(`Lỗi: Số lượng trong kho không đủ! Chỉ còn ${item.stockQuantity} sản phẩm.`);
                                return;
                            }
                            
                            if (existingItemIndex >= 0) {
                                cart[existingItemIndex].quantity += 1;
                            } else {
                                cart.push({
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    imageUrl: item.imageUrl,
                                    quantity: 1
                                });
                            }
                            
                            localStorage.setItem('cartItems', JSON.stringify(cart));
                            window.dispatchEvent(new Event('cartUpdated'));
                            alert(`Đã thêm [${item.name}] vào giỏ hàng!`);
                        }}
                        disabled={item.stockQuantity <= 0}
                    >
                        <i className="fas fa-cart-plus mr-1"></i> {item.stockQuantity > 0 ? "Mua ngay" : "Hết hàng"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
