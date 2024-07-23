import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Link } from 'react-router-dom';
import './style.css';

import { Parallax, Pagination, Navigation } from 'swiper/modules';
import Button from '../ui/Button';

export default function HomePageSlide() {
    return (
        <>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': 'pink',
                }}
                speed={600}
                parallax={true}
                pagination={{ clickable: true, }}
                navigation={true}
                modules={[Parallax, Pagination, Navigation]}
                className="mySwiper"
            >
                <div slot="container-start" className="parallax-bg " data-swiper-parallax="-23%"></div>

                <SwiperSlide className="text">
                    <div className="title" data-swiper-parallax="-300">"Writing is the painting of the voice."</div>
                    <div className="subtitle" data-swiper-parallax="-200">-Voltaire</div>
                    <div className="subtitle flex gap-6 mt-5" data-swiper-parallax="-100"><a href='https://en.wikipedia.org/wiki/Blog' target="_blank" rel="noopener noreferrer" className="white font-medium border-[1px] duration-200 transition-all ease-in border-black-500  rounded-md text-slate-900 bg-white cursor-pointer px-2 py-2 text-[0.8rem] hover:bg-red-500  bg-transparent hover:text-slate-50 md:text-[1rem] ">Read More</a></div>
                </SwiperSlide>

                <SwiperSlide className='text' >
                    <div className="title" data-swiper-parallax="-300">Share Your Story !</div>
                    <div className="subtitle" data-swiper-parallax="-200">Upload | Share | Inspire</div>
                    <div className="subtitle flex gap-6 mt-5" data-swiper-parallax="-100"></div>
                </SwiperSlide>

            </Swiper>
        </>
    );
}
