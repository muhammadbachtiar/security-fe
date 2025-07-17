import _Image from "next/image";

type Props = {
  alt: string;
  src: string;
};

function Image({ alt, src }: Props) {
  return (
    <_Image
      alt={alt}
      src={src}
      className="w-full h-full object-cover object-center"
      priority
      width={500}
      height={300}
    />
  );
}

export default Image;
