import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidad',
  description: 'Cómo Greenpop Studio recopila, usa y protege tus datos personales.'
}

const ACTUALIZADO = '27 de agosto de 2026'

export default function Privacidad() {
  return (
    <main className="doc">
      <div className="wrap doc-in">
        <Link href="/" className="back">← Volver al inicio</Link>
        <div className="eyebrow">Legales</div>
        <h1>Política de Privacidad</h1>
        <p className="upd">Última actualización: {ACTUALIZADO}</p>

        <p>
          En <strong>Greenpop Studio</strong> respetamos tu privacidad. Esta política explica qué datos recopilamos,
          para qué los usamos y qué derechos tienes. Al usar este sitio y nuestros formularios, aceptas lo aquí descrito.
        </p>

        <h2>1. Qué datos recopilamos</h2>
        <ul>
          <li><strong>Datos que nos das:</strong> nombre, nombre de tu negocio, correo o WhatsApp y el mensaje que escribes cuando llenas el formulario de contacto o agendas una llamada.</li>
          <li><strong>Datos de uso:</strong> información anónima sobre cómo navegas el sitio (páginas vistas, dispositivo, origen), recopilada mediante herramientas de analítica.</li>
        </ul>

        <h2>2. Para qué usamos tus datos</h2>
        <ul>
          <li>Responder tu solicitud y contactarte sobre tu proyecto.</li>
          <li>Enviarte propuestas, presupuestos o seguimiento del servicio.</li>
          <li>Mejorar el sitio y entender qué contenido es útil.</li>
        </ul>
        <p>No vendemos ni alquilamos tus datos personales a terceros.</p>

        <h2>3. Con quién los compartimos</h2>
        <p>
          Solo con proveedores que nos ayudan a operar (analítica, correo o agendamiento), siempre bajo acuerdos que
          protegen tu información. También cuando la ley lo exija.
        </p>

        <h2>4. Cookies y analítica</h2>
        <p>
          Usamos cookies propias y de terceros para que el sitio funcione y para medir su rendimiento de forma anónima.
          Puedes desactivarlas desde tu navegador; algunas funciones podrían verse afectadas.
        </p>

        <h2>5. Cuánto tiempo conservamos tus datos</h2>
        <p>Los conservamos mientras exista una relación comercial o interés legítimo, y luego los eliminamos o anonimizamos.</p>

        <h2>6. Tus derechos</h2>
        <p>Puedes solicitar acceder, corregir o eliminar tus datos, u oponerte a su uso, escribiéndonos. Responderemos en un plazo razonable.</p>

        <h2>7. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas razonables para proteger tus datos. Ningún sistema es 100% infalible, pero trabajamos para mantenerlos seguros.</p>

        <h2>8. Cambios a esta política</h2>
        <p>Podemos actualizar esta política. Publicaremos la versión vigente en esta página con su fecha de actualización.</p>

        <h2>9. Contacto</h2>
        <p>
          ¿Dudas sobre tu privacidad? Escríbenos a <a href="mailto:hola@greenpop.studio">hola@greenpop.studio</a>{' '}
          <em>(reemplaza por tu correo oficial)</em>.
        </p>
      </div>
    </main>
  )
}
