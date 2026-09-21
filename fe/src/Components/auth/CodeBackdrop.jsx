const CodeBackdrop = () => (
  <div className="auth-code-scene" aria-hidden="true">
    <div className="code-orb code-orb-one" />
    <div className="code-orb code-orb-two" />
    <div className="code-panel code-panel-left">
      <div className="code-panel-bar"><span /><span /><span /><em>portfolio.tsx</em></div>
      <code>
        <span className="code-line"><i>01</i><b>const</b> profile = {'{'}</span>
        <span className="code-line code-indent"><i>02</i>name: <strong>{"'Kabano Festo'"}</strong>,</span>
        <span className="code-line code-indent"><i>03</i>role: <strong>{"'Developer'"}</strong>,</span>
        <span className="code-line code-indent"><i>04</i>status: <mark>available</mark>,</span>
        <span className="code-line"><i>05</i>{'}'};</span>
      </code>
    </div>
    <div className="code-panel code-panel-right">
      <div className="code-panel-bar"><span /><span /><span /><em>workspace.json</em></div>
      <code>
        <span className="code-line"><i>01</i>{'{'}</span>
        <span className="code-line code-indent"><i>02</i><b>{'"build"'}</b>: <strong>{'"better"'}</strong>,</span>
        <span className="code-line code-indent"><i>03</i><b>{'"ship"'}</b>: <mark>true</mark></span>
        <span className="code-line"><i>04</i>{'}'}</span>
      </code>
    </div>
    <div className="code-status"><span />SYSTEM_READY <b>•</b> SECURE_ACCESS</div>
  </div>
);

export default CodeBackdrop;
