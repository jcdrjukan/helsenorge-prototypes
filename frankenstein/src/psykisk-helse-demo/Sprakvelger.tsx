// Språk/Language picker, copied from the Gravid prototype
// (gravid/sprakvelger.js + sprakvelger.css, 2026-11-09): borderless toggle
// with teal globe + chevron, SingleSelect-style list. Choosing marks the
// language (page text doesn't change) and announces "Språk endret til …";
// Esc or a click outside closes it.
import { useEffect, useRef, useState } from 'react';
import './sprakvelger.css';

const GLOBE = 'M35.49 32.138a21.747 21.747 0 00-4.009-2.281c.58-1.555.974-3.264 1.083-5.1h5.539a14.178 14.178 0 01-2.612 7.381zm-9.244 5.795c1.38-1.417 3.205-3.62 4.552-6.444a19.918 19.918 0 013.576 2.02 14.239 14.239 0 01-8.128 4.424zm-1.488-7.87c1.488.077 2.941.343 4.359.795-1.314 2.683-3.094 4.765-4.36 6.045v-6.84zm0-5.306h6.035a15.719 15.719 0 01-.982 4.467 18.969 18.969 0 00-5.053-.93v-3.537zm0-5.73a19.583 19.583 0 004.988-.834c.572 1.46.958 3.07 1.056 4.796h-6.044v-3.963zm0-8.219c1.232 1.22 2.954 3.196 4.258 5.754-1.367.4-2.788.633-4.258.696v-6.45zm9.46 3.257a18.005 18.005 0 01-3.5 1.903c-1.323-2.685-3.083-4.78-4.43-6.149a14.238 14.238 0 017.93 4.246zm1.134 1.359a14.169 14.169 0 012.75 7.565h-5.53a17.324 17.324 0 00-1.146-5.396 19.764 19.764 0 003.926-2.17zm-12.363 1.828a17.287 17.287 0 01-4.273-.768c1.335-2.573 3.066-4.564 4.273-5.767v6.535zm0 5.737h-6.16c.118-1.757.53-3.403 1.133-4.89 1.63.532 3.307.84 5.027.922v3.968zm0 5.299c-1.82.07-3.57.375-5.242.91a15.39 15.39 0 01-.928-4.44h6.17v3.53zm0 8.774c-1.293-1.26-3.194-3.413-4.557-6.233a17.657 17.657 0 014.557-.776v7.009zm-9.693-3.638a18.045 18.045 0 013.454-1.976c1.332 2.825 3.16 5.033 4.56 6.456a14.24 14.24 0 01-8.014-4.48zm-1.108-1.378a14.187 14.187 0 01-2.543-7.289h5.403c.09 1.826.467 3.52 1.03 5.064a19.909 19.909 0 00-3.89 2.225zm.278-16.716a21.62 21.62 0 003.827 2.139 17.704 17.704 0 00-1.237 5.52h-5.41a14.172 14.172 0 012.82-7.659zm8.887-5.494c-1.31 1.35-3.011 3.408-4.327 6.021a19.658 19.658 0 01-3.416-1.88 14.24 14.24 0 017.743-4.141zm2.52-2.005c-8.846 0-16.042 7.196-16.042 16.043 0 8.845 7.196 16.043 16.042 16.043 8.846 0 16.044-7.198 16.044-16.043 0-8.847-7.198-16.043-16.044-16.043z';
const CHEVRON = 'M32.577 17.885l1.793 1.779-10.371 10.451L13.63 19.664l1.793-1.779 8.576 8.644z';
const SPRAK: [string, string][] = [['bokmål', 'Bokmål'], ['nynorsk', 'Nynorsk'], ['engelsk', 'English']];

export default function Sprakvelger() {
  const [open, setOpen] = useState(false);
  const [valgt, setValgt] = useState('bokmål');
  const [melding, setMelding] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const velg = (kode: string) => {
    setValgt(kode);
    setMelding('Språk endret til ' + kode);
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <div className="sprakvelger" ref={rootRef}>
      <span className="sr-only" aria-live="polite">{melding}</span>
      <button ref={toggleRef} type="button" className="sprakvelger__toggle" id="sprakvelgerToggle" aria-haspopup="true" aria-controls="sprakvelgerValg" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <svg className="sprakvelger__left-icon" viewBox="0 0 48 48" aria-hidden="true"><path d={GLOBE} /></svg>
        <span className="sprakvelger__text">Språk/Language</span>
        <svg className="sprakvelger__right-icon" viewBox="0 0 48 48" aria-hidden="true"><path d={CHEVRON} /></svg>
      </button>
      <div className={'sprakvelger__content' + (open ? ' sprakvelger__content--open' : '')} id="sprakvelgerValg">
        <ul className="sprakvelger__options" role="group" aria-labelledby="sprakvelgerToggle">
          {SPRAK.map(([kode, navn]) => (
            <li className="sprakvelger__item" key={kode}>
              <button type="button" className="sprakvelger__option" aria-current={kode === valgt ? 'true' : undefined} onClick={() => velg(kode)}>
                <span className={'sprakvelger__dot' + (kode === valgt ? ' sprakvelger__dot--checked' : '')} aria-hidden="true" />
                <span>{navn}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
