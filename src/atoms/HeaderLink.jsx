import React from "react";
import { Link } from "react-router-dom";
import "../styles/HeaderLink.css";

const HeaderLink = () => {
    const categories = [
        { title: "Předkrmy", link: "/predkrmy" },
        { title: "Polévky", link: "/polevky" },
        { title: "Saláty", link: "/salaty" },
        { title: "Hlavní chody", link: "/hlavni-chody" },
        { title: "Dezerty", link: "/dezerty" },
        { title: "Nápoje", link: "/napoje" },
        { title: "Přidat recept", link: "/new-recipe" },
        { title: "Nakupní seznam", link: "/cart" },
    ];

    return (
        <div className="quick-links">
            {categories.map((cat) => (
                <Link
                    to={cat.link}
                    className={`quick-link-text ${
                        cat.title === "Přidat recept" ? "add-recipe" : ""
                    } ${cat.title === "Nakupní seznam" ? "cart-link" : ""}`}
                    key={cat.title}
                >
                    {cat.title}
                </Link>
            ))}
        </div>
    );
};

export default HeaderLink;