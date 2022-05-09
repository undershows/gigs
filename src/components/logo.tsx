type LogoProps = {
  textSize?: string;
  className?: string;
  invertColors?: boolean;
};

export default function Logo({ textSize, className, invertColors }: LogoProps) {
  return (
    <span className={`font-newake font-bold tracking-wider ${textSize ? textSize : `text-6xl`} ${className}`}>
      <span className={`underline underline-offset-4 text-black ${invertColors ? `invert` : ""}`}>UNDER</span>
      <span className={`px-1 pt-2 text-white bg-clip-padding bg-black ${invertColors ? `invert` : ""}`}>SHOWS</span>
    </span>
  );
}
