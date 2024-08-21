import { useContext } from 'react';
import { LocalContext } from '../../context/LocalContext';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import '../css/catnav.css';
import { useFilter } from '../context/FilterProvider';

import { useTheme } from '@mui/material/styles';

function CatNav({ categories, settings }) {
    const theme = useTheme();
    const { locale } = useContext(LocalContext);
    const { filters: { category }, updateFilterValue } = useFilter()
  
    const logo = settings[0]?.value
    const allCategory = { id: 0, Name_ar: "الكل", Name_en: "All", image: logo };
    const categoriesWithAll = [allCategory, ...categories]
    // console.log('categoriesWithAll', categoriesWithAll)

  return (
    <div dir={locale === "en" ? "ltr" : "rtl"} className={[locale === "en" ? "ltr" : "rtl", "cat-nav"].join(" ")} >
      <Swiper dir={locale === "en" ? "ltr" : "rtl"} slidesPerView={4.3} spaceBetween={10}
        modules={[Navigation, Scrollbar]}
        navigation={{ prevEl: '.left-arrow', nextEl: '.right-arrow' }}
        scrollbar={{
          el: '.swiper-progress',
        }}
        breakpoints={{
          900: {
            slidesPerView: 4.3,
          },
          1000: {
            slidesPerView: 5.3,
          },
          1200: {
            slidesPerView: 6.3,
          },
          1400: {
            slidesPerView: 7.3,
          },
        }}
      >
        {categoriesWithAll.map((categoryItem, index) => (
          <SwiperSlide key={index} >
            <div className={[theme.palette.mode === 'light' ? 'light' : 'dark', 'cat-item'].join(" ")} >
              <img
                className={`cat-img ${categoryItem.Name_en === category ? 'active' : ''}`}
                src={categoryItem.image} alt="" />
              <button
                onClick={updateFilterValue}
                name="category"
                value={categoryItem.Name_en}
                className="cat-name">
                {locale === "en" ? categoryItem.Name_en : categoryItem.Name_ar}
              </button>
              <div className="cat-name-title">{locale === "en" ? categoryItem.Name_en : categoryItem.Name_ar}</div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CatNav