/* global React, Icon */

const Modals = ({ mode, onClose, cms = {} }) => {
  React.useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (mode) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [mode, onClose]);

  if (!mode) return null;
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={18} stroke={2} />
        </button>
        {mode === 'book' && <BookModal onClose={onClose} cms={cms} />}
        {mode === 'contact' && <ContactModal onClose={onClose} cms={cms} />}
      </div>
    </div>
  );
};

const SLOTS = [
  { day: 'Mån', date: '25', month: 'Maj', times: ['09:30', '11:00', '14:00'] },
  { day: 'Tis', date: '26', month: 'Maj', times: ['10:00', '13:30', '15:00'] },
  { day: 'Ons', date: '27', month: 'Maj', times: ['09:00', '11:30'] },
  { day: 'Tor', date: '28', month: 'Maj', times: ['10:30', '14:00', '16:00'] },
  { day: 'Fre', date: '29', month: 'Maj', times: ['09:30', '13:00'] },
];

const BOOK_TOPICS_DEFAULT = ['PIM by Geta', 'Optimizely commerce', 'Shopify Plus', 'Headless / composable', 'Geta Care', 'Något annat'];

const BookModal = ({ onClose, cms }) => {
  const topics = (cms.bookTopics && cms.bookTopics.length > 0) ? cms.bookTopics : BOOK_TOPICS_DEFAULT;
  const [day, setDay] = React.useState(1);
  const [time, setTime] = React.useState(null);
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({ name: '', email: '', company: '', topic: topics[0] });
  const [done, setDone] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) return (
    <div className="modal-body modal-success">
      <div className="modal-success-icon">
        <Icon name="check" size={28} stroke={2.4} />
      </div>
      <h3 className="modal-success-title">{cms.bookSuccessTitle || 'Du är inbokad.'}</h3>
      <p className="modal-success-sub">
        {cms.bookSuccessMessage
          ? cms.bookSuccessMessage
          : <React.Fragment>
              Vi har skickat en kalenderinbjudan till <strong>{form.email}</strong> för{' '}
              <strong>{SLOTS[day].day} {SLOTS[day].date} {SLOTS[day].month}</strong> kl <strong>{time}</strong>.
            </React.Fragment>
        }
      </p>
      <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 12 }}>Klar</button>
    </div>
  );

  return (
    <div className="modal-body">
      <div className="modal-header">
        <span className="chip chip-tint">Steg {step} av 2</span>
        <h3 className="modal-title">{cms.bookTitle || 'Boka ett 30-minuters samtal'}</h3>
        <p className="modal-sub">{cms.bookSubtitle || 'Ingen agenda krävs. Vi lyssnar först, pratar sen.'}</p>
      </div>

      {step === 1 && (
        <React.Fragment>
          <div className="book-days">
            {SLOTS.map((s, i) => (
              <button
                key={i}
                className={`book-day ${day === i ? 'is-active' : ''}`}
                onClick={() => { setDay(i); setTime(null); }}
              >
                <div className="book-day-day">{s.day}</div>
                <div className="book-day-date">{s.date}</div>
                <div className="book-day-month">{s.month}</div>
              </button>
            ))}
          </div>
          <div className="book-times">
            {SLOTS[day].times.map(t => (
              <button
                key={t}
                className={`book-time ${time === t ? 'is-active' : ''}`}
                onClick={() => setTime(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="modal-footer">
            <span className="modal-foot-text">
              {cms.bookFooterNote || 'Alla tider i CET · 30 minuter · Videosamtal'}
            </span>
            <button
              className="btn btn-primary"
              disabled={!time}
              onClick={() => setStep(2)}
              style={{ opacity: time ? 1 : 0.4, pointerEvents: time ? 'auto' : 'none' }}
            >
              Fortsätt
              <Icon name="arrow-right" size={16} stroke={2} />
            </button>
          </div>
        </React.Fragment>
      )}

      {step === 2 && (
        <form onSubmit={submit} className="modal-form">
          <div className="modal-summary">
            <Icon name="calendar" size={16} stroke={2} />
            <span><strong>{SLOTS[day].day} {SLOTS[day].date} {SLOTS[day].month}</strong> kl <strong>{time}</strong> CET</span>
            <button type="button" className="modal-summary-edit" onClick={() => setStep(1)}>Ändra</button>
          </div>
          <Field label="Ditt namn" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <Field label="Jobbmail" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required />
          <Field label="Företag" value={form.company} onChange={v => setForm({...form, company: v})} />
          <SelectField
            label="Vad vill du prata om?"
            value={form.topic}
            onChange={v => setForm({...form, topic: v})}
            options={topics}
          />
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Tillbaka</button>
            <button type="submit" className="btn btn-primary">
              Bekräfta bokning
              <Icon name="arrow-right" size={16} stroke={2} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const CONTACT_TOPICS_DEFAULT = ['Allmän fråga', 'Nytt projekt', 'PIM', 'Optimizely', 'Shopify', 'Geta Care', 'Partnerskap', 'Press'];

const ContactModal = ({ onClose, cms }) => {
  const topics = (cms.contactTopics && cms.contactTopics.length > 0) ? cms.contactTopics : CONTACT_TOPICS_DEFAULT;
  const [form, setForm] = React.useState({ name: '', email: '', company: '', message: '', topic: topics[0] });
  const [done, setDone] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!form.email || !form.name) return;
    setDone(true);
  };

  if (done) return (
    <div className="modal-body modal-success">
      <div className="modal-success-icon">
        <Icon name="check" size={28} stroke={2.4} />
      </div>
      <h3 className="modal-success-title">{cms.contactSuccessTitle || 'Tack!'}</h3>
      <p className="modal-success-sub">
        {cms.contactSuccessMessage || `Tack ${form.name.split(' ')[0] || 'där'} — någon av oss hör av sig inom en arbetsdag.`}
      </p>
      <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 12 }}>Klar</button>
    </div>
  );

  return (
    <div className="modal-body">
      <div className="modal-header">
        <span className="chip chip-tint">Kontakt</span>
        <h3 className="modal-title">{cms.contactTitle || 'Berätta om ditt projekt'}</h3>
        <p className="modal-sub">{cms.contactSubtitle || 'En riktig människa läser varje meddelande. Vi svarar oftast inom en arbetsdag.'}</p>
      </div>
      <form onSubmit={submit} className="modal-form">
        <div className="modal-form-row">
          <Field label="Ditt namn" value={form.name} onChange={v => setForm({...form, name: v})} required />
          <Field label="Jobbmail" type="email" value={form.email} onChange={v => setForm({...form, email: v})} required />
        </div>
        <Field label="Företag" value={form.company} onChange={v => setForm({...form, company: v})} />
        <SelectField
          label="Vad handlar det om?"
          value={form.topic}
          onChange={v => setForm({...form, topic: v})}
          options={topics}
        />
        <TextAreaField
          label="Berätta lite mer (valfritt)"
          value={form.message}
          onChange={v => setForm({...form, message: v})}
        />
        <div className="modal-footer">
          <span className="modal-foot-text">{cms.contactFooterNote || 'Vi hanterar dina uppgifter varsamt. Se integritetspolicy.'}</span>
          <button type="submit" className="btn btn-primary">
            Skicka meddelande
            <Icon name="arrow-right" size={16} stroke={2} />
          </button>
        </div>
      </form>
    </div>
  );
};

const Field = ({ label, type = 'text', value, onChange, required }) => (
  <label className="modal-field">
    <span className="modal-field-label">{label}{required && <span style={{ color: 'var(--purple)' }}> *</span>}</span>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} />
  </label>
);

const TextAreaField = ({ label, value, onChange }) => (
  <label className="modal-field">
    <span className="modal-field-label">{label}</span>
    <textarea rows="3" value={value} onChange={e => onChange(e.target.value)} />
  </label>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className="modal-field">
    <span className="modal-field-label">{label}</span>
    <select value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>
);

window.Modals = Modals;
