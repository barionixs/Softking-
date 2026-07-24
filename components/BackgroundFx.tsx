export function BackgroundFx() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <div className="bg-fx__photo"></div>
      <div className="bg-fx__scrim"></div>
      <pre className="code-snippet code-snippet--1">{`<header>
  <nav>
    <div class="logo">SoftKing</div>
    <ul class="nav-links">
      <li><a href="#servicios">Servicios</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
  </nav>
</header>`}</pre>
      <pre className="code-snippet code-snippet--2">{`.logo {
  font-size: 24px;
  font-weight: bold;
}
.hero {
  background-image: url(...);
  background-size: cover;
}`}</pre>
    </div>
  );
}
