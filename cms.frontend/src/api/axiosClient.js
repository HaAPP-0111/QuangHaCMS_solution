import axios from 'axios';

// Khởi tạo một thực thể axios với cấu hình base chung
const axiosClient = axios.create({
    // Sử dụng biến môi trường từ file .env
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7083/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server (10 giây)
    withCredentials: true, // Quan trọng để gửi kèm Cookie cho xác thực
});

// Interceptor giúp can thiệp vào dữ liệu trước khi trả về component
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu phản hồi thành công, bóc tách lấy thẳng cục data bên trong dữ liệu JSON
        // Giúp component của bạn không cần gọi response.data mỗi lần nữa
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung tại đây (Ví dụ: Server sập, lỗi 404, lỗi 500)pm start
        console.error('Lỗi kết nối API:', error.message);

        // Bạn có thể thêm xử lý logic cho các mã lỗi cụ thể ở đây
        if (error.response?.status === 401) {
            console.log("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn.");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;