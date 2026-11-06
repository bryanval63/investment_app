import type { Table } from "@tanstack/react-table";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { IconActionButton } from "./IconActionButton";
import "./row-editor";

type RowEditorActionsProps<TData extends { id: number }> = {
  table: Table<TData>;
  row: TData;
};

/** Actions de ligne : éditer / supprimer, ou sauvegarder / annuler. */
export const RowEditorActions = <TData extends { id: number }>({
  table,
  row,
}: RowEditorActionsProps<TData>) => {
  const editor = table.options.meta?.rowEditor;
  if (!editor) return null;

  return editor.editingId === row.id ? (
    <div className="flex justify-end gap-1">
      <IconActionButton
        icon={Check}
        label="Sauvegarder"
        tone="primary"
        disabled={!editor.canSave}
        onClick={() => editor.save(row.id)}
      />
      <IconActionButton icon={X} label="Annuler" onClick={editor.cancelEdit} />
    </div>
  ) : (
    <div className="flex justify-end gap-1">
      <IconActionButton
        icon={Pencil}
        label="Éditer"
        onClick={() => editor.startEdit(row)}
      />
      <IconActionButton
        icon={Trash2}
        label="Supprimer"
        tone="danger"
        onClick={() => editor.remove(row.id)}
      />
    </div>
  );
};
