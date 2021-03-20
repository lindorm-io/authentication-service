import { IKoaAuthContext } from "../../typing";
import { orderBy } from "lodash";
import { Account, ISessionAgent } from "../../entity";

export interface IGetAccountSessionsData {
  agent: ISessionAgent;
  created: Date;
  expires: Date;
  id: string;
  scope: string;
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
      agent: session.agent,
      created: session.created,
      expires: session.expires,
      id: session.id,
      scope: session.scope,
      updated: session.updated,
    });
  }

  return orderBy(sessionArray, ["expired", "expires"], ["asc", "desc"]);
};
