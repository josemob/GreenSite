export default function WhatsAppFab() {
  // Reemplaza el número por tu WhatsApp real: https://wa.me/<código+número>
  return (
    <a
      href="https://wa.me/000000000?text=Hola%20Greenpop%2C%20quiero%20información"
      target="_blank"
      rel="noopener"
      className="wa"
      aria-label="Escríbenos por WhatsApp"
    >
      <i className="dot" /> WhatsApp
    </a>
  )
}
