import axios from "axios";
import { Account } from "../entity";
import { IDENTITY_SERVICE_BASIC_AUTH, IDENTITY_SERVICE_BASE_URL } from "../config";
import { IOpenIdClaims } from "../typing";
import { camelKeys } from "@lindorm-io/core";

interface IRequestEnsureIdentityData {
  created: Date;
  updated: Date;
}

export const requestEnsureIdentity = async (account: Account): Promise<IRequestEnsureIdentityData> => {
  const url = new URL(`/headless/create/${account.id}`, IDENTITY_SERVICE_BASE_URL);

  const response = await axios.post(url.toString(), null, { auth: IDENTITY_SERVICE_BASIC_AUTH });

  const created = response.data?.created ? new Date(response.data.created) : undefined;
  const updated = response.data?.updated ? new Date(response.data.updated) : undefined;

  return {
    created,
    updated,
  };
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
