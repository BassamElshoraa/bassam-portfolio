import { useEffect, useMemo, useState } from "react";
import { Code2, Download, ExternalLink, RefreshCw, Save, Search } from "lucide-react";

export default function SourceEditor({ mode, listSourceFiles, readSourceFile, saveSourceFile }) {
  const [files, setFiles] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [draft, setDraft] = useState("");
  const [original, setOriginal] = useState("");
  const [sha, setSha] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const dirty = draft !== original;
  const visibleFiles = useMemo(() => files.filter((file) => file.path.toLowerCase().includes(filter.toLowerCase())), [files, filter]);

  useEffect(() => {
    let active = true;
    listSourceFiles().then((items) => { if (active) setFiles(items); }).catch((error) => { if (active) setMessage(error.message); });
    return () => { active = false; };
  }, [listSourceFiles]);

  const openFile = async (path, force = false) => {
    if (dirty && !force && !window.confirm("Discard your unsaved changes to this file?")) return;
    setBusy(true);
    setMessage("");
    try {
      const file = await readSourceFile(path);
      setSelectedPath(file.path);
      setOriginal(file.content);
      setDraft(file.content);
      setSha(file.sha);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!selectedPath || !dirty || busy) return;
    if (!window.confirm(`Publish your edits to ${selectedPath}? A code error could stop the next site build. Your current published version remains until a build succeeds.`)) return;
    setBusy(true);
    setMessage("");
    try {
      const file = await saveSourceFile(selectedPath, draft, sha);
      setOriginal(file.content);
      setDraft(file.content);
      setSha(file.sha);
      setMessage(mode === "remote" ? "Source committed to GitHub. Check the Pages build before considering this change live." : "Source saved to the local project.");
    } catch (error) {
      setMessage(`Not saved: ${error.message}`);
    } finally {
      setBusy(false);
    }
  };

  const downloadOriginal = () => {
    const objectUrl = URL.createObjectURL(new Blob([original], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = selectedPath.split("/").pop() || "portfolio-source.txt";
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  };

  return <section className="admin-section form-section source-workspace">
    <div className="admin-section-head"><div><span className="eyebrow">Advanced editor</span><h2>Site source</h2><p>Edit layout, components, and styles from this dashboard. Use Presentation for everyday changes; source edits are for changes to the website itself.</p></div><a className="button button-ghost button-small" href="https://github.com/BassamElshoraa/bassam-portfolio/actions" target="_blank" rel="noreferrer">Publishing status <ExternalLink size={15} /></a></div>
    <div className="source-workspace-grid">
      <aside className="source-file-list"><label className="search-box"><Search size={17} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Find a file" /></label><div role="listbox" aria-label="Editable source files">{visibleFiles.map((file) => <button type="button" className={file.path === selectedPath ? "active" : ""} key={file.path} onClick={() => openFile(file.path)} role="option" aria-selected={file.path === selectedPath}><Code2 size={15} /><span>{file.path}</span></button>)}</div><small>{files.length} editable text files. Images and content have their own sections.</small></aside>
      <div className="source-editor-panel">
        {selectedPath ? <><div className="source-editor-toolbar"><div><strong>{selectedPath}</strong><span>{dirty ? "Unsaved changes" : "Up to date"} · {draft.split("\n").length} lines</span></div><div><button className="button button-ghost button-small" type="button" onClick={downloadOriginal} disabled={busy} title="Download the version you opened"><Download size={15} /> Backup</button><button className="button button-ghost button-small" type="button" onClick={() => openFile(selectedPath, true)} disabled={busy}><RefreshCw size={15} /> Reload</button><button className="button button-small" type="button" onClick={save} disabled={busy || !dirty}><Save size={15} /> {busy ? "Working…" : "Publish file"}</button></div></div><textarea className="source-code-editor" spellCheck="false" aria-label={`${selectedPath} source code`} value={draft} onChange={(event) => setDraft(event.target.value)} disabled={busy} /></> : <div className="source-empty">Choose a file to view and edit its source. Your changes are not saved until you publish that file.</div>}
        {message && <p className="source-message" role="status">{message}</p>}
      </div>
    </div>
    <p className="admin-help">Before editing code, download the original file with Backup. Make one source change at a time and confirm the GitHub Pages build succeeds. A source edit changes the repository; it cannot be previewed in the published site before saving.</p>
  </section>;
}
