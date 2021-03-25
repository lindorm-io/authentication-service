import axios from "axios";
import { Account } from "../entity";
import { IDENTITY_SERVICE_BASIC_AUTH, IDENTITY_SERVICE_BASE_URL } from "../config";
import { IOpenIdClaims } from "../typing";

export interface IEnsureIdentityData {
  created: string;
  updated: string;
}

export const requestEnsureIdentity = async (account: Account): Promise<IEnsureIdentityData> => {
  const url = new URL(`/headless/create/${account.id}`, IDENTITY_SERVICE_BASE_URL);

  const response = await axios.post(url.toString(), null, { auth: IDENTITY_SERVICE_BASIC_AUTH });

  return response?.data as IEnsureIdentityData;
};

export const requestOpenIdClaims = async (account: Account, scope: string): Promise<IOpenIdClaims> => {
  const url = new URL(`/headless/open-id/${account.id}`, IDENTITY_SERVICE_BASE_URL);

  const response = await axios.post(url.toString(), { scope }, { auth: IDENTITY_SERVICE_BASIC_AUTH });

  return response?.data as IOpenIdClaims;
};

export const requestOpenIdInformation = async (accessToken: string): Promise<IOpenIdClaims> => {
  const url = new URL("/open-id", IDENTITY_SERVICE_BASE_URL);

  const response = await axios.get(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response?.data as IOpenIdClaims;
};
