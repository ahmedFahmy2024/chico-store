import { useContext } from 'react';
import { LocalContext } from '../../context/LocalContext';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import '../css/cattext.css';
import { useFilter } from '../context/FilterProvider';
import { useTheme } from '@mui/material/styles';

import Button from '@mui/material/Button';

function CatText({ categories }) {
    const theme = useTheme();
    const { locale } = useContext(LocalContext);
    const { filters: { category }, updateFilterValue } = useFilter()
    // console.log('all_products', all_products)
    // console.log('category', category) is the name of selected category

    const allCategory = { id: 0, Name_ar: "الكل", Name_en: "All" };
    const categoriesWithAll = [allCategory, ...categories]

    return (
        <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "cat-text"].join(" ")} >
            <Swiper dir={locale === "en" ? "ltr" : "rtl"} slidesPerView={4.3} spaceBetween={10}
                modules={[Navigation, Scrollbar]}
                navigation={{ prevEl: '.left-arrow', nextEl: '.right-arrow' }}
                scrollbar={{
                    el: '.swiper-progress',
                }}
                breakpoints={{
                    1200: {
                        slidesPerView: 5.3,
                    },
                }}
            >
                {categoriesWithAll.map((categoryItem, index) => (
                    <SwiperSlide key={index}>
                        <Button
                            className={`cat-name ${category === categoryItem.Name_en ? 'active' : ''}`}
                            style={{
                                color: category === categoryItem.Name_en && theme.palette.mode === 'dark' ? theme.palette.text.primary : 'black',
                                backgroundColor: category === categoryItem.Name_en && theme.palette.mode === 'dark' ? theme.palette.background.default : 'white'
                            }}
                            name="category"
                            onClick={updateFilterValue}
                            value={categoryItem.Name_en}>
                            {locale === "en" ? categoryItem.Name_en : categoryItem.Name_ar}
                        </Button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default CatText