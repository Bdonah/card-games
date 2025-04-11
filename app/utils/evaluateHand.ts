// export type Card = {
//   rank: string;
//   suit: string;
// };

// export type HandResult = {
//   name: string;
//   rank: number;   // Higher is better
//   tiebreaker: number[]; // Extra numbers to compare if same hand type
// };

// const rankValues: Record<string, number> = {
//   "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
//   "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14,
// };

// export function evaluateHand(cards: Card[]): HandResult {
//   const values = cards.map(c => rankValues[c.rank]).sort((a, b) => b - a);
//   const suits = cards.map(c => c.suit);

//   const valueCounts: Record<number, number> = {};
//   values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);

//   const suitCounts: Record<string, number> = {};
//   suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);

//   const flushSuit = Object.keys(suitCounts).find(suit => suitCounts[suit] >= 5);
//   const flushCards = flushSuit ? cards.filter(c => c.suit === flushSuit) : [];

//   const uniqueValues = [...new Set(values)].sort((a, b) => b - a);
//   let straightHigh = 0;
//   for (let i = 0; i <= uniqueValues.length - 5; i++) {
//     if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
//       straightHigh = uniqueValues[i];
//       break;
//     }
//   }
//   if (uniqueValues.includes(14) && uniqueValues.includes(5)) {
//     if ([5, 4, 3, 2].every(v => uniqueValues.includes(v))) {
//       straightHigh = 5;
//     }
//   }

//   // Straight Flush
//   if (flushCards.length >= 5) {
//     const flushValues = flushCards.map(c => rankValues[c.rank]).sort((a, b) => b - a);
//     const uniqueFlushValues = [...new Set(flushValues)];
//     for (let i = 0; i <= uniqueFlushValues.length - 5; i++) {
//       if (uniqueFlushValues[i] - uniqueFlushValues[i + 4] === 4) {
//         return {
//           name: uniqueFlushValues[i] === 14 ? "Royal Flush" : "Straight Flush",
//           rank: 9,
//           tiebreaker: [uniqueFlushValues[i]],
//         };
//       }
//     }
//   }

//   // Four of a Kind
//   const four = Object.entries(valueCounts).find(([, count]) => count === 4);
//   if (four) {
//     const kicker = values.find(v => v !== Number(four[0]))!;
//     return {
//       name: "Four of a Kind",
//       rank: 8,
//       tiebreaker: [Number(four[0]), kicker],
//     };
//   }

//   // Full House
//   const threes = Object.entries(valueCounts).filter(([, count]) => count === 3).map(([val]) => Number(val));
//   const pairs = Object.entries(valueCounts).filter(([, count]) => count === 2).map(([val]) => Number(val));
//   if (threes.length && pairs.length) {
//     return {
//       name: "Full House",
//       rank: 7,
//       tiebreaker: [threes[0], pairs[0]],
//     };
//   }
//   if (threes.length >= 2) {
//     return {
//       name: "Full House",
//       rank: 7,
//       tiebreaker: [threes[0], threes[1]],
//     };
//   }

//   // Flush
//   if (flushCards.length >= 5) {
//     const flushValues = flushCards.map(c => rankValues[c.rank]).sort((a, b) => b - a).slice(0, 5);
//     return {
//       name: "Flush",
//       rank: 6,
//       tiebreaker: flushValues,
//     };
//   }

//   // Straight
//   if (straightHigh > 0) {
//     return {
//       name: "Straight",
//       rank: 5,
//       tiebreaker: [straightHigh],
//     };
//   }

//   // Three of a Kind
//   if (threes.length) {
//     const kickers = values.filter(v => v !== threes[0]).slice(0, 2);
//     return {
//       name: "Three of a Kind",
//       rank: 4,
//       tiebreaker: [threes[0], ...kickers],
//     };
//   }

//   // Two Pair
//   if (pairs.length >= 2) {
//     pairs.sort((a, b) => b - a);
//     const kicker = values.find(v => v !== pairs[0] && v !== pairs[1])!;
//     return {
//       name: "Two Pair",
//       rank: 3,
//       tiebreaker: [pairs[0], pairs[1], kicker],
//     };
//   }

//   // One Pair
//   if (pairs.length === 1) {
//     const kickers = values.filter(v => v !== pairs[0]).slice(0, 3);
//     return {
//       name: "One Pair",
//       rank: 2,
//       tiebreaker: [pairs[0], ...kickers],
//     };
//   }

//   // High Card
//   return {
//     name: "High Card",
//     rank: 1,
//     tiebreaker: values.slice(0, 5),
//   };
// }