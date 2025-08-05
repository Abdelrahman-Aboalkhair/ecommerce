"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiFeatures {
    constructor(queryString) {
        this.queryOptions = {};
        this.queryString = queryString;
    }
    filter() {
        // Create a mutable copy of the query string and remove keys reserved for pagination, sorting, etc.
        const queryObj = Object.assign({}, this.queryString);
        const excludedFields = ["page", "sort", "limit", "fields", "searchQuery"];
        excludedFields.forEach((el) => delete queryObj[el]);
        // Initialize the filters object that will become the Prisma "where" clause.
        const filters = {};
        // If there's a search query, filter the product name via a case-insensitive "contains" search.
        if (this.queryString.searchQuery) {
            filters.name = {
                contains: this.queryString.searchQuery,
                mode: "insensitive",
            };
        }
        // Explicitly handle category filtering by matching the category's slug.
        if (this.queryString.category) {
            filters.category = {
                is: {
                    slug: {
                        equals: this.queryString.category,
                        mode: "insensitive",
                    },
                },
            };
            delete queryObj["category"];
        }
        // Explicitly handle boolean flag filters so that we use equality instead of "contains".
        if (this.queryString.bestselling) {
            // "bestselling" query parameter is mapped to the "bestSeller" boolean field in Product.
            filters.bestSeller =
                this.queryString.bestselling.toLowerCase() === "true";
            delete queryObj["bestselling"];
        }
        if (this.queryString.featured) {
            filters.featured = this.queryString.featured.toLowerCase() === "true";
            delete queryObj["featured"];
        }
        if (this.queryString.promotional) {
            filters.promotional =
                this.queryString.promotional.toLowerCase() === "true";
            delete queryObj["promotional"];
        }
        if (this.queryString.newarrival) {
            // Use "newarrival" in the query URL to map to the "newArrival" field.
            filters.newArrival = this.queryString.newarrival.toLowerCase() === "true";
            delete queryObj["newarrival"];
        }
        // For all other keys remaining in queryObj, create filters by checking if the field's value
        // contains the query string value (or is included in a list if comma-delimited).
        for (const key in queryObj) {
            if (queryObj[key]) {
                const value = queryObj[key];
                // When value is an array, use the "in" operator.
                if (Array.isArray(value)) {
                    filters[key] = { in: value };
                }
                // When the value is a comma-separated string, split it and apply the "in" operator.
                else if (typeof value === "string" && value.includes(",")) {
                    filters[key] = { in: value.split(",") };
                }
                // Otherwise, apply a case-insensitive "contains" filter.
                else {
                    filters[key] = {
                        contains: value,
                        mode: "insensitive",
                    };
                }
            }
        }
        this.queryOptions.where = filters;
        return this;
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").map((field) => {
                const [key, order] = field.split(":");
                return { [key]: order || "asc" };
            });
            this.queryOptions.orderBy = sortBy;
        }
        return this;
    }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields
                .split(",")
                .reduce((acc, field) => {
                acc[field] = true;
                return acc;
            }, {});
            this.queryOptions.select = fields;
        }
        return this;
    }
    paginate() {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 16;
        const skip = (page - 1) * limit;
        this.queryOptions.skip = skip;
        this.queryOptions.take = limit;
        return this;
    }
    build() {
        return this.queryOptions;
    }
}
exports.default = ApiFeatures;
