import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { todayKey } from '../utils.js';

export default function AssignmentForm({ assignment, onSave, onClose }) {
  // This child manages its own controlled form inputs with useState.
  const [values, setValues] = useState({ title: assignment?.title ?? '', subject: assignment?.subject ?? '', deadline: assignment?.deadline ?? todayKey(), priority: assignment?.priority ?? 'Medium', notes: assignment?.notes ?? '' });
  const [error, setError] = useState('');
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);
  function change(event) { setValues(current => ({ ...current, [event.target.name]: event.target.value })); setError(''); }
  function submit(event) {
    event.preventDefault();
    // Read the submitted controls as well as state so date-picker commits are captured.
    const submitted = Object.fromEntries(new FormData(event.currentTarget));
    if (!submitted.title.trim() || !submitted.subject.trim()) { setError('Enter an assignment title and subject.'); return; }
    onSave({ ...submitted, title: submitted.title.trim(), subject: submitted.subject.trim(), notes: submitted.notes.trim() });
  }
  return <dialog ref={dialog} className="form-dialog" aria-labelledby="form-heading" onCancel={onClose} onClick={event => { if (event.target === dialog.current) { const rect = dialog.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <div className="form-heading"><div><p className="eyebrow">A STEP TOWARD DONE</p><h2 id="form-heading">{assignment ? 'Edit assignment.' : 'Something to work on.'}</h2></div><button className="icon-button" aria-label="Close form" onClick={onClose}><X size={21} /></button></div>
    <p className="form-description">{assignment ? 'Refine the details and keep moving.' : 'Give your next task a place in your workspace.'}</p>
    <form onSubmit={submit}><label>Assignment title<input name="title" value={values.title} onChange={change} required maxLength={120} placeholder="e.g. Build a React CRUD application" autoFocus /></label><label>Subject<input name="subject" value={values.subject} onChange={change} required maxLength={80} placeholder="e.g. Event-Driven Programming" /></label><div className="form-grid"><label>Due date<input type="date" name="deadline" value={values.deadline} onChange={change} min="1900-01-01" max="9999-12-31" required /></label><label>Priority<select name="priority" value={values.priority} onChange={change}>{['Low', 'Medium', 'High'].map(value => <option key={value}>{value}</option>)}</select></label></div><label>Notes <span className="optional">(optional)</span><textarea name="notes" value={values.notes} onChange={change} maxLength={1000} rows={3} placeholder="Instructions, reminders, or a place to start…" /></label>{error && <p className="notice" role="alert">{error}</p>}<div className="form-actions"><button type="button" className="button secondary" onClick={onClose}>Cancel</button><button className="button primary" type="submit">{assignment ? 'Save changes' : 'Add assignment'}<ArrowRight size={16} /></button></div></form>
  </dialog>;
}
