import React from "react";
import { Link } from "react-router-dom";
import "../styles/HeaderLink.css"; //

const HeaderLink = () => {
    const categories = [
        { title: "Předkrmy", link: "/predkrmy" },
        { title: "Polévky", link: "/polevky" },
        { title: "Saláty", link: "/salaty" },
        { title: "Hlavní chody", link: "/hlavni-chody" },
        { title: "Dezerty", link: "/dezerty" },
        { title: "Nápoje", link: "/napoje" },
    ];

    return (
        <div className="quick-links">
            {categories.map((cat) => (
                <Link to={cat.link} className="quick-link-text" key={cat.title}>
                    {cat.title}
                </Link>
            ))}
        </div>
    );
};

export default HeaderLink;