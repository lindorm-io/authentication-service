import axios from "axios";
import { Account } from "../entity";
import { IDENTITY_SERVICE_BASIC_AUTH, IDENTITY_SERVICE_BASE_URL } from "../config";
import { IOpenIdClaims } from "../typing";

export interface IEnsureIdentityData {
  created: string;
  updated: string;
}

export const ensureIdentity = async (account: Account): Promise<IEnsureIdentityData> => {
  const url = new URL(`/headless/create/${account.id}`, IDENTITY_SERVICE_BASE_URL);

  const response = await axios.post(url.toString(), null, { auth: IDENTITY_SERVICE_BASIC_AUTH });

  return response?.data as IEnsureIdentityData;
};

export const getOpenIdClaims = async (account: Account, scope: string): Promise<any> => {
  const url = new URL(`/headless/open-id/${account.id}`, IDENTITY_SERVICE_BASE_URL);

  const response = await axios.post(url.toString(), { scope }, { auth: IDENTITY_SERVICE_BASIC_AUTH });

  return response?.data as IOpenIdClaims;
};
