import { api } from "@/utils/fetch.utils";
import type {
  NetWorthRequestDto,
  NetWorthResponseDto,
} from "@investments/shared";

const NET_WORTHES_URL = "net-worthes";

/** Toutes les saisies, ou celles d'une année civile. */
export const getNetWorthesApi = (year?: number) =>
  api<NetWorthResponseDto[]>(
    "GET",
    year === undefined ? NET_WORTHES_URL : `${NET_WORTHES_URL}?year=${year}`,
  );

export const postNetWorthApi = (netWorth: NetWorthRequestDto) =>
  api<NetWorthRequestDto>("POST", NET_WORTHES_URL, netWorth);

export const patchNetWorthApi = (id: number, netWorth: NetWorthRequestDto) =>
  api<NetWorthResponseDto>("PATCH", `${NET_WORTHES_URL}/${id}`, netWorth);

export const deleteNetWorthApi = (id: number) =>
  api<void>("DELETE", `${NET_WORTHES_URL}/${id}`);
