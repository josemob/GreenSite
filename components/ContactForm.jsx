'use client'

export default function ContactForm() {
  // TODO: conectar a un servicio de envío (Formspree, un endpoint propio, etc.)
  function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div>
        <label>Nombre</label>
        <input type="text" placeholder="Tu nombre" />
      </div>
      <div>
        <label>Negocio</label>
        <input type="text" placeholder="Nombre de tu negocio" />
      </div>
      <div>
        <label>WhatsApp o email</label>
        <input type="text" placeholder="Para contactarte" />
      </div>
      <div>
        <label>¿Qué necesitas?</label>
        <select defaultValue="Aún no lo sé">
          <option>Aún no lo sé</option>
          <option>Landing Page</option>
          <option>Web Corporativa</option>
          <option>Tienda / Portal</option>
          <option>App Móvil</option>
        </select>
      </div>
      <button className="btn btn-accent" type="submit">Quiero que me contacten</button>
      <p className="fine">Te respondemos el mismo día · Sin compromiso</p>
    </form>
  )
}
