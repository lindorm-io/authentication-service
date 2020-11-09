import Joi from "@hapi/joi";
import { IAuthContext } from "../typing";
import { InvalidClientError, AssertClientSecretError, RejectedClientError } from "../error";
import { TPromise } from "@lindorm-io/core";
import { assertClientSecret } from "../support";

const schema = Joi.object({
  clientId: Joi.string().guid().required(),
  clientSecret: Joi.string(),
});

export const clientMiddleware = async (ctx: IAuthContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { logger, repository } = ctx;
  const { clientId, clientSecret } = ctx.request.body;

  await schema.validateAsync({ clientId, clientSecret });

  try {
    ctx.client = await repository.client.find({ id: clientId });
  } catch (err) {
    throw new InvalidClientError(clientId, err);
  }

  if (!ctx.client.approved) {
    throw new RejectedClientError(clientId);
  }

  if (ctx.client.secret) {
    try {
      assertClientSecret(ctx.client, clientSecret);
    } catch (err) {
      throw new AssertClientSecretError(clientId, err);
    }
  }

  logger.debug("client validated", { clientId });

  ctx.metrics = {
    ...(ctx.metrics || {}),
    client: Date.now() - start,
  };

  await next();
};
