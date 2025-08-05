"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldFetchPreviousPeriod = void 0;
// Determine if the previous period should be fetched
const shouldFetchPreviousPeriod = (timePeriod) => timePeriod !== "allTime" && timePeriod !== "custom";
exports.shouldFetchPreviousPeriod = shouldFetchPreviousPeriod;
