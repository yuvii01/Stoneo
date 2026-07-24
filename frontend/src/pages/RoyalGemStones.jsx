import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactSlick from 'react-slick';
const Slider = ReactSlick.default || ReactSlick;
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/RoyalGemStones.css';
import SEOHead from '../components/SEOHead';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

gsap.registerPlugin(ScrollTrigger);

const RoyalGemStones = () => {
  const [loading, setLoading] = useState(true);
  const stoneRowsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Hide preloader after typing animation completes (2.5s)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const carouselItems = [
    {
      subtitle: "Back Panel",
      title: "THE WHISPERS OF SOPHISTICATION",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBcB2jHT1LXZz1IxvonrDJKYrxGE2bBY2kgJ9KfF_fTw&s"
    },
    {
      subtitle: "Wash Basin",
      title: "A TOUCH OF ELEGANCE",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPRt4ry8FCS9Ai7Jx8WZnzinRGrPUnsi1pe7q4Ko1bqg&s=10"
    },
    {
      subtitle: "Table Top",
      title: "CENTERPIECE OF LUXURY",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAgIwcdfVn1xODyZ3MJ1n9iy9G8vFGxzcBD2iqj_egqg&s=10"
    }
  ];

  const stoneCategories = [
    {
      name: "AGATE",
      description: "Discover the mesmerizing banding and translucent beauty of natural Agate. Perfect for creating a dramatic and luxurious statement piece in any space.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSnsCZjlc6ItSzy-XFExEtrg2QgNJ6t5gCKOSpEYteVg&s=10"
    },
    {
      name: "QUARTZ",
      description: "Experience the unparalleled clarity and brilliance of Quartz. A timeless choice that blends durability with an ethereal aesthetic.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSnsCZjlc6ItSzy-XFExEtrg2QgNJ6t5gCKOSpEYteVg&s=10"
    },
    {
      name: "GEMSTONE",
      description: "Indulge in the vibrant colors and rare allure of our Gemstone collection. Crafted for those who appreciate the extraordinary.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSnsCZjlc6ItSzy-XFExEtrg2QgNJ6t5gCKOSpEYteVg&s=10"
    },
    {
      name: "SHELLSTONE",
      description: "Bring the delicate textures of the ocean into your interiors. Shellstone offers a unique, organic feel with a touch of pearlescent shine.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSnsCZjlc6ItSzy-XFExEtrg2QgNJ6t5gCKOSpEYteVg&s=10"
    },
    {
      name: "FOSSIL",
      description: "Own a piece of history with our Fossil stones. These incredible natural formations add a captivating historical depth to any design.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSnsCZjlc6ItSzy-XFExEtrg2QgNJ6t5gCKOSpEYteVg&s=10"
    },
    {
      name: "JASPER",
      description: "Admire the rich, earthy tones and intricate patterns of Jasper. A grounding stone that brings warmth and sophisticated character.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSnsCZjlc6ItSzy-XFExEtrg2QgNJ6t5gCKOSpEYteVg&s=10"
    }
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    fade: true,
    arrows: false,
  };

  useEffect(() => {
    if (!loading) {
      // Stone Rows Animation on scroll
      stoneRowsRef.current.forEach((el, index) => {
        if (el) {
          gsap.fromTo(el,
            { opacity: 0, y: 80 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }
  }, [loading]);

  return (
    <div className="royal-page page">
      <SEOHead
        pageKey="home"
        title="Royal Gem Stones | Luxury Collection"
      />

      {/* Fullscreen Preloader */}
      <div className={`royal-preloader ${!loading ? 'hidden' : ''}`}>
        <div className="typing-container">
          <h1 className="typing-text">
            ROYAL GEM STONES <span style={{ color: '#d4af37', margin: '0 8px' }}>X</span> STONEO
          </h1>
        </div>
      </div>

      {/* Large Carousel */}
      <section className="royal-carousel-section">
        <Slider {...sliderSettings}>
          {carouselItems.map((item, index) => (
            <div key={index}>
              <div
                className="royal-slide"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="royal-slide-overlay"></div>
                <div className="royal-slide-content">
                  <p style={{ color: '#ccc', marginBottom: '15px', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '1.2rem', fontWeight: 300 }}>{item.subtitle}</p>
                  <h2>{item.title}</h2>
                  <button 
                    className="btn-view-product"
                    onClick={() => navigate(`/royal-gem-stones/application/${item.subtitle.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    View Collection
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Alternating Stone Types */}
      <section className="royal-stone-types">
        <h2 className="royal-section-title">Stone Types</h2>

        {stoneCategories.map((stone, index) => (
          <div
            key={stone.name}
            className={`stone-type-row ${index % 2 !== 0 ? 'reverse' : ''}`}
            ref={el => stoneRowsRef.current[index] = el}
          >
            <div className="stone-info">
              <h3>{stone.name}</h3>
              <p>{stone.description}</p>
              <button 
                className="btn-view-collection"
                onClick={() => navigate(`/royal-gem-stones/stone/${stone.name.toLowerCase()}`)}
              >
                View Collection
              </button>
            </div>
            <div className="stone-image">
              <img src={stone.image} alt={stone.name} />
            </div>
          </div>
        ))}

      </section>
    </div>
  );
};

export default RoyalGemStones;
