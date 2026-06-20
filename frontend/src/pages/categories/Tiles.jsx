import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Required for URL filtering
import { GRANITE_TYPES } from '../utils/constants';
import '../styles/pages.css';

// 1. Updated Data with Category Column
const CSV_PRODUCTS = [

  { name: "Absolute Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2015/11/Absolute-Black-Polished-Texture.webp", category: "Black" },
  { name: "Black Galaxy Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2015/11/Black-Galaxy-Granite-Swatch.webp", category: "Black" },
  { name: "Black Marine Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Black-marine-granite.webp", category: "Black" },
  { name: "Black Marcino Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2020/08/Black-Marcino-Swatch.webp", category: "Black" },
  { name: "Blue Dunes Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Blue-dunes-granite.webp", category: "Blue" },
  { name: "Colonial White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2017/07/Colonial-White-Swatch.webp", category: "White" },
  { name: "Desert Brown Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Desert-brown-granite.webp", category: "Brown" },
  { name: "Steel Grey Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Steel-grey-granite.webp", category: "Grey" },
  
  { name: "P White Granite (Lunar Pearl)", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/P-white-granite.webp", category: "White" },
  { name: "Alaska White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2016/06/Alaska-White-Swatch.webp", category: "White" },
  { name: "Black Forest Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2016/05/Black-Forest-Swatch.webp", category: "Black" },
  { name: "Viscon White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Viscon-white-granite-1.webp", category: "White" },
  { name: "Tan Brown Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Tan-brown-granite.webp", category: "Brown" },
  { name: "Colonial Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2015/11/Colonial-Gold-Swatch.webp", category: "Gold" },
  { name: "Kuppam Green Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2016/05/Kuppam-Green-Swatch.webp", category: "Green" },
  { name: "Lavender Blue Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Lavendar-blue-granite.webp", category: "Blue" },
  { name: "Coffee Brown Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Coffee-brown-granite.webp", category: "Brown" },
  { name: "Classic Paradiso Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2016/05/Classic-Paradiso-Swatch.webp", category: "Multicolor" },
  { name: "Bash Paradiso Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Bash-paradiso-granite.webp", category: "Multicolor" },
  { name: "Red Multicolor Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Red-multicolor-granite.webp", category: "Red" },
  { name: "New Kashmir White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/New-kashmir-white-granite-1.webp", category: "White" },
  { name: "Himalayan Blue Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Himalayan-blue-granite.webp", category: "Blue" },
  { name: "Colombo Juparana Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Colombo-jubrana-granite.webp", category: "Multicolor" },
  { name: "Crystal Yellow Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Crystal-yellow-granite.webp", category: "Yellow" },
  { name: "Malwada Yellow Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Malwada-yellow-granite.webp", category: "Yellow" },
  { name: "Astoria Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Astoria-granite.webp", category: "Multicolor" },
  { name: "Bala Flower Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Bala-flower-granite.webp", category: "Multicolor" },
  { name: "Copper Silk Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Copper-silk-granite.webp", category: "Brown" },
  { name: "Kotkasta Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Kotkasta-granite.webp", category: "Multicolor" },
  { name: "Maliwada Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Maliwada-granite.webp", category: "Yellow" },
  { name: "Monte Cristo Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Monte-cristo-granite.webp", category: "Multicolor" },
  { name: "Onida Orange Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Onida-orange-granite.webp", category: "Orange" },
  { name: "Royal Cream Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Royal-cream-granite.webp", category: "Cream" },
  { name: "Rue Classic Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Rue-classic-granite.webp", category: "Multicolor" },
  { name: "Tiger Skin Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Tiger-skin-granite.webp", category: "Brown" },
  { name: "Bahama Ivory Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Bahama-ivory-granite.webp", category: "Cream" },
  { name: "Cats Eye Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Cats-eye-granite.webp", category: "Brown" },
  { name: "Black Premium Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Black-premium-granite.webp", category: "Black" },
  { name: "Colonial Cream Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Colonial-cream-granite.webp", category: "Cream" },
  { name: "Ghiblee Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Ghiblee-granite.webp", category: "Multicolor" },
  { name: "Indian Aurora Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Indian-aurora-granite.webp", category: "Multicolor" },
  { name: "Ivory Fantasy Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Ivory-fantasy-granite.webp", category: "Cream" },
  { name: "Millennium Cream Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Millenium-cream-granite-1.webp", category: "Cream" },
  { name: "Rose Wood Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Rose-wood-granite.webp", category: "Brown" },
  { name: "Sea Waves Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Sea-waves-granite-1.webp", category: "Grey" },
  { name: "Mango Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Mango-granite.webp", category: "Yellow" },
  { name: "Lava Oro Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Lava-oro-granite.webp", category: "Gold" },
  { name: "Donna Grey Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Donna-grey-granite.webp", category: "Grey" },
  { name: "Indian Copacabana Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Indian-Copacabana-Swatch.webp", category: "Multicolor" },
  { name: "Alabaster White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Alabaster-white-granite.webp", category: "White" },
  { name: "Alpinus White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Alpinus-white-granite.webp", category: "White" },
  { name: "Bianco White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Bianco-white-granite.webp", category: "White" },
  { name: "Crystal White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Crystal-white-granite.webp", category: "White" },
  { name: "French White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/French-white-granite.webp", category: "White" },
  { name: "Imperial White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Imperial-white-granite.webp", category: "White" },
  { name: "Indian Cappuccino White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Indian-cappucino-white-granite.webp", category: "White" },
  { name: "Kuppam White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Kuppam-white-granite.webp", category: "White" },
  { name: "Moon White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Moon-white-granite.webp", category: "White" },
  { name: "River White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/River-white-granite.webp", category: "White" },
  { name: "Thunder White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Thunder-white-granite-1.webp", category: "White" },
  { name: "Titanium White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Titanium-white-granite.webp", category: "White" },
  { name: "New Ivory White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/New-ivory-white-granite.webp", category: "White" },
  { name: "S White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/S-white-granite.webp", category: "White" },
  { name: "Sadarali Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Sadarali-grey-granite.webp", category: "Grey" },
  { name: "Epic White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Epic-white-granite.webp", category: "White" },
  { name: "Monalisa Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Monalisa-granite.webp", category: "Multicolor" },
  { name: "Sunset Canyon Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Sunset-canyon-granite.webp", category: "Brown" },
  { name: "Stream White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Stream-White-Swatch.webp", category: "White" },
  { name: "Mariyam White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Mariyam-White-Granite-Swatch.webp", category: "White" },
  { name: "Atlantic White Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Atlantic-White-Swatch.webp", category: "White" },
  { name: "Alaska Red Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Alaska-red-granite.webp", category: "Red" },
  { name: "Bruno Red Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Bruno-red-granite.webp", category: "Red" },
  { name: "Jhansi Red Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Jhansi-red-granite.webp", category: "Red" },
  { name: "Lakha Red Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Lakha-red-granite.webp", category: "Red" },
  { name: "New Imperial Red Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/New-imperial-red-granite.webp", category: "Red" },
  { name: "Wine Red Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Wine-red-granite.webp", category: "Red" },
  { name: "Chima Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Chima-pink-granite.webp", category: "Pink" },
  { name: "Rosy Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Rosy-pink-granite.webp", category: "Pink" },
  { name: "Astoria Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Astoria-pink-granite.webp", category: "Pink" },
  { name: "Ghiblee Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Ghiblee-pink-granite.webp", category: "Pink" },
  { name: "Imperial Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Imperial-pink-granite.webp", category: "Pink" },
  { name: "Romantic Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Romantic-pink-granite.webp", category: "Pink" },
  { name: "Strawberry Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Strawberry-pink-granite.webp", category: "Pink" },
  { name: "Alaska Pink Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Alaska-pink-granite.webp", category: "Pink" },
  { name: "Narlai Grey Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Narlai-grey-granite.webp", category: "Grey" },
  { name: "Kuppam Grey Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Kuppam-grey-granite.webp", category: "Grey" },
  { name: "Apple Green Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Apple-green-granite-2.webp", category: "Green" },
  { name: "Desert Green Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Desert-green-granite.webp", category: "Green" },
  { name: "French Green Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/French-green-granite.webp", category: "Green" },
  { name: "Green Pearl Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Green-pearl-granite.webp", category: "Green" },
  { name: "Royal Green Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Royal-green-granite.webp", category: "Green" },
  { name: "Hassan Green Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Hassan-green-granite.webp", category: "Green" },
  { name: "Mungaria Green Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Mungaria-green-granite.webp", category: "Green" },
  { name: "Olivia Green Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Olivia-Green-Swatch.webp", category: "Green" },
  { name: "Alaska Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Alaska-gold-granite.webp", category: "Gold" },
  { name: "Bianco Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Bianco-gold-granite.webp", category: "Gold" },
  { name: "Desert Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Desert-gold-granite.webp", category: "Gold" },
  { name: "Magma Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Magma-gold-granite.webp", category: "Gold" },
  { name: "Merry Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Merry-gold-granite.webp", category: "Gold" },
  { name: "Titanium Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Titanium-gold-granite.webp", category: "Gold" },
  { name: "Astoria Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Astoria-gold-granite.webp", category: "Gold" },
  { name: "Fusion Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2022/09/Fusion-Gold-Swatch.webp", category: "Gold" },
  { name: "Golden Oak Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Golden-oak-granite.webp", category: "Gold" },
  { name: "Imperial Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Imperial-gold-granite.webp", category: "Gold" },
  { name: "Ivory Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Ivory-gold-granite.webp", category: "Gold" },
  { name: "Parada Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Parada-gold-granite-1.webp", category: "Gold" },
  { name: "River Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/River-gold-granite.webp", category: "Gold" },
  { name: "Shivakashi Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Shivakashi-gold-granite.webp", category: "Gold" },
  { name: "Ivory Chiffon Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Ivory-chiffon-granite.webp", category: "Cream" },
  { name: "Exotic Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Exotic-gold-granite.webp", category: "Gold" },
  { name: "Armani Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Armani-gold-granite.webp", category: "Gold" },
  { name: "Bhama Gold Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Bhama-Gold-Granite-Swatch.webp", category: "Gold" },
  { name: "Z Brown Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Z-brown-granite.webp", category: "Brown" },
  { name: "Baltic Brown Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Baltic-brown-granite.webp", category: "Brown" },
  { name: "Ivory Brown Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Ivory-brown-granite.webp", category: "Brown" },
  { name: "Sapphire Brown Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Sapphire-brown-granite.webp", category: "Brown" },
  { name: "Sparkle Brown Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Sparkle-brown-granite.webp", category: "Brown" },
  { name: "Imperial Blue Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Imperial-blue-granite.webp", category: "Blue" },
  { name: "Koliwada Blue Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Koliwada-blue-granite.webp", category: "Blue" },
  { name: "Flash Blue Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Flash-blue-granite.webp", category: "Blue" },
  { name: "Indian Blue Pearl Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Indian-blue-pearl-granite.webp", category: "Blue" },
  { name: "Vizag Blue Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Vizag-blue-granite.webp", category: "Blue" },
  { name: "Blue Ocean Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Blue-ocean-granite.jpg", category: "Blue" },
  { name: "Black Beauty Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Black-beauty-granite.webp", category: "Black" },
  { name: "Black Marquina Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Black-marquina-granite.webp", category: "Black" },
  { name: "Wave Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Wave-black-granite.webp", category: "Black" },
  { name: "Zebra Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Zebra-black-granite.webp", category: "Black" },
  { name: "Fusion Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Fusion-black-granite.webp", category: "Black" },
  { name: "Impala Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Impala-black-granite.webp", category: "Black" },
  { name: "Jet Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Jet-black-granite.webp", category: "Black" },
  { name: "Nova Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/02/Nova-black-granite-1.webp", category: "Black" },
  { name: "Fish Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Fish-black-granite.webp", category: "Black" },
  { name: "Titanium Black Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/03/Titanium-black-granite.webp", category: "Black" },
  { name: "Silver Waves Granite", image: "https://www.regattagranitesindia.com/wp-content/uploads/2026/04/Silver-Waves-Swatch-2.webp", category: "Grey" },


  
  { name: 'Black Forest Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/8-scaled.jpg', price: 52, category: 'Black' },
  { name: 'Black Pearl Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/5-scaled.jpg', price: 52, category: 'Black' },
  { name: 'Ash Black Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/11-scaled.jpg', price: 52, category: 'Black' },
  { name: 'Coin Black Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/15-scaled.jpg', price: 52, category: 'Black' },
  { name: 'Fusion Black Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/45-scaled.jpg', price: 52, category: 'Black' },
  { name: 'Impala Black Granite', image: 'https://marmogranite.com/wp-content/uploads/2024/11/Fortuna-Marmo-Granite-29.jpg', price: 52, category: 'Black' },
  { name: 'Titanium Black Granite', image: 'https://marmogranite.com/wp-content/uploads/2025/04/Fortuna-Marmo-Granite-1.jpg', price: 52, category: 'Black' },

  { name: 'Classic White Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/14-scaled.jpg', price: 52, category: 'White' },
  { name: 'Andromeda White Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/4-scaled.jpg', price: 52, category: 'White' },
  { name: 'Alaska White Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/3-scaled.jpg', price: 52, category: 'White' },
  { name: 'Azul White Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/6-scaled.jpg', price: 52, category: 'White' },
  { name: 'Colonial White Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/18-scaled.jpg', price: 52, category: 'White' },
  { name: 'Kashmir White Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/26-scaled.jpg', price: 52, category: 'White' },
  { name: 'Moon White Granite', image: 'https://marmogranite.com/wp-content/uploads/2024/11/Fortuna-Marmo-Granite-23-400x223.jpg', price: 52, category: 'White' },

  { name: 'Alaska Gold Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/2-1-scaled.jpg', price: 52, category: 'Gold' },
  { name: 'Imperial Gold Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/23-scaled.jpg', price: 52, category: 'Gold' },
  { name: 'Ghibli Gold Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/22-scaled.jpg', price: 52, category: 'Gold' },
  { name: 'Desert Gold Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/08/10-min-300x167.jpg', price: 52, category: 'Gold' },

  { name: 'Blue Dunes Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/12-1-scaled.jpg', price: 52, category: 'Blue' },
  { name: 'Blue Pearl Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/13-1-scaled.jpg', price: 52, category: 'Blue' },
  { name: 'Flash Blue Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/21-scaled.jpg', price: 52, category: 'Blue' },
  { name: 'Amadeus Blue Granite', image: 'https://marmogranite.com/wp-content/uploads/2024/12/Fortuna-Marmo-Granite-32-300x167.jpg', price: 52, category: 'Blue' },

  { name: 'Nosra Green Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/06/32-scaled.jpg', price: 52, category: 'Green' },
  { name: 'Desert Green Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/08/11-min-300x167.jpg', price: 52, category: 'Green' },
  { name: 'Hassan Green Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/08/12-min-300x167.jpg', price: 52, category: 'Green' },
  { name: 'Apple Green Granite', image: 'https://marmogranite.com/wp-content/uploads/2024/11/Fortuna-Marmo-Granite-30.jpg', price: 52, category: 'Green' },

  { name: 'Tan Brown Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/08/1-300x167.jpg', price: 52, category: 'Brown' },
  { name: 'Coffee Brown Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/08/2-300x167.jpg', price: 52, category: 'Brown' },
  { name: 'Desert Brown Granite', image: 'https://marmogranite.com/wp-content/uploads/2022/08/9-min-300x167.jpg', price: 52, category: 'Brown' },

  { name: 'Jhansi Red Granite', image: 'https://marmogranite.com/wp-content/uploads/2024/11/Fortuna-Marmo-Granite-7-1.jpg', price: 52, category: 'Red' },
  { name: 'Lakha Red Granite', image: 'https://marmogranite.com/wp-content/uploads/2024/11/Fortuna-Marmo-Granite-9-600x335.jpg', price: 52, category: 'Red' },
  { name: 'New Imperiala Red Granite', image: 'https://marmogranite.com/wp-content/uploads/2024/10/Fortuna-Marmo-Granite-1-1024x571.jpg', category: 'Red' },

  
];

const DEFAULT_DESCRIPTION = 'Premium quality granite, sourced from verified quarries.';
const DEFAULT_FEATURES = ['Natural stone finish', 'Scratch resistant', 'Easy to maintain'];

// Build Lookup Map
const graniteTypesMap = Object.fromEntries(
  GRANITE_TYPES.map((g) => [g.name.toLowerCase().trim(), g])
);

// Merge Data
const ALL_PRODUCTS = CSV_PRODUCTS.map((csvItem, index) => {
  const key = csvItem.name.toLowerCase().trim();
  const existing = graniteTypesMap[key];
  return {
    id: existing ? existing.id : `csv-${index}`,
    name: csvItem.name,
    image: csvItem.image,
    category: csvItem.category || 'Luxury', // Fallback
    description: existing ? existing.description : DEFAULT_DESCRIPTION,
    features: existing ? existing.features : DEFAULT_FEATURES,
  };
});


export default function Tiles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 2. Get category from URL (e.g. ?category=Black)
  const categoryFilter = searchParams.get('category') || 'All';

  // 3. Filtered List Logic
  const filteredProducts = useMemo(() => {
    if (categoryFilter === 'All') return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }, [categoryFilter]);

  const [selectedProduct, setSelectedProduct] = useState(filteredProducts[0] || ALL_PRODUCTS[0]);

  // Sync selected product when filter changes
  useEffect(() => {
    if (filteredProducts.length > 0) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [filteredProducts]);

  return (
    <div className="page products-page">
      <section className="page-header">
        <div className="container container-heading">
          <h1>Our {categoryFilter !== 'All' ? categoryFilter : ''} Granite Collections</h1>
          <p>Browse our premium selection of {categoryFilter.toLowerCase()} imported varieties</p>
        </div>
      </section>

      {/* Category Tabs - Responsive Slider */}
      <section className="filter-bar">
        <div className="filter-buttons-wrapper">
          <div className="filter-buttons-container">
            {['All', 'Black', 'White', 'Blue', 'Gold', 'Green', 'Brown', 'Red', 'Yellow' , 'Multicolor', 'Cream', 'Grey', 'Pink', 'Orange'].map(cat => (
              <button 
                key={cat}
                className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setSearchParams({ category: cat })}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/products/${product.id || product._id}`, { state: { product } })}
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />

                  <div className="category-tag" style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 10px',
                    fontSize: '10px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {product.category}
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <button 
                    className="get-quote-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/get-quote?granite=${encodeURIComponent(product.name)}`);
                    }}
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Granite Guide */}
      <section className="granite-guide">
        <div className="container">
          <h2>Granite Buying Guide</h2>
          <div className="guide-grid">
            <div className="guide-card">
              <h3>🏠 For Home Projects</h3>
              <p>Ideal granite types for kitchens, bathrooms, and living spaces. Durable and easy to maintain.</p>
              <ul>
                <li>Indian Black Granite</li>
                <li>Kashmir White Granite</li>
                <li>Green Granite</li>
              </ul>
            </div>
            <div className="guide-card">
              <h3>🏢 For Commercial Use</h3>
              <p>Heavy-duty granite suitable for high-traffic commercial areas and office buildings.</p>
              <ul>
                <li>Multicolor Granite</li>
                <li>Red Granite</li>
                <li>Indian Black Granite</li>
              </ul>
            </div>
            <div className="guide-card">
              <h3>✨ Premium Selection</h3>
              <p>Our finest collections for luxury projects and statement designs.</p>
              <ul>
                <li>Pink Granite</li>
                <li>Multicolor Granite</li>
                <li>Kashmir White Granite</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2>Why Choose Our Granite?</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">💎</div>
              <h4>Premium Quality</h4>
              <p>Sourced directly from verified quarries</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🔧</div>
              <h4>Professional Installation</h4>
              <p>Expert installation with proper sealing</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⏱️</div>
              <h4>Quick Turnaround</h4>
              <p>Fast processing and delivery</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🛡️</div>
              <h4>Guaranteed Quality</h4>
              <p>1-year warranty on installation</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}