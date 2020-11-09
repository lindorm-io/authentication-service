import Joi from "@hapi/joi";
import { JOI_JWT_TOKEN } from "../../constant";
import { IAuthContext } from "../../typing";
import { assertAccountPermission } from "../../support";

export interface ILogoutWithTokenOptions {
  refreshToken?: string;
}

const schema = Joi.object({
  refreshToken: JOI_JWT_TOKEN,
});

export const logoutWithToken = (ctx: IAuthContext) => async (options?: ILogoutWithTokenOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { repository, token } = ctx;
  const {
    refresh: { subject: sessionId },
  } = token;

  const session = await repository.session.find({ id: sessionId });

  await assertAccountPermission(ctx)(session.accountId);

  await repository.session.remove(session);
};
