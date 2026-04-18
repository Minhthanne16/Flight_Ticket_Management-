import '../../css/Authentication/SignUpForm.css';
function SignUpForm() {
    return (
        <div className="signup-form">
            <div className="signup-container">
                <div className="signup-banner">
                    <img
                        src="https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1200&q=80"
                        alt="Flight Banner"
                    />
                </div>    
                <div className="signup-content">
                    <h2>
                        Bạn đã sẳn sàng tham gia Masupilami Airways
                    </h2>
                    <p className="subtitle">
                        Vui lòng điền đầy đủ thông tin cá nhân giống trên CMND/CCCD của bạn</p>

                    <form className="signup-form-fields">
                        
                        <label>NGÔN NGỮ ƯU TIÊN (*) </label>
                        <select>
                            <option> Tiếng Việt </option>
                            <option> Tiếng Anh </option>
                        </select>
                        
                        <h2>Thông tin cá nhân</h2>
                        <p className="infor-text">Thông tin này sẽ được sử dụng để xác nhận vé và gửi thông tin chuyến bay cho bạn</p>
                        
                        <label> DANH XƯNG </label>
                        <select>
                            <option> Ông </option>
                            <option> Bà </option>
                            <option> Cô </option>
                        </select>

                        <div className="name-group">
                            <div>
                                <label> HỌ (*) </label>
                                <input type="text" placeholder="Họ, ví dụ: PHAM"/>
                            </div>
                            <div>
                                <label> TÊN ĐỆM & TÊN (*) </label>
                                <input type="text" placeholder="Tên đệm và tên, ví dụ: NGUYEN HOANG LONG"/>
                            </div>
                            <div>
                                <label> 
                                    NGÀY, THÁNG, NĂM SINH (*) </label>
                                <input type="date"/>
                            </div>
                            <label>
                                GIỚI TÍNH (*) </label>
                            <select>
                                <option> Nam </option>
                                <option> Nữ </option>
                            </select>
                        </div>

                        <h2>Thông tin liên hệ</h2>
                        <p className="infor-text">Bằng cách chia sẻ thông tin liên lạc của bạn, bạn có thể nhận được cuộc gọi hoặc tin nhắn liên quan đến chuyến bay và bất kỳ cập nhật về hành lý nào cho hành trình của bạn.</p>
                        <div className="contact-group">
                            <div>
                                <label> 
                                    <i class="fa fa-mobile" aria-hidden="true"></i>
                                    SỐ ĐIỆN THOẠI (*) 
                                </label>
                                <input type="text" placeholder="Số điện thoại của bạn"/>
                            </div>
                            <div>
                                 
                                <label> 
                                    <i class="fa-solid fa-envelope"></i>
                                    ĐỊA CHỈ EMAIL (*) 
                                </label>
                                <input type="email" placeholder="Địa chỉ email của bạn"/>
                            </div>
                        </div>

                        <h2>Thông tin đăng nhập</h2>
                        <p className='infor-text'>Một số biện pháp phòng ngừa để bảo vệ tài khoản của bạn</p>
                        <div className="login-group">
                            <div>
                                <label> 
                                    <i class="fa fa-key" aria-hidden="true"></i>
                                    MẬT KHẨU (*) 
                                </label>
                                <input type="password" placeholder="Mật khẩu của bạn"/>
                            </div>
                            <div>
                                <label> 
                                    <i class="fa fa-key" aria-hidden="true"></i>
                                    NHẬP LẠI MẬT KHẨU (*) 
                            </label>
                                <input type="password" placeholder="Nhập lại mật khẩu của bạn"/>
                            </div>
                        </div>

                        <checkbox>
                            <input type="checkbox" id="terms" name="terms"/>
                            <label for="terms"> Tôi đồng ý với <a href="#">Điều khoản và Điều kiện</a> của Masupilami Airways</label>
                        </checkbox>
                        <checkbox>
                            <input type="checkbox" id="newsletter" name="newsletter"/>
                            <label for="newsletter"> Tôi muốn nhận bản tin và ưu đãi đặc biệt từ Masupilami Airways</label>
                        </checkbox>

                        <button type="submit" className="signup-button">Đăng ký</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;

            