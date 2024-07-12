import React from "react";

function Close_sidebar_btn() {
    const handleSidebarClose = () => {
        // Handle sidebar close
        const leftSidebar = document.querySelector('.container__left-sidebar');
        const navbar = document.querySelector('.navbar');
        const rightContainer = document.querySelector('.container__right');
        const menuBtn = document.querySelector('.navbar__menu-btn');

        if (leftSidebar) leftSidebar.style.display = 'none';
        if (navbar) {
            navbar.style.maxWidth = '100%';
            navbar.style.marginLeft = '0';
            navbar.style.marginRight = '0';
        }
        if (menuBtn) menuBtn.style.display = 'block';
        if (rightContainer) {
            rightContainer.style.maxWidth = '100%';
            rightContainer.style.marginLeft = '0';
            rightContainer.style.marginRight = '0';
        }
    };

    return (
        <div id="closeLeftSide" className="sidebar__close-btn" onClick={handleSidebarClose}>×</div>
    );
}

export default Close_sidebar_btn;




