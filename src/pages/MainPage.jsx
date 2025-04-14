import React from "react";
import { Link } from "react-router-dom";
import Category from "../atoms/Category.jsx";
import "../styles/MainPage.css";

const categories = [
    { title: "Předkrmy", link: "/predkrmy", description: "Malé lahůdky, které vás skvěle naladí na hlavní chod.", image: "/images/predkrmy.jpg" },
    { title: "Polévky", link: "/polevky", description: "Hřejivé a chutné polévky pro každou příležitost.", image: "/images/polevky.jpg" },
    { title: "Saláty", link: "/salaty", description: "Lehké, zdravé a plné svěžích chutí.", image: "/images/salaty.jpg" },
    { title: "Hlavní chody", link: "/hlavni-chody", description: "Výborná jídla, která vás zasytí a potěší.", image: "/images/hlavni chody.jpg" },
    { title: "Dezerty", link: "/dezerty", description: "Sladká tečka, kterou si zamilujete.", image: "/images/dezerty.jpg" },
    { title: "Nápoje", link: "/napoje", description: "Osvěžující i hřejivé nápoje pro každou chvíli.", image: "/images/napoje.jpg" },
];

const MainPage = () => {
    return (
        <div className="container">
            {/* Rychlé odkazy na kategorie - textové odkazy bez obrázků */}
            <div className="quick-links">
                {categories.map((cat) => (
                    <Link to={cat.link} className="quick-link-text" key={cat.title}>
                        {cat.title}
                    </Link>
                ))}
            </div>

            <div className="hero">
                <img src="/images/hero.jpg" alt="Navařeno" className="hero-image" />
                <div className="hero-overlay">
                    <h1 className="main-title">Navařeno</h1>
                    <p className="subtitle">Uvařit nikdy nebylo jednodušší</p>
                </div>
            </div>

            <h2 className="section-title">Vyberte si z našich chutných kategorií</h2>
            <p className="section-subtitle">Od předkrmu až po dezert</p>

            {/* Kategorií s obrázky */}
            <div className="category-grid">
                {categories.map((cat) => (
                    <Category key={cat.title} {...cat} />
                ))}
            </div>
        </div>
    );
};

export default MainPage;
