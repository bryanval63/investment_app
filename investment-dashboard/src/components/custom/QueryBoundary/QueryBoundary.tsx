import type { FetchStatus } from "@tanstack/react-query";
import { Loader } from "../Loader/Loader";

type QueryBoundaryProps = {
  query: {
    fetchStatus: FetchStatus;
    error: unknown;
  };
  children: React.ReactNode;
};

export const QueryBoundary = ({ query, children }: QueryBoundaryProps) => {
  if (query.fetchStatus === "fetching")
    return (
      <div className="flex justify-center items-center h-full w-full absolute">
        <Loader />
      </div>
    );

  if (query.error) {
    console.error(query.error);
  }

  return children;
};
