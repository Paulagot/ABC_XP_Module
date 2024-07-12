import React from "react";

function Navbar_btn() {
    const handleMenuOpen = () => {
        // Handle menu open
        const leftSidebar = document.querySelector('.container__left-sidebar');
        const navbar = document.querySelector('.navbar');
        const rightContainer = document.querySelector('.container__right');
        const menuBtn = document.querySelector('.navbar__menu-btn');

        if (leftSidebar) leftSidebar.style.display = 'block'; // Show sidebar
        if (navbar) {
            navbar.style.maxWidth = '79%';
            navbar.style.marginLeft = '20.5%';
        }
        if (menuBtn) menuBtn.style.display = 'none'; // Hide menu button
        if (rightContainer) {
            rightContainer.style.maxWidth = '79%';
            rightContainer.style.marginLeft = '20.5%';
        }
    };

    return (
        <div className="navbar__menu-btn" id="openMenu" onClick={handleMenuOpen}>☰</div>
    );
}

export default Navbar_btn;
