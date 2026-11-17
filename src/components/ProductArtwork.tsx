import { useEffect, useState } from 'react';
import { ImageCrop, StoreProduct } from '../data/storeCatalog';

interface ProductArtworkProps {
  product: StoreProduct;
  className?: string;
  showHanger?: boolean;
  overrideColors?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    imageUrl?: string;
    imageCrop?: ImageCrop;
  };
}

export function ProductArtwork({
  product,
  className = 'w-full h-full',
  showHanger = true,
  overrideColors,
}: ProductArtworkProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const { kind, id } = product;
  const activeImageUrl = overrideColors?.imageUrl ?? product.imageUrl;
  const activeImageCrop = overrideColors?.imageCrop ?? product.imageCrop;

  useEffect(() => {
    setImgFailed(false);
  }, [activeImageUrl]);

  const primaryColor = overrideColors?.primaryColor ?? product.primaryColor;
  const secondaryColor = overrideColors?.secondaryColor ?? product.secondaryColor;
  const accentColor = overrideColors?.accentColor ?? product.accentColor;
  const uid = `${id.replace(/[^a-zA-Z0-9]/g, '')}_${primaryColor.replace('#', '')}`;

  if (activeImageUrl && !imgFailed && activeImageCrop) {
    const zoom = activeImageCrop.zoom ?? 590;
    const halfW = 5000 / zoom;
    const halfH = (5000 * 16) / (zoom * 9);
    const safeX = Math.max(halfW, Math.min(100 - halfW, activeImageCrop.x));
    const safeY = Math.max(halfH, Math.min(100 - halfH, activeImageCrop.y));
    return (
      <div
        className={`${className} relative overflow-hidden rounded-2xl bg-[#efe9e0] shadow-[0_14px_30px_rgba(17,21,36,0.14)] ring-1 ring-black/8 select-none`}
      >
        <img
          src={activeImageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${zoom}%`,
            height: 'auto',
            maxWidth: 'none',
            transform: `translate(-${safeX}%, -${safeY}%)`,
          }}
          draggable={false}
        />
      </div>
    );
  }

  if (activeImageUrl && !imgFailed) {
    const isTransparentPng = activeImageUrl.toLowerCase().endsWith('.png');
    return (
      <img
        src={activeImageUrl}
        alt={product.name}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={`${className} object-contain select-none ${
          isTransparentPng ? '' : 'mix-blend-multiply'
        }`}
        draggable={false}
      />
    );
  }

  if (kind === 'beanie') {
    return (
      <svg
        viewBox="0 0 120 120"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="25" y1="18" x2="95" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>
        {/* Soft cast shadow */}
        <ellipse cx="60" cy="105" rx="34" ry="5.5" fill="rgba(17,18,20,0.14)" />
        {/* Beanie crown */}
        <path
          d="M27 68C27 38 41 22 60 22C79 22 93 38 93 68H27Z"
          fill={`url(#bg-${uid})`}
        />
        {/* Vertical rib lines */}
        <g stroke={accentColor} strokeOpacity="0.24" strokeWidth="1.4" strokeLinecap="round">
          <path d="M40 31C37 43 36 56 36 66" />
          <path d="M49 25C47 40 47 55 47 66" />
          <path d="M60 23V66" />
          <path d="M71 25C73 40 73 55 73 66" />
          <path d="M80 31C83 43 84 56 84 66" />
        </g>
        {/* Folded cuff */}
        <rect
          x="23"
          y="64"
          width="74"
          height="28"
          rx="8"
          fill={primaryColor}
          stroke={accentColor}
          strokeOpacity="0.18"
          strokeWidth="1"
        />
        <g stroke={accentColor} strokeOpacity="0.28" strokeWidth="1.5" strokeLinecap="round">
          <line x1="33" y1="67" x2="33" y2="89" />
          <line x1="42" y1="67" x2="42" y2="89" />
          <line x1="51" y1="67" x2="51" y2="89" />
          <line x1="60" y1="67" x2="60" y2="89" />
          <line x1="69" y1="67" x2="69" y2="89" />
          <line x1="78" y1="67" x2="78" y2="89" />
          <line x1="87" y1="67" x2="87" y2="89" />
        </g>
        {/* Woven mini label */}
        <rect x="52" y="75" width="16" height="9" rx="1.5" fill="#18191C" />
        <line x1="55" y1="79.5" x2="65" y2="79.5" stroke="#F4F4F5" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'backpack') {
    return (
      <svg
        viewBox="0 0 140 150"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`pack-${uid}`} x1="30" y1="20" x2="115" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>
        <ellipse cx="70" cy="137" rx="42" ry="6.5" fill="rgba(17,18,20,0.16)" />
        {/* Top grab loop */}
        <path d="M56 26C56 17 84 17 84 26" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
        {/* Side strap hints */}
        <path d="M35 55L28 110C28 118 33 123 39 124" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M105 55L112 110C112 118 107 123 101 124" stroke={accentColor} strokeWidth="4.5" strokeLinecap="round" />
        {/* Main body */}
        <rect x="33" y="25" width="74" height="106" rx="22" fill={`url(#pack-${uid})`} />
        {/* Quilted horizontal channels */}
        <g stroke={accentColor} strokeOpacity="0.22" strokeWidth="1.5">
          <path d="M36 52H104" />
          <path d="M34 74H106" />
          <path d="M34 96H106" />
        </g>
        {/* Front zippered pocket */}
        <rect
          x="42"
          y="78"
          width="56"
          height="42"
          rx="12"
          fill={secondaryColor}
          stroke={accentColor}
          strokeOpacity="0.25"
          strokeWidth="1.2"
        />
        <line x1="48" y1="86" x2="92" y2="86" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        <rect x="66" y="84" width="8" height="4" rx="1" fill="#E5E7EB" />
        {/* Subtle patch */}
        <rect x="61" y="40" width="18" height="10" rx="2" fill={accentColor} fillOpacity="0.7" />
      </svg>
    );
  }

  if (kind === 'duffel') {
    return (
      <svg
        viewBox="0 0 160 130"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="80" cy="112" rx="58" ry="7" fill="rgba(17,18,20,0.16)" />
        {/* Handles */}
        <path d="M52 48C52 24 108 24 108 48" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M60 50C60 32 100 32 100 50" stroke={accentColor} strokeOpacity="0.55" strokeWidth="3.5" strokeLinecap="round" />
        {/* Duffel cylinder body */}
        <rect
          x="20"
          y="46"
          width="120"
          height="62"
          rx="22"
          fill={primaryColor}
          stroke={accentColor}
          strokeOpacity="0.18"
          strokeWidth="1.2"
        />
        <rect x="20" y="76" width="120" height="32" rx="18" fill={secondaryColor} fillOpacity="0.45" />
        {/* Webbing vertical straps */}
        <rect x="48" y="46" width="7" height="62" fill={accentColor} fillOpacity="0.78" />
        <rect x="105" y="46" width="7" height="62" fill={accentColor} fillOpacity="0.78" />
        {/* Top zip */}
        <line x1="36" y1="53" x2="124" y2="53" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="75" y="64" width="10" height="10" rx="2" fill="#E5E7EB" fillOpacity="0.7" />
      </svg>
    );
  }

  if (kind === 'tote') {
    return (
      <svg
        viewBox="0 0 150 140"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="75" cy="126" rx="48" ry="6" fill="rgba(17,18,20,0.14)" />
        {/* Light natural tote */}
        <path d="M36 48C36 22 66 22 66 48" stroke="#22252A" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 48H78L74 118C74 121 71 123 68 123H34C31 123 28 121 28 118L24 48Z" fill={primaryColor} stroke="rgba(17,18,20,0.12)" strokeWidth="1" />
        <line x1="39" y1="74" x2="63" y2="74" stroke="#18191C" strokeOpacity="0.25" strokeWidth="1.8" />
        {/* Dark companion tote overlapping slightly */}
        <path d="M84 52C84 26 114 26 114 52" stroke="#111214" strokeWidth="4" strokeLinecap="round" />
        <path d="M72 52H126L122 120C122 123 119 125 116 125H82C79 125 76 123 76 120L72 52Z" fill={secondaryColor} />
      </svg>
    );
  }

  if (kind === 'sneaker') {
    return (
      <svg
        viewBox="0 0 160 110"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="82" cy="96" rx="56" ry="5.5" fill="rgba(17,18,20,0.16)" />
        {/* Outsole */}
        <path
          d="M25 82C25 76 30 74 42 74H132C139 74 142 79 140 86C139 90 133 91 124 91H32C27 91 25 87 25 82Z"
          fill="#1B1D21"
        />
        <path
          d="M27 77C34 76 46 76 62 77C84 78 110 75 137 78L136 82C112 81 86 83 62 82C46 81 33 81 27 81V77Z"
          fill={accentColor}
          fillOpacity="0.88"
        />
        {/* Upper shoe body */}
        <path
          d="M28 76L34 41C36 35 42 32 47 36C55 43 66 42 74 34C78 30 83 31 87 36L104 54C116 58 131 61 138 71C140 74 138 77 132 77H28Z"
          fill={primaryColor}
        />
        {/* Heel & toe overlays */}
        <path d="M28 76L33 48C42 50 48 60 52 76H28Z" fill={secondaryColor} />
        <path d="M110 57C122 59 133 63 138 71C139 74 136 77 130 77H102C102 68 106 61 110 57Z" fill={secondaryColor} fillOpacity="0.85" />
        {/* Laces */}
        <g stroke="#F3F4F6" strokeWidth="2.4" strokeLinecap="round">
          <line x1="81" y1="41" x2="90" y2="38" />
          <line x1="86" y1="47" x2="96" y2="44" />
          <line x1="92" y1="53" x2="102" y2="50" />
        </g>
        {/* Pull loop */}
        <path d="M31 39L26 32" stroke={secondaryColor} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // Hanging Garments (puffer, fleece, shell, cardigan)
  const isPuffer = kind === 'puffer';
  const isFleece = kind === 'fleece';
  const isCardigan = kind === 'cardigan';

  return (
    <svg
      viewBox="0 0 220 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gar-${uid}`} x1="55" y1="55" x2="175" y2="275" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>

      {/* Wooden Hanger & Metal Hook */}
      {showHanger && (
        <g>
          <path
            d="M110 14C110 8 118 8 118 14C118 18 110 19 110 26V34"
            stroke="#3C4047"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M110 33L62 56C59 57.5 60 62 64 62H156C160 62 161 57.5 158 56L110 33Z"
            fill="#CFA87C"
            stroke="#A88054"
            strokeWidth="1"
          />
        </g>
      )}

      {/* Hood / Collar */}
      <path
        d="M84 44C84 26 95 20 110 20C125 20 136 26 136 44L142 58H78L84 44Z"
        fill={secondaryColor}
      />
      <path
        d="M91 44C91 31 99 26 110 26C121 26 129 31 129 44L125 56H95L91 44Z"
        fill={accentColor}
        fillOpacity="0.48"
      />

      {/* Left Sleeve */}
      <path
        d="M72 56C54 62 43 74 37 104L22 195C21 200 24 204 29 205L43 207C47 207 50 204 51 200L65 112L72 104V56Z"
        fill={`url(#gar-${uid})`}
      />
      {/* Right Sleeve */}
      <path
        d="M148 56C166 62 177 74 183 104L198 195C199 200 196 204 191 205L177 207C173 207 170 204 169 200L155 112L148 104V56Z"
        fill={`url(#gar-${uid})`}
      />

      {/* Torso */}
      <path
        d="M70 54C82 48 96 47 110 47C124 47 138 48 150 54L159 252C159 259 153 264 146 264H74C67 264 61 259 61 252L70 54Z"
        fill={`url(#gar-${uid})`}
        stroke={accentColor}
        strokeOpacity="0.14"
        strokeWidth="1"
      />

      {/* Puffer horizontal baffles */}
      {isPuffer && (
        <g stroke={accentColor} strokeOpacity="0.32" strokeWidth="1.8">
          <path d="M68 84H152" />
          <path d="M67 112H153" />
          <path d="M66 140H154" />
          <path d="M65 168H155" />
          <path d="M64 196H156" />
          <path d="M63 224H157" />
          {/* Sleeve baffles */}
          <path d="M40 102L62 108" />
          <path d="M35 130L58 136" />
          <path d="M30 158L54 164" />
          <path d="M180 102L158 108" />
          <path d="M185 130L162 136" />
          <path d="M190 158L166 164" />
        </g>
      )}

      {/* Fleece chest pocket & half/full zip */}
      {isFleece && (
        <g>
          <rect
            x="124"
            y="95"
            width="20"
            height="34"
            rx="2"
            fill={secondaryColor}
            stroke={accentColor}
            strokeOpacity="0.28"
            strokeWidth="1.2"
          />
          <line x1="126" y1="99" x2="126" y2="124" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* Cardigan / Shell pocket & seam details */}
      {!isPuffer && (
        <g stroke={accentColor} strokeOpacity="0.26" strokeWidth="1.5" strokeLinecap="round">
          <line x1="76" y1="184" x2="82" y2="218" />
          <line x1="144" y1="184" x2="138" y2="218" />
          {isCardigan && (
            <>
              <rect x="64" y="250" width="92" height="12" rx="2" fill={secondaryColor} stroke="none" />
              <line x1="72" y1="252" x2="72" y2="262" />
              <line x1="88" y1="252" x2="88" y2="262" />
              <line x1="104" y1="252" x2="104" y2="262" />
              <line x1="120" y1="252" x2="120" y2="262" />
              <line x1="136" y1="252" x2="136" y2="262" />
            </>
          )}
        </g>
      )}

      {/* Center Zipper */}
      <line
        x1="110"
        y1="54"
        x2="110"
        y2={isFleece ? 150 : 261}
        stroke={accentColor}
        strokeOpacity="0.72"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="108" y="61" width="4" height="7" rx="1" fill="#D1D5DB" />

      {/* Cuffs */}
      <path d="M23 195L48 199" stroke={accentColor} strokeOpacity="0.35" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M197 195L172 199" stroke={accentColor} strokeOpacity="0.35" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
