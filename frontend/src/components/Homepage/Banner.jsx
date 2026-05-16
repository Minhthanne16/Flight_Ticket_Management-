function Banner() {
  return (
    <div className="relative h-[550px] md:h-[650px] w-full flex items-center justify-center pt-16">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop')` }}
      ></div>
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-8 mb-32">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Bắt đầu hành trình tuyệt vời của bạn
        </h1>
        <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md">
          Khám phá thế giới với những ưu đãi chuyến bay tốt nhất
        </p>
      </div>
    </div>
  );
}

export default Banner;