import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactSlick from 'react-slick';
const Slider = ReactSlick.default || ReactSlick;
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/RoyalGemStones.css';
import SEOHead from '../components/SEOHead';
import { gemstoneImages } from '../gemstoneImages';
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
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const carouselItems = [
    {
      subtitle: "Back Panel",
      title: "THE WHISPERS OF SOPHISTICATION",
      image: "https://i.pinimg.com/736x/79/d7/f9/79d7f9b997fe48ff5cc92532e2bc8811.jpg"
    },
    {
      subtitle: "Wash Basin",
      title: "A TOUCH OF ELEGANCE",
      image: "https://i.pinimg.com/1200x/78/68/8b/78688bb5a28888d87cfa8c03d0c065ca.jpg"
    },
    {
      subtitle: "Table Top",
      title: "CENTERPIECE OF LUXURY",
      image: "https://i.pinimg.com/736x/68/84/b8/6884b808b96bd2ce7cd0ae904d502dbe.jpg"
    }
  ];

  const stoneCategories = [
    {
      name: "AGATE",
      description: "Discover the mesmerizing banding and translucent beauty of natural Agate. Perfect for creating a dramatic and luxurious statement piece in any space.",
      images: gemstoneImages['agate'] || []
    },
    {
      name: "QUARTZ",
      description: "Experience the unparalleled clarity and brilliance of Quartz. A timeless choice that blends durability with an ethereal aesthetic.",
      images: gemstoneImages['quartz'] || []
    },
    {
      name: "GEMSTONE",
      description: "Indulge in the vibrant colors and rare allure of our Gemstone collection. Crafted for those who appreciate the extraordinary.",
      images: gemstoneImages['gemstone'] || []
    },
    {
      name: "SHELLSTONE",
      description: "Bring the delicate textures of the ocean into your interiors. Shellstone offers a unique, organic feel with a touch of pearlescent shine.",
      images: gemstoneImages['shellstone'] || []
    },
    {
      name: "FOSSIL",
      description: "Own a piece of history with our Fossil stones. These incredible natural formations add a captivating historical depth to any design.",
      images: gemstoneImages['fossil'] || []
    },
    {
      name: "JASPER",
      description: "Admire the rich, earthy tones and intricate patterns of Jasper. A grounding stone that brings warmth and sophisticated character.",
      images: gemstoneImages['jasper'] || []
    }
  ];

  const stoneSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    arrows: false,
    swipeToSlide: true,
    touchThreshold: 100,
  };

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
    swipeToSlide: true,
    touchThreshold: 100,
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
        <div className="loader-fade-2">ROYAL GEM STONES</div>
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
                    style={{ margin: '0 auto', display: 'block' }}
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
            onClick={() => navigate(`/royal-gem-stones/stone/${stone.name.toLowerCase()}`)}
            className={`stone-type-row ${index % 2 !== 0 ? 'reverse' : ''}`}
            ref={el => stoneRowsRef.current[index] = el}
          >
            <div className="stone-info">
              <h3>{stone.name}</h3>
              <p>{stone.description}</p>
              <button
                className="btn-view-collection"

              >
                View Collection
              </button>
            </div>
            <div className="stone-image-slider" style={{ cursor: 'pointer' }}>
              {stone.images && stone.images.length > 0 ? (
                <Slider {...stoneSliderSettings}>
                  {stone.images.map((imgSrc, i) => (
                    <div key={i} className="stone-slide-item">
                      <img src={imgSrc} alt={`${stone.name} ${i + 1}`} />
                    </div>
                  ))}
                </Slider>
              ) : (
                <div className="stone-slide-item">
                  <p style={{ color: '#555', textAlign: 'center', paddingTop: '40%' }}>No images available</p>
                </div>
              )}
            </div>
          </div>
        ))}

      </section>
    </div>
  );
};

export default RoyalGemStones;
