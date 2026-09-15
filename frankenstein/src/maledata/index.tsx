import { useEffect, useRef, useState } from 'react';
import Logo from '@helsenorge/designsystem-react/components/Logo';
import Icon from '@helsenorge/designsystem-react/components/Icon';
import Avatar from '@helsenorge/designsystem-react/components/Avatar';
import Title from '@helsenorge/designsystem-react/components/Title';
import Select from '@helsenorge/designsystem-react/components/Select';
import VisualCheckboxCloud from '@helsenorge/designsystem-react/components/VisualCheckboxCloud/VisualCheckboxCloud';
import NotificationPanel from '@helsenorge/designsystem-react/components/NotificationPanel/NotificationPanel';
import EmptyState from '@helsenorge/designsystem-react/components/EmptyState/EmptyState';
import Expander from '@helsenorge/designsystem-react/components/Expander/Expander';
// This subpath's own .d.ts only declares the default export (a packaging
// bug — the compiled JS genuinely exports all of these, confirmed by
// reading node_modules directly), so TypeScript can't see the named
// exports even though they exist at runtime.
// @ts-expect-error — see note above
import Table, { TableHead, TableBody, TableRow, TableHeadCell, TableCell, ModeType } from '@helsenorge/designsystem-react/components/Table/Table';
import Menu from '@helsenorge/designsystem-react/components/Icons/Menu';
import Bell from '@helsenorge/designsystem-react/components/Icons/Bell';
import Logout from '@helsenorge/designsystem-react/components/Icons/Logout';
import ChevronDown from '@helsenorge/designsystem-react/components/Icons/ChevronDown';
import ChevronLeft from '@helsenorge/designsystem-react/components/Icons/ChevronLeft';
import Download from '@helsenorge/designsystem-react/components/Icons/Download';
import {
  SERIES,
  dateLabel,
  agoLabel,
  formatValue,
  latestReading,
  windowValues,
  type MaledataSeries,
} from './data';
import './style.css';

export interface MaledataProps {
  onNavigateHome?: () => void;
}

const TIMEFRAME_OPTIONS = [
  { value: '7', label: 'Siste 7 dager' },
  { value: '14', label: 'Siste 14 dager' },
  { value: '28', label: 'Siste måned' },
  { value: '90', label: 'Siste 3 måneder' },
];

// Chart plot geometry, shared by every panel and the sticky axis ticks so
// day k lines up vertically across all of them.
const VB_WIDTH = 320;
const PLOT_X0 = 30;
const PLOT_X1 = 314;

function sx(k: number, days: number): number {
  if (days <= 1) return PLOT_X0;
  return PLOT_X0 + ((PLOT_X1 - PLOT_X0) * k) / (days - 1);
}

function markerRadius(days: number): number {
  return days > 40 ? 1.6 : days > 14 ? 2.6 : 3.5;
}

function AxisTicks({ days }: { days: number }) {
  const ticks = [0, Math.floor(days / 2), days - 1];
  const h = 14;
  return (
    <svg viewBox={`0 0 ${VB_WIDTH} ${h}`} width="100%" height={h} aria-hidden="true" className="md-axis-svg">
      {ticks.map((k, j) => (
        <text
          key={j}
          x={sx(k, days)}
          y={11}
          fontSize={11}
          fill="var(--core-color-neutral-700)"
          textAnchor={j === 0 ? 'start' : j === 2 ? 'end' : 'middle'}
        >
          {dateLabel(days - 1 - k)}
        </text>
      ))}
    </svg>
  );
}

interface LatestCardProps {
  series: MaledataSeries;
  onSelect: (id: string) => void;
}

function LatestCard({ series, onSelect }: LatestCardProps) {
  const reading = latestReading(series);
  if (!reading) {
    return (
      <button className="md-card" onClick={() => onSelect(series.id)}>
        <p className="md-card__label">{series.name}</p>
        <p className="md-card__sub md-card__sub--warn">Ingen registreringer</p>
      </button>
    );
  }
  const { value, offset, outOfRange, stale } = reading;
  const warn = outOfRange || stale;
  return (
    <button className="md-card" onClick={() => onSelect(series.id)}>
      <p className="md-card__label">{series.name}</p>
      <p className="md-card__value">
        {formatValue(value, series.decimals)} <span className="md-card__unit">{series.unit}</span>
      </p>
      <p className={`md-card__sub${warn ? ' md-card__sub--warn' : ''}`}>
        {outOfRange ? 'Utenfor · ' : ''}
        {agoLabel(offset)}
      </p>
    </button>
  );
}


interface SeriesTableProps {
  series: MaledataSeries;
  days: number;
}

// The accessible artifact the working notes call the priority-#1
// requirement (§11): the visual chart is an enhancement on top of it, not
// the other way round, so it has to stand on its own without depending on
// the chart. scrollAriaLabel carries the "which series is this" context a
// visual caption would otherwise — each usage already has its own visible
// heading (panel title or the table-view section title) right above it.
function SeriesTable({ series, days }: SeriesTableProps) {
  const vals = windowValues(series, days);
  // Most recent first — matches how the latest-registration cards read.
  const rows = vals.map((v, k) => ({ offset: days - 1 - k, value: v })).reverse();
  return (
    <Table mode={ModeType.compact} scrollAriaLabel={`${series.name} som tabell`} className="md-table">
      <TableHead>
        <TableRow mode={ModeType.compact}>
          <TableHeadCell mode={ModeType.compact}>Dato</TableHeadCell>
          <TableHeadCell mode={ModeType.compact}>Verdi</TableHeadCell>
          <TableHeadCell mode={ModeType.compact}>Status</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(({ offset, value }) => {
          const missing = value == null;
          const out = !missing && !!series.band && (value < series.band[0] || value > series.band[1]);
          return (
            <TableRow key={offset} mode={ModeType.compact}>
              <TableCell mode={ModeType.compact} dataLabel="Dato">{dateLabel(offset)}</TableCell>
              <TableCell mode={ModeType.compact} dataLabel="Verdi">{missing ? '–' : `${formatValue(value, series.decimals)} ${series.unit}`}</TableCell>
              <TableCell mode={ModeType.compact} dataLabel="Status">{missing ? 'Mangler' : out ? 'Utenfor målområdet' : series.band ? 'I målområdet' : '–'}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

interface SeriesPanelProps {
  series: MaledataSeries;
  days: number;
  flashing: boolean;
  tableOpen: boolean;
  onToggleTable: (id: string, expanded: boolean) => void;
  panelRef: (el: HTMLDivElement | null) => void;
}

function SeriesPanel({ series, days, flashing, tableOpen, onToggleTable, panelRef }: SeriesPanelProps) {
  const h = series.ordinal ? 56 : 78;
  const y0 = 5;
  const y1 = h - 6;
  const sy = (v: number) => y1 - ((y1 - y0) * (v - series.lo)) / (series.hi - series.lo);
  const vals = windowValues(series, days);
  const r = markerRadius(days);
  const midBand = series.band ? (series.band[0] + series.band[1]) / 2 : (series.lo + series.hi) / 2;

  const gridValues = series.ordinal ? [0, 4] : series.band ? series.band : [series.lo, series.hi];

  let pathD = '';
  if (!series.ordinal) {
    let pen = false;
    for (let k = 0; k < days; k++) {
      const v = vals[k];
      if (v == null) {
        pen = false;
        continue;
      }
      pathD += `${pen ? 'L' : 'M'}${sx(k, days).toFixed(1)} ${sy(v).toFixed(1)} `;
      pen = true;
    }
  }

  return (
    <div
      className={`md-panel${flashing ? ' md-panel--flash' : ''}`}
      id={`md-panel-${series.id}`}
      tabIndex={-1}
      ref={panelRef}
    >
      <div className="md-panel__head">
        <p className="md-panel__title">
          {series.name} <span className="md-panel__unit">{series.unit}{series.source === 'form' ? ' · skjema' : ''}</span>
        </p>
      </div>

      <svg viewBox={`0 0 ${VB_WIDTH} ${h}`} width="100%" role="img" className="md-panel__svg">
        <title>{series.name}</title>
        {series.band && (
          <rect
            x={PLOT_X0}
            y={sy(series.band[1])}
            width={PLOT_X1 - PLOT_X0}
            height={sy(series.band[0]) - sy(series.band[1])}
            fill="#C4E3EA"
          />
        )}
        {gridValues.map((v, i) => (
          <g key={i}>
            <line
              x1={PLOT_X0}
              x2={PLOT_X1}
              y1={sy(v)}
              y2={sy(v)}
              stroke="var(--core-color-neutral-400)"
              strokeOpacity={0.6}
              strokeWidth={0.5}
            />
            <text x={PLOT_X0 - 4} y={sy(v) + 3.5} textAnchor="end" fontSize={11} fill="var(--core-color-neutral-700)">
              {v}
            </text>
          </g>
        ))}
        {!series.ordinal && pathD && (
          <path d={pathD} fill="none" stroke="var(--core-color-blueberry-700)" strokeWidth={1.2} />
        )}
        {vals.map((v, k) => {
          if (v == null) {
            return (
              <circle
                key={k}
                cx={sx(k, days)}
                cy={sy(midBand)}
                r={r}
                fill="none"
                stroke="var(--core-color-neutral-500)"
                strokeDasharray="2 2"
              />
            );
          }
          const out = !!series.band && (v < series.band[0] || v > series.band[1]);
          const color = out ? 'var(--color-notification-graphics-warning)' : 'var(--core-color-blueberry-700)';
          if (series.ordinal) {
            return (
              <rect key={k} x={sx(k, days) - r} y={sy(v) - r} width={2 * r} height={2 * r} fill={color} />
            );
          }
          return <circle key={k} cx={sx(k, days)} cy={sy(v)} r={r} fill={color} />;
        })}
      </svg>

      {/* size defaults to ExpanderSize.small */}
      <Expander
        title="Vis som tabell"
        expanded={tableOpen}
        onExpand={isExpanded => onToggleTable(series.id, isExpanded)}
      >
        <SeriesTable series={series} days={days} />
      </Expander>
    </div>
  );
}

function toCsv(rows: (string | number)[][]): string {
  return rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

export default function Maledata({ onNavigateHome }: MaledataProps) {
  const [shown, setShown] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SERIES.map(s => [s.id, true]))
  );
  const [days, setDays] = useState(28);
  const [customChosen, setCustomChosen] = useState(false);
  const [tableOpen, setTableOpen] = useState<Record<string, boolean>>({});
  const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!pendingFocusId) return;
    const el = panelRefs.current[pendingFocusId];
    if (el) {
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      el.focus({ preventScroll: true });
      if (!reduce) {
        setFlashId(pendingFocusId);
        const t = setTimeout(() => setFlashId(null), 1200);
        return () => clearTimeout(t);
      }
    }
    setPendingFocusId(null);
  }, [pendingFocusId]);

  const toggleShown = (id: string) => setShown(prev => ({ ...prev, [id]: !prev[id] }));

  const selectFromCard = (id: string) => {
    setShown(prev => (prev[id] ? prev : { ...prev, [id]: true }));
    setPendingFocusId(id);
  };

  const setTableOpenFor = (id: string, expanded: boolean) => setTableOpen(prev => ({ ...prev, [id]: expanded }));

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === 'custom') {
      // Stands in for a real date-range picker, not built for this concept.
      setDays(21);
      setCustomChosen(true);
    } else {
      setDays(parseInt(v, 10));
      setCustomChosen(false);
    }
  };

  const downloadCsv = () => {
    const visibleSeries = SERIES.filter(s => shown[s.id]);
    const rows: (string | number)[][] = [['Måling', 'Dato', 'Verdi', 'Enhet', 'Status']];
    visibleSeries.forEach(s => {
      const vals = windowValues(s, days);
      vals.forEach((v, k) => {
        const offset = days - 1 - k;
        const missing = v == null;
        const out = !missing && !!s.band && (v < s.band[0] || v > s.band[1]);
        rows.push([
          s.name,
          dateLabel(offset),
          missing ? '' : formatValue(v, s.decimals),
          s.unit,
          missing ? 'Mangler' : out ? 'Utenfor målområdet' : s.band ? 'I målområdet' : '',
        ]);
      });
    });
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maledata.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const rangeText = `${dateLabel(days - 1)} – ${dateLabel(0)}`;
  const visibleSeries = SERIES.filter(s => shown[s.id]);

  return (
    <div className="md-shell">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="header">
        <div className="top-bar">
          <Logo size={80} />
          <nav className="top-nav">
            <button className="nav-icon-btn" aria-label="Meny">
              <Icon svgIcon={Menu} size={38} />
              <span className="nav-icon-btn__label">Meny</span>
            </button>
            <button className="nav-icon-btn" aria-label="Varsler">
              <Icon svgIcon={Bell} size={38} />
              <span className="nav-icon-btn__label">Varsler</span>
            </button>
            <button className="nav-icon-btn" aria-label="Logg ut">
              <Icon svgIcon={Logout} size={38} />
              <span className="nav-icon-btn__label">Logg ut</span>
            </button>
          </nav>
        </div>
        <button className="profile-bar" aria-label="Brukermeny">
          <Avatar className="md-avatar" color="blueberry" size="xsmall">Tora Hansen</Avatar>
          <span className="profile-bar__name">Tora Hansen</span>
          <Icon svgIcon={ChevronDown} size={38} />
        </button>
      </header>

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <nav className="breadcrumb" aria-label="Brødsmulesti">
        <button className="breadcrumb__back" onClick={onNavigateHome}>
          <Icon svgIcon={ChevronLeft} size={38} />
          <span>Forside</span>
        </button>
      </nav>
      <hr className="page-divider" />

      <main className="md-page">
        <Title htmlMarkup="h1" appearance="title1">Måledata</Title>
        <p className="md-ingress">
          Her ser du målingene dine over tid, sammen med målområdene som er satt for deg.
        </p>

        <NotificationPanel variant="info" fluid className="md-followup-panel">
          <p style={{ margin: 0, fontWeight: 400 }}>Følges opp av hjemmetjenesten, hverdager 08–15.</p>
        </NotificationPanel>

        <section>
          <h2 className="md-section-title">Siste målinger</h2>
          <div className="md-cards">
            {SERIES.map(s => (
              <LatestCard key={s.id} series={s} onSelect={selectFromCard} />
            ))}
          </div>
        </section>

        <section className="md-chart-card">
          <h2 className="md-section-title">Vis målinger</h2>
          <VisualCheckboxCloud className="md-chips">
            {SERIES.map(s => (
              <VisualCheckboxCloud.Checkbox
                key={s.id}
                name="md-series"
                value={s.id}
                checked={!!shown[s.id]}
                onChange={() => toggleShown(s.id)}
              >
                {s.name}
              </VisualCheckboxCloud.Checkbox>
            ))}
          </VisualCheckboxCloud>

          <div className="md-strip">
            <div className="md-strip__row">
              <Select
                label="Vis tidsrom"
                selectId="md-timeframe"
                value={customChosen ? 'chosen' : String(days)}
                onChange={handleTimeframeChange}
                wrapperClassName="md-strip__select"
              >
                {TIMEFRAME_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
                {customChosen && <option value="chosen">Valgt periode</option>}
                <option value="custom">Velg tidsramme…</option>
              </Select>
              <span className="md-strip__range">{rangeText}</span>
            </div>
            <AxisTicks days={days} />
          </div>

          <div className="md-panels">
            {visibleSeries.map(s => (
              <SeriesPanel
                key={s.id}
                series={s}
                days={days}
                flashing={flashId === s.id}
                tableOpen={!!tableOpen[s.id]}
                onToggleTable={setTableOpenFor}
                panelRef={el => { panelRefs.current[s.id] = el; }}
              />
            ))}
            {visibleSeries.length === 0 && (
              // compact size only ever renders `title` (no additionalText) —
              // say what to do about it directly in the title itself.
              <EmptyState size="compact" title="Ingen målinger vist — velg minst én over" />
            )}
          </div>

          <div className="md-legend">
            <span>
              <svg width="10" height="10" aria-hidden="true"><rect width="10" height="10" rx="2" fill="#C4E3EA" /></svg>
              Målområde
            </span>
            <span>
              <svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="3" fill="var(--color-notification-graphics-warning)" /></svg>
              Utenfor målområdet
            </span>
            <span>
              <svg width="10" height="10" aria-hidden="true"><rect x="1" y="1" width="8" height="8" fill="var(--core-color-blueberry-700)" /></svg>
              Skjema-registrert
            </span>
            <span>
              <svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="3" fill="none" stroke="var(--core-color-neutral-500)" strokeDasharray="2 2" /></svg>
              Mangler måling
            </span>
          </div>

          <div className="md-chart-links">
            <button className="md-text-link" onClick={downloadCsv}>
              <Icon svgIcon={Download} size={20} /> Last ned (.csv format)
            </button>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="md-footer">
        <div className="md-footer__top">
          <div className="md-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <div>
              <p className="md-footer__link-title">23 32 70 00</p>
              <p className="md-footer__link-sub">Veiledning helsenorge.no</p>
            </div>
          </div>
          <div className="md-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p className="md-footer__link-title">Hjelp og kontakt</p>
          </div>
          <div className="md-footer__row">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <div className="md-footer__lang">
              <span className="md-footer__link-title">English</span>
              <span className="md-footer__lang-sep" />
              <span className="md-footer__link-title">Sámi</span>
            </div>
          </div>
        </div>
        <div className="md-footer__divider" />
        <div className="md-footer__links">
          <a href="#" className="md-footer__link">Om Helsenorge</a>
          <a href="#" className="md-footer__link">Personvern og nettsikkerhet</a>
          <a href="#" className="md-footer__link">Tilgjengelighetserklæring</a>
        </div>
        <div className="md-footer__divider" />
        <a href="#" className="md-footer__link">Last ned Helsenorge-appen</a>
        <div className="md-footer__divider" />
        <p className="md-footer__brand">Drives av Norsk helsenett SF</p>
      </footer>
    </div>
  );
}
