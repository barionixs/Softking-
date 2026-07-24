const BLOG_POSTS = [
  {
    img: "/img/blog/bsod.jpg",
    alt: "Pantalla azul de Windows (BSOD)",
    tag: "Hardware / Software",
    date: "10 jul 2026",
    title: "Pantalla azul (BSOD): ¿cuándo preocuparte?",
    excerpt:
      "Si es un caso aislado, no es grave. Si se repite, es una señal de alarma.",
    body: "Causas típicas: drivers desactualizados, RAM defectuosa o sobrecalentamiento. Si se repite en varios días, actualiza drivers, revisa temperaturas y respalda tus archivos.",
  },
  {
    img: "/img/blog/slow-pc.jpg",
    alt: "Persona frustrada frente a un computador lento",
    tag: "Software",
    date: "02 jul 2026",
    title: "Tu PC arranca cada vez más lento",
    excerpt:
      'No es que "el equipo ya está viejo": casi siempre hay una causa puntual.',
    body: "Suele deberse a demasiados programas al inicio, disco casi lleno o malware en segundo plano. Revisar el administrador de tareas y limpiar lo innecesario devuelve la velocidad sin gastar en hardware.",
  },
  {
    img: "/img/blog/no-power.jpg",
    alt: "Interior de un computador de escritorio abierto",
    tag: "Hardware",
    date: "24 jun 2026",
    title: "Tu equipo no enciende: primeros pasos",
    excerpt:
      "Antes de entrar en pánico, descarta las causas más simples y comunes.",
    body: "Revisa cable, enchufe y fuente de poder, y en notebooks el cargador o batería. Si nada funciona, probablemente sea una falla interna que requiere revisión técnica.",
  },
  {
    img: "/img/blog/wifi.jpg",
    alt: "Router WiFi sobre fondo amarillo",
    tag: "Redes",
    date: "15 jun 2026",
    title: "WiFi que se cae a cada rato",
    excerpt: "Casi nunca es el proveedor: suele estar en el router o su ubicación.",
    body: "Interferencia, firmware desactualizado o mala ubicación son las causas más comunes. Reiniciar el router, actualizar su firmware y alejarlo de muros gruesos resuelve la mayoría de los cortes.",
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="section">
      <div className="container">
        <p className="section__eyebrow">Blog técnico</p>
        <h2 className="section__title">Fallas comunes y sus causas</h2>
        <p className="section__desc">
          Guías rápidas para reconocer, entender y solucionar los problemas
          más frecuentes en equipos, redes y sitios web.
        </p>

        <div className="blog-grid">
          {BLOG_POSTS.map((post) => (
            <article className="blog-card" key={post.title}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="blog-card__img"
                src={post.img}
                alt={post.alt}
                loading="lazy"
              />
              <div className="blog-card__body">
                <div className="blog-card__head">
                  <span className="blog-card__tag">{post.tag}</span>
                  <span className="blog-card__date">{post.date}</span>
                </div>
                <h3 className="blog-card__title">{post.title}</h3>
                <p className="blog-card__excerpt">{post.excerpt}</p>
                <details className="blog-card__details">
                  <summary>Leer más</summary>
                  <p>{post.body}</p>
                </details>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
