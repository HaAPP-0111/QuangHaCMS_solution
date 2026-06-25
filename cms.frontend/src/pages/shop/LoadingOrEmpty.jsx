import React from 'react';

// Component dùng chung để xử lý UX/UI trạng thái tải mạng hoặc trống kết quả
function LoadingOrEmpty({ loading, isEmpty, loadingText, emptyText }) {
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">{loadingText || 'Đang tải dữ liệu...'}</p>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="text-center py-5">
                <i className="fas fa-box-open text-muted mb-3" style={{ fontSize: '48px', opacity: 0.4 }}></i>
                <p className="text-muted m-0">{emptyText || 'Không tìm thấy sản phẩm phù hợp.'}</p>
            </div>
        );
    }

    return null;
}

export default LoadingOrEmpty;
