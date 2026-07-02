import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await axiosClient.get(`/posts/${id}`);
                setPost(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch post", error);
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="container py-5 text-center">Đang tải...</div>;
    if (!post) return <div className="container py-5 text-center text-danger">Không tìm thấy bài viết</div>;

    return (
        <div className="container py-5">
            <h1 className="mb-4">{post.title}</h1>
            <p className="text-muted">Đăng ngày: {new Date(post.createdDate).toLocaleDateString()}</p>
            {post.imageUrl && <img src={process.env.REACT_APP_IMAGE_BASE_URL + post.imageUrl} alt={post.title} className="img-fluid mb-4 rounded" />}
            
            {/* Using dangerouslySetInnerHTML as per requirement #44 */}
            <div 
                className="blog-content" 
                dangerouslySetInnerHTML={{ __html: post.content }} 
            />
        </div>
    );
}
export default BlogDetail;
