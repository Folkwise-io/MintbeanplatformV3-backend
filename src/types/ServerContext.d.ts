interface ServerContext {
  req: Req;
  // TODO: add anything else we want to pass down to our resolvers once a request is received
}

interface Req {
  // TODO: add keys such as cookies etc. that we need to process in the resolvers
}
