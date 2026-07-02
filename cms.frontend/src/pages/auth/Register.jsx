import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

function Register() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
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

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);

        try {
            // Loại bỏ trường confirmPassword trước khi gửi lên API
            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                password: formData.password
            };

            await axiosClient.post('/customersapi', payload);
            
            alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
            navigate('/login');
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                // Xử lý lỗi validation từ .NET
                const errorMessages = Object.values(err.response.data.errors).flat().join(' ');
                setError(errorMessages);
            } else {
                setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm border-0 rounded-3">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-primary">ĐĂNG KÝ TÀI KHOẢN</h3>
                                <p className="text-muted">Tạo tài khoản mới để trải nghiệm dịch vụ tốt hơn</p>
                            </div>

                            {error && (
                                <div className="alert alert-danger py-2 text-center" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Họ và tên <span className="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light" 
                                        name="fullName"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required 
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="form-label fw-bold">Email <span className="text-danger">*</span></label>
                                        <input 
                                            type="email" 
                                            className="form-control bg-light" 
                                            name="email"
                                            placeholder="Email của bạn"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Số điện thoại</label>
                                        <input 
                                            type="tel" 
                                            className="form-control bg-light" 
                                            name="phone"
                                            placeholder="Số điện thoại liên hệ"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Địa chỉ</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-light" 
                                        name="address"
                                        placeholder="Địa chỉ giao hàng mặc định"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6 mb-3 mb-md-0">
                                        <label className="form-label fw-bold">Mật khẩu <span className="text-danger">*</span></label>
                                        <input 
                                            type="password" 
                                            className="form-control bg-light" 
                                            name="password"
                                            placeholder="Tạo mật khẩu"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                                        <input 
                                            type="password" 
                                            className="form-control bg-light" 
                                            name="confirmPassword"
                                            placeholder="Nhập lại mật khẩu"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required 
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 btn-lg fw-bold mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang đăng ký...' : 'ĐĂNG KÝ NGAY'}
                                </button>
                                
                                <div className="text-center">
                                    <span className="text-muted">Đã có tài khoản? </span>
                                    <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                        Đăng nhập
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

export default Register;
