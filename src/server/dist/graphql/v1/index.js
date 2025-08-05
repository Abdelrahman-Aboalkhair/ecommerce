"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverV1 = void 0;
const server_1 = require("@apollo/server");
const schema_1 = require("./schema");
exports.serverV1 = new server_1.ApolloServer({
    schema: schema_1.combinedSchemas,
    introspection: process.env.NODE_ENV !== "production",
    includeStacktraceInErrorResponses: process.env.NODE_ENV !== "production",
});
