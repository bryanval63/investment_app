import type { ReactElement } from "react";

type MainContainerProps = {
  children: ReactElement | ReactElement[];
  columns?: number;
};

export const MainContainer = ({
  children,
  columns = 2,
}: MainContainerProps) => {
  return <div className={`flex flex-col lg:grid lg:grid-cols-${columns} gap-3 lg:gap-8`}>{children}</div>;
};

