import { IKoaAuthContext } from "../../typing";
import { orderBy } from "lodash";
import { Account } from "../../entity";

export interface IGetAccountSessionsData {
  created: Date;
  expires: Date;
  id: string;
  scope: Array<string>;
  updated: Date;
}

export const getAccountSessions = (ctx: IKoaAuthContext) => async (
  account: Account,
): Promise<Array<IGetAccountSessionsData>> => {
  const { repository } = ctx;

  const sessions = await repository.session.findMany({ accountId: account.id });
  const sessionArray = [];

  for (const session of sessions) {
    sessionArray.push({
      created: session.created,
      expires: session.expires,
      id: session.id,
      scope: session.scope,
      updated: session.updated,
    });
  }

  return orderBy(sessionArray, ["expired", "expires"], ["asc", "desc"]);
};
