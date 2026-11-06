import type { RowData, Table } from "@tanstack/react-table";

/**
 * État d'édition en ligne d'un tableau, transmis via `meta.rowEditor`.
 *
 * Les colonnes doivent rester des constantes de module : `flexRender` traite
 * chaque fonction `cell` comme un composant, donc des colonnes recréées à
 * chaque rendu remonteraient les champs (perte du focus et de la saisie).
 */
export type RowEditor<TData, TForm> = {
  editingId: number | null;
  form: TForm | null;
  updateForm: (patch: Partial<TForm>) => void;
  startEdit: (row: TData) => void;
  save: (id: number) => void;
  cancelEdit: () => void;
  remove: (id: number) => void;
  canSave: boolean;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    rowEditor?: RowEditor<TData, unknown>;
  }
}

/** Formulaire de la ligne `id` si elle est en cours d'édition, sinon `null`. */
export const getEditedForm = <TData, TForm>(
  table: Table<TData>,
  id: number,
): TForm | null => {
  const editor = table.options.meta?.rowEditor;
  return editor?.editingId === id ? (editor.form as TForm | null) : null;
};

export const getRowEditor = <TData, TForm>(table: Table<TData>) =>
  table.options.meta?.rowEditor as RowEditor<TData, TForm> | undefined;
