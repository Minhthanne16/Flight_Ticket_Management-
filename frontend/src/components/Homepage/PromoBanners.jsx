import React from 'react';

const banners = [
    { id: 1, title: 'Giảm 20% thẻ tín dụng JCB', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop', color: 'from-blue-600 to-blue-400' },
    { id: 2, title: 'Bay hè thả ga - Hoàn tiền 500K', image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop', color: 'from-orange-500 to-amber-400' },
    { id: 3, title: 'Ưu đãi đặt phòng khách sạn', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop', color: 'from-emerald-600 to-teal-400' },
    { id: 4, title: 'Combo Du Lịch Tiết Kiệm', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop', color: 'from-purple-600 to-pink-500' }
];

function PromoBanners() {
    return (
        <div className="relative z-0 container mx-auto px-4 md:px-8 mt-12 mb-6">
            <div className="relative overflow-hidden group py-4">
                <div className="flex w-max animate-marquee space-x-4 md:space-x-6">
                    {[...banners, ...banners].map((banner, index) => (
                        <div key={`${banner.id}-${index}`} className="w-[300px] md:w-[400px] shrink-0 h-[160px] md:h-[200px] rounded-2xl overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md transition-shadow bg-slate-800 group/banner">
                            <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-90 z-10`}></div>
                            <img src={banner.image} alt={banner.title} className="absolute right-0 inset-y-0 h-full w-2/3 object-cover z-0 opacity-50 mix-blend-overlay group-hover/banner:scale-105 transition-transform duration-500" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black)' }} />
                            <div className="absolute inset-0 p-6 flex flex-col justify-center w-2/3 z-20">
                                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-3 drop-shadow-sm">{banner.title}</h3>
                                <span className="text-white bg-white/20 backdrop-blur-md w-max px-3 py-1 rounded-full text-xs font-semibold hover:bg-white hover:text-slate-800 transition-colors">Khám phá ngay</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PromoBanners;
