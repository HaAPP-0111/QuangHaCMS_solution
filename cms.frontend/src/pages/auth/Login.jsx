import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosClient.post('/customersapi/login', formData);
            if (response.user) {
                // Lưu thông tin user vào localStorage
                localStorage.setItem('user', JSON.stringify(response.user));
                alert('Đăng nhập thành công!');
                // Chuyển hướng về trang chủ
                navigate('/');
                // Reload lại trang để header cập nhật trạng thái (hoặc dùng Context API nếu có)
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 my-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm border-0 rounded-3">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-primary">ĐĂNG NHẬP</h3>
                                <p className="text-muted">Chào mừng bạn quay lại QuangHa Pet Shop</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger py-2 text-center" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Email đăng nhập <span className="text-danger">*</span></label>
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg bg-light" 
                                        name="email"
                                        placeholder="Nhập email của bạn"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold">Mật khẩu <span className="text-danger">*</span></label>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg bg-light" 
                                        name="password"
                                        placeholder="Nhập mật khẩu"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 btn-lg fw-bold mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                                </button>
                                
                                <div className="text-center">
                                    <span className="text-muted">Chưa có tài khoản? </span>
                                    <Link to="/register" className="text-primary fw-bold text-decoration-none">
                                        Đăng ký ngay
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
