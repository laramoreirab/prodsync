import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Phone } from "lucide-react";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Sobre nós", href: "#sobre-nos" },
  { title: "Serviços", href: "#servicos" },
  { title: "FAQs", href: "#faqs" },
  { title: "Cadastro", href: "/cadastro" },
];

const contactItems = [
  {
    icon: MapPin,
    label: "Rua Boa Vista, 825",
    href: null,
  },
  {
    icon: Mail,
    label: "prodsync@gmail.com",
    href: "mailto:prodsync@gmail.com",
  },
  {
    icon: Phone,
    label: "4002-8922",
    href: "tel:+55400028922",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-[#23304c]/10 bg-[#fafbfd]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-16 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <a href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="ProdSync"
                className="h-9 w-auto sm:h-10"
              />
            </a>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
              Sua fábrica sincronizada em tempo real e sob controle.
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#23304c]/70">
              Navegação
            </p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-[#23304c]"
                >
                  {link.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#23304c]/70">
              Contato
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#23304c]/6 text-[#23304c]">
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <span className="text-sm leading-snug">{item.label}</span>
                  </>
                );

                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-[#23304c]"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-[#23304c]/10" />

        <p className="text-center text-xs text-muted-foreground sm:text-sm">
          © 2026 ProdSync. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
