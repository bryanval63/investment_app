import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Plus, Trash2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

// Bouton icône pour retirer une ligne d'un formulaire.
export const RemoveRowButton = ({
  label = "Supprimer",
  className,
  ...props
}: { label?: string } & Omit<ComponentProps<typeof Button>, "children">) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    aria-label={label}
    title={label}
    className={cn(
      "text-slate-500 hover:bg-red-50 hover:text-red-600",
      className,
    )}
    {...props}
  >
    <Trash2 />
  </Button>
);

// Bouton « Ajouter un … » à bordure pointillée.
export const AddRowButton = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    type="button"
    variant="outline"
    className={cn(
      "h-10 w-full border-dashed border-slate-300 bg-transparent text-slate-600 shadow-none hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600",
      className,
    )}
    {...props}
  >
    <Plus />
    {children}
  </Button>
);

// Bouton de validation (accent indigo).
export const SubmitButton = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) => (
  <Button
    type="submit"
    className={cn(
      "w-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 sm:w-auto sm:min-w-36",
      className,
    )}
    {...props}
  >
    <Check />
    {children}
  </Button>
);

// Barre d'actions alignée à droite (pleine largeur sur mobile).
export const FormFooter = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
    {children}
  </div>
);

// Message d'erreur de soumission.
export const FormSubmitError = ({ error }: { error: unknown }) =>
  error ? (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
    >
      Erreur :{" "}
      {error instanceof Error ? error.message : "Une erreur est survenue"}
    </p>
  ) : null;
