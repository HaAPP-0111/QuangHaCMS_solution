import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
     * Endpoint này kết nối tới CategoryProductController trong ASP.NET Core
     */
    getAllCategoryProducts: () => {
        // axiosClient đã có baseURL = https://localhost:7083/api
        // nên chỉ cần ghi tên controller: /categoryproducts
        const url = '/categoryproducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;