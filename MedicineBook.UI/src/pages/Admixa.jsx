import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const Admixa = () => {
  const appRef = useRef(null);
  const { id } = useParams();

  // Fallback dynamic script loader in case scripts weren't loaded yet
  useEffect(() => {
    if (typeof window !== 'undefined' && !customElements.get('admixa-app')) {
      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = src;
          s.async = false;
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      };

      loadScript('/admixa/js/config.js')
        .then(() => loadScript('/admixa/admixa.js'))
        .catch((err) => console.error('[Admixa] Failed to load scripts', err));
    }
  }, []);

  // Handle opening specific medicine if ID parameter is provided in route
  useEffect(() => {
    if (id) {
      const openDrug = () => {
        if (appRef.current?.api?.open) {
          appRef.current.api.open(id);
        } else if (window.Admixa?.open) {
          window.Admixa.open(id);
        }
      };
      openDrug();
      const t1 = setTimeout(openDrug, 200);
      const t2 = setTimeout(openDrug, 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [id]);

  return (
    <div className="w-full -m-4 md:-m-8 min-h-[calc(100vh-64px)] md:min-h-screen">
      <admixa-app
        ref={appRef}
        style={{ display: 'block', width: '100%', minHeight: '100vh' }}
      ></admixa-app>
    </div>
  );
};

export default Admixa;
