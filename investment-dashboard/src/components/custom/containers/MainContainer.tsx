import type { ReactElement } from "react";

type MainContainerProps = {
  children: ReactElement | ReactElement[];
  columns?: 1 | 2 | 3;
};

// Classes écrites en toutes lettres : Tailwind ne détecte pas les classes interpolées.
const GRID_COLUMNS = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
} as const;

export const MainContainer = ({
  children,
  columns = 2,
}: MainContainerProps) => {
  return (
    <div
      className={`flex flex-col lg:grid ${GRID_COLUMNS[columns]} gap-3 lg:gap-4 xl:gap-8`}
    >
      {children}
    </div>
  );
};
