import Navbar from '../components/Homepage/Navbar.js';
import Banner from '../components/Homepage/Banner.js';
import SearchFlight from '../components/Homepage/SearchFlight.js';
import DestinationCards from '../components/Homepage/DestinationCard.js';
import TestimonialSlider from '../components/Homepage/TestimonialSlider.js';
function Homepage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <SearchFlight />
      <TestimonialSlider />
      <DestinationCards />
    </div>
  );
}

export default Homepage; 

