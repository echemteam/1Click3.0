"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import PropTypes from 'prop-types';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './SwiperSlider.scss';
import Iconify from '../iconify/Iconify';

const SwiperSlider = ({ slides, slidesResponsive = true }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [navigationReady, setNavigationReady] = useState(false);

    useEffect(() => {
        if (prevRef.current && nextRef.current) {
            setNavigationReady(true);
        }
    }, []);

    function limitPaginationBullets(swiper) {
        const paginationEl = swiper?.pagination?.el;
        if (!paginationEl) return; // safely exit if null or undefined

        const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
        const total = bullets.length;
        const activeIndex = swiper.realIndex;

        bullets.forEach((bullet, index) => {
            bullet.style.display = 'none';
            if (
                index === 0 || // First
                index === total - 1 || // Last
                index === activeIndex // Current
            ) {
                bullet.style.display = 'inline-block';
            }
        });
    }



    return (
        <div className="custom-swiper-wrapper">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={10}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                speed={1000}
                navigation={
                    navigationReady
                        ? {
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }
                        : false
                }
                pagination={{
                    el: '.custom-pagination',
                    clickable: true,
                    renderBullet: function (index, className) {
                        return `<span class="${className}" data-index="${index}"></span>`;
                    }
                }}
                onSwiper={(swiper) => {
                    limitPaginationBullets(swiper);
                }}
                onSlideChange={(swiper) => {
                    limitPaginationBullets(swiper);
                  }}
                breakpoints={slidesResponsive ? {
                    320: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1400: { slidesPerView: 5 },
                } : {
                    320: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                    1400: { slidesPerView: 1 },
                }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>{slide}</SwiperSlide>
                ))}
            </Swiper>

            <div className="custom-arrow-wrapper">
                <div className="custom-arrow prev" ref={prevRef}>
                    <Iconify icon="iconamoon:arrow-left-2-duotone" width={20} />
                </div>
                <div className="custom-pagination"></div>
                <div className="custom-arrow next" ref={nextRef}>
                    <Iconify icon="iconamoon:arrow-right-2-duotone" width={20} />
                </div>
            </div>
        </div>
    );
};

SwiperSlider.propTypes = {
    slides: PropTypes.array.isRequired,
    slidesResponsive: PropTypes.bool,
};

export default SwiperSlider;