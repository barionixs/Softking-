"use client";

import { useState } from "react";
import { WhatsappIcon } from "./icons";

const NAV_LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#blog", label: "Blog" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <a href="#inicio" className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="brand__logo"
            src="/img/logo-softking.png"
            alt="SoftKing Support"
          />
        </a>

        <nav className={`nav${isOpen ? " is-open" : ""}`} id="nav">
          <ul className="nav__links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="btn btn--whatsapp navbar__cta"
          href="https://wa.me/56948917116"
          target="_blank"
          rel="noopener"
        >
          <WhatsappIcon size={18} />
          Contáctanos
        </a>

        <button
          className={`nav-toggle${isOpen ? " is-open" : ""}`}
          id="navToggle"
          aria-label="Abrir menú"
          aria-expanded={isOpen}
          aria-controls="nav"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
