import axiosClient from '../api/axiosClient';

const blogService = {
    // 1. Hàm lấy danh sách toàn bộ bài viết (Post) từ Backend
    getAllPosts: () => {
        const url = '/posts';
        return axiosClient.get(url);
    },

    // 2. Hàm lấy chi tiết 1 bài viết theo ID (phục vụ trang xem chi tiết sau này)
    getPostById: (id) => {
        const url = `/posts/${id}`;
        return axiosClient.get(url);
    },

    // 3. Hàm lấy danh sách chuyên mục bài viết (Category)
    getBlogCategories: () => {
        const url = '/categories';
        return axiosClient.get(url);
    }
};

export default blogService;
