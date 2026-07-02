import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import productService from '../../services/productService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';

function Shop() {
    const location = useLocation();
    
    // Mảng chứa sản phẩm đã được lọc trực tiếp từ API
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lấy keyword từ URL (Header đẩy sang)
    const urlParams = new URLSearchParams(location.search);
    const keywordFromUrl = urlParams.get('keyword') || '';

    // Các State điều khiển bộ lọc cục bộ
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [keyword, setKeyword] = useState(keywordFromUrl);
    
    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Đồng bộ state keyword khi URL thay đổi
    useEffect(() => {
        setKeyword(keywordFromUrl);
        setCurrentPage(1); // Reset về trang 1 khi search mới
    }, [keywordFromUrl]);

    // Gọi API mỗi khi các bộ lọc hoặc trang thay đổi
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            try {
                setLoading(true);
                const filters = {
                    keyword: keyword,
                    categoryId: activeCategoryId,
                    minPrice: minPrice !== '' ? minPrice : null,
                    maxPrice: maxPrice !== '' ? maxPrice : null,
                    page: currentPage
                };
                const data = await productService.getAllProducts(filters);
                
                // Cập nhật state
                const prods = data.products || data.Products || (Array.isArray(data) ? data : []);
                setFilteredProducts(prods);
                setTotalPages(data.totalPages || data.TotalPages || 1);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm cho trang Shop:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredProducts();
    }, [keyword, activeCategoryId, minPrice, maxPrice, currentPage]);

    const handleChangePriceRange = (min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
        setCurrentPage(1); // Reset trang
    };
    
    const handleCategorySelect = (id) => {
        setActiveCategoryId(id);
        setCurrentPage(1); // Reset trang
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <Header />

            <div className="container my-5">
                <div className="row">
                    {/* CỘT TRÁI: BỘ LỌC */}
                    <div className="col-md-3 mb-4">
                        <ShopSidebar
                            activeCategoryId={activeCategoryId}
                            onSelectCategory={handleCategorySelect}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onChangePriceRange={handleChangePriceRange}
                        />
                    </div>

                    {/* CỘT PHẢI: TÌM KIẾM + LƯỚI SẢN PHẨM */}
                    <div className="col-md-9">
                        <ShopHeader
                            keyword={keyword}
                            onChangeKeyword={(k) => { setKeyword(k); setCurrentPage(1); }}
                            totalCount={filteredProducts.length}
                        />

                        <LoadingOrEmpty
                            loading={loading}
                            isEmpty={!loading && filteredProducts.length === 0}
                            loadingText="Đang tải danh sách sản phẩm..."
                            emptyText="Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại."
                        />

                        {!loading && filteredProducts.length > 0 && (
                            <>
                                <ProductList products={filteredProducts} />
                                
                                {/* Phân trang (Pagination) */}
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-center mt-5">
                                        <nav aria-label="Page navigation">
                                            <ul className="pagination shadow-sm">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button className="page-link px-3" onClick={() => handlePageChange(currentPage - 1)}>
                                                        <i className="fas fa-chevron-left"></i> Trước
                                                    </button>
                                                </li>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                        <button className="page-link px-3 fw-bold" onClick={() => handlePageChange(i + 1)}>
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button className="page-link px-3" onClick={() => handlePageChange(currentPage + 1)}>
                                                        Sau <i className="fas fa-chevron-right"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Shop;
