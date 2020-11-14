import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { KeyType } from "@lindorm-io/key-pair";
import { assertAccountAdmin, generateKeyPair } from "../../support";

export interface ICreateKeyPairOptions {
  type: KeyType;
}

export interface ICreateKeyPairData {
  algorithm: string;
  keyPairId: string;
  type: string;
}

const schema = Joi.object({
  type: Joi.string().valid(KeyType.EC, KeyType.RSA).required(),
});

export const createKeyPair = (ctx: IAuthContext) => async (
  options: ICreateKeyPairOptions,
): Promise<ICreateKeyPairData> => {
  await schema.validateAsync(options);

  const { cache, logger, repository } = ctx;
  const { type } = options;

  await assertAccountAdmin(ctx)();

  const keyPair = await generateKeyPair(type);

  await repository.keyPair.create(keyPair);
  await cache.keyPair.create(keyPair);

  logger.debug("key pair created", {
    algorithm: keyPair.algorithm,
    id: keyPair.id,
    type: keyPair.type,
  });

  return {
    algorithm: keyPair.algorithm,
    keyPairId: keyPair.id,
    type: keyPair.type,
  };
};
