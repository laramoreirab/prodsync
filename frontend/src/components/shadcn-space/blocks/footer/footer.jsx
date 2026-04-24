// import Logo from "@/assets/logo/logo";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Índice",
    links: [
      {
        title: "Home",
        href: "#",
      },
      {
        title: "Sobre nós",
        href: "#",
      },
      {
        title: "Serviços",
        href: "#",
      },
      {
        title: "FAQs",
        href: "#",
      },
      {
        title: "Cadastro",
        href: "#",
      },
      {
        title: "Login",
        href: "#",
      }
    ],
  },
  {
    title: "",
    links: [
      {
        title: "",
        href: "#",
      },
      {
        title: "",
        href: "#",
      },
      {
        title: "",
        href: "#",
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="py-10">
      <Separator orientation="horizontal" />
      <div className="xl:px-16 lg:px-8 px-4 mx-auto">
        <div className="flex flex-col gap-6 sm:gap-12">
          <div
            className="py-12 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-12 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col-span-full lg:col-span-4">
              <div
                className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
                {/* Logo */}
                <a className="" href="#">
                  <img src="/logo.png" alt="Logo - ProdSync" className="h-10" />
                </a>

                <p className="text-base font-normal text-muted-foreground">
                  Sua fábrica sincronizada em tempo real e sob controle.
                </p>
              </div>
            </div>

            <div className="col-span-1 lg:block hidden"></div>

            {footerSections.map(({ title, links }, index) => (
              <div key={index} className="col-span-2">
                <div
                  className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
                  <p className="text-base font-medium text-foreground">
                    {title}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {links.map(({ title, href }) => (
                      <li key={title}>
                        <a
                          href={href}
                          className="text-base font-normal text-muted-foreground hover:text-foreground">
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="col-span-3">
              <div
                className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
                <p className="text-base font-medium text-foreground">
                  Informações para contato
                </p>
                <ul className="flex flex-col gap-3">
                  <li>
                    <p className="text-base font-normal text-muted-foreground">
                      Rua Boa Vista, 825
                    </p>
                  </li>
                  <li>
                    <a
                      href="mailto:contact@example.com"
                      className="text-base font-normal text-muted-foreground hover:text-foreground">
                      prodsync@gmail.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+01051923556"
                      className="text-base font-normal text-muted-foreground hover:text-foreground">
                      4002-8922
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" />
          <p
            className="text-sm font-normal text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
            ©2026 ProdSync. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
