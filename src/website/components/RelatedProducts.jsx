import { useContext, useEffect, useState } from 'react'
import { LocalContext } from '../../context/LocalContext';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import Card1 from './Card1';
import "../css/relatedproducts.css"
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useCheckOut } from '../context/CheckOutProvider';

function RelatedProducts() {
    const { t } = useTranslation();
    const { locale } = useContext(LocalContext);
    const { recommendations } = useCheckOut();
    const [localRecommendations, setLocalRecommendations] = useState([]);

    useEffect(() => {
        if (recommendations.length === 0) {
            const storedRecommendations = localStorage.getItem('recommendations');
            if (storedRecommendations) {
                setLocalRecommendations(JSON.parse(storedRecommendations));
            }
        } else {
            setLocalRecommendations(recommendations);
        }
    }, [recommendations]);

    if (!recommendations) return null

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "related-products"].join(" ")}>
            <h2 className='title'>{t("Related Products")}</h2>
            <Swiper
                // dir={locale === "en" ? "ltr" : "rtl"}
                dir="ltr"
                slidesPerView={2.3}
                spaceBetween={40}
                loop={true}
                modules={[Navigation, Scrollbar]}
                navigation={{ prevEl: ".left-arrow", nextEl: ".right-arrow" }}
                scrollbar={{
                    el: ".swiper-progress"
                }}
                breakpoints={{
                    600: {
                        slidesPerView: 3.3
                    },
                    800: {
                        slidesPerView: 4.3
                    },
                    1000: {
                        slidesPerView: 5.3
                    },
                }}
            >
                {localRecommendations.map(product => (
                    <SwiperSlide key={product.id}>
                        <Card1 {...product} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="swiper-options">
                <div className="swiper-arrows">
                    <div className="right-arrow arrow">
                        <NavigateNextIcon />
                    </div>
                    <div className="left-arrow arrow">
                        <NavigateBeforeIcon />
                    </div>
                </div>
                <div className="swiper-progress"></div>
            </div>
        </div>
    )
}

export default RelatedProducts