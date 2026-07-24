import { InstagramIcon, WhatsappIcon } from "./icons";

const HIGHLIGHTS = [
  {
    title: "Respuesta rápida",
    desc: "Te contestamos por WhatsApp al tiro, sin tickets ni esperas eternas.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    title: "Remoto o presencial",
    desc: "Solucionamos tu problema donde estés, en línea o cara a cara.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Precios claros",
    desc: "Sin letra chica ni sorpresas en la boleta. Sabes lo que pagas antes de partir.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.57 3.2L4 3a1 1 0 0 0-1 1l.2 5.57a2 2 0 0 0 .63 1.43l9.58 9.58a2 2 0 0 0 2.82 0l4.36-4.36a2 2 0 0 0 0-2.82z" />
        <circle cx="7.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Atención directa",
    desc: "Hablas con quien te va a ayudar, no con un call center.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1-4.5A8 8 0 1 1 21 12z" />
      </svg>
    ),
  },
];

export function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero__inner">
        <p className="eyebrow">Soporte técnico &amp; desarrollo web</p>
        <h1 className="hero__title">
          SERVICIOS
          <br />
          DIGITALES
        </h1>
        <p className="hero__subtitle">PARA EMPRESAS Y EMPRENDEDORES</p>

        <p className="hero__desc">
          Mantenemos tus equipos funcionando y llevamos tu negocio a
          internet. Soporte TI y sitios web hechos a medida, con atención
          directa por WhatsApp.
        </p>

        <div className="hero__actions">
          <a
            className="btn btn--whatsapp"
            href="https://wa.me/56948917116"
            target="_blank"
            rel="noopener"
          >
            <WhatsappIcon size={20} />
            Cotiza por WhatsApp
          </a>
          <a
            className="btn btn--ghost"
            href="https://instagram.com/_softking"
            target="_blank"
            rel="noopener"
          >
            <InstagramIcon size={18} />
            @_softking
          </a>
        </div>

        <div className="highlights">
          {HIGHLIGHTS.map((item) => (
            <div className="highlight-card" key={item.title}>
              <div className="highlight-card__icon">{item.icon}</div>
              <h3 className="highlight-card__title">{item.title}</h3>
              <p className="highlight-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
