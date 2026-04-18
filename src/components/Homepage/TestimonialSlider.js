import '../../css/Homepage/TestimonialSlider.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

import test1 from '../../asset/Testimonials/1.png';
import test2 from '../../asset/Testimonials/2.png';
import test3 from '../../asset/Testimonials/3.png';
import test4 from '../../asset/Testimonials/4.png';
import test5 from '../../asset/Testimonials/5.png';

const TestimonialSlider = () => {
  const myImages = [test1, test2, test3, test4, test5];

  return (
    <div className="slider-container">
      
      <Swiper
        modules={[Navigation, EffectCoverflow, Autoplay]}
        effect="coverflow"
        navigation={true}
        centeredSlides={true}
        slidesPerView={'auto'} 
        loop={true}
        
        loopedSlides={4} 
        loopPreventsSliding={false} 
        rewind={false} 
        speed={1000}   
        
        autoplay={{
          delay: 5000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}

        coverflowEffect={{
          rotate: 0,
          stretch: 150,
          depth: 200,
          modifier: 2,
          slideShadows: false,
        }}
        
        className="testimonial-swiper"
      >
        {myImages.map((img, index) => (
          <SwiperSlide key={index} className="testimonial-slide">
            <div className="card">
              <img src={img} alt={`testimonial-${index + 1}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialSlider;