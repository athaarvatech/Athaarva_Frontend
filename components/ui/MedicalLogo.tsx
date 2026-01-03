import Image from 'next/image';

interface MedicalLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const MedicalLogo: React.FC<MedicalLogoProps> = ({ 
  width = 48, 
  height = 48, 
  className = "" 
}) => {
  return (
    <Image
      src="/logo.png"
      alt="Medical Logo"
      width={width}
      height={height}
      className={className}
      style={{ width: width, height: "auto" }} // Ensures aspect ratio is maintained
      priority // Add priority for LCP warning if logo is above the fold
    />
  );
};

export default MedicalLogo;