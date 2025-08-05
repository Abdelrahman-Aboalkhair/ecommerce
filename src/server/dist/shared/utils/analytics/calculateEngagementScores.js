"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEngagementScores = void 0;
const calculateEngagementScores = (interactions) => {
    const scores = {};
    interactions.forEach((interaction) => {
        const userId = interaction.userId;
        if (!scores[userId])
            scores[userId] = 0;
        switch (interaction.type.toLowerCase()) {
            case "view":
                scores[userId] += 1;
                break;
            case "click":
                scores[userId] += 2;
                break;
            default:
                scores[userId] += 3;
        }
    });
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const averageScore = Object.keys(scores).length > 0
        ? totalScore / Object.keys(scores).length
        : 0;
    return { scores, averageScore };
};
exports.calculateEngagementScores = calculateEngagementScores;
