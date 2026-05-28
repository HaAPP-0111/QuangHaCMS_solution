import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
     * Endpoint này kết nối tới CategoryProductController trong ASP.NET Core
     */
    getAllCategoryProducts: () => {
        // Đường dẫn phải khớp chính xác với [Route("api/[controller]")] của Backend
        const url = '/categoriesproducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;
