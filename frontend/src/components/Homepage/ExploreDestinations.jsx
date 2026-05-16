import React from 'react';
import { MapPin } from 'lucide-react';

const destinations = [
    {
        id: 1,
        name: 'Vịnh Hạ Long',
        location: 'Quảng Ninh',
        // Unsplash: Ha Long Bay, Vietnam - limestone karsts, emerald water
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 2,
        name: 'Phố Cổ Hội An',
        location: 'Quảng Nam',
        // Unsplash: Hoi An ancient town lanterns at night
        image: 'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        name: 'Cầu Vàng',
        location: 'Đà Nẵng',
        // Unsplash: Golden Bridge Ba Na Hills - giant stone hands
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 4,
        name: 'Chợ Bến Thành',
        location: 'Hồ Chí Minh',
        // Unsplash: Ho Chi Minh City / Ben Thanh area at night
        image: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 5,
        name: 'Tràng An',
        location: 'Ninh Bình',
        // Unsplash: Trang An – limestone cliffs, boat on river
        image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800&auto=format&fit=crop&q=80'
    },
    {
        id: 6,
        name: 'Sapa',
        location: 'Lào Cai',
        // Unsplash: Sapa rice terraces, misty mountains
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80'
    }
];

function ExploreDestinations() {
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4 md:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Khám phá Việt Nam</h2>
                    <p className="text-slate-500 font-medium">Những điểm đến không thể bỏ lỡ cho chuyến đi tiếp theo của bạn</p>
                </div>
                
                {/* Horizontal Scrollable Container */}
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 space-x-4 md:space-x-6 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {destinations.map((item) => (
                        <div key={item.id} className="min-w-[240px] md:min-w-[280px] h-[320px] md:h-[380px] rounded-2xl overflow-hidden relative group snap-start cursor-pointer shrink-0 shadow-sm hover:shadow-lg transition-all">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            {/* Text Content */}
                            <div className="absolute bottom-0 left-0 p-5 w-full">
                                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{item.name}</h3>
                                <div className="flex items-center text-white/80 space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <p className="text-sm font-medium">{item.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* CSS to hide scrollbar for webkit browsers */}
                <style dangerouslySetInnerHTML={{__html: `
                    .overflow-x-auto::-webkit-scrollbar {
                        display: none;
                    }
                `}} />
            </div>
        </div>
    );
}

export default ExploreDestinations;
