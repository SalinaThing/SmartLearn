import type { ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  width?: number;
  height?: number;
};

export default function Image({ src, alt = "", width, height, className, style, ...rest }: Props) {
  const resolved =
    typeof src === "string"
      ? src
      : src && typeof src === "object" && "default" in (src as object)
        ? (src as { default: string }).default
        : String(src);
  return (
    <img
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      {...rest}
    />
  );
}
