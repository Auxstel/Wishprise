import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface ButtonWithIconProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  forceHover?: boolean;
}

const ButtonWithIcon = ({ text, onClick, className = "", disabled, forceHover }: ButtonWithIconProps) => {
  const hoverClasses = forceHover ? "ps-16 pe-8" : "";
  const arrowHoverClasses = forceHover ? "right-[calc(100%-48px)] rotate-45" : "";

  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className={`relative text-sm font-medium rounded-full h-14 p-1 ps-8 pe-16 group/btn transition-all duration-500 hover:ps-16 hover:pe-8 w-fit overflow-hidden cursor-pointer ${hoverClasses} ${className}`}
    >
      <span className="relative z-10 transition-all duration-500">
        {text}
      </span>
      <div className={`absolute right-1.5 w-11 h-11 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover/btn:right-[calc(100%-48px)] group-hover/btn:rotate-45 ${arrowHoverClasses}`}>
        <ArrowUpRight size={20} />
      </div>
    </Button>
  );
};

export default ButtonWithIcon;
