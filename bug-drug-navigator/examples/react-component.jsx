// Hulool web (React / Next.js). Put the "spectra" folder in /public/tools/ first.
import { useEffect, useRef } from "react";

export default function Spectra({ user, onEvent }) {
  const ref = useRef(null);

  useEffect(() => {
    const origin = window.location.origin;
    function onMessage(e) {
      if (e.origin !== origin || e.source !== ref.current?.contentWindow) return;
      const m = e.data;
      if (!m || m.source !== "spectra") return;
      if (m.type === "ready" && user) {
        ref.current.contentWindow.postMessage(
          { source: "hulool", type: "spectra:setUser", userId: user.staffCode, role: user.role, site: user.site, appVersion: user.appVersion },
          origin
        );
      }
      if (m.type === "event") onEvent?.(m.event); // e.g. batch and POST to /api/spectra/events
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [user, onEvent]);

  return (
    <iframe
      ref={ref}
      src="/tools/spectra/index.html"
      title="Spectra — bug–drug spectrum navigator"
      style={{ width: "100%", height: "90vh", border: 0 }}
    />
  );
}
