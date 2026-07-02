import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
// IMPORT component CON VÀO ĐỂ SỬ DỤNG
import ProductCard from '../../components/ProductCard';

function ProductGrid() {
    const [latestProducts, setLatestProducts] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeProducts = async () => {
            try {
                setLoading(true);
                const [latest, bestSelling] = await Promise.all([
                    productService.getLatestProducts(),
                    productService.getBestSellingProducts()
                ]);
                setLatestProducts(latest);
                setBestSellingProducts(bestSelling);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeProducts();
    }, []);

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Đang tải danh sách thú cưng nổi bật...</p>
            </div>
        );
    }

    return (
        <section className="product-grid-wrapper py-4">
            <div className="container">
                {/* --- Lưới 1: Sản phẩm mới nhất --- */}
                <div className="section-heading mb-4 d-flex justify-content-between align-items-center border-bottom pb-2">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                        <i className="fas fa-bolt mr-2 text-warning"></i> Thú Cưng Mới Nhất
                    </h4>
                </div>
                <div className="row mb-5">
                    {latestProducts.map((product) => (
                        <div className="col-xl-4 col-lg-4 col-sm-6 col-12 mb-4" key={`latest-${product.id}`}>
                            <ProductCard item={product} />
                        </div>
                    ))}
                </div>

                {/* --- Lưới 2: Sản phẩm bán chạy --- */}
                <div className="section-heading mb-4 d-flex justify-content-between align-items-center border-bottom pb-2">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                        <i className="fas fa-fire mr-2 text-danger"></i> Bán Chạy Nhất
                    </h4>
                </div>
                <div className="row">
                    {bestSellingProducts.map((product) => (
                        <div className="col-xl-4 col-lg-4 col-sm-6 col-12 mb-4" key={`best-${product.id}`}>
                            <ProductCard item={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductGrid;
