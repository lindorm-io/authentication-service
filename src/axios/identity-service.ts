import axios from "axios";
import { Account } from "../entity";
import { IDENTITY_SERVICE_BASIC_AUTH, IDENTITY_SERVICE_BASE_URL } from "../config";
import { IOpenIdClaims } from "../typing";
import { camelKeys } from "@lindorm-io/core";

export const requestEnsureIdentity = async (account: Account): Promise<void> => {
  const url = new URL(`/headless/create/${account.id}`, IDENTITY_SERVICE_BASE_URL);

  await axios.post(url.toString(), null, { auth: IDENTITY_SERVICE_BASIC_AUTH });
};

export const requestOpenIdClaims = async (account: Account, scope: Array<string>): Promise<IOpenIdClaims> => {
  const url = new URL(`/headless/open-id/${account.id}`, IDENTITY_SERVICE_BASE_URL);

  const response = await axios.post(url.toString(), { scope }, { auth: IDENTITY_SERVICE_BASIC_AUTH });

  return camelKeys(response?.data || {}) as IOpenIdClaims;
};

export const requestOpenIdInformation = async (accessToken: string): Promise<IOpenIdClaims> => {
  const url = new URL("/open-id", IDENTITY_SERVICE_BASE_URL);

  const response = await axios.get(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return camelKeys(response?.data || {}) as IOpenIdClaims;
};
