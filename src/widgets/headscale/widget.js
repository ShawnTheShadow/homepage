import credentialedProxyHandler from "utils/proxy/handlers/credentialed";

const widget = {
  api: "https://ts.stsg.io/api/v1/{endpoint}/{deviceid}",
  proxyHandler: credentialedProxyHandler,

  mappings: {
    device: {
      endpoint: "node",
    },
  },
};

export default widget;
