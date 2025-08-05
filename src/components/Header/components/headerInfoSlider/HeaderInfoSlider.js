import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import Iconify from "@components/ui/iconify/Iconify";
import './HeaderInfoSlider.scss';


const infoData = [
    { icon: "material-symbols:delivery-truck-speed-outline-rounded", text: "FAST & SECURE DELIVERY" },
    { icon: "mdi:shield-check", text: "SAFE & RELIABLE TRANSACTIONS" },
    { icon: "mdi:certificate", text: "TRUSTED BY PROFESSIONALS" },
    { icon: "material-symbols:delivery-truck-speed-outline-rounded", text: "FAST & SECURE DELIVERY" },
    { icon: "mdi:shield-check", text: "SAFE & RELIABLE TRANSACTIONS" },
    { icon: "mdi:certificate", text: "TRUSTED BY PROFESSIONALS" },
]

export const HeaderInfoSlider = () => {
    return (
        <div className="info-slider">
            <Swiper
                modules={[Autoplay, FreeMode]}
                loop={true}
                slidesPerView={3}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                spaceBetween={5}
                speed={5000} // Controls the smooth speed
                autoplay={{
                    delay: 0,      // No pause between slides
                    disableOnInteraction: false,
                }}
                freeMode={true}
                className="info-slider__swiper"
            >
                {infoData.map((item, index) => (
                    <SwiperSlide key={index} className="info-slider__slide">
                        <div className="info-slider__content">
                            <span className="info-slider__icon"><Iconify icon={item.icon} width={20} height={20} /></span>
                            <span className="info-slider__text">{item.text}</span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
