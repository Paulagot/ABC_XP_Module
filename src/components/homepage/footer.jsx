import React from "react";

function Footer (){
    return (<footer className="footer">
        <div className="footer-container">
        <div className="row">
        <div className="footer-col">
            <h4>company</h4>
            <ul>
            <li><a href="#">about us</a></li>
            <li><a href="https://www.ablockofcrypto.com/partners">our services</a></li>
            <li><a href="https://www.ablockofcrypto.com/blog">Blog</a></li>
            <li><a href="https://www.ablockofcrypto.com/privacypolicy">privacy policy</a></li>
            </ul>
        </div>
        
        <div className="footer-col">
            <h4>follow us</h4>
            <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
        </div>
        </div>
        </div>
    </footer>)
}

export default Footer