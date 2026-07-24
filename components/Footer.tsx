import { InstagramIcon, WhatsappIcon } from "./icons";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a href="#inicio" className="brand brand--footer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand__logo"
            src="/img/logo-softking.png"
            alt="SoftKing Support"
          />
        </a>

        <div className="footer__links">
          <a
            href="https://instagram.com/_softking"
            target="_blank"
            rel="noopener"
          >
            <InstagramIcon size={18} />
            Instagram · @_softking
          </a>
          <a href="https://wa.me/56948917116" target="_blank" rel="noopener">
            <WhatsappIcon size={18} />
            WhatsApp · +56 9 4891 7116
          </a>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} SoftKing. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
