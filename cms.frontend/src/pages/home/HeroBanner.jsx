import React from 'react';

function HeroBanner() {
    return (
        <section
            className="hero-banner-clean bg-light my-4 d-flex align-items-center justify-content-center"
            style={{
                minHeight: '200px',
                border: '2px dashed #11CAA0',
                borderRadius: '8px'
            }}
        >
            <div className="text-center p-3">
                <h4 className="font-weight-bold text-secondary mb-0">
                    Dành tự thực hành
                </h4>
            </div>
        </section>
    );
}

export default HeroBanner;
