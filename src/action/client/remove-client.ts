import Joi from "@hapi/joi";
import { IKoaAuthContext } from "../../typing";
import { assertAccountAdmin } from "../../support";

export interface IRemoveClientOptions {
  clientId: string;
}

const schema = Joi.object({
  clientId: Joi.string().guid().required(),
});

export const removeClient = (ctx: IKoaAuthContext) => async (options: IRemoveClientOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account, cache, logger, repository } = ctx;
  const { clientId } = options;

  const client = await repository.client.find({ id: clientId });

  await assertAccountAdmin(ctx)();

  await repository.client.remove(client);
  await cache.client.remove(client);

  logger.debug("client removed", {
    accountId: account.id,
    clientId: client.id,
  });
};
