export const STORAGE_KEY = 'assignment-studio-v1';
export function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export const isOverdue = (assignment) => !assignment.completed && assignment.deadline < todayKey();
export function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
export function validAssignments(data) {
  return Array.isArray(data) && new Set(data.map(item => item?.id)).size === data.length && data.every(item => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.subject === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.deadline) && !Number.isNaN(new Date(`${item.deadline}T00:00:00`).getTime()) && ['High', 'Medium', 'Low'].includes(item.priority) && typeof item.completed === 'boolean' && typeof item.notes === 'string');
}
