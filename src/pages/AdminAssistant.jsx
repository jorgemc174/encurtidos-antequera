import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { signOutAdmin, useAdmin } from "../lib/useAdmin";

const button = "px-5 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed";
const historyColumns = "id,request,summary,changes,status,created_at,expires_at,applied_at,undone_at";
const statusLabels = { draft: "Pendiente de confirmar", applied: "Publicado", undone: "Deshecho", cancelled: "Cancelado" };

function Changes({ changes }) {
  return <ul className="space-y-3 mt-4">{changes.map((change, index) => (
    <li key={index} className="rounded-xl border border-[#B78B5A]/30 bg-white p-4 break-words">
      <p className="font-semibold mb-3">{change.label}</p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div><p className="text-sm text-stone-600">Antes</p><p className="whitespace-pre-wrap">{change.before}</p></div>
        <div className="bg-green-50 rounded-lg p-2 -m-1"><p className="text-sm text-green-800">Después</p><p className="font-semibold whitespace-pre-wrap">{change.after}</p></div>
      </div>
    </li>
  ))}</ul>;
}

export default function AdminAssistant() {
  const { isAdmin, loading, error: accessError } = useAdmin();
  const [prompt, setPrompt] = useState("");
  const [scope, setScope] = useState("all");
  const [proposal, setProposal] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [undoTarget, setUndoTarget] = useState(null);
  const [tab, setTab] = useState("request");
  const [confirmed, setConfirmed] = useState(false);
  const resultRef = useRef(null);
  const busyRef = useRef(false);

  const loadHistory = async () => {
    const { data, error: readError } = await supabase.from("ai_change_proposals").select(historyColumns).order("created_at", { ascending: false }).limit(30);
    if (readError) setHistoryError("No se ha podido cargar el historial. Comprueba la conexión y la instalación del asistente.");
    else { setHistory(data); setHistoryError(""); }
  };
  useEffect(() => { if (isAdmin) void loadHistory(); }, [isAdmin]);
  useEffect(() => { if (proposal || message || error || undoTarget) resultRef.current?.focus(); }, [proposal, message, error, undoTarget]);

  const prepare = async (event) => {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy("prepare"); setError(""); setMessage(""); setProposal(null); setConfirmed(false);
    try {
      const { data, error: functionError } = await supabase.functions.invoke("admin-assistant", { body: { prompt, scope } });
      if (functionError) {
        let detail;
        try { detail = await functionError.context?.json(); } catch { /* Sin respuesta JSON. */ }
        throw new Error(detail?.error || "No se ha podido conectar con el asistente. Comprueba la conexión y que esté activado en Supabase.");
      }
      if (data?.error) throw new Error(data.error);
      if (data?.proposal) setProposal(data.proposal);
      else setMessage(data?.message || "No hay cambios que proponer.");
      await loadHistory();
    } catch (failure) { setError(failure.message); }
    finally { setBusy(""); busyRef.current = false; }
  };

  const apply = async (target, action) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(action); setError(""); setMessage("");
    try {
      const { error: applyError } = await supabase.rpc("apply_ai_proposal", { p_id: target.id, p_action: action });
      if (applyError) throw new Error(applyError.message || "No se ha podido completar la operación.");
      if (action !== "cancel") {
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith("encurtidos_menu_") || key.startsWith("encurtidos_home_")) localStorage.removeItem(key);
        }
      }
      setProposal(null); setUndoTarget(null); setConfirmed(false);
      setMessage(action === "apply" ? "Cambios publicados. Ya puedes verlos en la web." : action === "undo" ? "Cambios deshechos. Se ha recuperado la versión anterior." : "Propuesta cancelada. No se ha cambiado nada.");
      await loadHistory();
    } catch (failure) { setError(`${failure.message} Si se perdió la conexión, consulta el historial para comprobar el estado antes de repetir.`); }
    finally { setBusy(""); busyRef.current = false; }
  };

  if (loading) return <main className="p-8 text-xl" role="status">Comprobando acceso…</main>;
  if (!isAdmin) return <Navigate to="/admin" replace />;
  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex flex-wrap gap-3 justify-between items-center mb-7">
          <Link to="/" className={`${button} bg-white border`}>Ver la web</Link>
          <button disabled={!!busy} onClick={signOutAdmin} className="underline p-3">Cerrar sesión</button>
        </header>
        <h1 className="text-3xl md:text-4xl font-bold">¿Qué quieres cambiar?</h1>
        <p className="text-lg mt-3 mb-6">Escríbelo con tus palabras. Primero verás una propuesta y después podrás confirmarla.</p>
        <nav aria-label="Administración" className="flex gap-2 mb-6">
          <button aria-current={tab === "request" ? "page" : undefined} disabled={!!busy} onClick={() => { setTab("request"); setUndoTarget(null); }} className={`${button} ${tab === "request" ? "bg-[#4E3B2A] text-white" : "bg-white border"}`}>Pedir cambios</button>
          <button aria-current={tab === "history" ? "page" : undefined} disabled={!!busy} onClick={() => { setTab("history"); void loadHistory(); }} className={`${button} ${tab === "history" ? "bg-[#4E3B2A] text-white" : "bg-white border"}`}>Historial</button>
        </nav>
        {tab === "request" && <form onSubmit={prepare} className="bg-white p-5 md:p-7 rounded-2xl space-y-5 shadow-sm">
          <label className="block text-lg font-semibold">Dónde quieres hacer los cambios
            <select disabled={!!busy || !!proposal} value={scope} onChange={(e) => setScope(e.target.value)} className="block w-full mt-2 border p-3 rounded-xl font-normal">
              <option value="all">Toda la web / varios puestos</option><option value="Carta - Gáldar">Solo Gáldar</option><option value="Carta - Telde">Solo Telde</option><option value="Carta - Las Palmas">Solo Las Palmas / Puerto</option><option value="home">Página de inicio y horarios</option>
            </select>
          </label>
          <label className="block text-lg font-semibold" htmlFor="change-request">Qué quieres cambiar</label>
          <textarea id="change-request" disabled={!!busy || !!proposal} required minLength={5} maxLength={3000} rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Por ejemplo: pon la caña a 1,80 € solo en Gáldar y la copa a 2,40 € en todos los puestos." className="block w-full border rounded-xl p-4 text-lg leading-relaxed" />
          <p className="text-stone-600">Puedes pedir cambios de precios, nombres, textos y horarios. Las fotos y los productos nuevos se siguen editando desde la web.</p>
          {!proposal && <button disabled={!!busy || prompt.trim().length < 5} className={`${button} bg-[#4E3B2A] text-white w-full`}>{busy === "prepare" ? "Preparando propuesta… Puede tardar un minuto" : "Ver propuesta de cambios"}</button>}
        </form>}
        <div ref={resultRef} tabIndex={-1} className="outline-none mt-5" aria-live="polite" aria-busy={!!busy}>
          {(error || accessError) && <p role="alert" className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200">{error || accessError}</p>}
          {message && <p role="status" className="p-4 rounded-xl bg-green-50 text-green-900 border border-green-200 text-lg">{message}</p>}
          {tab === "request" && proposal && <section className="mt-5 rounded-2xl border-2 border-[#B78B5A] p-5">
            <h2 className="text-2xl font-bold">Revisa antes de publicar</h2><p className="mt-2">{proposal.summary}</p>
            <p className="mt-2">{proposal.changes.length} campos. Válida hasta las {new Date(proposal.expires_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}.</p>
            <Changes changes={proposal.changes} />
            <label className="flex gap-3 items-start my-5 text-lg"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={!!busy} className="w-6 h-6 shrink-0 mt-1" />He revisado los cambios y los puestos afectados.</label>
            <div className="flex flex-wrap gap-3"><button disabled={!!busy || !confirmed} onClick={() => apply(proposal, "apply")} className={`${button} bg-[#47621b] text-white`}>{busy === "apply" ? "Publicando…" : "Confirmar y publicar"}</button><button disabled={!!busy} onClick={() => apply(proposal, "cancel")} className={`${button} bg-white border`}>Cancelar / corregir petición</button></div>
          </section>}
          {tab === "history" && undoTarget && <section className="my-5 rounded-2xl border-2 border-[#B78B5A] p-5">
            <h2 className="text-2xl font-bold">Revisa lo que vas a deshacer</h2>
            <Changes changes={undoTarget.changes.map((change) => ({ ...change, before: change.after, after: change.before }))} />
            <p className="my-4">Si ha habido otra edición en esos documentos, se detendrá la operación para no perderla.</p>
            <button disabled={!!busy} onClick={() => apply(undoTarget, "undo")} className={`${button} bg-[#4E3B2A] text-white`}>Confirmar deshacer</button><button disabled={!!busy} onClick={() => setUndoTarget(null)} className={`${button} underline`}>Cancelar</button>
          </section>}
        </div>
        {tab === "history" && <section className="mt-5 space-y-4">
          <h2 className="text-2xl font-bold">Tus últimas 30 propuestas</h2>
          {historyError && <p role="alert">{historyError}</p>}
          {!history.length && !historyError && <p>Aún no hay propuestas guardadas.</p>}
          {history.map((entry) => <article key={entry.id} className="bg-white border rounded-2xl p-5">
            <p className="text-sm text-stone-600">{new Date(entry.created_at).toLocaleString("es-ES")} · {statusLabels[entry.status]}</p>
            <p className="text-lg font-semibold my-2">{entry.request}</p>
            <details><summary className="cursor-pointer py-3">Ver {entry.changes.length} cambios</summary><Changes changes={entry.changes} /></details>
            {entry.status === "applied" && <button disabled={!!busy} onClick={() => { setUndoTarget(entry); setError(""); setMessage(""); }} className={`${button} border mt-3`}>Deshacer estos cambios</button>}
            {entry.status === "draft" && Date.parse(entry.expires_at) > Date.now() && <button disabled={!!busy || !!proposal} onClick={() => { setProposal(entry); setConfirmed(false); setPrompt(entry.request); setTab("request"); setError(""); setMessage(""); }} className={`${button} border mt-3`}>Revisar propuesta pendiente</button>}
          </article>)}
        </section>}
      </div>
    </main>
  );
}
