import React from 'react';
import { Plane } from 'lucide-react';

const promos = [
    {
        id: 1,
        from: 'Hồ Chí Minh (SGN)',
        to: 'Hà Nội (HAN)',
        date: '15 Thg 06, 2026',
        oldPrice: '1.200.000 VNĐ',
        price: '899.000 VNĐ',
        // Unsplash: Hoan Kiem Lake / Turtle Tower – Hanoi landmark
        image: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=600&auto=format&fit=crop&q=80',
        airline: 'Vietnam Airlines'
    },
    {
        id: 2,
        from: 'Hà Nội (HAN)',
        to: 'Đà Nẵng (DAD)',
        date: '20 Thg 06, 2026',
        oldPrice: '800.000 VNĐ',
        price: '550.000 VNĐ',
        // Unsplash: Dragon Bridge at night – Da Nang landmark
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&auto=format&fit=crop&q=80',
        airline: 'Vietjet Air'
    },
    {
        id: 3,
        from: 'Hồ Chí Minh (SGN)',
        to: 'Phú Quốc (PQC)',
        date: '05 Thg 07, 2026',
        oldPrice: '1.050.000 VNĐ',
        price: '750.000 VNĐ',
        // Ho Chi Minh City landmark
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&auto=format&fit=crop&q=80',
        airline: 'Bamboo Airways'
    },
    {
        id: 4,
        from: 'Hà Nội (HAN)',
        to: 'Nha Trang (CXR)',
        date: '12 Thg 07, 2026',
        oldPrice: '1.500.000 VNĐ',
        price: '990.000 VNĐ',
        // Unsplash: Nha Trang Bay – coastal city, beach, turquoise sea
        image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=600&auto=format&fit=crop&q=80',
        airline: 'Vietnam Airlines'
    }
];

function FlightPromos() {
    return (
        <div className="container mx-auto px-4 md:px-8 py-12">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Chuyến bay phổ biến</h2>
                <p className="text-slate-500 font-medium">Khám phá các chặng bay được yêu thích nhất với giá cực ưu đãi</p>
            </div>
            <div className="relative overflow-hidden group py-4">
                <div className="flex w-max animate-marquee space-x-6">
                    {[...promos, ...promos].map((promo, index) => (
                        <div key={`${promo.id}-${index}`} className="w-[280px] shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer">
                            <div className="relative h-40 bg-slate-200 overflow-hidden">
                                <img src={promo.image} alt={promo.to} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
                                    {promo.airline}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center space-x-2 text-slate-700 font-semibold mb-3">
                                    <span className="truncate" title={promo.from}>{promo.from.split('(')[0].trim()}</span>
                                    <Plane className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="truncate" title={promo.to}>{promo.to.split('(')[0].trim()}</span>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">{promo.date}</p>
                                
                                <div className="mt-auto">
                                    <div className="flex items-end space-x-2 mb-4">
                                        <span className="text-xs text-slate-400 line-through">{promo.oldPrice}</span>
                                        <span className="text-lg font-bold text-orange-600">{promo.price}</span>
                                    </div>
                                    <button className="w-full py-2 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-colors">
                                        Tìm chuyến bay
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FlightPromos;
