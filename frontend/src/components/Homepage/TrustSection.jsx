import React from 'react';
import { Tag, ShieldCheck, HeadphonesIcon } from 'lucide-react';

const features = [
    {
        id: 1,
        icon: <Tag className="w-8 h-8 text-blue-600" />,
        title: 'Giá rẻ mỗi ngày',
        description: 'Đảm bảo giá tốt nhất với nhiều ưu đãi độc quyền trên EasyFlight.'
    },
    {
        id: 2,
        icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
        title: 'Thanh toán an toàn',
        description: 'Bảo mật thông tin tối đa với các phương thức thanh toán đa dạng.'
    },
    {
        id: 3,
        icon: <HeadphonesIcon className="w-8 h-8 text-orange-500" />,
        title: 'Hỗ trợ 24/7',
        description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn mọi lúc.'
    }
];

function TrustSection() {
    return (
        <div className="bg-slate-100 py-16 mt-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Tại sao chọn EasyFlight?</h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">Chúng tôi cam kết mang đến trải nghiệm đặt vé bay nhanh chóng, an toàn và tiện lợi nhất cho hành trình của bạn.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {features.map(feature => (
                        <div key={feature.id} className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TrustSection;
