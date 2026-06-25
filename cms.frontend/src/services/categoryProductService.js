import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
     * Endpoint này kết nối tới CategoryProductController trong ASP.NET Core
     */
    getAllCategoryProducts: () => {
        // Đường dẫn đã xác nhận đúng theo Swagger thực tế: /api/CategoryProducts
        const url = '/CategoryProducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;