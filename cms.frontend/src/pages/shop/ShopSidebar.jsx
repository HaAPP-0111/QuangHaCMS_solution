import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

// Component nhận state lọc từ Component cha (shop/index.jsx) và bắn sự kiện thay đổi lên trên
function ShopSidebar({ activeCategoryId, onSelectCategory, minPrice, maxPrice, onChangePriceRange }) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // State tạm cho 2 ô nhập khoảng giá, chỉ bắn lên cha khi bấm nút Lọc
    const [tempMin, setTempMin] = useState(minPrice);
    const [tempMax, setTempMax] = useState(maxPrice);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục cho Sidebar:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleApplyPriceFilter = (e) => {
        e.preventDefault();
        onChangePriceRange(tempMin, tempMax);
    };

    const handleResetFilter = () => {
        setTempMin('');
        setTempMax('');
        onSelectCategory(null);
        onChangePriceRange('', '');
    };

    return (
        <div className="shop-sidebar">
            {/* KHỐI 1: DANH MỤC SẢN PHẨM */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white border-bottom-0 pt-3 pb-1">
                    <h6 className="font-weight-bold text-uppercase text-dark m-0">
                        <i className="fas fa-filter mr-2 text-primary"></i> Danh mục
                    </h6>
                </div>
                <div className="card-body p-0">
                    {loadingCategories ? (
                        <div className="text-center py-3 text-muted small">Đang tải...</div>
                    ) : (
                        <div className="list-group list-group-flush">
                            <button
                                type="button"
                                className={`list-group-item list-group-item-action border-0 d-flex align-items-center ${activeCategoryId === null ? 'font-weight-bold text-primary' : 'text-secondary'}`}
                                onClick={() => onSelectCategory(null)}
                            >
                                <i className="fas fa-chevron-right mr-2" style={{ fontSize: '10px' }}></i>
                                Tất cả sản phẩm
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    className={`list-group-item list-group-item-action border-0 d-flex align-items-center ${activeCategoryId === cat.id ? 'font-weight-bold text-primary' : 'text-secondary'}`}
                                    onClick={() => onSelectCategory(cat.id)}
                                >
                                    <i className="fas fa-chevron-right mr-2" style={{ fontSize: '10px' }}></i>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* KHỐI 2: KHOẢNG GIÁ */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-bottom-0 pt-3 pb-1">
                    <h6 className="font-weight-bold text-uppercase text-dark m-0">
                        <i className="fas fa-tag mr-2 text-primary"></i> Khoảng giá (đ)
                    </h6>
                </div>
                <div className="card-body">
                    <form onSubmit={handleApplyPriceFilter}>
                        <div className="form-row">
                            <div className="col-6">
                                <label className="small text-muted mb-1">Từ</label>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="0"
                                    value={tempMin}
                                    onChange={(e) => setTempMin(e.target.value)}
                                />
                            </div>
                            <div className="col-6">
                                <label className="small text-muted mb-1">Đến</label>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    placeholder="999.000"
                                    value={tempMax}
                                    onChange={(e) => setTempMax(e.target.value)}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm btn-block mt-3">
                            Áp dụng
                        </button>
                        <button type="button" className="btn btn-outline-secondary btn-sm btn-block mt-2" onClick={handleResetFilter}>
                            Xóa bộ lọc
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ShopSidebar;
