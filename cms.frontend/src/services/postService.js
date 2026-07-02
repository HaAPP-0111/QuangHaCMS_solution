// Import cấu hình axiosClient dùng chung đã được cấu hình BaseURL ở thư mục api
import axiosClient from '../api/axiosClient';

const postService = {
    /**
     * 1. Lấy danh sách toàn bộ bài viết tin tức từ Backend
     * API Endpoint: GET /api/posts
     * API trả về { Posts: [...], TotalPages, CurrentPage } hoặc mảng thẳng
     */
    getAllPosts: async (page = 1) => {
        try {
            const response = await axiosClient.get(`/posts?page=${page}`);
            const raw = response.data || response;
            return raw;
        } catch (error) {
            console.error("Lỗi API getAllPosts:", error);
            return { Posts: [], TotalPages: 1, CurrentPage: 1 };
        }
    },

    /**
     * 2. Lấy thông tin chi tiết của một bài viết theo ID
     * API Endpoint: GET /api/posts/{id}
     */
    getPostById: async (id) => {
        try {
            const response = await axiosClient.get(`/posts/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getPostById với ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * 3. Lấy bài viết theo danh mục
     * API Endpoint: GET /api/posts/category/{categoryId}
     */
    getPostsByCategory: async (categoryId, page = 1) => {
        try {
            const response = await axiosClient.get(`/posts/category/${categoryId}?page=${page}`);
            const raw = response.data || response;
            return raw;
        } catch (error) {
            console.error(`Lỗi API getPostsByCategory:`, error);
            return { Posts: [], TotalPages: 1, CurrentPage: 1 };
        }
    }
};

export default postService;
