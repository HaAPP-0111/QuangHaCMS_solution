import React, { useState, useEffect } from 'react';
import blogService from '../../services/blogService';

// Cột phải hiển thị danh mục bài viết (Category), bắn sự kiện chọn lên component cha
function BlogSidebar({ activeCategoryId, onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const data = await blogService.getBlogCategories();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải chuyên mục bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="card shadow-sm p-3 bg-white rounded">
            <h5 className="card-title text-uppercase font-weight-bold text-secondary">
                <i className="fas fa-tags mr-2 text-info"></i> Chủ đề bài viết
            </h5>

            {loading ? (
                <div className="text-center my-3 text-muted small">Đang nạp chuyên mục...</div>
            ) : (
                <div className="list-group list-group-flush mt-2">
                    <button
                        type="button"
                        className={`list-group-item list-group-item-action border-0 d-flex align-items-center px-1 ${activeCategoryId === null ? 'font-weight-bold text-primary' : 'text-dark'}`}
                        onClick={() => onSelectCategory(null)}
                    >
                        <i className="fas fa-hashtag mr-2 text-muted"></i> Tất cả bài viết
                    </button>
                    {categories.length === 0 ? (
                        <p className="text-muted small pl-2 mt-2">Chưa có chuyên mục nào.</p>
                    ) : (
                        categories.map((cate) => (
                            <button
                                key={cate.id}
                                type="button"
                                className={`list-group-item list-group-item-action border-0 d-flex align-items-center px-1 ${activeCategoryId === cate.id ? 'font-weight-bold text-primary' : 'text-dark'}`}
                                onClick={() => onSelectCategory(cate.id)}
                            >
                                <i className="fas fa-hashtag mr-2 text-muted"></i> {cate.name}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default BlogSidebar;
