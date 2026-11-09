const dialMarks = Array.from({ length: 96 }, (_, index) => ({
  angle: index * 3.75,
  depth: index % 8 === 0 ? 18 : index % 4 === 0 ? 11 : 5,
}))

export function IntroArt() {
  return (
    <div className="qi-intro-art" aria-hidden="true">
      <div className="qi-intro-beam" />
      <svg className="qi-intro-dial" viewBox="0 0 800 800" fill="none" focusable="false">
        <defs>
          <radialGradient id="qi-iris" cx="0" cy="0" r="1" gradientTransform="translate(515 205) rotate(125) scale(630)">
            <stop stopColor="#6e4a2e" stopOpacity=".6" />
            <stop offset=".37" stopColor="#211b17" />
            <stop offset="1" stopColor="#100e0d" />
          </radialGradient>
          <linearGradient id="qi-alloy" x1="143" y1="639" x2="697" y2="147" gradientUnits="userSpaceOnUse">
            <stop stopColor="#181311" />
            <stop offset=".25" stopColor="#453126" />
            <stop offset=".47" stopColor="#191613" />
            <stop offset=".76" stopColor="#8d5d37" />
            <stop offset=".86" stopColor="#e6b77e" />
            <stop offset="1" stopColor="#3a271d" />
          </linearGradient>
          <linearGradient id="qi-edge" x1="177" y1="657" x2="636" y2="105" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6d4b35" stopOpacity=".12" />
            <stop offset=".39" stopColor="#a27651" stopOpacity=".4" />
            <stop offset=".68" stopColor="#b48965" />
            <stop offset=".86" stopColor="#ffdfaf" />
            <stop offset="1" stopColor="#ce9154" stopOpacity=".2" />
          </linearGradient>
          <radialGradient id="qi-inset">
            <stop stopColor="#0d0c0b" />
            <stop offset=".7" stopColor="#12100e" />
            <stop offset="1" stopColor="#201813" />
          </radialGradient>
        </defs>

        <circle cx="400" cy="400" r="382" stroke="#deba94" strokeOpacity=".08" />
        <circle cx="400" cy="400" r="358" stroke="#d4aa7d" strokeOpacity=".17" />
        <path d="M400 4v38m0 716v38M4 400h38m716 0h38" stroke="#d4aa7d" strokeOpacity=".35" />
        <circle cx="400" cy="400" r="319" fill="url(#qi-iris)" stroke="url(#qi-edge)" strokeWidth="1.5" />

        <g className="qi-intro-rotor">
          <circle cx="400" cy="400" r="336" stroke="#a7794f" strokeOpacity=".56" strokeDasharray="112 1999" />
          <circle cx="400" cy="400" r="336" stroke="#e6bc89" strokeOpacity=".43" strokeDasharray="44 2067" transform="rotate(161 400 400)" />
          <g stroke="#d6ad83" strokeOpacity=".55">
            {dialMarks.map(({ angle, depth }) => (
              <line key={angle} x1="400" y1="55" x2="400" y2={55 + depth} transform={`rotate(${angle} 400 400)`} />
            ))}
          </g>
          <circle cx="400" cy="400" r="301" stroke="url(#qi-alloy)" strokeWidth="22" />
          <circle cx="400" cy="400" r="312" stroke="url(#qi-edge)" strokeWidth="1" />
          <circle cx="400" cy="400" r="291" stroke="url(#qi-edge)" strokeWidth="1.5" />
          <path d="M184 196A298 298 0 0 1 593 173M598 622A298 298 0 0 1 237 646" stroke="#ddaf7d" strokeOpacity=".28" strokeWidth="2" />
          <path d="M497 118A298 298 0 0 1 651 239" className="qi-intro-hot-edge" stroke="#ffdeae" strokeWidth="2" />
          <circle cx="400" cy="400" r="272" stroke="#c89562" strokeOpacity=".3" />
          <circle cx="400" cy="400" r="264" stroke="#c89562" strokeOpacity=".22" strokeDasharray="2 8" />
        </g>

        <circle cx="400" cy="400" r="240" fill="url(#qi-inset)" stroke="url(#qi-edge)" strokeWidth="1" />
        <circle cx="400" cy="400" r="229" stroke="#b68659" strokeOpacity=".18" />
        <path d="M117 400h38m490 0h38M400 117v38m0 490v38" stroke="#f3c896" strokeOpacity=".28" />
        <path d="M268 167l14 25m236 416 14 25M167 532l25-14m416-236 25-14" stroke="#ebbd8f" strokeOpacity=".31" />
        <circle cx="400" cy="66" r="2.5" fill="#ffe0b7" />
        <circle cx="734" cy="400" r="2" fill="#e6ae71" />
      </svg>
      <div className="qi-intro-horizon" />
    </div>
  )
}
