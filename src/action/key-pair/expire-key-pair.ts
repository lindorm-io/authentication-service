import Joi from "@hapi/joi";
import { IKoaAuthContext } from "../../typing";
import { InvalidExpiryString } from "../../error";
import { add } from "date-fns";
import { assertAccountAdmin } from "../../support";
import { stringToDurationObject, stringToMilliseconds } from "@lindorm-io/core";

export interface IExpireKeyPairOptions {
  keyPairId: string;
  expires: string;
}

const schema = Joi.object({
  keyPairId: Joi.string().guid().required(),
  expires: Joi.string().required(),
});

export const expireKeyPair = (ctx: IKoaAuthContext) => async (options: IExpireKeyPairOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { cache, logger, repository } = ctx;
  const { expires, keyPairId } = options;

  await assertAccountAdmin(ctx)();

  if (stringToMilliseconds(expires) === 0) {
    throw new InvalidExpiryString(expires);
  }

  const keyPair = await repository.keyPair.find({ id: keyPairId });

  keyPair.expires = add(new Date(), stringToDurationObject(expires));

  const updated = await repository.keyPair.update(keyPair);

  try {
    await cache.keyPair.update(updated);
  } catch (err) {
    logger.error("could not update cache", err);
  }

  logger.debug("key pair updated", {
    id: keyPair.id,
    expires: keyPair.expires,
  });
};
