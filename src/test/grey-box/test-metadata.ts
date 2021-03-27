import { IKoaAppMetadata } from "@lindorm-io/koa";

export const getTestMetadata = (): IKoaAppMetadata => ({
  clientId: "9ba5e0c5-f2aa-4706-a27d-66369b547b0b",
  clientEnvironment: "test",
  clientName: "test-client-name",
  clientPlatform: "platform",
  clientVersion: "99.99.99+999",
  correlationId: "4cecde23-5fa4-4366-bc68-30a3aecbb4cf",
  deviceId: "4a8c6c97-6155-4ddf-b02f-696cf0ec8dd5",
  installationId: "76e7d58f-99c2-4cbb-9fe3-a633c6013186",
  sessionId: "6acb48a8-1995-4b13-b83b-15bc103fa8f3",
});
