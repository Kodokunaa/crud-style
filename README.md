# Assignment Studio

A React assignment tracker inspired by the local WLMouse app's monochrome palette, Poppins typography, thin borders, and spacious layout.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Use `npm run build` for a production build and `npm run preview` to preview it.

## Activity requirements

- **Parent + two children:** `src/App.jsx` owns records; `AssignmentForm.jsx` and `AssignmentList.jsx` receive props.
- **useState:** the parent manages records, selection, search, filters, and sorting. The form manages controlled input values.
- **useEffect:** the parent fetches `public/assignments.json` when mounted. Another effect persists changes to localStorage.
- **Props:** assignments and the selected record travel down; `onSave`, `onEdit`, `onDelete`, `onToggle`, and `onClose` provide callbacks to the parent.
- **CRUD:** add through the form, read the table, edit details or completion status, and delete after confirmation.

Initial records come from the JSON file; subsequent changes are stored in this browser's localStorage, including an empty list after all records are deleted. This is a local demo with no backend: it does not rewrite the JSON file or synchronize across browsers. Clear the `assignment-studio-v1` storage key in browser developer tools to reload the sample records. Search matches titles, subjects, and notes; filters and sorting narrow the table. Overdue dates use the user's local calendar date.
