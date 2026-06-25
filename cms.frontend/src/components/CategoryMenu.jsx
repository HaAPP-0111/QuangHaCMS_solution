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
                        <ul className="nav nav-pills nav-fill flex-column flex-sm-row">
                            {/* Nút mặc định: Xem tất cả sản phẩm */}
                            <li className="nav-item m-1">
                                <button
                                    className={`nav-link w-100 font-weight-bold border-0 text-uppercase py-3 ${activeCategoryId === null ? 'active' : 'text-secondary bg-transparent'}`}
                                    style={{
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        backgroundColor: activeCategoryId === null ? '#005088' : 'transparent',
                                        transition: '0.3s'
                                    }}
                                    onClick={() => handleCategoryClick(null)}
                                >
                                    <i className="fas fa-th-large mr-2"></i> Tất cả sản phẩm
                                </button>
                            </li>
                            {/* VÒNG LẶP ĐỘNG: Duyệt mảng categories từ API Backend sinh ra các nút menu */}
                            {categories.map((cat) => (
                                <li className="nav-item m-1" key={cat.id}>
                                    <button
                                        className={`nav-link w-100 font-weight-bold border-0 text-uppercase py-3 ${activeCategoryId === cat.id ? 'active' : 'text-secondary bg-transparent'}`}
                                        style={{
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            backgroundColor: activeCategoryId === cat.id ? '#11CAA0' : 'transparent',
                                            color: activeCategoryId === cat.id ? '#fff' : '#6c757d',
                                            transition: '0.3s'
                                        }}
                                        onClick={() => handleCategoryClick(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;
