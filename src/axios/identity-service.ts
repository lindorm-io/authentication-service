import axios from "axios";
import { IDENTITY_SERVICE_BASIC_AUTH, IDENTITY_SERVICE_BASE_URL } from "../config";

export const ensureIdentity = async (id: string): Promise<any> => {
  const url = new URL(`/headless/${id}`, IDENTITY_SERVICE_BASE_URL);

  const response = await axios.post(url.toString(), null, {
    auth: IDENTITY_SERVICE_BASIC_AUTH,
  });

  const { created, updated } = response?.data;

  return {
    created,
    updated,
  };
};

export const getOpenIdClaims = async (id: string, accessToken: string): Promise<any> => {
  const url = new URL(`/open-id/${id}`, IDENTITY_SERVICE_BASE_URL);

  const response = await axios.get(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response?.data;
};
