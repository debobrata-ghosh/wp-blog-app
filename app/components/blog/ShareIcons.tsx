"use client";

import React from "react";

type Props = {
  postLink: string;
  title: string;
};

export function ShareIcons({ postLink, title }: Props) {
  const encodedLink = postLink ? encodeURIComponent(postLink) : "";
  const encodedTitle = title ? encodeURIComponent(title) : "";

  return (
    <div className="single-share__icons">
      <a
        href={postLink ? `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}` : "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="share-icon"
      >
        Facebook
      </a>
      <a
        href={
          postLink
            ? `https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedTitle}`
            : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="share-icon"
      >
        X
      </a>
      <a
        href={
          postLink
            ? `https://www.linkedin.com/shareArticle?mini=true&url=${encodedLink}&title=${encodedTitle}`
            : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="share-icon"
      >
        LinkedIn
      </a>
      <a
        href={postLink ? `mailto:?subject=${encodedTitle}&body=${encodedLink}` : "#"}
        aria-label="Share via Email"
        className="share-icon"
      >
        Email
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (!postLink) return;
          navigator.clipboard?.writeText(postLink);
        }}
        aria-label="Copy link"
        className="share-icon"
      >
        Copy
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.print();
        }}
        aria-label="Print article"
        className="share-icon"
      >
        Print
      </a>
    </div>
  );
}

