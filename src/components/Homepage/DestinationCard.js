import '../../css/Homepage/DestinationCard.css';

import CanThoImg from '../../asset/Destination/CanTho.png';
import DaLatImg from '../../asset/Destination/DaLat.png';
import DaNangImg from '../../asset/Destination/DaNang.png';
import HaLongImg from '../../asset/Destination/HaLongBay.png'; 
import HaNoiImg from '../../asset/Destination/HaNoi.png';
import HueImg from '../../asset/Destination/Hue.png';
import NgheAnImg from '../../asset/Destination/NgheAn.png';
import NhaTrangImg from '../../asset/Destination/NhaTrang.png';
import PhuQuocImg from '../../asset/Destination/PhuQuoc.png';
import SaiGonImg from '../../asset/Destination/SaiGon.png';

const destinations = [
  { id: 1, name: 'Cần Thơ', img: CanThoImg },
  { id: 2, name: 'Đà Lạt', img: DaLatImg },
  { id: 3, name: 'Đà Nẵng', img: DaNangImg },
  { id: 4, name: 'Hạ Long', img: HaLongImg },
  { id: 5, name: 'Hà Nội', img: HaNoiImg },
  { id: 6, name: 'Huế', img: HueImg },
  { id: 7, name: 'Nghệ An', img: NgheAnImg },
  { id: 8, name: 'Nha Trang', img: NhaTrangImg },
  { id: 9, name: 'Phú Quốc', img: PhuQuocImg },
  { id: 10, name: 'Sài Gòn', img: SaiGonImg },
];

const DestinationCards = () => {
  return (
    <div className="container">
      <h2 className="title">Enjoying your trip with these popular destination</h2>
      <div className="grid-container">
        {destinations.map((item) => (
          <div key={item.id} className="card">
            <div className="card-image">
              <img src={item.img} alt={item.name} />
            </div>
            <div className="card-footer">
              <p>{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationCards;