import React from 'react';
import { MapPin } from 'lucide-react';

const destinations = [
    {
        id: 1,
        name: 'Vịnh Hạ Long',
        location: 'Quảng Ninh',
        // Wikipedia: Ha Long Bay
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Ha_Long_Bay_in_2019.jpg/1280px-Ha_Long_Bay_in_2019.jpg'
    },
    {
        id: 2,
        name: 'Phố Cổ Hội An',
        location: 'Quảng Nam',
        // Wikimedia Commons: Hoi An ancient town
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/HoiAn_VietNam.jpg/1280px-HoiAn_VietNam.jpg'
    },
    {
        id: 3,
        name: 'Cầu Vàng',
        location: 'Đà Nẵng',
        // Wikipedia: Golden Bridge Ba Na Hills
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg/1280px-Golden_Bridge_at_Ba_Na_Hills_20250718.jpg'
    },
    {
        id: 4,
        name: 'Chợ Bến Thành',
        location: 'Hồ Chí Minh',
        // Wikipedia: Ben Thanh Market
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG/1280px-Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG'
    },
    {
        id: 5,
        name: 'Tràng An',
        location: 'Ninh Bình',
        // Wikipedia: Trang An landscape complex
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Muaxuantamcoc.jpg'
    },
    {
        id: 6,
        name: 'Sapa',
        location: 'Lào Cai',
        // Wikipedia: Sa Pa
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Thacbac3.jpg/1280px-Thacbac3.jpg'
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
                <div className="relative overflow-hidden group py-4">
                    <div className="flex w-max animate-marquee space-x-6">
                        {[...destinations, ...destinations].map((item, index) => (
                            <div key={`${item.id}-${index}`} className="w-[280px] shrink-0 h-[380px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-lg transition-all">
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
                </div>
            </div>
        </div>
    );
}

export default ExploreDestinations;
