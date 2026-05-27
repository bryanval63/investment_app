import type { ReactElement } from "react";

type MainContainerProps = {
  children: ReactElement | ReactElement[];
  columns?: number;
};

export const MainContainer = ({
  children,
  columns = 2,
}: MainContainerProps) => {
  return <div className={`grid grid-cols-${columns} gap-8`}>{children}</div>;
};
