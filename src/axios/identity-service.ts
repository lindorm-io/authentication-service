import { Account } from "../entity";
import { AuthType } from "@lindorm-io/axios/dist/enum";
import { IKoaAuthContext, IOpenIdClaims } from "../typing";
import { axiosBearerAuthMiddleware } from "@lindorm-io/axios";
import { isString } from "lodash";

interface IRequestEnsureIdentityData {
  created: Date;
  updated: Date;
}

export const requestEnsureIdentity = (ctx: IKoaAuthContext) => async (
  account: Account,
): Promise<IRequestEnsureIdentityData> => {
  const {
    axios: { identity },
  } = ctx;

  const response = await identity.post(`/headless/create/${account.id}`, {
    auth: AuthType.BASIC,
  });

  const created = isString(response.data?.created) ? new Date(response.data.created) : undefined;
  const updated = isString(response.data?.updated) ? new Date(response.data.updated) : undefined;

  return {
    created,
    updated,
  };
};

export const requestOpenIdClaims = (ctx: IKoaAuthContext) => async (
  account: Account,
  scope: Array<string>,
): Promise<IOpenIdClaims> => {
  const {
    axios: { identity },
  } = ctx;

  const response = await identity.post(`/headless/create/${account.id}`, {
    auth: AuthType.BASIC,
    data: { scope },
  });

  return response?.data as IOpenIdClaims;
};

export const requestOpenIdInformation = (ctx: IKoaAuthContext) => async (
  accessToken: string,
): Promise<IOpenIdClaims> => {
  const {
    axios: { identity },
  } = ctx;

  const response = await identity.get("/open-id", {
    auth: AuthType.NONE,
    middleware: [axiosBearerAuthMiddleware(accessToken)],
  });

  return response?.data as IOpenIdClaims;
};
