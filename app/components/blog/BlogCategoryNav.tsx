"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = { id: number; name: string; slug: string };

type Props = {
  categories: Category[];
};

export function BlogCategoryNav({ categories }: Props) {
  const pathname = usePathname();
  const active = useMemo(() => {
    if (pathname === "/blog") return "all";
    const m = pathname.match(/^\/blog\/category\/([^/]+)\/?$/);
    return m?.[1] ?? "all";
  }, [pathname]);

  const options = useMemo(() => [{ id: 0, name: "All Categories", slug: "all" }, ...categories], [categories]);

  return (
    <nav className="category-nav" aria-label="Blog categories">
      <div className="category-nav__container">
        <ul className="category-nav__list category-nav__list--desktop">
          {options.map((c) => (
            <li key={c.slug}>
              <Link
                href={c.slug === "all" ? "/blog" : `/blog/category/${c.slug}`}
                className={[
                  "category-nav__link",
                  "category-filter-link",
                  active === c.slug ? "active" : "",
                ].join(" ")}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="category-nav__mobile">
          <select
            className="category-nav__select category-filter-select"
            aria-label="Select blog category"
            value={active}
            onChange={(e) => {
              const value = e.target.value;
              const href = value === "all" ? "/blog" : `/blog/category/${value}`;
              window.location.assign(href);
            }}
          >
            {options.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}

