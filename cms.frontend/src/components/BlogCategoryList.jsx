import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogCategories();
        const data = response?.data ?? response ?? [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Lỗi khi tải danh mục tin tức:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 20, width: 300, zIndex: 1050 }}>
      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h6 className="mb-0 text-uppercase font-weight-bold">Chuyên mục</h6>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3 text-center">Đang tải chuyên mục...</div>
          ) : categories.length === 0 ? (
            <div className="p-3 text-muted">Chưa có chuyên mục nào.</div>
          ) : (
            <div className="list-group list-group-flush">
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#category-${cat.id}`}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  <span>{cat.name || cat.Name}</span>
                  <i className="fa-solid fa-chevron-right text-muted small"></i>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCategoryList;
