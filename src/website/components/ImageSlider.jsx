import React, { useState, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import { Icon } from '@iconify/react';
import { LocalContext } from '../../context/LocalContext';


const ImageSlider = ({ images }) => {
    const { locale } = useContext(LocalContext);
    const [activeThumb, setActiveThumb] = useState(null);
    const imageUrls = images ? images.split(',') : [];
    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "image-slider-carousel"].join(" ")}>
            <Swiper
                dir={locale === "en" ? "ltr" : "rtl"}
                spaceBetween={10}
                modules={[Navigation, Thumbs]}
                navigation={{ nextEl: '.right-arrow', prevEl: '.left-arrow' }}
                grabCursor={true}
                thumbs={{ swiper: activeThumb && !activeThumb.destroyed ? activeThumb : null }}
                className='product-images-slider'
            >
                {imageUrls.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt="Product"
                        />
                    </SwiperSlide>
                ))}
                <div className="swiper--option">
                    <div className="swiper-arrows">
                        <div className="left-arrow arrow">
                            <Icon className='leftone' icon="iconamoon:arrow-left-2-thin" width="24" height="24" />
                        </div>
                        <div className="right-arrow arrow">
                            <Icon className='rightone' icon="iconamoon:arrow-right-2-thin" width="24" height="24" />
                        </div>
                    </div>
                </div>
            </Swiper>

            <Swiper
                dir={locale === "en" ? "ltr" : "rtl"}
                onSwiper={setActiveThumb}
                spaceBetween={10}
                modules={[Navigation, Thumbs]}
                className='product-images-slider-thumbs'
                slidesPerView={4}
            >
                {imageUrls.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className="product-images-slider-thumbs-wrapper">
                            <img src={image} alt="product images" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default ImageSlider