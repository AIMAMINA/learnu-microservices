interface HeroProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
}

export function Hero({
  title,
  subtitle,
  imageUrl = "/src/assets/hero.png",
}: HeroProps) {
  return (
    <section
      className="relative flex items-center justify-center w-full overflow-hidden"
      style={{
        height: "400px",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay bleu foncé transparent */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,41,59,0.8) 0%, rgba(51,65,85,0.85) 100%)",
        }}
      />

      {/* Texte centré */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1
          className="text-white mb-4 leading-tight"
          style={{
            fontSize: "3.2rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color: "#CAD8E4",
            fontSize: "1.15rem",
            lineHeight: "1.8",
            maxWidth: "650px",
            margin: "0 auto",
            opacity: 0.95,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Ligne lumineuse en bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #22D3EE 50%, transparent 100%)",
          opacity: 0.6,
        }}
      />
    </section>
  );
}
