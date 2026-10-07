export default function ResumePage() {
  return (
    <main className="view page active show" id="resumeView">
      <div className="doc">
        <div className="doc-row">
          <div className="doc-label">EDUCATION</div>
          <div className="doc-body">
            <p>Technical University of Cluj-Napoca, Romania</p>
            <p className="sub">Architecture, fifth year</p>
          </div>
        </div>

        <div className="doc-row">
          <div className="doc-label">ERASMUS</div>
          <div className="doc-body">
            <p>Roma Tre University, Rome, Italy</p>
            <p>Polytechnic University of Cartagena, Spain</p>
          </div>
        </div>

        <div className="doc-row">
          <div className="doc-label">EXPERIENCE</div>
          <div className="doc-body">
            <p>Maiatec</p>
          </div>
        </div>

        <div className="doc-row">
          <div className="doc-label">SKILLS</div>
          <div className="doc-body">
            <p>AutoCAD, Revit, SketchUp, Rhinoceros, Adobe Photoshop, Illustrator and InDesign, hand drawing and model making</p>
          </div>
        </div>

        <div className="doc-row">
          <div className="doc-label">LANGUAGES</div>
          <div className="doc-body">
            <p>Romanian, Italian, Spanish, English</p>
          </div>
        </div>

        <div className="doc-row">
          <div className="doc-label">FULL CV</div>
          <div className="doc-body">
            <a href="/andreea-halip-cv.pdf" className="hot-target">DOWNLOAD PDF</a>
          </div>
        </div>
      </div>
    </main>
  );
}
