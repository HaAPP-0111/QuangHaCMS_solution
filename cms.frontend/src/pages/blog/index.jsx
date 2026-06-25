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

    // Tải lại bài viết mỗi khi đổi chuyên mục: null = tất cả, có giá trị = lọc theo category
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = activeCategoryId === null
                    ? await postService.getAllPosts()
                    : await postService.getPostsByCategory(activeCategoryId);
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [activeCategoryId]);

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
                            <div className="row">
                                {posts.map((post) => (
                                    <div className="col-lg-4 col-md-6 col-12 mb-4" key={post.id}>
                                        <PostCard post={post} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CỘT PHẢI (25%): CHUYÊN MỤC BÀI VIẾT */}
                    <div className="col-md-3">
                        <BlogSidebar
                            activeCategoryId={activeCategoryId}
                            onSelectCategory={setActiveCategoryId}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Blog;
