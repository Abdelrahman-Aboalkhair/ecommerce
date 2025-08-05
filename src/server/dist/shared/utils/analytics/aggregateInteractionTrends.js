"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateInteractionTrends = void 0;
const aggregateInteractionTrends = (interactions) => {
    // Define the months of the year for later use in visualizing trends
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    // Initialize the structure to hold aggregated interaction data per month => for instance: { "Jan": { views: 0, clicks: 0, others: 0 } }
    const interactionTrends = {};
    // Set up a basic structure for all months, starting with zero counts for all interaction types
    months.forEach((_, index) => {
        interactionTrends[index + 1] = { views: 0, clicks: 0, others: 0 };
    });
    // Iterate through each interaction, categorizing it by month and type (view, click, or others)
    interactions.forEach((interaction) => {
        // Get the month number (1-12) based on the interaction timestamp
        const month = interaction.createdAt.getMonth() + 1;
        // Categorize interactions by type and increment the respective count for that month
        switch (interaction.type.toLowerCase()) {
            case "view":
                interactionTrends[month].views += 1; // Increment views for this month
                break;
            case "click":
                interactionTrends[month].clicks += 1; // Increment clicks for this month
                break;
            default:
                interactionTrends[month].others += 1; // For all other types, increment 'others'
        }
    });
    // Prepare the data to return, with month labels and aggregated counts for each interaction type
    return {
        labels: months, // Labels for the x-axis (months of the year)
        // Aggregate the views, clicks, and others into arrays, one value for each month
        views: months.map((_, index) => interactionTrends[index + 1].views),
        clicks: months.map((_, index) => interactionTrends[index + 1].clicks),
        others: months.map((_, index) => interactionTrends[index + 1].others),
    };
};
exports.aggregateInteractionTrends = aggregateInteractionTrends;
