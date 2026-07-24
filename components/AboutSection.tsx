const CLIENT_IMAGES = [
  {
    src: "/img/about/clientes-1.jpg",
    alt: "Equipo de trabajo en oficina con múltiples pantallas",
  },
  {
    src: "/img/about/clientes-2.jpg",
    alt: "Desarrollador trabajando en notebook con código en pantalla",
  },
  {
    src: "/img/about/clientes-3.jpg",
    alt: "Manos escribiendo en teclado frente a monitor",
  },
];

export function AboutSection() {
  return (
    <section id="nosotros" className="section section--alt">
      <div className="container about">
        <div className="about__text">
          <p className="section__eyebrow">Quiénes somos</p>
          <h2 className="section__title">SoftKing</h2>
          <p className="section__desc">
            Somos un equipo profesional independiente especializado en
            soporte técnico integral de hardware y software, con
            experiencia en el mantenimiento, reparación e instalación de
            equipos informáticos, pantallas y servidores. Ofrecemos
            soluciones tecnológicas adaptadas a las necesidades de cada
            cliente, combinando conocimiento técnico y atención
            personalizada en cada servicio.
          </p>
          <p className="section__desc">
            Nuestro compromiso es brindar un soporte confiable y eficiente,
            ya sea para la reparación de un equipo, el mantenimiento
            preventivo de tu infraestructura tecnológica, o la venta e
            instalación de nuevos sistemas. Trabajamos con seriedad,
            puntualidad y un enfoque orientado a resolver los problemas de
            manera efectiva y duradera.
          </p>
        </div>
        <div className="about__stats">
          {CLIENT_IMAGES.map((img) => (
            <div className="stat stat--img" key={img.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
