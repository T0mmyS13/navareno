import React from "react";
import Category from "../atoms/Category.jsx";
import "../styles/MainPage.css";

// Data pro jednotlivé kategorie jídel
const categories = [
    { title: "Předkrmy", link: "/predkrmy", description: "Malé lahůdky, které vás skvěle naladí na hlavní chod.", image: "/images/predkrmy.jpg" },
    { title: "Polévky", link: "/polevky", description: "Hřejivé a chutné polévky pro každou příležitost.", image: "/images/polevky.jpg" },
    { title: "Saláty", link: "/salaty", description: "Lehké, zdravé a plné svěžích chutí.", image: "/images/salaty.jpg" },
    { title: "Hlavní chody", link: "/hlavni-chody", description: "Výborná jídla, která vás zasytí a potěší.", image: "/images/hlavni-chody.jpg" },
    { title: "Dezerty", link: "/dezerty", description: "Sladká tečka, kterou si zamilujete.", image: "/images/dezerty.jpg" },
    { title: "Nápoje", link: "/napoje", description: "Osvěžující i hřejivé nápoje pro každou chvíli.", image: "/images/napoje.jpg" },
];

// Hlavní komponenta hlavní stránky
const MainPage = () => {
    return (
        <div className="container"> {/* Hlavní obalovací div */}

            {/* Úvodní hero sekce s obrázkem a nadpisem */}
            <div className="hero">
                <img src="/images/hero.jpg" alt="Navařeno" className="hero-image" />
                <div className="hero-overlay">
                    <h1 className="main-title">Navařeno</h1>
                    <p className="subtitle">Uvařit nikdy nebylo jednodušší</p>
                </div>
            </div>

            {/* Úvodní nadpis sekce kategorií */}
            <h2 className="section-title">Vyberte si z našich chutných kategorií</h2>
            <p className="section-subtitle">Od předkrmu až po dezert</p>

            {/* Mřížka s kategoriemi */}
            <div className="category-grid">
                {categories.map((cat) => (
                    <Category key={cat.title} {...cat} /> // Vykreslení jednotlivých kategorií
                ))}
            </div>
        </div>
    );
};

export default MainPage;
