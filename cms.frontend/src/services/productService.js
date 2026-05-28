import axiosClient from '../api/axiosClient';

const productService = {
    // Hàm gọi API lấy toàn bộ danh sách sản phẩm thời trang
    getAllProducts: () => {
        const url = '/Products'; // Phải khớp chính xác với Router trong ProductsController phía Backend
        return axiosClient.get(url);
    }
};

export default productService;
