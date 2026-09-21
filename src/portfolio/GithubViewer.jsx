import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BookOpen, Code2, ExternalLink, FileCode2, LoaderCircle } from "lucide-react";
import { decodeGithubContent, parseGithubUrl } from "./utils.js";

const supportedExtensions = [".ipynb", ".sql", ".py"];

function isSupported(path = "", kind = "") {
  const lower = path.toLowerCase();
  if (kind === "Python") return lower.endsWith(".ipynb") || lower.endsWith(".py");
  if (kind === "SQL") return lower.endsWith(".sql");
  return supportedExtensions.some((extension) => lower.endsWith(extension));
}

function filePriority(path = "") {
  const lower = path.toLowerCase();
  if (lower.endsWith(".ipynb")) return 0;
  if (lower.endsWith(".sql")) return 1;
  if (lower.endsWith(".py")) return 2;
  if (lower.endsWith("readme.md")) return 3;
  if (lower.endsWith(".md")) return 4;
  return 5;
}

function CodeBlock({ value, language }) {
  const lines = `${value || ""}`.replace(/\n$/, "").split("\n");
  return (
    <div className="code-block" data-language={language || "text"}>
      <div className="code-block-label">{language || "text"}</div>
      <pre>{lines.map((line, index) => <span className="code-line" key={`${index}-${line.slice(0, 20)}`}><span className="line-number">{index + 1}</span><code>{line || " "}</code></span>)}</pre>
    </div>
  );
}

function Notebook({ source }) {
  const notebook = useMemo(() => {
    try {
      return JSON.parse(source);
    } catch {
      return null;
    }
  }, [source]);

  if (!notebook) return <CodeBlock value={source} language="json" />;

  const codeCells = (notebook.cells || []).filter((cell) => cell.cell_type === "code");
  if (!codeCells.length) return <div className="viewer-empty"><p>This notebook does not contain code cells.</p></div>;

  return (
    <div className="notebook-view">
      {codeCells.map((cell, index) => {
        const cellSource = Array.isArray(cell.source) ? cell.source.join("") : cell.source || "";
        return (
          <div className="notebook-cell" key={index}>
            <span className="cell-prompt">In [{cell.execution_count ?? " "}]</span>
            <CodeBlock value={cellSource} language="python" />
          </div>
        );
      })}
    </div>
  );
}

export default function GithubViewer({ url, title, kind = "", compactHeader = false }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [source, setSource] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingSource, setLoadingSource] = useState(false);
  const [error, setError] = useState("");
  const parsed = useMemo(() => parseGithubUrl(url), [url]);

  useEffect(() => {
    let active = true;

    async function discoverFiles() {
      if (!parsed) throw new Error("This GitHub URL could not be parsed.");
      setFiles([]);
      setSelectedFile(null);
      setSource("");
      setLoadingFiles(true);
      setError("");

      const repositoryResponse = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
      if (!repositoryResponse.ok) throw new Error("GitHub temporarily blocked the repository preview. Use the repository link instead.");
      const repository = await repositoryResponse.json();
      const branch = parsed.branch || repository.default_branch || "main";

      if (parsed.directFile && parsed.path) {
        if (!isSupported(parsed.path, kind)) throw new Error(`This link does not point to a previewable ${kind || "code"} file.`);
        const onlyFile = { path: parsed.path, branch };
        if (active) {
          setFiles([onlyFile]);
          setSelectedFile(onlyFile);
        }
        return;
      }

      const treeResponse = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
      if (!treeResponse.ok) throw new Error("Could not read this repository tree from GitHub.");
      const tree = await treeResponse.json();
      const prefix = parsed.path ? `${parsed.path.replace(/\/$/, "")}/` : "";
      const discovered = (tree.tree || [])
        .filter((item) => item.type === "blob" && isSupported(item.path, kind))
        .filter((item) => !prefix || item.path === parsed.path || item.path.startsWith(prefix))
        .sort((a, b) => filePriority(a.path) - filePriority(b.path) || a.path.localeCompare(b.path))
        .slice(0, 80)
        .map((item) => ({ path: item.path, branch, size: item.size }));

      if (!discovered.length) throw new Error(`No previewable ${kind || "code"} files were found in this repository path.`);
      if (active) {
        setFiles(discovered);
        setSelectedFile(discovered[0]);
      }
    }

    discoverFiles().catch((fetchError) => active && setError(fetchError.message)).finally(() => active && setLoadingFiles(false));
    return () => { active = false; };
  }, [parsed, kind]);

  useEffect(() => {
    let active = true;
    async function loadFile() {
      if (!selectedFile || !parsed) return;
      setLoadingSource(true);
      setError("");
      const endpoint = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/contents/${selectedFile.path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(selectedFile.branch)}`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("This file could not be previewed. It may be too large for the GitHub API.");
      const payload = await response.json();
      let fileSource = payload.content ? decodeGithubContent(payload.content) : "";
      if (!fileSource && payload.download_url) {
        const rawResponse = await fetch(payload.download_url);
        if (rawResponse.ok) fileSource = await rawResponse.text();
      }
      if (!fileSource) throw new Error("GitHub did not return previewable file content.");
      if (active) setSource(fileSource);
    }

    loadFile().catch((fetchError) => active && setError(fetchError.message)).finally(() => active && setLoadingSource(false));
    return () => { active = false; };
  }, [selectedFile, parsed]);

  const isNotebook = selectedFile?.path?.toLowerCase().endsWith(".ipynb");
  const language = selectedFile?.path?.split(".").pop();

  return (
    <div className={compactHeader ? "github-viewer github-viewer-embedded" : "github-viewer"}>
      {!compactHeader && <div className="viewer-toolbar">
        <div><Code2 size={19} /><div><strong>Repository viewer</strong><span>{title}</span></div></div>
        <a href={url} target="_blank" rel="noreferrer">Open on GitHub <ExternalLink size={15} /></a>
      </div>}
      <div className="github-viewer-body">
        <aside className="file-browser">
          <span className="file-browser-title">Project files</span>
          {loadingFiles && <div className="viewer-loading"><LoaderCircle className="spin" size={18} /> Finding files</div>}
          {files.map((file) => (
            <button className={selectedFile?.path === file.path ? "file-button active" : "file-button"} type="button" key={file.path} onClick={() => setSelectedFile(file)} title={file.path}>
              {file.path.endsWith(".ipynb") ? <BookOpen size={15} /> : <FileCode2 size={15} />}
              <span>{file.path.split("/").pop()}</span>
            </button>
          ))}
        </aside>
        <div className="file-preview">
          <div className="file-preview-head"><span>{selectedFile?.path || "Select a file"}</span>{selectedFile?.size ? <small>{Math.round(selectedFile.size / 1024)} KB</small> : null}</div>
          {loadingSource && <div className="viewer-empty"><LoaderCircle className="spin" size={28} /><p>Loading file from GitHub…</p></div>}
          {!loadingSource && error && <div className="viewer-empty viewer-error"><AlertCircle size={28} /><p>{error}</p><a className="button button-small" href={url} target="_blank" rel="noreferrer">Open repository <ExternalLink size={15} /></a></div>}
          {!loadingSource && !error && source && (isNotebook ? <Notebook source={source} /> : <CodeBlock value={source} language={language} />)}
        </div>
      </div>
    </div>
  );
}
