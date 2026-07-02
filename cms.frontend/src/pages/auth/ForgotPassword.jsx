import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axiosClient from '../../api/axiosClient';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isResetStep, setIsResetStep] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (!email) {
            setError('Vui lòng nhập email!');
            return;
        }

        setLoading(true);
        try {
            const res = await axiosClient.post('/customersapi/forgot-password', { email });
            setMessage(res.message || res.data?.message || 'Email hợp lệ. Cho phép đặt lại mật khẩu!');
            setIsResetStep(true); // Chuyển sang bước nhập mật khẩu mới
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể yêu cầu đặt lại mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!newPassword || newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        setLoading(true);
        try {
            const res = await axiosClient.post('/customersapi/reset-password', { email, newPassword });
            setMessage(res.message || res.data?.message || 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.');
            setIsResetStep(false);
            setEmail('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi đặt lại mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />

            <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="card shadow-lg border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '15px' }}>
                    <div className="card-body p-5">
                        <div className="text-center mb-4">
                            <i className="fas fa-lock fa-3x text-primary mb-3"></i>
                            <h2 className="fw-bold text-dark">Quên Mật Khẩu</h2>
                            <p className="text-muted">
                                {!isResetStep 
                                    ? 'Nhập email của bạn để hệ thống cấp lại mật khẩu.' 
                                    : 'Nhập mật khẩu mới cho tài khoản của bạn.'}
                            </p>
                        </div>

                        {error && <div className="alert alert-danger text-center"><i className="fas fa-exclamation-circle me-2"></i> {error}</div>}
                        {message && <div className="alert alert-success text-center"><i className="fas fa-check-circle me-2"></i> {message}</div>}

                        {!isResetStep ? (
                            <form onSubmit={handleForgotSubmit}>
                                <div className="form-floating mb-4">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="emailInput" 
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="emailInput"><i className="fas fa-envelope text-muted me-2"></i> Địa chỉ Email</label>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-3 fw-bold shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-paper-plane me-2"></i>}
                                    Yêu Cầu Đặt Lại
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetSubmit}>
                                <div className="form-floating mb-4">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="newPasswordInput" 
                                        placeholder="Mật khẩu mới"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="newPasswordInput"><i className="fas fa-key text-muted me-2"></i> Mật khẩu mới</label>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-success w-100 py-3 fw-bold shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-save me-2"></i>}
                                    Xác Nhận Đặt Lại
                                </button>
                            </form>
                        )}

                        <div className="mt-4 text-center">
                            <p className="mb-0">
                                Nhớ mật khẩu? <Link to="/login" className="text-primary fw-bold text-decoration-none">Đăng nhập ngay</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ForgotPassword;
