import React, { useEffect, useState } from 'react';
import { ArrowUpRight, BookOpen, Check, CircleCheck, Clock3, LayoutGrid, Plus, Search, SlidersHorizontal } from 'lucide-react';
import AssignmentForm from './components/AssignmentForm.jsx';
import AssignmentList from './components/AssignmentList.jsx';
import { STORAGE_KEY, isOverdue, validAssignments } from './utils.js';

export default function App() {
  // The parent owns the records and sends data and CRUD callbacks through props.
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [storageError, setStorageError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [subject, setSubject] = useState('All subjects');
  const [sort, setSort] = useState('deadline');

  // Load the required JSON file once; restore browser edits if they exist.
  useEffect(() => {
    const controller = new AbortController();
    async function loadAssignments() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}assignments.json`, { signal: controller.signal });
        if (!response.ok) throw new Error('Could not load the sample assignments. Refresh to try again.');
        const initialData = await response.json();
        if (!validAssignments(initialData)) throw new Error('The assignments JSON contains invalid records.');
        let data = initialData;
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (!validAssignments(parsed)) throw new Error('Invalid saved data');
            data = parsed;
          }
        } catch {
          setStorageError('Saved data could not be read. Sample assignments have been loaded.');
        }
        if (!controller.signal.aborted) { setAssignments(data); setLoading(false); }
      } catch (error) {
        if (!controller.signal.aborted) { setLoadError(error.message); setLoading(false); }
      }
    }
    loadAssignments();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (loading || loadError) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments)); }
    catch { setStorageError('Browser storage is unavailable. Changes will last only for this session.'); }
  }, [assignments, loading, loadError]);

  function saveAssignment(values) {
    if (selectedAssignment) {
      setAssignments(current => current.map(item => item.id === selectedAssignment.id ? { ...item, ...values } : item));
      setAnnouncement('Assignment updated.');
    } else {
      setAssignments(current => [...current, { ...values, id: crypto.randomUUID(), completed: false }]);
      setAnnouncement('Assignment added.');
    }
    setFormOpen(false);
  }
  function editAssignment(item) { setSelectedAssignment(item); setFormOpen(true); }
  function deleteAssignment(item) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setAssignments(current => current.filter(record => record.id !== item.id));
    setAnnouncement('Assignment deleted.');
  }
  function toggleAssignment(item) {
    setAssignments(current => current.map(record => record.id === item.id ? { ...record, completed: !record.completed } : record));
    setAnnouncement(item.completed ? 'Assignment marked pending.' : 'Assignment completed.');
  }
  const completed = assignments.filter(item => item.completed).length;
  const overdue = assignments.filter(isOverdue).length;
  const pending = assignments.length - completed;
  const progress = assignments.length ? Math.round(completed / assignments.length * 100) : 0;
  const subjects = [...new Set(assignments.map(item => item.subject))].sort();
  const activeSubject = subjects.includes(subject) ? subject : 'All subjects';
  const visibleAssignments = assignments.filter(item => {
    const matchesFilter = filter === 'All' || (filter === 'Completed' ? item.completed : filter === 'Overdue' ? isOverdue(item) : !item.completed);
    return matchesFilter && (activeSubject === 'All subjects' || item.subject === activeSubject) && `${item.title} ${item.subject} ${item.notes}`.toLowerCase().includes(search.toLowerCase());
  }).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'priority' ? ['High', 'Medium', 'Low'].indexOf(a.priority) - ['High', 'Medium', 'Low'].indexOf(b.priority) : a.deadline.localeCompare(b.deadline));

  return <>
    <div className="top-strip">LESS CHAOS. MORE PROGRESS.</div>
    <header className="site-header"><div className="page-width header-inner">
      <a className="brand" href="./" aria-label="Assignment Studio home"><span className="brand-mark">a<span>.</span></span><span>assignment<span className="brand-light">studio</span><sup>®</sup></span></a>
      <span className="header-section">STUDENT WORKSPACE</span>
      <span className="profile"><span className="profile-dot" />Personal workspace</span>
    </div></header>
    <main className="page-width">
      <section className="intro"><div><p className="eyebrow">YOUR SEMESTER, IN FOCUS</p><h1>Make room for<br />your next <span>big idea.</span></h1><p className="intro-description">A little structure. A lot of possibilities.<br />Keep every assignment moving forward.</p></div>
        <div className="progress-card"><div className="progress-heading"><span className="eyebrow">SEMESTER PROGRESS</span><ArrowUpRight size={20} /></div><div className="progress-number">{progress}<span>%</span></div><div className="progress-track" role="progressbar" aria-label="Completed assignments" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${progress}%` }} /></div><p>{completed} of {assignments.length} assignments completed</p><div className="progress-foot"><Check size={14} /> One task closer to done.</div></div>
      </section>
      <section className="stats" aria-label="Assignment overview">{[[BookOpen, 'Total assignments', assignments.length, 'Everything in one place'], [Clock3, 'In progress', pending, 'Your next steps'], [CircleCheck, 'Completed', completed, 'Work worth celebrating'], [ArrowUpRight, 'Overdue', overdue, 'A little extra attention']].map(([Icon, label, value, caption]) => <div className="stat" key={label}><div className="stat-heading"><span>{label}</span><Icon size={17} /></div><strong>{value.toString().padStart(2, '0')}</strong><small>{caption}</small></div>)}</section>
      <section className="assignment-section" aria-labelledby="assignments-heading">
        <div className="section-heading"><div><p className="eyebrow">THE WORK AHEAD</p><h2 id="assignments-heading">Your assignments<span>.</span></h2></div><button className="button primary" disabled={loading || !!loadError} onClick={() => { setSelectedAssignment(null); setFormOpen(true); }}><Plus size={17} /> New assignment</button></div>
        {storageError && <p className="notice" role="alert">{storageError}</p>}
        <div className="filter-row"><div className="tabs" aria-label="Assignment status">{['All', 'Pending', 'Completed', 'Overdue'].map(value => <button key={value} className={filter === value ? 'active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}{value === 'All' && <span>{assignments.length}</span>}</button>)}</div><label className="search"><Search size={16} /><input aria-label="Search assignments" placeholder="Search assignments…" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
        <div className="list-toolbar"><span><LayoutGrid size={14} />{visibleAssignments.length} assignment{visibleAssignments.length !== 1 ? 's' : ''}</span><div><label><span className="sr-only">Filter by subject</span><select value={activeSubject} onChange={event => setSubject(event.target.value)}><option>All subjects</option>{subjects.map(value => <option key={value}>{value}</option>)}</select></label><SlidersHorizontal size={14} /><label><span className="sr-only">Sort assignments</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="deadline">Due date</option><option value="priority">Priority</option><option value="title">Title A–Z</option></select></label></div></div>
        {loading ? <div className="empty" role="status">Loading your workspace…</div> : loadError ? <div className="empty" role="alert">{loadError}</div> : <AssignmentList assignments={visibleAssignments} onEdit={editAssignment} onDelete={deleteAssignment} onToggle={toggleAssignment} filtered={!!search || filter !== 'All' || activeSubject !== 'All subjects'} onCreate={() => { setSelectedAssignment(null); setFormOpen(true); }} />}
      </section>
      <footer><span className="footer-brand">assignmentstudio.</span><span>A clearer desk. A clearer mind.</span><span>MADE FOR YOUR NEXT CHAPTER</span></footer>
    </main>
    <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    {formOpen && <AssignmentForm assignment={selectedAssignment} onSave={saveAssignment} onClose={() => setFormOpen(false)} />}
  </>;
}
