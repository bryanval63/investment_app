import type {
  SettingResponseDto,
  UpdateSettingRequestDto,
} from "@investments/shared";
import { api } from "@/utils/fetch.utils";

const SETTINGS_URL = "settings";

export const getSettingsApi = () =>
  api<SettingResponseDto[]>("GET", SETTINGS_URL);

export const updateSettingApi = (setting: UpdateSettingRequestDto) =>
  api<SettingResponseDto>("PUT", SETTINGS_URL, setting);
