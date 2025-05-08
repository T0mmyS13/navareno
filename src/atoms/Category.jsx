import React from "react";
import "../styles/Category.css";

const Category = ({ title, link, description, image }) => (
    <a href={link} className="category">
        <img src={image} alt={title} className="category-image" />
        <h3 className="category-title">{title}</h3>
        <p className="category-description">{description}</p>
    </a>
);

export default Category;