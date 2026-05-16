import Navbar from '../../components/Homepage/Navbar';
import Banner from '../../components/Homepage/Banner';
import SearchFlight from '../../components/Homepage/SearchFlight';
import PromoBanners from '../../components/Homepage/PromoBanners';
import FlightPromos from '../../components/Homepage/FlightPromos';
import ExploreDestinations from '../../components/Homepage/ExploreDestinations';
import TrustSection from '../../components/Homepage/TrustSection';
import Footer from '../../components/Homepage/Footer';

function Homepage() {
    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-blue-500 selection:text-white">
            <Navbar />
            
            <main>
                <Banner />
                <SearchFlight />
                <PromoBanners />
                <FlightPromos />
                <ExploreDestinations />
                <TrustSection />
            </main>

            <Footer />
        </div>
    );
}

export default Homepage;
