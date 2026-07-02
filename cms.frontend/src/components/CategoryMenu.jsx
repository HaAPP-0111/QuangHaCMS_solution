import React, { useState, useEffect } from 'react';
// Import dịch vụ gọi API danh mục sản phẩm đã thiết lập ở Buổi 7
import categoryProductService from '../../services/categoryProductService';

function CategoryMenu() {
    // 1. State lưu mảng danh mục sản phẩm từ SQL Server đổ về
    const [categories, setCategories] = useState([]);
    // 2. State theo dõi danh mục nào đang được người dùng bấm chọn (mặc định null = tất cả)
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    // 3. State quản lý trạng thái Loading dữ liệu mạng
    const [loading, setLoading] = useState(true);

    // 4. Gọi API ngay khi component được nạp lên trang chủ
    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuCategories();
    }, []);

    // 5. Hàm xử lý khi khách hàng click chọn một danh mục thời trang cụ thể
    const handleCategoryClick = (id) => {
        setActiveCategoryId(id);
        // Điểm mở rộng đồ án: nơi sẽ viết logic truyền Id này sang
        // để ép <ProductGrid /> (Tầng 4) tải lại sản phẩm theo bộ lọc.
        console.log(`Sinh viên sẽ xử lý lọc sản phẩm cho danh mục có ID: ${id}`);
    };

    if (loading) {
        return (
            <div className="container my-3 text-center">
                <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                <span className="ml-2 text-muted" style={{ fontSize: '14px' }}>Đang nạp menu phân loại...</span>
            </div>
        );
    }

    return (
        <section id="category-menu-section" className="category-menu-wrapper my-4">
            <div className="container">
                <div className="card shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                    <div className="card-body p-2 bg-white">
                        <div className="d-flex flex-wrap justify-content-center">
                            {/* Khối mặc định: Xem tất cả sản phẩm */}
                            <div className="m-2 text-center" style={{ width: '120px', cursor: 'pointer' }} onClick={() => handleCategoryClick(null)}>
                                <div
                                    className={`d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm`}
                                    style={{
                                        width: '80px', height: '80px', borderRadius: '50%',
                                        backgroundColor: activeCategoryId === null ? '#005088' : '#f8f9fa',
                                        color: activeCategoryId === null ? '#fff' : '#6c757d',
                                        transition: '0.3s',
                                        border: activeCategoryId === null ? '3px solid #005088' : '1px solid #dee2e6'
                                    }}
                                >
                                    <i className="fas fa-th-large fa-2x"></i>
                                </div>
                                <span className={`font-weight-bold ${activeCategoryId === null ? 'text-primary' : 'text-secondary'}`} style={{ fontSize: '14px' }}>
                                    Tất cả
                                </span>
                            </div>

                            {/* VÒNG LẶP ĐỘNG: Sinh ra các khối chứa ảnh */}
                            {categories.map((cat) => (
                                <div className="m-2 text-center" style={{ width: '120px', cursor: 'pointer' }} key={cat.id} onClick={() => handleCategoryClick(cat.id)}>
                                    <div
                                        className={`mx-auto mb-2 shadow-sm d-flex align-items-center justify-content-center`}
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            backgroundColor: '#f8f9fa',
                                            transition: '0.3s',
                                            border: activeCategoryId === cat.id ? '3px solid #11CAA0' : '1px solid #dee2e6',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {cat.imageUrl ? (
                                            <img src={cat.imageUrl} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <i className={`fas fa-paw fa-2x ${activeCategoryId === cat.id ? 'text-success' : 'text-secondary'}`}></i>
                                        )}
                                    </div>
                                    <span className={`font-weight-bold ${activeCategoryId === cat.id ? 'text-success' : 'text-secondary'}`} style={{ fontSize: '14px' }}>
                                        {cat.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
