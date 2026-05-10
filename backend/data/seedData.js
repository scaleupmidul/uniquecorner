
// Data copied from frontend constants.ts
export const MOCK_PRODUCTS_DATA = [
  { id: 101, name: "Levitating Moon Lamp", category: "Decoration", price: 4500, description: "A high-tech levitating moon lamp that floats in the air using magnetic induction. Perfect for modern home decor.", fabric: "ABS + Wood", colors: ["Warm White", "Cool White"], sizes: ["14cm", "18cm"], isNewArrival: true, isTrending: true, onSale: false, images: ["https://picsum.photos/seed/moonlamp/400/500", "https://picsum.photos/seed/moonlamp2/400/500"] },
  { id: 102, name: "Smart Ambient Light Bar", category: "Gadgets", price: 3200, description: "Sync your lights with music or movies. Control via app or voice for an immersive experience.", fabric: "Aluminum + PC", colors: ["RGB"], sizes: ["Standard"], isNewArrival: true, isTrending: true, onSale: false, images: ["https://picsum.photos/seed/smartlight/400/500", "https://picsum.photos/seed/smartlight2/400/500"] },
  { id: 103, name: "Minimalist Ceramic Vase Set", category: "Decoration", price: 2800, description: "Handcrafted ceramic vases with a matte finish. Adds a touch of elegance to any room.", fabric: "Ceramic", colors: ["Sage Green", "Off-White"], sizes: ["Set of 3"], isNewArrival: false, isTrending: true, onSale: true, images: ["https://picsum.photos/seed/vase/400/500", "https://picsum.photos/seed/vase2/400/500"] },
  { id: 104, name: "Portable Retro Bluetooth Speaker", category: "Gadgets", price: 5500, description: "Vintage design meets modern sound. High-quality audio with a nostalgic feel.", fabric: "Walnut Wood", colors: ["Natural Wood"], sizes: ["Compact"], isNewArrival: false, isTrending: false, onSale: true, images: ["https://picsum.photos/seed/retrospeaker/400/500", "https://picsum.photos/seed/retrospeaker2/400/500"] },
  { id: 201, name: "Smart Hydroponic Garden", category: "Gadgets", price: 8500, description: "Grow your own herbs indoors with this automated hydroponic system. Built-in LED grow lights.", fabric: "Eco-Plastic", colors: ["White"], sizes: ["6-Pod"], isNewArrival: true, isTrending: true, onSale: false, images: ["https://picsum.photos/seed/hydroponic/400/500"] },
  { id: 202, name: "Abstract Sand Art Frame", category: "Decoration", price: 1800, description: "Moving sand art picture. Every turn creates a unique landscape. Relaxing and beautiful.", fabric: "Glass + Sand", colors: ["Emerald Green", "Deep Blue"], sizes: ["7-inch", "12-inch"], isNewArrival: true, isTrending: false, onSale: false, images: ["https://picsum.photos/seed/sandart/400/500"] },
  { id: 203, name: "Wireless Charging Desk Organizer", category: "Gadgets", price: 2500, description: "Keep your desk tidy and your phone charged. Premium leather finish.", fabric: "PU Leather", colors: ["Forest Green", "Black"], sizes: ["One Size"], isNewArrival: false, isTrending: false, onSale: true, images: ["https://picsum.photos/seed/organizer/400/500"] },
  { id: 108, name: "Geometric Terrarium", category: "Decoration", price: 1500, description: "Modern geometric glass terrarium for succulents and air plants.", fabric: "Glass + Brass", colors: ["Gold"], sizes: ["Medium"], isNewArrival: true, isTrending: true, onSale: true, images: ["https://picsum.photos/seed/terrarium/400/500"] },
];

const SLIDER_IMAGE_URLS = {
  silk: "https://picsum.photos/seed/unique-corner-gadgets/1200/500",
  lawn: "https://picsum.photos/seed/unique-corner-decor/1200/500",
  party: "https://picsum.photos/seed/unique-corner-lifestyle/1200/500",
};
const SLIDER_MOBILE_IMAGE_URLS = {
  silk: "https://picsum.photos/seed/unique-corner-gadgets-mobile/400/500",
  lawn: "https://picsum.photos/seed/unique-corner-decor-mobile/400/500",
  party: "https://picsum.photos/seed/unique-corner-lifestyle-mobile/400/500",
};
const CATEGORY_IMAGE_URLS = {
  cotton: "https://picsum.photos/seed/unique-corner-gadget-cat/600/800",
  silk: "https://picsum.photos/seed/unique-corner-decor-cat/600/800",
  partyWear: "https://picsum.photos/seed/unique-corner-new-cat/600/800",
};

export const DEFAULT_SETTINGS_DATA = {
  onlinePaymentInfo: 'অর্ডার কনফার্ম করতে ডেলিভারি চার্জ অগ্রিম প্রদান করুন —\n<b>01909285883 (Personal)</b>\nBkash / Nagad\nএবং নিচের তথ্যগুলো পূরণ করুন:',
  onlinePaymentInfoStyles: {
    fontSize: '0.875rem', 
  },
  codEnabled: true,
  onlinePaymentEnabled: true,
  onlinePaymentMethods: ['Bkash', 'Nagad', 'UPAY'],
  sliderImages: [
    { id: 1, title: "Innovative Gadgets", subtitle: "Future-proof your lifestyle with our curated tech.", color: "text-emerald-700", image: SLIDER_IMAGE_URLS.silk, mobileImage: SLIDER_MOBILE_IMAGE_URLS.silk },
    { id: 2, title: "Premium Home Decor", subtitle: "Transform your space with artistic elegance.", color: "text-green-800", image: SLIDER_IMAGE_URLS.lawn, mobileImage: SLIDER_MOBILE_IMAGE_URLS.lawn },
    { id: 3, title: "Unique Lifestyle Items", subtitle: "Find the perfect gift for yourself or others.", color: "text-teal-700", image: SLIDER_IMAGE_URLS.party, mobileImage: SLIDER_MOBILE_IMAGE_URLS.party }
  ],
  categoryImages: [
    { categoryName: "Gadgets", image: CATEGORY_IMAGE_URLS.cotton },
    { categoryName: "Decoration", image: CATEGORY_IMAGE_URLS.silk },
    { categoryName: "New Arrivals", image: CATEGORY_IMAGE_URLS.partyWear },
    { categoryName: "Exclusive", image: "https://picsum.photos/seed/unique-exclusive/600/800" }
  ],
  categories: ["Gadgets", "Decoration", "New Arrivals", "Exclusive"],
  shippingOptions: [],
  productPagePromoImage: "https://picsum.photos/seed/unique-corner-promo/1200/400",
  contactAddress: 'Avenue 12, Gulshan-1, Dhaka, Bangladesh',
  contactPhone: '+880 17XX XXX XXX',
  contactEmail: 'support@uniquecorner.com',
  whatsappNumber: '+8801700000000',
  showWhatsAppButton: true,
  showCityField: true,
  socialMediaLinks: [
    { platform: 'Facebook', url: '#' },
    { platform: 'Instagram', url: '#' },
    { platform: 'Twitter', url: '#' },
  ],
  privacyPolicy: `
1. Introduction
Welcome to Unique Corner. We are committed to protecting your privacy...
  `.trim(),
  adminEmail: 'admin@uniquecorner.com',
  adminPassword: 'password123',
  footerDescription: 'Discover innovation and elegance with Unique Corner. We bring you the finest collections of unique gadgets and premium home decor.',
  homepageNewArrivalsCount: 4,
  homepageTrendingCount: 4,
  showSliderText: true,
  gaMeasurementId: '',
  gaApiSecret: '',
  fbPixelId: '',
  fbAccessToken: '',
  fbTestCode: '',
  gtmId: 'GTM-T7RFW3GJ',
  exitIntentPopupEnabled: true,
  exitIntentDiscount: 60,
  exitIntentCouponCode: 'UNIQUE60',
};
