const BASE = import.meta.env.BASE_URL;

export type StoreCategory = 'store' | 'clothing' | 'caps' | 'bags' | 'shoes';

export type ProductKind =
  | 'puffer'
  | 'fleece'
  | 'shell'
  | 'cardigan'
  | 'beanie'
  | 'backpack'
  | 'duffel'
  | 'tote'
  | 'sneaker';

export interface ImageCrop {
  x: number;
  y: number;
  zoom?: number;
}

export interface ColorSwatch {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  imageUrl?: string;
  imageCrop?: ImageCrop;
}

export interface ProductDimensions {
  labelA: string;
  valueACm: number;
  labelB: string;
  valueBCm: number;
}

export interface StoreProduct {
  id: string;
  category: Exclude<StoreCategory, 'store'>;
  kind: ProductKind;
  kicker: string;
  name: string;
  price: number;
  rating: string;
  reviewCount: number;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  imageUrl?: string;
  imageCrop?: ImageCrop;
  swatches: ColorSwatch[];
  dimensions: ProductDimensions;
  sizes: string[];
  defaultSize: string;
}

export const STORE_TABS: { id: StoreCategory; label: string }[] = [
  { id: 'store', label: 'Store' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'caps', label: 'Caps' },
  { id: 'bags', label: 'Bags' },
  { id: 'shoes', label: 'Shoes' },
];

const IMG_NAVY_PUFFER = `${BASE}src/assets/images/jacket_navy_puffer_cutout.png`;
const IMG_GLACIER_FLEECE = `${BASE}src/assets/images/jacket_glacier_fleece_cutout.png`;
const IMG_PINE_SHELL = `${BASE}src/assets/images/jacket_pine_shell_cutout.png`;
const IMG_AMBER_PARKA = `${BASE}src/assets/images/jacket_amber_parka_cutout.png`;
const IMG_CHALK_WINDBREAKER = `${BASE}src/assets/images/jacket_chalk_windbreaker_cutout.png`;

const CLOTHING_SWATCH_PRESETS: ColorSwatch[] = [
  { name: 'Pine Moss', primaryColor: '#487059', secondaryColor: '#375845', accentColor: '#1f2923', imageUrl: IMG_PINE_SHELL },
  { name: 'Chalk White', primaryColor: '#F3F4F6', secondaryColor: '#E2E4E8', accentColor: '#18191B', imageUrl: IMG_CHALK_WINDBREAKER },
  { name: 'Deep Navy', primaryColor: '#2B3A4E', secondaryColor: '#1E2A3A', accentColor: '#11161F', imageUrl: IMG_NAVY_PUFFER },
  { name: 'Glacier Blue', primaryColor: '#4D7BA8', secondaryColor: '#3B658E', accentColor: '#254361', imageUrl: IMG_GLACIER_FLEECE },
  { name: 'Amber Ochre', primaryColor: '#D96A27', secondaryColor: '#B85318', accentColor: '#291B12', imageUrl: IMG_AMBER_PARKA },
];

export const CLOTHING_PRODUCTS: StoreProduct[] = [
  {
    id: 'cl-moss-shell',
    category: 'clothing',
    kind: 'shell',
    kicker: 'ORGANIC OUTERWEAR',
    name: 'Pinecrest Rain Anorak',
    price: 88,
    rating: '9/10',
    reviewCount: 24,
    description:
      'Water-resistant organic waxed cotton with soft brushed flannel lining and gentle snap cuffs built for rainy play.',
    primaryColor: '#487059',
    secondaryColor: '#375845',
    accentColor: '#1f2923',
    imageUrl: IMG_PINE_SHELL,
    swatches: [
      CLOTHING_SWATCH_PRESETS[0],
      CLOTHING_SWATCH_PRESETS[2],
      CLOTHING_SWATCH_PRESETS[4],
    ],
    dimensions: { labelA: 'LENGTH', valueACm: 48, labelB: 'CHEST', valueBCm: 38 },
    sizes: ['1–2Y', '2–3Y', '3–4Y', '4–5Y', '5–6Y'],
    defaultSize: '3–4Y',
  },
  {
    id: 'cl-chalk-shell',
    category: 'clothing',
    kind: 'shell',
    kicker: 'LIGHTWEIGHT LAYERS',
    name: 'Cloud Mist Windbreaker',
    price: 78,
    rating: '9/10',
    reviewCount: 18,
    description:
      'Featherweight breathable shell crafted from recycled organic cotton blend with a soft jersey hood liner.',
    primaryColor: '#F3F4F6',
    secondaryColor: '#E2E4E8',
    accentColor: '#18191B',
    imageUrl: IMG_CHALK_WINDBREAKER,
    swatches: [
      CLOTHING_SWATCH_PRESETS[1],
      CLOTHING_SWATCH_PRESETS[3],
      CLOTHING_SWATCH_PRESETS[0],
    ],
    dimensions: { labelA: 'LENGTH', valueACm: 46, labelB: 'CHEST', valueBCm: 37 },
    sizes: ['1–2Y', '2–3Y', '3–4Y', '4–5Y', '5–6Y'],
    defaultSize: '2–3Y',
  },
  {
    id: 'cl-summit-puffer',
    category: 'clothing',
    kind: 'puffer',
    kicker: 'INSULATED KNITS',
    name: 'Tiny Summit 600 Down Puffer',
    price: 118,
    rating: '9.5/10',
    reviewCount: 31,
    description:
      'Baffled plant-based warmth with an organic cotton inner collar, protective chin guard, and deep pocket warmers.',
    primaryColor: '#2B3A4E',
    secondaryColor: '#1E2A3A',
    accentColor: '#11161F',
    imageUrl: IMG_NAVY_PUFFER,
    swatches: [
      CLOTHING_SWATCH_PRESETS[2],
      CLOTHING_SWATCH_PRESETS[0],
      CLOTHING_SWATCH_PRESETS[4],
    ],
    dimensions: { labelA: 'LENGTH', valueACm: 52, labelB: 'CHEST', valueBCm: 41 },
    sizes: ['1–2Y', '2–3Y', '3–4Y', '4–5Y', '5–6Y'],
    defaultSize: '3–4Y',
  },
  {
    id: 'cl-glacier-fleece',
    category: 'clothing',
    kind: 'fleece',
    kicker: 'SOFT FLEECE',
    name: 'Glacier Quarter-Zip Fleece',
    price: 68,
    rating: '9/10',
    reviewCount: 15,
    description:
      'Double-brushed organic cotton pile with contrast chest pocket and relaxed drop shoulders for effortless layering.',
    primaryColor: '#4D7BA8',
    secondaryColor: '#3B658E',
    accentColor: '#254361',
    imageUrl: IMG_GLACIER_FLEECE,
    swatches: [
      CLOTHING_SWATCH_PRESETS[3],
      CLOTHING_SWATCH_PRESETS[1],
      CLOTHING_SWATCH_PRESETS[2],
    ],
    dimensions: { labelA: 'LENGTH', valueACm: 49, labelB: 'CHEST', valueBCm: 39 },
    sizes: ['1–2Y', '2–3Y', '3–4Y', '4–5Y', '5–6Y'],
    defaultSize: '3–4Y',
  },
  {
    id: 'cl-ochre-shell',
    category: 'clothing',
    kind: 'shell',
    kicker: 'ORGANIC OUTERWEAR',
    name: 'Amber Trail Parka',
    price: 92,
    rating: '8.5/10',
    reviewCount: 19,
    description:
      'Windproof organic twill shell built for woodland walks, featuring reflective cuff piping and storm flaps.',
    primaryColor: '#D96A27',
    secondaryColor: '#B85318',
    accentColor: '#291B12',
    imageUrl: IMG_AMBER_PARKA,
    swatches: [
      CLOTHING_SWATCH_PRESETS[4],
      CLOTHING_SWATCH_PRESETS[0],
      CLOTHING_SWATCH_PRESETS[2],
    ],
    dimensions: { labelA: 'LENGTH', valueACm: 50, labelB: 'CHEST', valueBCm: 40 },
    sizes: ['1–2Y', '2–3Y', '3–4Y', '4–5Y', '5–6Y'],
    defaultSize: '2–3Y',
  },
];


const CAP_SWATCH_PRESETS: ColorSwatch[] = [
  {
    name: 'Jet Black',
    primaryColor: '#18191C',
    secondaryColor: '#0E0F11',
    accentColor: '#F3F2EE',
    imageUrl: `${BASE}assets/cutouts/caps/cap-brand-01.png`,
  },
  {
    name: 'Cream Sand',
    primaryColor: '#E8DAC2',
    secondaryColor: '#CAB89B',
    accentColor: '#1C1D20',
    imageUrl: `${BASE}assets/cutouts/caps/cap-brand-02.png`,
  },
  {
    name: 'Midnight Navy',
    primaryColor: '#1A233A',
    secondaryColor: '#101626',
    accentColor: '#F4F3EF',
    imageUrl: `${BASE}assets/cutouts/caps/cap-brand-05.png`,
  },
  {
    name: 'Forest Green',
    primaryColor: '#224B34',
    secondaryColor: '#163323',
    accentColor: '#F2EFE9',
    imageUrl: `${BASE}assets/cutouts/caps/cap-brand-10.png`,
  },
  {
    name: 'Gym Red',
    primaryColor: '#BA1922',
    secondaryColor: '#8B1017',
    accentColor: '#18191C',
    imageUrl: `${BASE}assets/cutouts/caps/cap-brand-13.png`,
  },
  {
    name: 'Crisp White',
    primaryColor: '#F3F2EE',
    secondaryColor: '#DEDCD5',
    accentColor: '#18191C',
    imageUrl: `${BASE}assets/cutouts/caps/cap-brand-15.png`,
  },
];

interface BrandedCapSeed {
  id: string;
  fileNum: string;
  brand: string;
  name: string;
  colorName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  price: number;
  rating: string;
  reviews: number;
  description: string;
}

const BRANDED_CAP_SEEDS: BrandedCapSeed[] = [
  { id: 'cap-brand-01', fileNum: '01', brand: 'NIKE', name: 'Nike Heritage86 Swoosh — Jet Black', colorName: 'Jet Black', primaryColor: '#18191C', secondaryColor: '#0E0F11', accentColor: '#FFFFFF', price: 36, rating: '9.5/10', reviews: 64, description: 'Classic six-panel Nike washed twill silhouette finished with signature crisp white Swoosh embroidery and metal tri-glide strap.' },
  { id: 'cap-brand-02', fileNum: '02', brand: 'NIKE', name: 'Nike Club Futura Twill — Cream Sand', colorName: 'Cream Sand', primaryColor: '#E8DAC2', secondaryColor: '#CAB89B', accentColor: '#1C1D20', price: 38, rating: '9.5/10', reviews: 52, description: 'Unstructured mid-depth organic cotton twill cap featuring an embroidered Nike Futura script mark and curved peak.' },
  { id: 'cap-brand-03', fileNum: '03', brand: 'ADIDAS', name: 'Adidas Originals Trefoil — Obsidian', colorName: 'Obsidian Black', primaryColor: '#1A1B1E', secondaryColor: '#0F1012', accentColor: '#FFFFFF', price: 36, rating: '9.5/10', reviews: 48, description: 'Archive Adidas Originals cotton gabardine cap topped with raised white Trefoil embroidery and breathable eyelets.' },
  { id: 'cap-brand-04', fileNum: '04', brand: 'ADIDAS', name: 'Adidas 3-Bar Performance — Cobalt', colorName: 'Cobalt Blue', primaryColor: '#2554A3', secondaryColor: '#193C78', accentColor: '#FFFFFF', price: 34, rating: '9/10', reviews: 39, description: 'Moisture-wicking Adidas performance twill cap built with lightweight sweatband comfort and tonal 3-Bar emblem.' },
  { id: 'cap-brand-05', fileNum: '05', brand: 'NEW ERA', name: 'New Era 9FORTY NY Yankees — Midnight Navy', colorName: 'Midnight Navy', primaryColor: '#1A233A', secondaryColor: '#101626', accentColor: '#FFFFFF', price: 42, rating: '9.5/10', reviews: 88, description: 'Iconic contoured New Era 9FORTY crown in midnight navy woven wool-feel twill with raised white NY monogram.' },
  { id: 'cap-brand-06', fileNum: '06', brand: 'NEW ERA', name: 'New Era 9FORTY LA Dodgers — Dodger Blue', colorName: 'Dodger Blue', primaryColor: '#1B4E9B', secondaryColor: '#123770', accentColor: '#FFFFFF', price: 42, rating: '9.5/10', reviews: 74, description: 'Structured six-panel New Era cap in signature Dodger blue featuring crisp LA interlocking stitch and D-ring closure.' },
  { id: 'cap-brand-07', fileNum: '07', brand: 'NEW ERA', name: 'New Era 9TWENTY NY Yankees — Olive Khaki', colorName: 'Olive Khaki', primaryColor: '#7D7254', secondaryColor: '#5D543D', accentColor: '#F5F2EB', price: 40, rating: '9.5/10', reviews: 57, description: 'Relaxed enzyme-washed New Era 9TWENTY dad cap in warm olive khaki paired with contrast off-white NY crest.' },
  { id: 'cap-brand-08', fileNum: '08', brand: 'NEW ERA', name: 'New Era 59FIFTY Chicago Bulls — Black & Red', colorName: 'Bulls Black & Red', primaryColor: '#1C1C1E', secondaryColor: '#101012', accentColor: '#BA1822', price: 48, rating: '9.5/10', reviews: 69, description: 'Structured flat-brim 59FIFTY silhouette combining deep matte black crown, crimson visor, and Bulls embroidery.' },
  { id: 'cap-brand-09', fileNum: '09', brand: 'POLO RALPH LAUREN', name: 'Polo Ralph Lauren Chino — Camel Khaki', colorName: 'Camel Khaki', primaryColor: '#C7A87C', secondaryColor: '#A6885E', accentColor: '#1D2944', price: 54, rating: '9.5/10', reviews: 61, description: 'Heritage washed cotton chino cap accented with the navy embroidered Polo pony and buckled leather rear strap.' },
  { id: 'cap-brand-10', fileNum: '10', brand: 'POLO RALPH LAUREN', name: 'Polo Ralph Lauren Chino — Forest Green', colorName: 'Forest Green', primaryColor: '#224B34', secondaryColor: '#163323', accentColor: '#EFECE6', price: 54, rating: '9.5/10', reviews: 45, description: 'Signature soft-washed British racing green twill cap finished with contrasting cream Polo pony embroidery.' },
  { id: 'cap-brand-11', fileNum: '11', brand: 'CARHARTT WIP', name: 'Carhartt WIP Madison — Hamilton Brown', colorName: 'Hamilton Brown', primaryColor: '#9D6B3E', secondaryColor: '#78502C', accentColor: '#1A1B1E', price: 46, rating: '9.5/10', reviews: 53, description: 'Garment-washed Carhartt WIP cotton twill cap in iconic Hamilton brown with embroidered C-logo front detail.' },
  { id: 'cap-brand-12', fileNum: '12', brand: 'CARHARTT', name: 'Carhartt Odessa Canvas — Washed Charcoal', colorName: 'Washed Charcoal', primaryColor: '#3D3F42', secondaryColor: '#282A2C', accentColor: '#D69F42', price: 42, rating: '9/10', reviews: 44, description: 'Rugged 100% cotton duck canvas cap lined with a moisture-wicking sweatband and stitched leatherette label.' },
  { id: 'cap-brand-13', fileNum: '13', brand: 'JORDAN', name: 'Jordan Jumpman Classic99 — Gym Red', colorName: 'Gym Red', primaryColor: '#BA1922', secondaryColor: '#8B1017', accentColor: '#18191C', price: 40, rating: '9.5/10', reviews: 59, description: 'Stretch-woven Jordan Classic99 crown in vibrant Gym Red anchored by a sculpted black Jumpman emblem.' },
  { id: 'cap-brand-14', fileNum: '14', brand: 'JORDAN', name: 'Jordan Pro Metal Jumpman — Triple Black', colorName: 'Triple Black', primaryColor: '#17181B', secondaryColor: '#0C0D0F', accentColor: '#8E9299', price: 42, rating: '9.5/10', reviews: 62, description: 'Stealth triple-black structured high-crown Jordan cap detailed with a brushed gunmetal Jumpman crest.' },
  { id: 'cap-brand-15', fileNum: '15', brand: 'PUMA', name: 'Puma Archive Cat — Crisp White', colorName: 'Crisp White', primaryColor: '#F3F2EE', secondaryColor: '#DEDCD5', accentColor: '#18191C', price: 34, rating: '9/10', reviews: 37, description: 'Clean all-white breathable cotton twill Puma dad cap finished with bold jet-black leaping Cat embroidery.' },
  { id: 'cap-brand-16', fileNum: '16', brand: 'UNDER ARMOUR', name: 'Under Armour Blitzing 3.0 — Graphite', colorName: 'Graphite Slate', primaryColor: '#45484E', secondaryColor: '#2F3136', accentColor: '#141518', price: 36, rating: '9/10', reviews: 41, description: 'Technical micro-thread knit Under Armour cap featuring an internal HeatGear sweatband and raised UA logo.' },
  { id: 'cap-brand-17', fileNum: '17', brand: 'THE NORTH FACE', name: 'The North Face Norm — Asphalt Charcoal', colorName: 'Asphalt Charcoal', primaryColor: '#2B2D30', secondaryColor: '#1B1D1F', accentColor: '#F4F3EF', price: 38, rating: '9.5/10', reviews: 55, description: 'Shallow-fit everyday cotton-blend cap from The North Face with clean white Dome embroidery and curved visor.' },
  { id: 'cap-brand-18', fileNum: '18', brand: 'THE NORTH FACE', name: 'The North Face Horizon — Warm Sand', colorName: 'Warm Sand', primaryColor: '#D6C4A4', secondaryColor: '#B5A280', accentColor: '#1F2024', price: 38, rating: '9/10', reviews: 33, description: 'Trail-ready lightweight recycled nylon cap engineered for quick-drying sun protection and packable durability.' },
  { id: 'cap-brand-19', fileNum: '19', brand: 'PATAGONIA', name: 'Patagonia P-6 Logo Trad — Midnight Navy', colorName: 'Midnight Navy', primaryColor: '#1E2B44', secondaryColor: '#121B2D', accentColor: '#D96A38', price: 44, rating: '9.5/10', reviews: 67, description: 'Organic cotton canvas cap with a brim crafted from 100% recycled fishing nets and iconic P-6 woven crest.' },
  { id: 'cap-brand-20', fileNum: '20', brand: 'PATAGONIA', name: 'Patagonia Fitz Roy Trad — Sage Pine', colorName: 'Sage Pine', primaryColor: '#4F6A57', secondaryColor: '#374B3D', accentColor: '#EFECE6', price: 44, rating: '9.5/10', reviews: 46, description: 'Unstructured six-panel organic cotton Patagonia cap in earthy sage pine adorned with minimalist Fitz Roy badge.' },
  { id: 'cap-brand-21', fileNum: '21', brand: 'LACOSTE', name: 'Lacoste Gabardine Croc — Emerald Green', colorName: 'Emerald Green', primaryColor: '#196A42', secondaryColor: '#10492D', accentColor: '#FFFFFF', price: 58, rating: '9.5/10', reviews: 49, description: 'Fine French cotton gabardine cap in signature Lacoste green detailed with the iconic embroidered crocodile.' },
  { id: 'cap-brand-22', fileNum: '22', brand: 'TOMMY HILFIGER', name: 'Tommy Hilfiger Flag Twill — Crisp Navy', colorName: 'Crisp Navy', primaryColor: '#1C2B4B', secondaryColor: '#111B31', accentColor: '#C41E2B', price: 45, rating: '9/10', reviews: 43, description: 'Pre-curved crisp navy chino twill cap embroidered with the classic tricolor Tommy Hilfiger flag emblem.' },
  { id: 'cap-brand-23', fileNum: '23', brand: 'CHAMPION', name: 'Champion Classic Twill — Bordeaux Wine', colorName: 'Bordeaux Wine', primaryColor: '#6F1926', secondaryColor: '#4E1019', accentColor: '#F4F3EF', price: 36, rating: '9/10', reviews: 35, description: 'Pigment-dyed bordeaux cotton twill cap accented with heritage Champion script across the unstructured crown.' },
  { id: 'cap-brand-24', fileNum: '24', brand: 'VANS', name: 'Vans Drop V Jockey — Mustard Ochre', colorName: 'Mustard Ochre', primaryColor: '#C98C28', secondaryColor: '#9E6B1A', accentColor: '#18191C', price: 36, rating: '9/10', reviews: 38, description: 'Skate-inspired mustard ochre cotton jockey cap finished with embroidered Drop V branding and flat-curve brim.' },
];

export const CAPS_PRODUCTS: StoreProduct[] = BRANDED_CAP_SEEDS.map((seed) => {
  const cutoutUrl = `${BASE}assets/cutouts/caps/cap-brand-${seed.fileNum}.png`;
  const primarySwatch: ColorSwatch = {
    name: seed.colorName,
    primaryColor: seed.primaryColor,
    secondaryColor: seed.secondaryColor,
    accentColor: seed.accentColor,
    imageUrl: cutoutUrl,
  };
  const altSwatches = CAP_SWATCH_PRESETS.filter((s) => s.name !== seed.colorName).slice(0, 3);

  return {
    id: seed.id,
    category: 'caps',
    kind: 'beanie',
    kicker: seed.brand,
    name: seed.name,
    price: seed.price,
    rating: seed.rating,
    reviewCount: seed.reviews,
    description: seed.description,
    primaryColor: seed.primaryColor,
    secondaryColor: seed.secondaryColor,
    accentColor: seed.accentColor,
    imageUrl: cutoutUrl,
    swatches: [primarySwatch, ...altSwatches],
    dimensions: { labelA: 'HEIGHT', valueACm: 12, labelB: 'BRIM', valueBCm: 18 },
    sizes: ['1–2Y', '2–3Y', '3–4Y', '5–6Y', 'One Size'],
    defaultSize: 'One Size',
  };
});

const ATELIER_SWATCH_PRESETS: ColorSwatch[] = [
  {
    name: 'Cognac Saddle',
    primaryColor: '#9A4D1E',
    secondaryColor: '#723410',
    accentColor: '#D4AF37',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-01.png`,
  },
  {
    name: 'Burnished Bordeaux',
    primaryColor: '#6E1418',
    secondaryColor: '#4C0B0E',
    accentColor: '#C9A962',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-09.png`,
  },
  {
    name: 'Bottle Green',
    primaryColor: '#1F3027',
    secondaryColor: '#131E18',
    accentColor: '#D4AF37',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-14.png`,
  },
  {
    name: 'Midnight Navy',
    primaryColor: '#1D2742',
    secondaryColor: '#12192C',
    accentColor: '#CBD5E1',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-08.png`,
  },
];

export const ATELIER_BAGS_PRODUCTS: StoreProduct[] = [
  {
    id: 'bag-atelier-01',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 01',
    name: 'Belted Heritage Satchel — Cognac',
    price: 445,
    rating: '9.5/10',
    reviewCount: 41,
    description:
      'Full-grain tumbled cognac calfskin satchel anchored by twin rolled top handles, side clasp gussets, and a belted brass buckle.',
    primaryColor: '#9A4D1E',
    secondaryColor: '#723410',
    accentColor: '#D4AF37',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-01.png`,
    swatches: [
      { name: 'Cognac Saddle', primaryColor: '#9A4D1E', secondaryColor: '#723410', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-01.png` },
      ATELIER_SWATCH_PRESETS[1],
      ATELIER_SWATCH_PRESETS[2],
      ATELIER_SWATCH_PRESETS[3],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 24, labelB: 'WIDTH', valueBCm: 32 },
    sizes: ['Medium', 'Large'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-02',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 02',
    name: 'Basketweave Frame Bag — Oxblood',
    price: 415,
    rating: '9/10',
    reviewCount: 27,
    description:
      'Hand-burnished mahogany calfskin embossed with architectural basketweave relief, finished with an oval brass turn-lock.',
    primaryColor: '#4E1618',
    secondaryColor: '#340D0E',
    accentColor: '#C9A962',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-02.png`,
    swatches: [
      { name: 'Mahogany Oxblood', primaryColor: '#4E1618', secondaryColor: '#340D0E', accentColor: '#C9A962', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-02.png` },
      ATELIER_SWATCH_PRESETS[0],
      ATELIER_SWATCH_PRESETS[2],
      ATELIER_SWATCH_PRESETS[3],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 19, labelB: 'WIDTH', valueBCm: 26 },
    sizes: ['Small', 'Medium'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-03',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 03',
    name: 'Contrast Gusset Tote — Citron',
    price: 395,
    rating: '9/10',
    reviewCount: 24,
    description:
      'Sunlit chartreuse grained leather framed by crisp ivory piped side gussets, sculptural charm pendant, and detachable shoulder strap.',
    primaryColor: '#C6C528',
    secondaryColor: '#9A991A',
    accentColor: '#EAEAEA',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-03.png`,
    swatches: [
      { name: 'Citron Yellow', primaryColor: '#C6C528', secondaryColor: '#9A991A', accentColor: '#EAEAEA', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-03.png` },
      { name: 'Blush Petal', primaryColor: '#E8AFC0', secondaryColor: '#CA8C9F', accentColor: '#FFFFFF', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-07.png` },
      { name: 'Sky Blue', primaryColor: '#619CD9', secondaryColor: '#447BB8', accentColor: '#DCE2EA', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-10.png` },
      ATELIER_SWATCH_PRESETS[0],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 22, labelB: 'WIDTH', valueBCm: 29 },
    sizes: ['Small', 'Medium'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-04',
    category: 'bags',
    kind: 'duffel',
    kicker: 'ATELIER SHOWCASE · NO. 04',
    name: 'Dome Bolide Carryall — Pine',
    price: 460,
    rating: '9.5/10',
    reviewCount: 33,
    description:
      'Glazed evergreen dome silhouette sculpted with tubular rolled handles, padded stitch tabs, and dark gunmetal hardware.',
    primaryColor: '#1D3B2B',
    secondaryColor: '#12261B',
    accentColor: '#788085',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-04.png`,
    swatches: [
      { name: 'Pine Forest', primaryColor: '#1D3B2B', secondaryColor: '#12261B', accentColor: '#788085', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-04.png` },
      { name: 'Emerald Jade', primaryColor: '#1F8054', secondaryColor: '#14593B', accentColor: '#D8DEE6', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-13.png` },
      ATELIER_SWATCH_PRESETS[2],
      ATELIER_SWATCH_PRESETS[3],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 25, labelB: 'WIDTH', valueBCm: 31 },
    sizes: ['Medium', 'Large'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-05',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 05',
    name: 'Croco-Embossed V Satchel — Scarlet',
    price: 435,
    rating: '9.5/10',
    reviewCount: 36,
    description:
      'Vivid scarlet alligator-embossed calfskin paired with brushed silver crest hardware, geometric luggage charm, and rolled crossbody strap.',
    primaryColor: '#D92121',
    secondaryColor: '#A31313',
    accentColor: '#E5E7EB',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-05.png`,
    swatches: [
      { name: 'Scarlet Red', primaryColor: '#D92121', secondaryColor: '#A31313', accentColor: '#E5E7EB', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-05.png` },
      { name: 'Rouge Crimson', primaryColor: '#D2222A', secondaryColor: '#A2161D', accentColor: '#CBD5E1', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-11.png` },
      ATELIER_SWATCH_PRESETS[1],
      ATELIER_SWATCH_PRESETS[0],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 22, labelB: 'WIDTH', valueBCm: 30 },
    sizes: ['Medium', 'Large'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-06',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 06',
    name: 'Brillant Buckle Satchel — Canary',
    price: 455,
    rating: '9.5/10',
    reviewCount: 42,
    description:
      'Architectural trapezoidal top-handle handbag in mimosa-yellow grained calfskin crowned with a sculpted polished-gold horseshoe buckle.',
    primaryColor: '#E8BE30',
    secondaryColor: '#C79E1B',
    accentColor: '#E2BE68',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-06.png`,
    swatches: [
      { name: 'Canary Yellow', primaryColor: '#E8BE30', secondaryColor: '#C79E1B', accentColor: '#E2BE68', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-06.png` },
      { name: 'Citron Yellow', primaryColor: '#C6C528', secondaryColor: '#9A991A', accentColor: '#EAEAEA', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-03.png` },
      { name: 'Ivory Cream', primaryColor: '#E4D7C5', secondaryColor: '#C6B59F', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-12.png` },
      ATELIER_SWATCH_PRESETS[0],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 23, labelB: 'WIDTH', valueBCm: 25 },
    sizes: ['Small', 'Medium'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-07',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 07',
    name: 'Petal Contrast Satchel — Blush',
    price: 410,
    rating: '9/10',
    reviewCount: 29,
    description:
      'Delicate blossom-pink calfskin tote accented with crisp white side panels, gilded heart motif charm, and twin top handles.',
    primaryColor: '#E8AFC0',
    secondaryColor: '#CA8C9F',
    accentColor: '#D4AF37',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-07.png`,
    swatches: [
      { name: 'Blush Petal', primaryColor: '#E8AFC0', secondaryColor: '#CA8C9F', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-07.png` },
      { name: 'Ivory Cream', primaryColor: '#E4D7C5', secondaryColor: '#C6B59F', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-12.png` },
      { name: 'Citron Yellow', primaryColor: '#C6C528', secondaryColor: '#9A991A', accentColor: '#EAEAEA', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-03.png` },
      { name: 'Sky Blue', primaryColor: '#619CD9', secondaryColor: '#447BB8', accentColor: '#DCE2EA', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-10.png` },
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 22, labelB: 'WIDTH', valueBCm: 29 },
    sizes: ['Small', 'Medium'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-08',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 08',
    name: 'Quilted Ribbon Tote — Midnight Navy',
    price: 425,
    rating: '9.5/10',
    reviewCount: 38,
    description:
      'Diamond-quilted deep indigo leather bag adorned with a tonal knotted leather bow, silver crest medallion, and chrome handle collars.',
    primaryColor: '#1D2742',
    secondaryColor: '#12192C',
    accentColor: '#CBD5E1',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-08.png`,
    swatches: [
      ATELIER_SWATCH_PRESETS[3],
      { name: 'Sky Blue', primaryColor: '#619CD9', secondaryColor: '#447BB8', accentColor: '#DCE2EA', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-10.png` },
      ATELIER_SWATCH_PRESETS[2],
      ATELIER_SWATCH_PRESETS[1],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 22, labelB: 'WIDTH', valueBCm: 28 },
    sizes: ['Small', 'Medium'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-09',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 09',
    name: 'Sculpted Cutout Carryall — Bordeaux',
    price: 485,
    rating: '9.5/10',
    reviewCount: 44,
    description:
      'Mirror-glazed Bordeaux calfskin tote defined by geometric corner cutouts, articulated top handles, and blind-embossed crest motif.',
    primaryColor: '#6E1418',
    secondaryColor: '#4C0B0E',
    accentColor: '#C7B0AC',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-09.png`,
    swatches: [
      ATELIER_SWATCH_PRESETS[1],
      { name: 'Mahogany Oxblood', primaryColor: '#4E1618', secondaryColor: '#340D0E', accentColor: '#C9A962', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-02.png` },
      { name: 'Scarlet Red', primaryColor: '#D92121', secondaryColor: '#A31313', accentColor: '#E5E7EB', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-05.png` },
      ATELIER_SWATCH_PRESETS[0],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 25, labelB: 'WIDTH', valueBCm: 34 },
    sizes: ['Medium', 'Large'],
    defaultSize: 'Large',
  },
  {
    id: 'bag-atelier-10',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 10',
    name: 'Capucine Arch Crossbody — Sky Blue',
    price: 430,
    rating: '9.5/10',
    reviewCount: 31,
    description:
      'Crisp cornflower-blue smooth leather flap bag paired with a gleaming chrome arch handle, signature LV twist lock, and crossbody strap.',
    primaryColor: '#619CD9',
    secondaryColor: '#447BB8',
    accentColor: '#DCE2EA',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-10.png`,
    swatches: [
      { name: 'Sky Blue', primaryColor: '#619CD9', secondaryColor: '#447BB8', accentColor: '#DCE2EA', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-10.png` },
      ATELIER_SWATCH_PRESETS[3],
      { name: 'Blush Petal', primaryColor: '#E8AFC0', secondaryColor: '#CA8C9F', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-07.png` },
      { name: 'Ivory Cream', primaryColor: '#E4D7C5', secondaryColor: '#C6B59F', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-12.png` },
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 20, labelB: 'WIDTH', valueBCm: 24 },
    sizes: ['Mini', 'Small'],
    defaultSize: 'Small',
  },
  {
    id: 'bag-atelier-11',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 11',
    name: 'Grommet Trapeze Bag — Crimson',
    price: 390,
    rating: '9/10',
    reviewCount: 22,
    description:
      'Minimalist lipstick-crimson grained leather handbag structured with oversized satin-silver handle grommets and soft gusseted sides.',
    primaryColor: '#D2222A',
    secondaryColor: '#A2161D',
    accentColor: '#CBD5E1',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-11.png`,
    swatches: [
      { name: 'Rouge Crimson', primaryColor: '#D2222A', secondaryColor: '#A2161D', accentColor: '#CBD5E1', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-11.png` },
      { name: 'Scarlet Red', primaryColor: '#D92121', secondaryColor: '#A31313', accentColor: '#E5E7EB', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-05.png` },
      ATELIER_SWATCH_PRESETS[1],
      { name: 'Blush Petal', primaryColor: '#E8AFC0', secondaryColor: '#CA8C9F', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-07.png` },
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 21, labelB: 'WIDTH', valueBCm: 27 },
    sizes: ['Small', 'Medium'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-12',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 12',
    name: 'Star-Stud Chevron Satchel — Ivory',
    price: 440,
    rating: '9.5/10',
    reviewCount: 35,
    description:
      'Warm sand-ivory quilted calfskin satchel accented with five-point brass star studs, gold collar links, and draped curb chain.',
    primaryColor: '#E4D7C5',
    secondaryColor: '#C6B59F',
    accentColor: '#D4AF37',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-12.png`,
    swatches: [
      { name: 'Ivory Cream', primaryColor: '#E4D7C5', secondaryColor: '#C6B59F', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-12.png` },
      { name: 'Blush Petal', primaryColor: '#E8AFC0', secondaryColor: '#CA8C9F', accentColor: '#D4AF37', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-07.png` },
      ATELIER_SWATCH_PRESETS[0],
      ATELIER_SWATCH_PRESETS[3],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 22, labelB: 'WIDTH', valueBCm: 29 },
    sizes: ['Small', 'Medium'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-13',
    category: 'bags',
    kind: 'duffel',
    kicker: 'ATELIER SHOWCASE · NO. 13',
    name: 'Pebbled Arch Dome Tote — Emerald',
    price: 420,
    rating: '9/10',
    reviewCount: 28,
    description:
      'Vibrant jade-emerald pebbled calfskin curved dome bag with elongated rolled handles and geometric brushed-silver strap mounts.',
    primaryColor: '#1F8054',
    secondaryColor: '#14593B',
    accentColor: '#D8DEE6',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-13.png`,
    swatches: [
      { name: 'Emerald Jade', primaryColor: '#1F8054', secondaryColor: '#14593B', accentColor: '#D8DEE6', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-13.png` },
      { name: 'Pine Forest', primaryColor: '#1D3B2B', secondaryColor: '#12261B', accentColor: '#788085', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-04.png` },
      ATELIER_SWATCH_PRESETS[2],
      { name: 'Sky Blue', primaryColor: '#619CD9', secondaryColor: '#447BB8', accentColor: '#DCE2EA', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-10.png` },
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 24, labelB: 'WIDTH', valueBCm: 30 },
    sizes: ['Medium', 'Large'],
    defaultSize: 'Medium',
  },
  {
    id: 'bag-atelier-14',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 14',
    name: 'Matelassé Flap Handle — Bottle Green',
    price: 470,
    rating: '9.5/10',
    reviewCount: 46,
    description:
      'Sumptuous bottle-green diamond-quilted lambskin shoulder flap with sculpted single handle and antique brass turn-lock closure.',
    primaryColor: '#1F3027',
    secondaryColor: '#131E18',
    accentColor: '#D4AF37',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-14.png`,
    swatches: [
      ATELIER_SWATCH_PRESETS[2],
      { name: 'Pine Forest', primaryColor: '#1D3B2B', secondaryColor: '#12261B', accentColor: '#788085', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-04.png` },
      ATELIER_SWATCH_PRESETS[3],
      ATELIER_SWATCH_PRESETS[1],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 19, labelB: 'WIDTH', valueBCm: 24 },
    sizes: ['Mini', 'Small'],
    defaultSize: 'Small',
  },
  {
    id: 'bag-atelier-15',
    category: 'bags',
    kind: 'tote',
    kicker: 'ATELIER SHOWCASE · NO. 15',
    name: 'Artisan Saddle Harness Tote — Ochre',
    price: 450,
    rating: '9.5/10',
    reviewCount: 30,
    description:
      'Velvety camel nubuck suede framed with dark roasted-espresso leather trim, whipstitched braided handles, and antique pewter buckle.',
    primaryColor: '#B97B47',
    secondaryColor: '#593524',
    accentColor: '#948D88',
    imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-15.png`,
    swatches: [
      { name: 'Saddle Suede', primaryColor: '#B97B47', secondaryColor: '#593524', accentColor: '#948D88', imageUrl: `${BASE}assets/cutouts/bags/bag-atelier-15.png` },
      ATELIER_SWATCH_PRESETS[0],
      ATELIER_SWATCH_PRESETS[1],
      ATELIER_SWATCH_PRESETS[2],
    ],
    dimensions: { labelA: 'HEIGHT', valueACm: 25, labelB: 'WIDTH', valueBCm: 32 },
    sizes: ['Medium', 'Large'],
    defaultSize: 'Medium',
  },
];

export const BAGS_PRODUCTS: StoreProduct[] = ATELIER_BAGS_PRODUCTS;

const SNEAKER_SWATCH_PRESETS: ColorSwatch[] = [
  { name: 'Triple White', primaryColor: '#F4F3EF', secondaryColor: '#DFDDD6', accentColor: '#1B1C1E', imageUrl: `${BASE}assets/cutouts/shoes/shoe-brand-01.png` },
  { name: 'Chicago Red', primaryColor: '#B91D26', secondaryColor: '#8A1219', accentColor: '#1B1C1E', imageUrl: `${BASE}assets/cutouts/shoes/shoe-brand-04.png` },
  { name: 'Collegiate Green', primaryColor: '#1E5E3E', secondaryColor: '#13402A', accentColor: '#EFECE6', imageUrl: `${BASE}assets/cutouts/shoes/shoe-brand-06.png` },
  { name: 'Triple Black', primaryColor: '#191A1D', secondaryColor: '#0E0F11', accentColor: '#8E9296', imageUrl: `${BASE}assets/cutouts/shoes/shoe-brand-07.png` },
  { name: 'Cobalt Gum', primaryColor: '#2258A5', secondaryColor: '#173E76', accentColor: '#9E7347', imageUrl: `${BASE}assets/cutouts/shoes/shoe-brand-11.png` },
  { name: 'Castle Grey', primaryColor: '#8E9296', secondaryColor: '#696D72', accentColor: '#F2F1EC', imageUrl: `${BASE}assets/cutouts/shoes/shoe-brand-10.png` },
];

interface BrandedShoeSeed {
  id: string;
  fileNum: string;
  brand: string;
  name: string;
  colorName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  price: number;
  rating: string;
  reviews: number;
  description: string;
  defaultSize: string;
}

const BRANDED_SHOE_SEEDS: BrandedShoeSeed[] = [
  { id: 'shoe-brand-01', fileNum: '01', brand: 'NIKE', name: "Nike Air Force 1 '07 Low — Triple White", colorName: 'Triple White', primaryColor: '#F4F3EF', secondaryColor: '#DFDDD6', accentColor: '#1B1C1E', price: 115, rating: '9.5/10', reviews: 142, description: 'Iconic crisp white tumbled leather court silhouette with perforated toe box and encapsulated Air cushioning.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-02', fileNum: '02', brand: 'NIKE', name: 'Nike Air Max 90 — Infrared & Cool Grey', colorName: 'Infrared & Grey', primaryColor: '#D8DADC', secondaryColor: '#9A9EA4', accentColor: '#DF2C26', price: 140, rating: '9.5/10', reviews: 98, description: 'Layered grey mesh and suede panels energized by vivid Infrared accents and classic visible Air window.', defaultSize: 'EU 42' },
  { id: 'shoe-brand-03', fileNum: '03', brand: 'NIKE', name: 'Nike Dunk Low — Panda Black & White', colorName: 'Panda Black & White', primaryColor: '#1E1F22', secondaryColor: '#111214', accentColor: '#F4F3EF', price: 120, rating: '9.5/10', reviews: 164, description: 'Clean two-tone smooth leather upper in crisp white and obsidian black atop a Heritage basketball cupsole.', defaultSize: 'EU 40' },
  { id: 'shoe-brand-04', fileNum: '04', brand: 'JORDAN', name: 'Air Jordan 1 Retro High OG — Chicago', colorName: 'Chicago Red', primaryColor: '#B91D26', secondaryColor: '#8A1219', accentColor: '#1B1C1E', price: 195, rating: '9.5/10', reviews: 185, description: 'Collector-grade Varsity Red and white full-grain leather high-top finished with black Swoosh and Wings collar logo.', defaultSize: 'EU 42' },
  { id: 'shoe-brand-05', fileNum: '05', brand: 'ADIDAS', name: 'Adidas Samba OG — Cloud White & Gum', colorName: 'Cloud White & Gum', primaryColor: '#ECEBE6', secondaryColor: '#CFCDC4', accentColor: '#9E7347', price: 110, rating: '9.5/10', reviews: 131, description: 'Low-profile indoor football icon blending supple white leather, grey suede T-toe overlay, and textured gum sole.', defaultSize: 'EU 40' },
  { id: 'shoe-brand-06', fileNum: '06', brand: 'ADIDAS', name: 'Adidas Gazelle Indoor — Collegiate Green', colorName: 'Collegiate Green', primaryColor: '#1E5E3E', secondaryColor: '#13402A', accentColor: '#EFECE6', price: 125, rating: '9.5/10', reviews: 87, description: 'Brushed emerald-green suede upper paired with cream serrated 3-Stripes and translucent honey gum tread.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-07', fileNum: '07', brand: 'ADIDAS', name: 'Adidas Ultraboost 1.0 — Triple Black', colorName: 'Triple Black', primaryColor: '#191A1D', secondaryColor: '#0E0F11', accentColor: '#45484E', price: 185, rating: '9.5/10', reviews: 112, description: 'Adaptive Primeknit sock-fit runner set over full-length matte black Boost energy return cushioning.', defaultSize: 'EU 42' },
  { id: 'shoe-brand-08', fileNum: '08', brand: 'ADIDAS', name: 'Adidas Campus 00s — Charcoal Slate', colorName: 'Charcoal Slate', primaryColor: '#45484D', secondaryColor: '#2E3034', accentColor: '#EFECE6', price: 118, rating: '9/10', reviews: 76, description: 'Skate-proportioned chunky suede silhouette featuring wide fat laces, padded tongue, and off-white midsole.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-09', fileNum: '09', brand: 'NEW BALANCE', name: 'New Balance 550 — White & Forest Green', colorName: 'White & Forest', primaryColor: '#F1F0EC', secondaryColor: '#D6D4CC', accentColor: '#1F5438', price: 125, rating: '9.5/10', reviews: 94, description: '1989 court revival crafted from perforated crisp white leather trimmed in deep forest-green N branding.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-10', fileNum: '10', brand: 'NEW BALANCE', name: 'New Balance 990v6 — Castle Grey', colorName: 'Castle Grey', primaryColor: '#8E9296', secondaryColor: '#696D72', accentColor: '#F2F1EC', price: 205, rating: '9.5/10', reviews: 108, description: 'Made in USA flagship runner combining breathable grey pigskin suede, silver mesh, and FuelCell foam propulsion.', defaultSize: 'EU 42' },
  { id: 'shoe-brand-11', fileNum: '11', brand: 'PUMA', name: 'Puma Palermo — Cobalt Blue & Gum', colorName: 'Cobalt & Gum', primaryColor: '#2258A5', secondaryColor: '#173E76', accentColor: '#9E7347', price: 105, rating: '9/10', reviews: 63, description: '80s terrace classic in rich cobalt blue suede accented with crisp white Formstrip and retro gum cupsole.', defaultSize: 'EU 40' },
  { id: 'shoe-brand-12', fileNum: '12', brand: 'PUMA', name: 'Puma Suede Classic XXI — Crimson Red', colorName: 'Crimson Red', primaryColor: '#AE1E28', secondaryColor: '#7D1219', accentColor: '#F4F3EF', price: 95, rating: '9/10', reviews: 58, description: 'Full velvet-napped crimson suede upper finished with gold foil Puma lettering and chunky white outsole.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-13', fileNum: '13', brand: 'JORDAN', name: 'Air Jordan 4 Retro — Military Black', colorName: 'Military Black', primaryColor: '#EBEAE5', secondaryColor: '#CAC8C0', accentColor: '#222428', price: 225, rating: '9.5/10', reviews: 149, description: 'Architectural leather and neutral suede Jordan 4 balanced with jet-black wings, heel tab, and visible Air heel.', defaultSize: 'EU 42' },
  { id: 'shoe-brand-14', fileNum: '14', brand: 'NIKE', name: "Nike Air Max 1 '86 — University Red", colorName: 'University Red', primaryColor: '#C42129', secondaryColor: '#8F161C', accentColor: '#EAE9E4', price: 155, rating: '9.5/10', reviews: 81, description: 'Original Tinker Hatfield runner celebrating Big Bubble cushioning beneath grey nubuck and University Red mudguard.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-15', fileNum: '15', brand: 'NIKE', name: 'Nike Zoom Vomero 5 — Metallic Silver', colorName: 'Metallic Silver', primaryColor: '#C8CCD2', secondaryColor: '#979CA3', accentColor: '#25272B', price: 165, rating: '9.5/10', reviews: 92, description: 'Y2K technical mesh runner framed by chrome synthetic overlays, sculpted Cushlon foam, and dual Zoom Air units.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-16', fileNum: '16', brand: 'ASICS', name: 'ASICS Gel-Kayano 14 — Cream & Black', colorName: 'Cream & Black', primaryColor: '#E8E2D5', secondaryColor: '#C9C1B0', accentColor: '#202226', price: 160, rating: '9.5/10', reviews: 104, description: '2008 precision distance silhouette layered in cream open mesh, metallic black stripes, and visible GEL inserts.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-17', fileNum: '17', brand: 'CONVERSE', name: 'Converse Chuck Taylor All Star Hi — Black', colorName: 'Classic Black', primaryColor: '#1C1D20', secondaryColor: '#101113', accentColor: '#F2F1EC', price: 85, rating: '9.5/10', reviews: 156, description: 'Heavyweight black cotton canvas high-top anchored by glossy white rubber foxing, ankle patch, and OrthoLite footbed.', defaultSize: 'EU 40' },
  { id: 'shoe-brand-18', fileNum: '18', brand: 'VANS', name: 'Vans Old Skool — Black & White Sidestripe', colorName: 'Black & White', primaryColor: '#202124', secondaryColor: '#121315', accentColor: '#F4F3EF', price: 82, rating: '9.5/10', reviews: 127, description: 'Suede-and-canvas skate staple featuring the iconic white leather Jazz stripe and signature waffle rubber tread.', defaultSize: 'EU 41' },
  { id: 'shoe-brand-19', fileNum: '19', brand: 'REEBOK', name: 'Reebok Club C 85 Vintage — Chalk & Green', colorName: 'Chalk & Green', primaryColor: '#EFECE4', secondaryColor: '#D6D1C5', accentColor: '#235E3F', price: 100, rating: '9.5/10', reviews: 89, description: 'Supple garment-aged chalk leather tennis low-top finished with plush terry lining and retro green window label.', defaultSize: 'EU 40' },
  { id: 'shoe-brand-20', fileNum: '20', brand: 'SALOMON', name: 'Salomon XT-6 — Vanilla Sand & Ochre', colorName: 'Vanilla Sand', primaryColor: '#DFD5C3', secondaryColor: '#B8AD99', accentColor: '#B87836', price: 200, rating: '9.5/10', reviews: 96, description: 'Alpine ultra-distance trail shoe pairing Quicklace speed closure, welded TPU film, and high-grip Mud Contagrip lugs.', defaultSize: 'EU 42' },
];

export const SHOES_PRODUCTS: StoreProduct[] = BRANDED_SHOE_SEEDS.map((seed) => {
  const cutoutUrl = `${BASE}assets/cutouts/shoes/shoe-brand-${seed.fileNum}.png`;
  const primarySwatch: ColorSwatch = {
    name: seed.colorName,
    primaryColor: seed.primaryColor,
    secondaryColor: seed.secondaryColor,
    accentColor: seed.accentColor,
    imageUrl: cutoutUrl,
  };
  const altSwatches = SNEAKER_SWATCH_PRESETS.filter((s) => s.name !== seed.colorName).slice(0, 3);

  return {
    id: seed.id,
    category: 'shoes',
    kind: 'sneaker',
    kicker: seed.brand,
    name: seed.name,
    price: seed.price,
    rating: seed.rating,
    reviewCount: seed.reviews,
    description: seed.description,
    primaryColor: seed.primaryColor,
    secondaryColor: seed.secondaryColor,
    accentColor: seed.accentColor,
    imageUrl: cutoutUrl,
    swatches: [primarySwatch, ...altSwatches],
    dimensions: { labelA: 'LENGTH', valueACm: 27, labelB: 'WIDTH', valueBCm: 10 },
    sizes: ['EU 36', 'EU 38', 'EU 40', 'EU 41', 'EU 42', 'EU 44'],
    defaultSize: seed.defaultSize,
  };
});

export const ALL_PRODUCTS: StoreProduct[] = [
  ...CLOTHING_PRODUCTS,
  ...CAPS_PRODUCTS,
  ...BAGS_PRODUCTS,
  ...SHOES_PRODUCTS,
];

export function getProductsByCategory(category: Exclude<StoreCategory, 'store'>): StoreProduct[] {
  switch (category) {
    case 'clothing':
      return CLOTHING_PRODUCTS;
    case 'caps':
      return CAPS_PRODUCTS;
    case 'bags':
      return BAGS_PRODUCTS;
    case 'shoes':
      return SHOES_PRODUCTS;
  }
}
