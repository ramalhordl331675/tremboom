export function SectionPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm sm:p-16">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
        {description}
      </p>
      <p className="mt-4 inline-block rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-medium text-zinc-600">
        Esta seção será implementada em breve.
      </p>
    </div>
  );
}
