export default function ContactPage() {
  return (
    <main className="view page active show" id="contactView">
      <div className="doc">
        <div className="doc-row">
          <div className="doc-label">EMAIL</div>
          <div className="doc-body">
            <a href="mailto:andreeahalip5@gmail.com" className="hot-target">andreeahalip5@gmail.com</a>
          </div>
        </div>

        <div className="doc-row">
          <div className="doc-label">PHONE</div>
          <div className="doc-body">
            <a href="tel:+40743895806" className="hot-target">0743 895 806</a>
          </div>
        </div>
      </div>
    </main>
  );
}
