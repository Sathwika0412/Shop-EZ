import { Product } from './types';

export const SEED_PRODUCTS: Product[] = [
  // --- BOOKS ---
  {
    id: 'prod-book-gitanjali',
    name: 'Gitanjali: Song Offerings by Rabindranath Tagore',
    description: 'A beautiful collector’s edition of Rabindranath Tagore’s Nobel Prize-winning verses. Printed on handcrafted sustainable parchment paper with elegant gold-foil details on the cover. Features the original English translations with an introduction by W.B. Yeats, perfect for literature lovers and heritage libraries.',
    artisanStory: 'Published in collaboration with the Tagore Heritage Society in Shantiniketan, Bengal. Each cover is hand-bound using upcycled organic cotton textiles by local women artisans, preserving Bengal’s book-binding legacy.',
    price: 999,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    discount: 10,
    stock: 25
  },
  {
    id: 'prod-book-mahabharata',
    name: 'The Mahabharata: Deluxe Illustrated Edition',
    description: 'An extraordinary deluxe volume of India’s greatest epic, featuring over 120 traditional Miniature paintings, Madhubani illustrations, and Tanjore art plates. Written in rich, evocative prose with side-by-side Sanskrit verses and philosophical analyses of the Bhagavad Gita.',
    artisanStory: 'Curated by visual historians and illustrated by traditional family guilds in Udaipur, Rajasthan. The proceeds support traditional miniature painting schools that keep classical Mewar school artistic rules alive.',
    price: 4500,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    discount: 15,
    stock: 8
  },
  {
    id: 'prod-book-ayurveda',
    name: 'Vedic Healing: Ancient Science of Longevity',
    description: 'A comprehensive modern compendium of Ayurvedic formulations, daily lifestyle routines (Dinacharya), yoga integration, and holistic herbal therapeutics. Features clear directories of 150+ native medicinal herbs and step-by-step organic recipe guides for deep physiological restoration.',
    artisanStory: 'Written by Dr. Anuradha Sharma, an Ayurvedic physician who works with wild-harvesting cooperatives in Rishikesh. Printed on 100% recycled wood-free paper using organic soy inks.',
    price: 1499,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    discount: 5,
    stock: 30
  },
  {
    id: 'prod-book-india-art',
    name: 'The Arts of India: A 5000-Year Visual History',
    description: 'A monumental, hardcover coffee table book exploring the magnificent architectures, temple sculptures, handloom masterworks, and metal crafts of the Indian subcontinent from the Indus Valley Civilization to contemporary revivification movements.',
    artisanStory: 'Compiled over 7 years by independent Indian art historians. Every purchase directly sponsors master-artisan database documentation and preservation projects overseen by national craft guilds.',
    price: 5999,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    discount: 20,
    stock: 12
  },

  // --- MENWEAR ---
  {
    id: 'prod-men-linen',
    name: 'Premium Royal Khadi Linen Kurta',
    description: 'An elegantly hand-spun, pure organic Khadi linen kurta in a classic heritage off-white tone. Features traditional side slit pockets, coconut shell buttons, and a structured mandarin collar. Combines lightweight ventilation with high-class formal comfort.',
    artisanStory: 'Hand-loomed by the Gandhi Khadi Cooperative in Wardha, Maharashtra. Using native hand-spinning charkhas, each fabric piece possesses a unique rustic texture that is breathable in summer and insulating in winter.',
    price: 3499,
    category: 'Menwear',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    discount: 12,
    stock: 15
  },
  {
    id: 'prod-men-indigo',
    name: 'Hand-Block Indigo Printed Casual Shirt',
    description: 'Made from premium long-staple organic cotton and hand-dyed with authentic fermented natural indigo plant extract. Features beautiful geometric hand-block patterns applied one-by-one with teakwood blocks. Exceptionally soft, lightweight, and tailored for modern leisure.',
    artisanStory: 'Printed by the Chippa community of Bagru, Rajasthan. The deep blue color is created by dipping the cotton multiple times in deep clay indigo vats that have been active for generations.',
    price: 2499,
    category: 'Menwear',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    discount: 0,
    stock: 40
  },
  {
    id: 'prod-men-pashmina',
    name: 'Heritage Pashmina Wool Nehru Jacket',
    description: 'A classic, tailored sleeveless Nehru jacket crafted with a premium blend of pure Kashmir Pashmina and fine sheep wool. Soft to the touch and extremely elegant, featuring a smooth satin inner lining, brass coin buttons, and a double-piped chest pocket.',
    artisanStory: 'Sourced from the nomadic Changpa herders of Ladakh and tailored by heritage artisans in Srinagar, Kashmir. Each jacket supports mountain shepherd families during the harsh winter seasons.',
    price: 12500,
    category: 'Menwear',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    discount: 10,
    stock: 6
  },
  {
    id: 'prod-men-tunic',
    name: 'Organic Bamboo Cotton Lounge Tunic',
    description: 'A relaxed-fit casual tunic shirt made from high-strength bamboo fibers and certified organic cotton. Features a clean, button-less open neck placket, curved hems, and breathable weave. Pre-washed to ensure maximum silkiness.',
    artisanStory: 'Tailored by a fair-wage green apparel hub in Coimbatore, Tamil Nadu, which utilizes solar power and closed-loop water recycling systems during textile dye filtration.',
    price: 1999,
    category: 'Menwear',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    discount: 5,
    stock: 50
  },

  // --- WOMENWEAR ---
  {
    id: 'prod-women-banarasi',
    name: 'Varanasi Royal Brocade Silk Saree',
    description: 'A magnificent heritage masterpiece hand-woven with 100% pure mulberry silk and premium liquid-gold zari metallic threads. Showcases detailed floral vines, intricate paisley motifs, and a spectacular heavy brocade border. Represents the absolute height of traditional Indian bridal couture.',
    artisanStory: 'Meticulously crafted by Kabir Ahmad and his family on their traditional wood-and-string pit loom in Madanpura, Varanasi. It takes 18 days of rigorous, synchronized shuttle work to complete this single saree.',
    price: 24999,
    category: 'Womenwear',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    discount: 8,
    stock: 4
  },
  {
    id: 'prod-women-kurti',
    name: 'Lucknowi Hand-Embroidered Chikankari Kurti',
    description: 'A gorgeous flowing georgette kurti displaying authentic Lucknow shadow-work embroidery (Chikankari) in intricate patterns of jasmine buds and creepers. Hand-stitched with premium white cotton thread, creating a semi-translucent, ethereal summer aesthetic.',
    artisanStory: 'Embroidered by a guild of over 40 women artisans in Kakori, Uttar Pradesh. This home-based work provides financial independence to rural women while preserving a royal Mughal-era embroidery legacy.',
    price: 3999,
    category: 'Womenwear',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    discount: 15,
    stock: 18
  },
  {
    id: 'prod-women-dress',
    name: 'Anar Hand-Painted Kalamkari Maxi Dress',
    description: 'An elegant, long maxi dress made of lightweight organic cotton fabric. Hand-painted by traditional Kalamkari artists using bamboo pens (kalam) and natural botanical dyes extracted from pomegranate rinds, madder root, and wild mustard.',
    artisanStory: 'Painted in Srikalahasti, Andhra Pradesh, by the Dwaraka Artisan Guild. Since each dress is painted completely free-hand, each piece showcases slight variations in layout and organic ink saturation.',
    price: 5499,
    category: 'Womenwear',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    discount: 10,
    stock: 10
  },
  {
    id: 'prod-women-shawl',
    name: 'Royal Jamawar Pashmina Wrap Shawl',
    description: 'A spectacular, luxury wool wrap featuring complete, high-density Jamawar tapestry jacquard weaves. Displays rich jewel tones of ruby, emerald, and bronze woven in classical floral paisley designs, offering incredible warmth and luxury draping.',
    artisanStory: 'Weaved on electronic-assisted heritage jacquard looms in Amritsar, Punjab, replicating original 19th-century royal Kashmiri designs sourced from museum archives.',
    price: 8999,
    category: 'Womenwear',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    discount: 5,
    stock: 8
  },

  // --- ACCESSORIES ---
  {
    id: 'prod-acc-bag',
    name: 'Handcrafted Full-Grain Leather Satchel',
    description: 'A beautiful, timeless vintage-style messenger satchel constructed from thick, vegetable-tanned full-grain buffalo leather. Features heavy-duty solid brass buckles, hand-stitched waxed thread seams, and an expandable padded interior lined with soft canvas.',
    artisanStory: 'Crafted by a master leather worker, Harpreet Singh, in Kanpur, Uttar Pradesh. Harpreet sources leather from local tanneries that use organic tree barks and eco-friendly oil drumming techniques.',
    price: 7499,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    discount: 15,
    stock: 12
  },
  {
    id: 'prod-acc-watch',
    name: 'Imperial Brass Hand-Wound Watch',
    description: 'A exquisite luxury mechanical wristwatch. Features an anti-reflective sapphire crystal glass lens, an exposed rear exhibition window, a solid brushed brass dial plate, and an authentic hand-stitched premium crocodile-grain leather strap.',
    artisanStory: 'Assembled in a boutique workshop in Coimbatore, Tamil Nadu, using high-precision automatic movements paired with hand-cast and hand-polished brass casings sourced from Mannar metal casting guilds.',
    price: 14999,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    discount: 10,
    stock: 5
  },
  {
    id: 'prod-acc-wallet',
    name: 'Hand-Tooled Leather Mandala Wallet',
    description: 'A slim, elegant bi-fold wallet made of premium vegetable-tanned goat leather. The exterior is intricately hand-stamped and embossed with geometric floral mandalas, featuring six card slots, a full-length cash compartment, and RFID protection.',
    artisanStory: 'Engraved by artisan families in Santiniketan, West Bengal. This artistic leather work utilizes special embossing dies and hand-painted spirit dyes to achieve rich, multi-toned caramel shading.',
    price: 1899,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627124793180-26a141009817?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    discount: 0,
    stock: 60
  },
  {
    id: 'prod-acc-copper',
    name: 'Hammered Ayurvedic Copper Bottle Set',
    description: 'A wellness hydration set comprising a 100% pure, leak-proof 1-litre copper bottle and two matching tumblers. The exterior is hand-hammered by traditional coppersmiths, increasing the surface area to enhance natural oligodynamic water purification properties.',
    artisanStory: 'Forged by the Thathera metal workers of Jandiala Guru, Punjab—whose unique copper and brass hammering craft is recognized as UNESCO Intangible Cultural Heritage.',
    price: 2199,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    discount: 20,
    stock: 25
  },

  // --- ELECTRONICS ---
  {
    id: 'prod-elec-headphone',
    name: 'AcousticPure Wireless ANC Headphones',
    description: 'Professional-grade hybrid Active Noise Cancelling wireless headphones with massive 40mm beryllium drivers, high-resolution audio support, and custom-tuned EQ presets. Features luxurious memory foam ear cushions, 45-hour battery life, and spatial audio technology for immersive cinema sound.',
    artisanStory: 'Engineered and hand-assembled with precision aluminum components in Bengaluru’s leading tech development corridor. A portion of sales funds digital literacy workshops for local schools.',
    price: 12999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    discount: 10,
    stock: 14
  },
  {
    id: 'prod-elec-keyboard',
    name: 'Retro Typewriter Mechanical Keyboard',
    description: 'A stunning nostalgic mechanical keyboard featuring tactile blue switches, round chrome-plated typewriter-style keycaps, white LED backlight animations, and multi-device Bluetooth connectivity. Encased in a solid, heavy-duty alloy chassis with a genuine wood-grain veneer finish.',
    artisanStory: 'Designed by a small boutique studio of retro-hardware enthusiasts in Hyderabad, bringing traditional tactile feedback and historical aesthetics to the modern workplace.',
    price: 6499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    discount: 15,
    stock: 20
  },

  // --- SKINCARE ---
  {
    id: 'prod-skin-serum',
    name: 'Organic Kumkumadi & Sandalwood Glow Serum',
    description: 'A luxurious night facial oil formulated with authentic Kashmiri Saffron, red sandalwood, wild-harvested turmeric, and 16 precious Ayurvedic herbs. Crafted to target hyperpigmentation, smooth fine lines, and give you an exceptional, radiant golden-hour complexion.',
    artisanStory: 'Slowly brewed in copper vessels by women-led farm cooperatives in Kannauj, Uttar Pradesh. Sourced with certified organic ingredients to support rural farming biodiversity.',
    price: 2999,
    category: 'Skincare',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    discount: 12,
    stock: 35
  },
  {
    id: 'prod-skin-mist',
    name: 'Pure Kannauj Rose Water Hydration Mist',
    description: '100% pure, steam-distilled hydrosol made from freshly plucked heritage Damask roses. Captures the absolute true essence of sweet-blooming roses to tone, calm, balance, and deeply refresh skin anytime throughout the day.',
    artisanStory: 'Distilled using the classical "Deg & Bhapka" clay-pot steam distillation method that Kannauj artisans have preserved for over 400 years.',
    price: 799,
    category: 'Skincare',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    discount: 5,
    stock: 45
  },

  // --- GADGETS ---
  {
    id: 'prod-gad-tracker',
    name: 'Aura Premium Fitness Smartwatch',
    description: 'A sleek, lightweight fitness tracking smartwatch featuring an ultra-bright AMOLED touch display, real-time stress monitoring, continuous heart-rate tracking, multi-sport diagnostics, and sleep stage analysis. Protected with an elegant IP68 waterproof aerospace titanium dial casing.',
    artisanStory: 'Assembled and calibrated in high-tech cleanrooms in Pune, integrating state-of-the-art biosensor arrays with local, artisan-carved high-strength wooden storage cases.',
    price: 8499,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    discount: 8,
    stock: 18
  },
  {
    id: 'prod-gad-camera',
    name: 'EpicView Compact Action Camera',
    description: 'An advanced, ultra-rugged pocket action camera recording crisp 4K footage at 60fps with advanced gyro-based stabilization. Perfect for adventure vlogging, underwater exploration up to 15m without a case, and crisp low-light wide-angle travel shots.',
    artisanStory: 'Co-developed by a tech startup in Bengaluru alongside outdoor athletes. Packed inside fully biodegradable protective cardboard frames to eliminate plastic waste.',
    price: 18499,
    category: 'Gadgets',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    discount: 10,
    stock: 9
  },

  // --- HOME APPLIANCES ---
  {
    id: 'prod-home-espresso',
    name: 'Artisan Chrome Espresso Maker',
    description: 'A powerful, high-performance professional 15-bar Italian pump espresso machine designed for your kitchen counter. Features a dual-PID temperature controller, professional milk texturing steam wand, heated top-plate cup warmer, and brushed stainless-steel retro body.',
    artisanStory: 'Custom fitted with beautifully carved reclaimed rosewood handles and control knobs by heritage cabinetmakers in Saharanpur, Uttar Pradesh.',
    price: 22499,
    category: 'Home Appliances',
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    discount: 15,
    stock: 6
  },
  {
    id: 'prod-home-kettle',
    name: 'Eco-Ceramic Quick-Boil Smart Kettle',
    description: 'A gorgeous electric kettle crafted from thick, insulated ceramic clay that preserves water heat and keeps water pure. Equipped with smart touch temperature controls (45°C - 100°C), automatic dry-burn shut-off safety, and a fast 1500W heating base.',
    artisanStory: 'The outer clay housing is individually hand-cast and glazed in Khurja, Uttar Pradesh—India’s famous "Ceramic City"—combining traditional craftsmanship with smart modern heating coils.',
    price: 3899,
    category: 'Home Appliances',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    discount: 10,
    stock: 16
  }
];
