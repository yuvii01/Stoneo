import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function House() {
    const location = useLocation();
    const navigate = useNavigate();
    const isInterior = location.pathname.toLowerCase().includes('interior');

    const pageTitle = isInterior ? "Interiors" : "Exteriors";

    const interiorTitles = [
        "Flooring",
        "Wall Cladding",
        "Kitchen Countertops",
        "Bathroom & Vanity",
        "Staircase",
        "Pooja Room & Temples",
        "Table Tops & Furniture"
    ];

    const exteriorTitles = [
        "Elevation/Facade Cladding",
        "Outdoor Flooring & Paving",
        "Garden & Landscaping",
        "Driveways & Pathways",
        "Swimming Pool Areas"
    ];

    const activeTitles = isInterior ? interiorTitles : exteriorTitles;

    // Use picsum photos to generate a consistent, beautiful demo picture for each tile
    const tiles = activeTitles.map(title => ({
        title,
        image: `https://picsum.photos/seed/${title.replace(/\s/g, '')}/800/600`
    }));

    return (
        <section className="house-page-container" style={{
            minHeight: '100vh',
            margin: 0,
            paddingBottom: '50px',
            paddingLeft: '5%',
            paddingRight: '5%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
        }}>

            {/* Main Heading */}
            <div style={{
                textAlign: 'center',
                padding: '2vh 0',
                marginBottom: '30px',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    fontFamily: '"Playfair Display", "Georgia", serif',
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    color: '#654321',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    margin: 0
                }}>
                    {pageTitle}
                </h1>
            </div>

            {/* Grid Container */}
            <div className="house-tiles-grid" style={{ flex: 1 }}>
                {tiles.map((tile, index) => (
                    <div
                        key={index}
                        onClick={() => {
                            const slug = tile.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                            const base = isInterior ? '/application/interior' : '/application/exterior';
                            navigate(`${base}/${slug}`);
                        }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '20px',
                            color: 'white',
                            position: 'relative',
                            minHeight: '280px',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                            e.currentTarget.querySelector('.tile-bg-overlay').style.backgroundColor = 'rgba(0,0,0,0.4)';
                            e.currentTarget.querySelector('.tile-bg-image').style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.querySelector('.tile-bg-overlay').style.backgroundColor = 'rgba(0,0,0,0.6)';
                            e.currentTarget.querySelector('.tile-bg-image').style.transform = 'scale(1)';
                        }}
                    >
                        {/* Background Image */}
                        <div className="tile-bg-image" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${tile.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'transform 0.5s ease',
                            zIndex: 1
                        }}></div>

                        {/* Dark Overlay for Text Readability */}
                        <div className="tile-bg-overlay" style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            transition: 'background-color 0.5s ease',
                            zIndex: 2
                        }}></div>

                        {/* Text */}
                        <h2 style={{
                            fontSize: '1.8rem',
                            margin: 0,
                            fontWeight: 400,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            zIndex: 3,
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                            {tile.title}
                        </h2>
                    </div>
                ))}
            </div>
        </section>
    );
}
