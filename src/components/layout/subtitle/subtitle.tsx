export function TypographyH2({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="scroll-m-20 mb-2 text-2xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
      <hr />
    </div>
  );
}
