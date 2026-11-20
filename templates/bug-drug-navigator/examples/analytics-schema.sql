-- Spectra usage events (schema v1). PostgreSQL syntax; adapt types for SQL Server/Oracle.
CREATE TABLE spectra_event (
  id               UUID PRIMARY KEY,           -- event id (idempotent: ignore duplicates on retry)
  ts               TIMESTAMPTZ NOT NULL,
  sid              UUID NOT NULL,              -- session
  seq              INTEGER,
  uid              VARCHAR(64),                -- pseudonymous staff ID
  role             VARCHAR(32),
  site             VARCHAR(32),
  name             VARCHAR(40) NOT NULL,       -- event name (see ANALYTICS.md §3)
  tab              VARCHAR(16),
  drug_group       VARCHAR(8),
  chart_version    VARCHAR(8),
  item_type        VARCHAR(16),
  item_id          VARCHAR(120),
  item_name        VARCHAR(160),
  via              VARCHAR(16),
  prev_dwell_ms    INTEGER,
  device           VARCHAR(16),
  os               VARCHAR(16),
  host             VARCHAR(16),
  module_version   VARCHAR(16) NOT NULL,
  content_version  VARCHAR(40) NOT NULL,       -- date + app.js hash: traceability to the exact content shown
  app_version      VARCHAR(32),
  props            JSONB,
  ctx              JSONB,
  received_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX ON spectra_event (ts);
CREATE INDEX ON spectra_event (uid, ts);
CREATE INDEX ON spectra_event (name, ts);
CREATE INDEX ON spectra_event (content_version);

-- Insert (idempotent):
-- INSERT INTO spectra_event (id, ts, sid, seq, uid, role, site, name, tab, drug_group, chart_version, item_type, item_id, item_name,
--   via, prev_dwell_ms, device, os, host, module_version, content_version, app_version, props, ctx)
-- VALUES (...) ON CONFLICT (id) DO NOTHING;

-- Weekly uptake
SELECT date_trunc('week', ts) AS week, count(DISTINCT uid) AS users, count(DISTINCT sid) AS sessions
FROM spectra_event GROUP BY 1 ORDER BY 1;

-- Most consulted drugs by role
SELECT role, item_name, count(*) AS views
FROM spectra_event WHERE name = 'screen_view' AND item_type = 'drug'
GROUP BY role, item_name ORDER BY views DESC LIMIT 30;

-- Median active time per session (minutes)
SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY m) AS median_min FROM (
  SELECT sid, max((props->>'active_ms')::int) / 60000.0 AS m FROM spectra_event WHERE name = 'session_pause' GROUP BY sid) s;

-- Content gaps: searches that found nothing, per week
SELECT date_trunc('week', ts) AS week, count(*) FROM spectra_event
WHERE name IN ('search_no_result', 'drug_filter_no_result') GROUP BY 1 ORDER BY 1;

-- Which content version was in use, per day
SELECT ts::date AS day, content_version, count(*) FROM spectra_event GROUP BY 1, 2 ORDER BY 1;
