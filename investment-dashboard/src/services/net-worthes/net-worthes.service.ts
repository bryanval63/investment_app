import { api } from "@/utils/fetch.utils";
import type {
  NetWorthRequestDto,
  NetWorthResponseDto,
} from "@investments/shared";

const NET_WORTHES_URL = "net-worthes";

export const getNetWorthesApi = () =>
  api<NetWorthResponseDto[]>("GET", NET_WORTHES_URL);

export const postNetWorthApi = (netWorth: NetWorthRequestDto) =>
  api<NetWorthRequestDto>("POST", NET_WORTHES_URL, netWorth);

export const patchNetWorthApi = (id: number, netWorth: NetWorthRequestDto) =>
  api<NetWorthResponseDto>("PATCH", `${NET_WORTHES_URL}/${id}`, netWorth);

export const deleteNetWorthApi = (id: number) =>
  api<void>("DELETE", `${NET_WORTHES_URL}/${id}`);
