import React from "react";

type Props = {
  data: Record<string, unknown>;
};

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function asNumber(v: unknown) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

function pickFirstString(data: Record<string, unknown>, keys: string[]) {
  for (const k of keys) {
    const s = asString(data[k]);
    if (s) return s;
  }
  return "";
}

export function HeroBlock({ data }: Props) {
  // Common ACF field names people use for hero blocks.
  const title = pickFirstString(data, ["title", "heading", "hero_title"]);
  const subtitle = pickFirstString(data, ["subtitle", "subheading", "hero_subtitle"]);
  const description = pickFirstString(data, ["description", "content", "text", "hero_description"]);

  const buttonText = pickFirstString(data, ["button_text", "cta_text", "link_text"]);
  const buttonUrl = pickFirstString(data, ["button_url", "cta_url", "link_url", "url"]);

  // Image fields: can be url string, or numeric media ID.
  const imageUrl = pickFirstString(data, ["image_url", "background_image_url", "image"]);
  const imageId =
    imageUrl ? null : asNumber((data as any).image) ?? asNumber((data as any).background_image);

  return (
    <section className="hero-block not-prose">
      <div className="hero-container">
        <div className="hero-text-column">
          <div className="hero-content">
            {title ? <h2 className="hero-headline">{title}</h2> : null}
            {subtitle ? <p className="hero-subheadline">{subtitle}</p> : null}
            {description ? (
              <p className="text-white/90" style={{ margin: 0 }}>
                {description}
              </p>
            ) : null}
            {buttonText && buttonUrl ? (
              <div>
                <a href={buttonUrl} className="wp-block-button__link">
                  {buttonText}
                </a>
              </div>
            ) : null}
          </div>
        </div>

        <div className="hero-image-column">
          <div className="hero-image-wrapper">
            {imageUrl ? (
              <img src={imageUrl} alt={title || "Hero"} className="hero-image" />
            ) : imageId ? (
              <div className="hero-image-placeholder">
                <div className="placeholder-text">
                  Media ID: <span className="font-mono">{imageId}</span>
                </div>
              </div>
            ) : (
              <div className="hero-image-placeholder">
                <div className="placeholder-text">No image</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

