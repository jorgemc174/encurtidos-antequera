import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase.js";

const identity = (value) => value;
const clone = (value) => JSON.parse(JSON.stringify(value));
export const CONTENT_CACHE_VERSION = "encurtidos-content-cache-v2";

export function ensureContentCacheVersion() {
  if (typeof localStorage === "undefined") return;
  const current = localStorage.getItem("encurtidos_content_cache_version");
  if (current === CONTENT_CACHE_VERSION) return;
  const keys = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (key) keys.push(key);
  }
  for (const key of keys) {
    if (key.startsWith("encurtidos_menu_") || key.startsWith("encurtidos_home_") || key === "encurtidos_destacados_items") {
      localStorage.removeItem(key);
    }
  }
  localStorage.setItem("encurtidos_content_cache_version", CONTENT_CACHE_VERSION);
}

// Leer nunca guarda. Solo una edición explícita del administrador inicia una
// escritura; el servidor compara con la última versión que este editor leyó.
export function useContentDocument({ table, documentKey, storageKey, fallback, isAdmin, normalize = identity, serialize = identity }) {
  const options = useRef({ fallback, normalize, serialize });
  const [data, setData] = useState(() => {
    ensureContentCacheVersion();
    try {
      const saved = localStorage.getItem(storageKey);
      return normalize(saved ? JSON.parse(saved) : clone(fallback));
    } catch { return clone(fallback); }
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const remote = useRef(null);
  const revision = useRef(0);
  const queuedRevision = useRef(0);
  const queue = useRef(Promise.resolve());
  const blocked = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    let cancelled = false;
    alive.current = true;
    const keyColumn = table === "menu_json" ? "location" : "section";
    (async () => {
      const { data: row, error: readError } = await supabase.from(table).select("data").eq(keyColumn, documentKey).maybeSingle();
      if (cancelled) return;
      if (readError) {
        setError("No se han podido cargar los datos actuales. Recarga la página antes de editar.");
        return;
      }
      remote.current = row?.data ?? null;
      const loaded = options.current.normalize(row?.data ?? clone(options.current.fallback));
      setData(loaded);
      localStorage.setItem(storageKey, JSON.stringify(options.current.serialize(loaded)));
      setReady(true);
    })();
    return () => { cancelled = true; alive.current = false; };
  }, [table, documentKey, storageKey]);

  const edit = useCallback((update) => {
    if (!isAdmin || !ready || blocked.current) return;
    revision.current++;
    setData((previous) => typeof update === "function" ? update(previous) : update);
  }, [isAdmin, ready]);

  useEffect(() => {
    if (!ready || !isAdmin || revision.current === queuedRevision.current) return;
    queuedRevision.current = revision.current;
    const value = clone(options.current.serialize(data));
    localStorage.setItem(storageKey, JSON.stringify(value));
    queue.current = queue.current.then(async () => {
      if (blocked.current || JSON.stringify(value) === JSON.stringify(remote.current)) return;
      if (alive.current) setSaving(true);
      const { error: writeError } = await supabase.rpc("save_content_document", {
        p_table: table, p_key: documentKey, p_before: remote.current, p_after: value,
      });
      if (writeError) {
        blocked.current = true;
        if (alive.current) setError("No se ha guardado esta edición. Puede haber cambios en otra ventana o un problema de conexión. Copia tu texto y recarga la página.");
      } else {
        remote.current = value;
        if (alive.current) setError("");
      }
      if (alive.current) setSaving(false);
    }).catch(() => {
      blocked.current = true;
      if (alive.current) { setSaving(false); setError("No se ha guardado esta edición. Copia tu texto y recarga la página."); }
    });
  }, [data, ready, isAdmin, table, documentKey, storageKey]);
  return { data, edit, error, saving, ready };
}
