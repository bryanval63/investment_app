import type { FetchStatus } from "@tanstack/react-query";
import { Loader } from "../Loader/Loader";

type QueryBoundaryProps = {
  query: {
    fetchStatus: FetchStatus;
    error: unknown;
    data?: unknown;
  };
  children: React.ReactNode;
};

export const QueryBoundary = ({ query, children }: QueryBoundaryProps) => {
  if (query.fetchStatus === "fetching" && query.data === undefined)
    return (
      <div className="flex min-h-64 w-full items-center justify-center">
        <Loader />
      </div>
    );

  if (query.error) {
    console.error(query.error);
  }

  return children;
};
