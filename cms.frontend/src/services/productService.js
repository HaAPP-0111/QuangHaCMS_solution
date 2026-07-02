// Import cấu hình axiosClient dùng chung từ thư mục api
import axiosClient from '../api/axiosClient';

const productService = {
    /**
     * 1. Lấy danh sách sản phẩm (Hỗ trợ lọc theo từ khóa và giá)
     * API Endpoint: GET /api/Products?keyword=...&minPrice=...&maxPrice=...
     */
    getAllProducts: async (filters = {}) => {
        try {
            // Chuyển đổi object filters thành chuỗi query parameters
            const queryParams = new URLSearchParams();
            if (filters.keyword) queryParams.append('keyword', filters.keyword);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
            if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
            if (filters.page) queryParams.append('page', filters.page);

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const response = await axiosClient.get(`/products${queryString}`);
            
            // API trả về { Products: [...], TotalPages, CurrentPage }
            const raw = response.data || response;
            return raw;
        } catch (error) {
            console.error("Lỗi API getAllProducts:", error);
            return { products: [], totalPages: 1, currentPage: 1 };
        }
    },

    getLatestProducts: async () => {
        try {
            const response = await axiosClient.get('/products/latest');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getLatestProducts:", error);
            return [];
        }
    },

    getBestSellingProducts: async () => {
        try {
            const response = await axiosClient.get('/products/bestselling');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getBestSellingProducts:", error);
            return [];
        }
    },

    /**
     * 2. Lấy thông tin chi tiết của một sản phẩm theo ID
     * API Endpoint: GET /api/Products/{id}
     */
    getProductById: async (id) => {
        try {
            const response = await axiosClient.get(`/products/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getProductById với ID ${id}:`, error);
            throw error;
        }
    }
};

export default productService;
