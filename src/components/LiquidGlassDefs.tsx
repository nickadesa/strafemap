// SVG lens filters for the optional Liquid Glass look (inspired by Glisse).
// Chromium applies them through backdrop-filter: url(); other browsers keep the frosted fallback.
export function LiquidGlassDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <filter id="lg-bend" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="3" result="n" />
          <feGaussianBlur in="n" stdDeviation="2" result="m" />
          <feDisplacementMap in="SourceGraphic" in2="m" scale="38" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="lg-dispersion" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.013" numOctaves="2" seed="5" result="n" />
          <feGaussianBlur in="n" stdDeviation="2" result="m" />
          <feDisplacementMap in="SourceGraphic" in2="m" scale="44" xChannelSelector="R" yChannelSelector="G" result="r" />
          <feDisplacementMap in="SourceGraphic" in2="m" scale="36" xChannelSelector="R" yChannelSelector="G" result="g" />
          <feDisplacementMap in="SourceGraphic" in2="m" scale="28" xChannelSelector="R" yChannelSelector="G" result="b" />
          <feColorMatrix in="r" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="rr" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gg" />
          <feColorMatrix in="b" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="bb" />
          <feBlend in="rr" in2="gg" mode="screen" result="rg" />
          <feBlend in="rg" in2="bb" mode="screen" />
        </filter>
        <filter id="lg-frost" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="9" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}
