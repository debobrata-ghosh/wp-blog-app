import Link from "next/link";
import { fetchCategories } from "@/app/lib/wordpress";

export default async function CategoriesPage() {
  const { categories, total } = await fetchCategories({ perPage: 100 });

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {total || categories.length} categories
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog/category/${cat.slug}`}
            className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-black"
          >
            <div className="font-medium">{cat.name}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {cat.count ?? 0}
            </div>
          </Link>
        ))}

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 sm:col-span-2">
            No categories found.
          </div>
        ) : null}
      </div>
    </section>
  );
}

