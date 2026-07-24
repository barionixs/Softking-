const SERVICES = [
  {
    badge: "01",
    title: "Soporte técnico",
    items: [
      "Antivirus y seguridad",
      "Formateo de PC",
      "Instalación de Office 365",
      "Mantenimiento general",
    ],
    linkLabel: "Solicitar soporte →",
  },
  {
    badge: "02",
    title: "Desarrollo web",
    items: [
      "Sitios corporativos",
      "Landing pages",
      "Web para restaurantes",
      "Web inmobiliaria",
      "Sitios informativos",
    ],
    linkLabel: "Cotizar sitio web →",
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="section">
      <div className="container">
        <p className="section__eyebrow">Lo que hacemos</p>
        <h2 className="section__title">Nuestros servicios</h2>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <article className="service-panel" key={service.badge}>
              <div className="service-panel__head">
                <span className="service-panel__badge">{service.badge}</span>
                <h3>{service.title}</h3>
              </div>
              <ul className="service-panel__list">
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                className="service-panel__link"
                href="https://wa.me/56948917116"
                target="_blank"
                rel="noopener"
              >
                {service.linkLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
