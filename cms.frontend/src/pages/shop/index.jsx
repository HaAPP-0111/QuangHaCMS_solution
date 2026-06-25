import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import productService from '../../services/productService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';

function Shop() {
    // Mảng GỐC chứa toàn bộ sản phẩm lấy từ API (chưa lọc)
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Các State điều khiển bộ lọc - quản lý tập trung tại đây để Sidebar và Header cùng dùng
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [keyword, setKeyword] = useState('');

    // 1. Gọi API lấy toàn bộ sản phẩm 1 lần duy nhất khi vào trang
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setAllProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm cho trang Shop:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // 2. Áp dụng bộ lọc (danh mục + khoảng giá + từ khóa) ngay trên mảng đã có, không cần gọi lại API
    const filteredProducts = allProducts.filter((p) => {
        const matchCategory = activeCategoryId === null || p.categoryProductId === activeCategoryId;
        const matchMin = minPrice === '' || p.price >= Number(minPrice);
        const matchMax = maxPrice === '' || p.price <= Number(maxPrice);
        const matchKeyword = keyword.trim() === '' || p.name.toLowerCase().includes(keyword.trim().toLowerCase());
        return matchCategory && matchMin && matchMax && matchKeyword;
    });

    const handleChangePriceRange = (min, max) => {
        setMinPrice(min);
        setMaxPrice(max);
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
                            onSelectCategory={setActiveCategoryId}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            onChangePriceRange={handleChangePriceRange}
                        />
                    </div>

                    {/* CỘT PHẢI: TÌM KIẾM + LƯỚI SẢN PHẨM */}
                    <div className="col-md-9">
                        <ShopHeader
                            keyword={keyword}
                            onChangeKeyword={setKeyword}
                            totalCount={filteredProducts.length}
                        />

                        <LoadingOrEmpty
                            loading={loading}
                            isEmpty={!loading && filteredProducts.length === 0}
                            loadingText="Đang tải danh sách sản phẩm..."
                            emptyText="Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại."
                        />

                        {!loading && filteredProducts.length > 0 && (
                            <ProductList products={filteredProducts} />
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Shop;
