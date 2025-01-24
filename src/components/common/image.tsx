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
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
      priority
      width={500}
      height={300}
    />
  );
}

export default Image;
