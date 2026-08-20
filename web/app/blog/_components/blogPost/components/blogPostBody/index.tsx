import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/client";
import { assetDimensions } from "@/lib/imageDimensions";
import { normalizeHref } from "@/lib/href";

type SanityImage = {
  asset?: { _ref?: string };
  alt?: string;
};

// PortableText renders nothing for types/marks it doesn't know, so every custom
// type and annotation the `post.body` schema allows needs an entry here.
const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset) return null;
      const size = assetDimensions(value.asset);
      return (
        <img
          src={urlFor(value).width(1440).url()}
          alt={value.alt || ""}
          width={size?.width}
          height={size?.height}
          loading="lazy"
        />
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href = normalizeHref(value?.href);
      const external = /^https?:\/\//.test(href) && !href.includes("getadigital.com");
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogPostBody({ value }: { value: any[] }) {
  return <PortableText value={value} components={components} />;
}
