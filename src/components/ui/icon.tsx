import type { SimpleIcon } from "simple-icons";

type IconProps = {
  src: SimpleIcon;
  className?: string;
};
export const Icon = ({ src, className }: IconProps) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width="40"
      height="40"
      fill={`#${src.hex}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>{src.title}</title>
      <path d={src.path} />
    </svg>
  );
};
