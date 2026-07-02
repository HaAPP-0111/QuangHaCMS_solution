import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import postService from '../../services/postService';
import PostCard from '../../components/PostCard';
import BlogSidebar from './BlogSidebar';

function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Tải lại bài viết mỗi khi đổi chuyên mục hoặc đổi trang
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = activeCategoryId === null
                    ? await postService.getAllPosts(currentPage)
                    : await postService.getPostsByCategory(activeCategoryId, currentPage);
                
                const postsData = data.Posts || data.posts || (Array.isArray(data) ? data : []);
                setPosts(postsData);
                setTotalPages(data.TotalPages || data.totalPages || 1);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [activeCategoryId, currentPage]);

    const handleCategorySelect = (id) => {
        setActiveCategoryId(id);
        setCurrentPage(1);
    };

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
                    {/* CỘT TRÁI (75%): LƯỚI BÀI VIẾT */}
                    <div className="col-md-9">
                        <h4 className="mb-4 font-weight-bold text-uppercase" style={{ color: '#005088' }}>
                            <i className="fas fa-newspaper mr-2 text-info"></i> Tin Tức / Blog
                        </h4>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="mt-2 text-muted">Đang tải bài viết...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="alert alert-light text-center border">
                                <p className="text-muted m-0">Không có bài viết nào trong chuyên mục này.</p>
                            </div>
                        ) : (
                            <>
                                <div className="row">
                                    {posts.map((post) => (
                                        <div className="col-lg-4 col-md-6 col-12 mb-4" key={post.id}>
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Phân trang */}
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

                    {/* CỘT PHẢI (25%): CHUYÊN MỤC BÀI VIẾT */}
                    <div className="col-md-3">
                        <BlogSidebar
                            activeCategoryId={activeCategoryId}
                            onSelectCategory={handleCategorySelect}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Blog;
