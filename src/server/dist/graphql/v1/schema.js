"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinedSchemas = void 0;
const schema_1 = require("@/modules/analytics/graphql/schema");
const schema_2 = require("@/modules/product/graphql/schema");
const schema_3 = require("@graphql-tools/schema");
exports.combinedSchemas = (0, schema_3.mergeSchemas)({
    schemas: [schema_1.analyticsSchema, schema_2.productSchema],
});
