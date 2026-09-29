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
  bpWindow,
  formatBp,
  weekdayShort,
  weekdayDateLabel,
  type BpDay,
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
        {formatValue(value, series.decimals)}
        {series.source !== 'form' && <>{' '}<span className="md-card__unit">{series.unit}</span></>}
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
// visual caption would otherwise — the panel's own title is right above it.
const TABLE_ROWS_PER_PAGE = 14;

function SeriesTable({ series, days }: SeriesTableProps) {
  const [visibleCount, setVisibleCount] = useState(TABLE_ROWS_PER_PAGE);
  const vals = windowValues(series, days);
  // Most recent first — matches how the latest-registration cards read.
  const rows = vals.map((v, k) => ({ offset: days - 1 - k, value: v })).reverse();
  // A long period (3 months, or a long custom range) can produce far more
  // rows than fit comfortably on screen, so only render a page at a time.
  const shownRows = rows.slice(0, visibleCount);
  const hasMore = visibleCount < rows.length;

  return (
    <>
      <Table mode={ModeType.compact} scrollAriaLabel={`${series.name} som tabell`} className="md-table">
        <TableHead>
          <TableRow mode={ModeType.compact}>
            <TableHeadCell mode={ModeType.compact}>Dato</TableHeadCell>
            <TableHeadCell mode={ModeType.compact}>Verdi</TableHeadCell>
            <TableHeadCell mode={ModeType.compact}>Status</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shownRows.map(({ offset, value }) => {
            const missing = value == null;
            const out = !missing && !!series.band && (value < series.band[0] || value > series.band[1]);
            return (
              <TableRow key={offset} mode={ModeType.compact}>
                <TableCell mode={ModeType.compact} dataLabel="Dato">{dateLabel(offset)}</TableCell>
                <TableCell mode={ModeType.compact} dataLabel="Verdi">
                  {missing ? '–' : series.ordinal ? formatValue(value, series.decimals) : `${formatValue(value, series.decimals)} ${series.unit}`}
                </TableCell>
                <TableCell mode={ModeType.compact} dataLabel="Status">{missing ? 'Mangler' : out ? 'Utenfor målområdet' : series.band ? 'I målområdet' : '–'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {hasMore && (
        <button
          className="md-text-link md-table__more"
          onClick={() => setVisibleCount(c => c + TABLE_ROWS_PER_PAGE)}
        >
          Vis flere rader
        </button>
      )}
    </>
  );
}

// ─── Blood pressure: floating bar chart ─────────────────────────────
// One bar per reading, spanning [diastolic, systolic]; morning and
// evening bars grouped side by side per day (a missing reading leaves
// its slot empty). Drawn in real pixels (width measured with a
// ResizeObserver) so the ~20px max bar width and 4px corner radius hold
// at any container width. Legend is HTML above the chart. Colors and
// sizes per the chart spec; labels in Norwegian.
const BP_H = 300;
const BP_PAD = { l: 40, r: 8, t: 22, b: 26 };
// Morning and evening both use Frankenstein blueberry500 (#188097) —
// the lightest blueberry token that still clears WCAG 1.4.11's 3:1 on
// white (4.59:1; blueberry400 is 2.66:1). They differ by shape —
// morning solid, evening hollow (outlined) — which works for every
// color-vision type, in greyscale and on paper.
const BP_MORNING = 'var(--core-color-blueberry-500, #188097)';
const BP_EVENING = 'var(--core-color-blueberry-500, #188097)';
// Where bars are too narrow to show a hollow (3-month view), evening
// bars fall back to solid blueberry300 — lighter, so the two still
// differ by brightness rather than becoming identical.
const BP_EVENING_SOLID = 'var(--core-color-blueberry-300, #7abecc)';
// Outline is 2px on normal-width bars and thins to 1px on narrow ones
// (e.g. the default 1-month view, ~4px bars) so a hollow stays visible.
// Only below BP_MIN_HOLLOW (the 3-month view's ~1px bars) is there no
// room for a hollow at all, and evening bars fall back to solid
// BP_EVENING_SOLID.
const bpOutline = (barW: number) => (barW >= 6 ? 2 : 1);
const BP_MIN_HOLLOW = 3;
const BP_GRID = '#e1e0d9';
const BP_TICK = '#898781';

type BpTip = { x: number; y: number; title: string; line: string };

function BpChart({ days }: { days: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(340);
  const [tip, setTip] = useState<BpTip | null>(null);

  // A tooltip from the previous timeframe would point at a different bar.
  useEffect(() => setTip(null), [days]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => setW(Math.round(entries[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = bpWindow(days);
  // Fixed 60–160 so weeks are comparable; expand only if a value falls outside.
  let lo = 60;
  let hi = 160;
  data.forEach(d => [d.morning, d.evening].forEach(r => {
    if (!r) return;
    if (r.dia < lo) lo = Math.floor(r.dia / 10) * 10;
    if (r.sys > hi) hi = Math.ceil(r.sys / 10) * 10;
  }));
  const x0 = BP_PAD.l;
  const x1 = w - BP_PAD.r;
  const y0 = BP_PAD.t;
  const y1 = BP_H - BP_PAD.b;
  const sy = (v: number) => y1 - ((y1 - y0) * (v - lo)) / (hi - lo);
  const slot = (x1 - x0) / days;
  const gap = Math.max(1, Math.min(4, slot * 0.08));
  const barW = Math.max(1, Math.min(20, (slot - gap) * 0.4));
  const ticks: number[] = [];
  for (let v = Math.ceil(lo / 20) * 20; v <= hi; v += 20) ticks.push(v);
  // Weekday names for a one-week view; "21. sep" dates (thinned) for longer ranges.
  const weekView = days <= 7;
  const labelStep = weekView ? 1 : Math.ceil(days / 6);

  const summary = `Blodtrykk morgen og kveld, siste ${days} dager. Hver stolpe går fra undertrykket (diastolisk) nederst til overtrykket (systolisk) øverst.`;

  return (
    <div className="md-bp">
      <div className="md-bp__legend" aria-hidden="true">
        <span className="md-bp__key"><span className="md-bp__swatch" style={{ background: BP_MORNING }} />Morgen</span>
        <span className="md-bp__key"><span className="md-bp__swatch md-bp__swatch--hollow" style={{ borderColor: BP_EVENING }} />Kveld</span>
        <span className="md-bp__hint">Stolpens bunn = undertrykk, topp = overtrykk</span>
      </div>
      <div className="md-bp__plot" ref={wrapRef} onPointerLeave={() => setTip(null)}>
        <svg width={w} height={BP_H} role="img" aria-label={summary} className="md-bp__svg">
          <text x={4} y={12} fontSize={11} fill={BP_TICK}>mmHg</text>
          {ticks.map(v => (
            <g key={v}>
              <line x1={x0} x2={x1} y1={sy(v)} y2={sy(v)} stroke={BP_GRID} strokeWidth={1} />
              <text x={x0 - 6} y={sy(v) + 4} textAnchor="end" fontSize={11} fill={BP_TICK}>{v}</text>
            </g>
          ))}
          {data.map((d, k) => {
            const offset = days - 1 - k;
            const cx = x0 + slot * (k + 0.5);
            const bars: { r: NonNullable<BpDay['morning']>; x: number; color: string; name: string; hollow: boolean }[] = [];
            if (d.morning) bars.push({ r: d.morning, x: cx - gap / 2 - barW, color: BP_MORNING, name: 'Morgen', hollow: false });
            if (d.evening) bars.push({ r: d.evening, x: cx + gap / 2, color: barW >= BP_MIN_HOLLOW ? BP_EVENING : BP_EVENING_SOLID, name: 'Kveld', hollow: barW >= BP_MIN_HOLLOW });
            // Thinned date labels; one that would crowd today's end-anchored
            // label at the right edge is skipped.
            const showLabel = weekView || ((days - 1 - k) % labelStep === 0 && (k === days - 1 || x1 - cx > 60));
            return (
              <g key={k}>
                {bars.map(b => {
                  const top = sy(b.r.sys);
                  const show = () => setTip({
                    x: b.x + barW / 2,
                    y: top,
                    title: weekdayDateLabel(offset),
                    line: `${b.name}: ${formatBp(b.r)}`,
                  });
                  const height = Math.max(1, sy(b.r.dia) - top);
                  // Hollow bars: stroke drawn inside the bar's own bounds (inset by
                  // half the stroke) so both bar types occupy exactly the same box.
                  const outline = bpOutline(barW);
                  const inset = b.hollow ? outline / 2 : 0;
                  return (
                    <rect
                      key={b.name}
                      x={b.x + inset}
                      y={top + inset}
                      width={barW - 2 * inset}
                      height={Math.max(1, height - 2 * inset)}
                      rx={Math.max(0, Math.min(4, barW / 2) - inset)}
                      fill={b.hollow ? '#fff' : b.color}
                      stroke={b.hollow ? b.color : 'none'}
                      strokeWidth={b.hollow ? outline : 0}
                      onPointerEnter={show}
                      onClick={show}
                    />
                  );
                })}
                {showLabel && (
                  // The rightmost (today) date label is end-anchored at the plot
                  // edge so it isn't clipped; weekday labels are short enough to center.
                  <text
                    x={!weekView && k === days - 1 ? x1 : cx}
                    y={BP_H - 8}
                    textAnchor={!weekView && k === days - 1 ? 'end' : 'middle'}
                    fontSize={11}
                    fill={BP_TICK}
                  >
                    {weekView ? weekdayShort(offset) : dateLabel(offset)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {tip && (
          <div
            className="md-bp__tip"
            style={{ left: Math.min(Math.max(tip.x, 70), w - 70), top: tip.y }}
            role="status"
          >
            <strong>{tip.title}</strong>
            <span>{tip.line}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Table companion for the BP chart (same role as SeriesTable): one row per
// day, most recent first, morning and evening as "sys/dia".
function BpTable({ days }: { days: number }) {
  const [visibleCount, setVisibleCount] = useState(TABLE_ROWS_PER_PAGE);
  const rows = bpWindow(days).map((d, k) => ({ offset: days - 1 - k, d })).reverse();
  const shownRows = rows.slice(0, visibleCount);
  const cell = (r: BpDay['morning']) => (r ? `${formatBp(r)} mmHg` : '–');
  return (
    <>
      <Table mode={ModeType.compact} scrollAriaLabel="Blodtrykk som tabell" className="md-table">
        <TableHead>
          <TableRow mode={ModeType.compact}>
            <TableHeadCell mode={ModeType.compact}>Dato</TableHeadCell>
            <TableHeadCell mode={ModeType.compact}>Morgen</TableHeadCell>
            <TableHeadCell mode={ModeType.compact}>Kveld</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shownRows.map(({ offset, d }) => (
            <TableRow key={offset} mode={ModeType.compact}>
              <TableCell mode={ModeType.compact} dataLabel="Dato">{dateLabel(offset)}</TableCell>
              <TableCell mode={ModeType.compact} dataLabel="Morgen">{cell(d.morning)}</TableCell>
              <TableCell mode={ModeType.compact} dataLabel="Kveld">{cell(d.evening)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {visibleCount < rows.length && (
        <button className="md-text-link md-table__more" onClick={() => setVisibleCount(c => c + TABLE_ROWS_PER_PAGE)}>
          Vis flere rader
        </button>
      )}
    </>
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
  // Blood pressure gets its own floating-bar chart (morning/evening
  // readings) instead of the single-value line chart.
  const isBp = series.id === 'sbp';
  const h = series.ordinal ? 56 : 78;
  const y0 = 5;
  const y1 = h - 6;
  const sy = (v: number) => y1 - ((y1 - y0) * (v - series.lo)) / (series.hi - series.lo);
  const vals = windowValues(series, days);
  const r = markerRadius(days);
  const midBand = series.band ? (series.band[0] + series.band[1]) / 2 : (series.lo + series.hi) / 2;

  const gridValues = series.ordinal ? [series.scaleMin ?? 0, series.scaleMax ?? 4] : series.band ? series.band : [series.lo, series.hi];

  const isOut = (v: number) => !!series.band && (v < series.band[0] || v > series.band[1]);

  // One segment per pair of adjacent, present points — a segment is
  // warning-colored if either endpoint is out of range, and only shows the
  // normal series color when both endpoints agree.
  const segments: { key: number; x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  if (!series.ordinal) {
    for (let k = 1; k < days; k++) {
      const prev = vals[k - 1];
      const cur = vals[k];
      if (prev == null || cur == null) continue;
      const color = isOut(prev) || isOut(cur)
        ? 'var(--color-notification-graphics-warning)'
        : 'var(--core-color-blueberry-700)';
      segments.push({ key: k, x1: sx(k - 1, days), y1: sy(prev), x2: sx(k, days), y2: sy(cur), color });
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
          {isBp ? 'Blodtrykk' : series.name} <span className="md-panel__unit">{series.source === 'form' ? `skjema (skala ${series.unit})` : series.unit}</span>
        </p>
      </div>

      {isBp ? (
        <BpChart days={days} />
      ) : (
        <svg viewBox={`0 0 ${VB_WIDTH} ${h}`} width="100%" role="img" className="md-panel__svg">
          <title>{series.name}</title>
          {series.band && (
            <rect
              x={PLOT_X0}
              y={sy(series.band[1])}
              width={PLOT_X1 - PLOT_X0}
              height={sy(series.band[0]) - sy(series.band[1])}
              fill="var(--core-color-blueberry-50, #e4f7f9)"
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
          {segments.map(seg => (
            <line
              key={seg.key}
              x1={seg.x1}
              y1={seg.y1}
              x2={seg.x2}
              y2={seg.y2}
              stroke={seg.color}
              strokeWidth={1.2}
            />
          ))}
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
            const color = isOut(v) ? 'var(--color-notification-graphics-warning)' : 'var(--core-color-blueberry-700)';
            if (series.ordinal) {
              return (
                <rect key={k} x={sx(k, days) - r} y={sy(v) - r} width={2 * r} height={2 * r} fill={color} />
              );
            }
            return <circle key={k} cx={sx(k, days)} cy={sy(v)} r={r} fill={color} />;
          })}
        </svg>
      )}

      {/* size defaults to ExpanderSize.small */}
      <Expander
        title="Vis som tabell"
        expanded={tableOpen}
        onExpand={isExpanded => onToggleTable(series.id, isExpanded)}
      >
        {isBp ? <BpTable days={days} /> : <SeriesTable series={series} days={days} />}
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
          <p style={{ margin: 0, fontWeight: 400 }}>Din behandler tar kontakt dersom dine målinger krever noe oppfølging</p>
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
              <svg width="10" height="10" aria-hidden="true"><rect width="10" height="10" rx="2" fill="var(--core-color-blueberry-50, #e4f7f9)" /></svg>
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
