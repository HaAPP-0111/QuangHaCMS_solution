import React from 'react';

// Thanh tìm kiếm nhanh và bộ đếm số sản phẩm phía trên lưới
function ShopHeader({ keyword, onChangeKeyword, totalCount }) {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <p className="text-muted mb-2 mb-md-0">
                Tìm thấy <strong className="text-dark">{totalCount}</strong> sản phẩm
            </p>
            <div style={{ maxWidth: '320px', width: '100%' }}>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Gõ từ khóa tìm mẫu váy, đầm, quần tây..."
                        value={keyword}
                        onChange={(e) => onChangeKeyword(e.target.value)}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text bg-white">
                            <i className="fas fa-search text-muted"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopHeader;
