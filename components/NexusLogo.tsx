type LogoTheme = "dark" | "blue" | "pink" | "face";

type NexusLogoProps = {
  theme?: LogoTheme;
  compact?: boolean;
};

export function NexusLogo({ theme = "dark", compact = false }: NexusLogoProps) {
  const left = theme === "pink" ? "#fb9bd0" : theme === "blue" ? "#58ccff" : "#58ccff";
  const right = theme === "pink" ? "#d261ff" : theme === "blue" ? "#ae7eff" : "#c084fc";
  const iconSize = compact ? 92 : 148;
  const stroke = compact ? 7 : 10;

  return (
    <div className={`flex flex-col items-center ${compact ? "gap-2" : "gap-5"}`}>
      <div
        aria-label="NEXUS logo"
        role="img"
        className="relative flex items-center justify-center"
        style={{ width: iconSize * 2.2, height: iconSize * 1.35 }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.22),transparent_62%)] blur-2xl" />

        <div
          className="absolute rounded-[45%]"
          style={{
            width: iconSize,
            height: iconSize * 0.76,
            left: "8%",
            top: "11%",
            border: `${stroke}px solid ${left}`,
            transform: "rotate(-8deg)",
            boxShadow: `0 0 18px ${left}55`,
          }}
        />
        <div
          className="absolute rounded-[45%]"
          style={{
            width: iconSize,
            height: iconSize * 0.76,
            right: "8%",
            top: "11%",
            border: `${stroke}px solid ${right}`,
            transform: "rotate(8deg)",
            boxShadow: `0 0 18px ${right}55`,
          }}
        />

        <div
          className="absolute rounded-full bg-white"
          style={{
            width: compact ? 16 : 24,
            height: compact ? 16 : 24,
            left: "50%",
            top: "47%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 12px #fff, 0 0 32px rgba(255,255,255,.9), 0 0 54px rgba(147,197,253,.7)",
          }}
        />
        <div
          className="absolute rounded-full bg-white/80 blur-md"
          style={{
            width: compact ? 36 : 58,
            height: compact ? 36 : 58,
            left: "50%",
            top: "47%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {!compact && (
        <div className="font-black leading-none tracking-[0.2em] text-white" style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}>
          NEXUS
        </div>
      )}
    </div>
  );
}
