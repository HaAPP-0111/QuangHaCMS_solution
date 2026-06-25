// Import cấu hình axiosClient dùng chung đã được cấu hình BaseURL ở thư mục api
import axiosClient from '../api/axiosClient';

const postService = {
    /**
     * 1. Lấy danh sách toàn bộ bài viết tin tức từ Backend
     * API Endpoint: GET /api/Posts
     */
    getAllPosts: async () => {
        try {
            const response = await axiosClient.get('/Posts');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getAllPosts:", error);
            throw error;
        }
    },

    /**
     * 2. Lấy thông tin chi tiết của một bài viết theo ID
     * API Endpoint: GET /api/Posts/{id}
     */
    getPostById: async (id) => {
        try {
            const response = await axiosClient.get(`/Posts/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getPostById với ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * 3. Lấy danh sách bài viết theo chuyên mục
     * API Endpoint: GET /api/Posts/category/{categoryId} (đã xác nhận đúng theo Swagger)
     */
    getPostsByCategory: async (categoryId) => {
        try {
            const response = await axiosClient.get(`/Posts/category/${categoryId}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getPostsByCategory với categoryId ${categoryId}:`, error);
            throw error;
        }
    }
};

export default postService;
