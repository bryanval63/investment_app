import type { ReactElement } from "react";

type MainContainerProps = {
  children: ReactElement | ReactElement[];
  columns?: number;
};

export const MainContainer = ({
  children,
  columns = 2,
}: MainContainerProps) => {
  return <div className={`flex flex-col md:grid md:grid-cols-${columns} gap-3 md:gap-8`}>{children}</div>;
};
