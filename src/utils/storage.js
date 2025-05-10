// Use localStorage for demo; swap for IndexedDB for large data

const IMPORT_KEY = "importData";
const ASSIGN_KEY = "boxAssignments";

export async function saveImportData(data) {
  localStorage.setItem(IMPORT_KEY, JSON.stringify(data));
}

export async function getImportData() {
  const data = localStorage.getItem(IMPORT_KEY);
  return data ? JSON.parse(data) : null;
}

export async function saveBoxAssignments(assignments) {
  localStorage.setItem(ASSIGN_KEY, JSON.stringify(assignments));
}

export async function getBoxAssignments() {
  const data = localStorage.getItem(ASSIGN_KEY);
  return data ? JSON.parse(data) : null;
}
