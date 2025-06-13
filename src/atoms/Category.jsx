import React from "react";
import { Link } from "react-router-dom"
import "../styles/Category.css";

const Category = ({ title, link, description, image }) => (
    <Link to={link} className="category">
        <img src={image} alt={title} className="category-image" />
        <h3 className="category-title">{title}</h3>
        <p className="category-description">{description}</p>
    </Link>
);

export default Category;