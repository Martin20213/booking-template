import { businessConfig } from "@/config/business";

export function Footer() {
  return (
    <footer className="border-t border-ink-line py-10">
      <div className="section flex flex-col items-center gap-3 text-center text-sm text-paper-muted md:flex-row md:justify-between md:text-left">
        <p>{businessConfig.footer.note}</p>
        <p>&copy; {new Date().getFullYear()} {businessConfig.meta.name}</p>
      </div>
    </footer>
  );
}
