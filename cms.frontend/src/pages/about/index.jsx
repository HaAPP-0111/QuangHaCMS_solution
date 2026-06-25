import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

function About() {
    return (
        <div>
            <Header />

            <div className="container py-5 my-3">
                <div className="row justify-content-center">
                    <div className="col-md-8 text-center">
                        <h2 className="font-weight-bold text-uppercase mb-3" style={{ color: '#005088' }}>
                            Về ThaiCMS.Fashion
                        </h2>
                        <div className="mx-auto mb-4" style={{ width: '60px', height: '3px', backgroundColor: '#11CAA0' }}></div>

                        <p className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                            ThaiCMS.Fashion là hệ thống bán hàng thời trang trực tuyến chuyên về trang phục
                            công sở và dạ hội, được phát triển trong khuôn khổ đồ án Chuyên đề ASP.NET Core kết hợp ReactJS.
                        </p>
                        <p className="text-secondary" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                            Chúng tôi cam kết mang đến những sản phẩm chất lượng, cập nhật xu hướng phối đồ
                            mới nhất, cùng trải nghiệm mua sắm trực tuyến nhanh chóng và tiện lợi.
                        </p>

                        <div className="row mt-5">
                            <div className="col-md-4 mb-4">
                                <i className="fas fa-shipping-fast mb-3" style={{ fontSize: '36px', color: '#11CAA0' }}></i>
                                <h6 className="font-weight-bold">Giao hàng nhanh</h6>
                                <p className="text-muted small">Giao hàng toàn quốc, nhận hàng nhanh chóng</p>
                            </div>
                            <div className="col-md-4 mb-4">
                                <i className="fas fa-undo-alt mb-3" style={{ fontSize: '36px', color: '#11CAA0' }}></i>
                                <h6 className="font-weight-bold">Đổi trả dễ dàng</h6>
                                <p className="text-muted small">Chính sách đổi trả linh hoạt trong 7 ngày</p>
                            </div>
                            <div className="col-md-4 mb-4">
                                <i className="fas fa-headset mb-3" style={{ fontSize: '36px', color: '#11CAA0' }}></i>
                                <h6 className="font-weight-bold">Hỗ trợ tận tâm</h6>
                                <p className="text-muted small">Tư vấn nhiệt tình qua hotline và email</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default About;