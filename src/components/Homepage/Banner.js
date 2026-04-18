import '../../css/Homepage/Banner.css';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
function Banner(){
    return(
        <div className="banner">
            <img src={"../images/plane.png"} alt="plane" className="plane-img"/> 
            <div className="content-box">
                <img src={"../images/glow-effect.png"} alt="glow effect" className="glow-img"/>
                <p className="subtext">Find the best deals on flights</p>
                <h1 className="main-text">Embark on your Adventure</h1>

                <div className="button-group">
                    <Link to="/signup">
                        
                        <button className="button-create">
                            <i class="fa-solid fa-user"></i>
                            Create Account 
                        </button>
                    </Link>
                    <Link to="/signin"> 
                        <button className="button-login">
                            <i class="fa fa-sign-in" aria-hidden="true"></i>
                            Sign In 
                        </button>
                    </Link>
                </div>
            </div>  
        </div>
    );
}

export default Banner;