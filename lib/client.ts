import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({
  clientId:
    process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
    (() => {
      throw new Error("NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not defined");
    })(),
});

export default client;
