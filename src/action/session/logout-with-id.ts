import Joi from "@hapi/joi";
import { IKoaAuthContext } from "../../typing";
import { assertAccountPermission } from "../../support";

export interface ILogoutWithIdOptions {
  sessionId?: string;
}

const schema = Joi.object({
  sessionId: Joi.string().guid().required(),
});

export const logoutWithId = (ctx: IKoaAuthContext) => async (options?: ILogoutWithIdOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { repository } = ctx;
  const { sessionId } = options;

  const session = await repository.session.find({ id: sessionId });

  await assertAccountPermission(ctx)(session.accountId);

  await repository.session.remove(session);
};
