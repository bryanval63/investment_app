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
