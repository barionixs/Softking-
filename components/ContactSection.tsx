import { InstagramIcon, WhatsappIcon } from "./icons";

export function ContactSection() {
  return (
    <section id="contacto" className="section section--contact">
      <div className="container contact">
        <p className="section__eyebrow">Hablemos</p>
        <h2 className="section__title">
          ¿Tienes un proyecto o un equipo con problemas?
        </h2>
        <p className="contact__desc">
          Escríbenos y te respondemos directo por WhatsApp.
        </p>

        <div className="contact__actions">
          <a
            className="btn btn--whatsapp btn--lg"
            href="https://wa.me/56948917116"
            target="_blank"
            rel="noopener"
          >
            <WhatsappIcon size={20} />
            +56 9 4891 7116
          </a>
          <a
            className="btn btn--ghost btn--lg"
            href="https://instagram.com/_softking"
            target="_blank"
            rel="noopener"
          >
            <InstagramIcon size={18} />
            /_softking
          </a>
        </div>
      </div>
    </section>
  );
}
