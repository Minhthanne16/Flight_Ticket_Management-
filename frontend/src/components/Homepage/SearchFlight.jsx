import { useState } from 'react';
import { ArrowRightLeft, Search } from 'lucide-react';
import PassengerPicker from '../Picker/PassengerPicker';
import Airport from '../Picker/AirportPicker';
import DatePicker from '../Picker/DatePicker';

function SearchFlight() {
  const [fromCity, setFromCity] = useState(null);
  const [toCity, setToCity] = useState(null);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [tripType, setTripType] = useState('round-trip');

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  return (
    <div className="relative -mt-24 z-20 container mx-auto px-4 md:px-8 max-w-6xl">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        
        {/* Top Options Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
            <button 
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${tripType === 'one-way' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setTripType('one-way')}
            >
              Một chiều
            </button>
            <button 
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${tripType === 'round-trip' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setTripType('round-trip')}
            >
              Khứ hồi
            </button>
            <button 
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${tripType === 'multi-city' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:bg-slate-200'}`}
              onClick={() => setTripType('multi-city')}
            >
              Nhiều chặng
            </button>
          </div>

          <div className="flex items-center space-x-4">
             <label className="flex items-center space-x-2 cursor-pointer">
                 <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                 <span className="text-sm text-slate-600 font-medium">Bay thẳng</span>
             </label>
             <div className="w-px h-6 bg-slate-200"></div>
             <select className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer">
                 <option value="economy">Phổ thông</option>
                 <option value="business">Thương gia</option>
                 <option value="first-class">Hạng nhất</option>
             </select>
             <div className="w-px h-6 bg-slate-200"></div>
             <div className="relative z-30">
               <PassengerPicker />
             </div>
          </div>
        </div>

        {/* Input Grid Row */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {/* Location Group */}
          <div className="flex w-full lg:w-5/12 relative border border-slate-200 rounded-xl bg-white hover:border-blue-400 transition-colors">
             <div className="flex-1 p-3">
                 <p className="text-xs text-slate-500 font-medium mb-1">Điểm đi</p>
                 <Airport
                     label="Chọn điểm đi"
                     selectedAirport={fromCity} 
                     onSelect={(ap) => setFromCity(ap)} 
                 />
             </div>
             
             {/* Swap Button */}
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                 <button 
                   onClick={handleSwap}
                   className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                 >
                     <ArrowRightLeft className="w-4 h-4" />
                 </button>
             </div>

             <div className="w-px bg-slate-200 my-2"></div>

             <div className="flex-1 p-3">
                 <p className="text-xs text-slate-500 font-medium mb-1">Điểm đến</p>
                 <Airport
                     label="Chọn điểm đến" 
                     selectedAirport={toCity} 
                     onSelect={(ap) => setToCity(ap)} 
                 />
             </div>
          </div>

          {/* Dates Group */}
          <div className="flex w-full lg:w-4/12 border border-slate-200 rounded-xl bg-white hover:border-blue-400 transition-colors p-3">
             <div className="w-full">
                <DatePicker
                    departureDate={departureDate} 
                    setDepartureDate={setDepartureDate}
                    returnDate={returnDate}
                    setReturnDate={setReturnDate}
                />
             </div>
          </div>

          {/* Search Button */}
          <div className="w-full lg:w-3/12">
            <button className="w-full h-[72px] bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center space-x-2 font-bold text-lg transition-colors shadow-lg shadow-orange-500/30">
               <Search className="w-5 h-5" />
               <span>Tìm chuyến bay</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SearchFlight;