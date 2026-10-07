import React from "react";
import { BookOpen, Check, Pencil, Plus, Trash2 } from "lucide-react";
import { formatDate, isOverdue } from "../utils.js";

export default function AssignmentList({
  assignments,
  onEdit,
  onDelete,
  onToggle,
  filtered,
  onCreate,
}) {
  if (!assignments.length)
    return (
      <div className="empty">
        <BookOpen size={28} />
        <h3>{filtered ? "No matching assignments." : "A fresh start."}</h3>
        <p>
          {filtered
            ? "Try another search or filter."
            : "Add your first assignment and make a little progress."}
        </p>
        {!filtered && (
          <button className="button primary" onClick={onCreate}>
            <Plus size={16} />
            New assignment
          </button>
        )}
      </div>
    );
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th className="check-cell">
              <span className="sr-only">Completion</span>
            </th>
            <th>Assignment</th>
            <th>Due date</th>
            <th>Priority</th>
            <th>Status</th>
            <th className="actions-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((item) => {
            const overdue = isOverdue(item);
            return (
              <tr
                key={item.id}
                className={item.completed ? "completed-row" : ""}
              >
                <td className="check-cell">
                  <button
                    className={`completion-button ${item.completed ? "checked" : ""}`}
                    aria-label={`${item.completed ? "Mark pending" : "Complete"}: ${item.title}`}
                    aria-pressed={item.completed}
                    onClick={() => onToggle(item)}
                  >
                    {item.completed && <Check size={13} />}
                  </button>
                </td>
                <td className="assignment-cell">
                  <button
                    className="assignment-title"
                    onClick={() => onEdit(item)}
                  >
                    {item.title}
                  </button>
                  <span className="subject-name">{item.subject}</span>
                  {item.notes && (
                    <span className="assignment-notes" title={item.notes}>
                      {item.notes}
                    </span>
                  )}
                </td>
                <td className={`date-cell ${overdue ? "overdue-date" : ""}`}>
                  {formatDate(item.deadline)}
                </td>
                <td>
                  <span
                    className={`priority priority-${item.priority.toLowerCase()}`}
                  >
                    <span />
                    {item.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${item.completed ? "done" : overdue ? "late" : "pending"}`}
                  >
                    <span />
                    {item.completed
                      ? "Completed"
                      : overdue
                        ? "Overdue"
                        : "Pending"}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="icon-button"
                      aria-label={`Edit: ${item.title}`}
                      title="Edit assignment"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="icon-button delete-button"
                      aria-label={`Delete: ${item.title}`}
                      title="Delete assignment"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
