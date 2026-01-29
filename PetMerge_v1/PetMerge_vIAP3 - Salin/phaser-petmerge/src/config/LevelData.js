/**
 * Level Mission Data for Adventure Mode
 * Converted from Construct 3 Project
 *
 * goalsID mapping:
 * 0 = Betta Fish, 1 = Hamster, 2 = Canary, 3 = Hedgehog, 4 = Sugar Glider
 * 5 = Owl, 6 = Ferret, 7 = Rabbit, 8 = Racoon, 9 = Cat, 10 = Dog
 * 11 = Alpaca, 12 = Albino Lion
 */

const LEVEL_DATA = [
    {
        level: 1,
        goals: [{ petLevel: 5, qty: 2 }], // Create 2 Owls
        moves: 50,
        probabilities: [0.40, 0.40, 0.10, 0.10, 0.00, 0.00]
    },
    {
        level: 2,
        goals: [{ petLevel: 6, qty: 3 }], // Create 3 Ferrets
        moves: 50,
        probabilities: [0.20, 0.20, 0.20, 0.00, 0.40, 0.00]
    },
    {
        level: 3,
        goals: [{ petLevel: 7, qty: 1 }], // Create 1 Rabbit
        moves: 50,
        probabilities: [0.20, 0.20, 0.30, 0.10, 0.00, 0.00]
    },
    {
        level: 4,
        goals: [{ petLevel: 7, qty: 2 }], // Create 2 Rabbits
        moves: 90,
        probabilities: [0.30, 0.30, 0.20, 0.10, 0.10, 0.00]
    },
    {
        level: 5,
        goals: [{ petLevel: 6, qty: 2 }], // Create 2 Ferrets
        moves: 50,
        probabilities: [0.40, 0.20, 0.20, 0.20, 0.00, 0.00]
    },
    {
        level: 6,
        goals: [{ petLevel: 6, qty: 2 }], // Create 2 Ferrets
        moves: 40,
        probabilities: [0.40, 0.40, 0.15, 0.05, 0.00, 0.00]
    },
    {
        level: 7,
        goals: [{ petLevel: 6, qty: 1 }], // Create 1 Ferret
        moves: 40,
        probabilities: [0.20, 0.40, 0.30, 0.10, 0.00, 0.00]
    },
    {
        level: 8,
        goals: [{ petLevel: 5, qty: 3 }], // Create 3 Owls
        moves: 40,
        probabilities: [0.40, 0.20, 0.20, 0.10, 0.10, 0.00]
    },
    {
        level: 9,
        goals: [{ petLevel: 6, qty: 2 }], // Create 2 Ferrets
        moves: 30,
        probabilities: [0.50, 0.15, 0.20, 0.00, 0.15, 0.00]
    },
    {
        level: 10,
        goals: [{ petLevel: 7, qty: 1 }, { petLevel: 5, qty: 2 }], // 1 Rabbit + 2 Owls
        moves: 50,
        probabilities: [0.60, 0.15, 0.10, 0.00, 0.15, 0.00]
    },
    {
        level: 11,
        goals: [{ petLevel: 7, qty: 2 }],
        moves: 50,
        probabilities: [0.30, 0.20, 0.00, 0.30, 0.20, 0.00]
    },
    {
        level: 12,
        goals: [{ petLevel: 9, qty: 1 }], // Create 1 Cat
        moves: 50,
        probabilities: [0.20, 0.20, 0.30, 0.30, 0.00, 0.00]
    },
    {
        level: 13,
        goals: [{ petLevel: 6, qty: 2 }],
        moves: 35,
        probabilities: [0.30, 0.10, 0.30, 0.30, 0.00, 0.00]
    },
    {
        level: 14,
        goals: [{ petLevel: 5, qty: 3 }, { petLevel: 6, qty: 2 }],
        moves: 35,
        probabilities: [0.20, 0.20, 0.30, 0.30, 0.00, 0.00]
    },
    {
        level: 15,
        goals: [{ petLevel: 7, qty: 2 }],
        moves: 35,
        probabilities: [0.40, 0.40, 0.15, 0.05, 0.00, 0.00]
    },
    {
        level: 16,
        goals: [{ petLevel: 8, qty: 1 }], // Create 1 Racoon
        moves: 50,
        probabilities: [0.40, 0.40, 0.10, 0.10, 0.00, 0.00]
    },
    {
        level: 17,
        goals: [{ petLevel: 6, qty: 2 }, { petLevel: 5, qty: 3 }],
        moves: 25,
        probabilities: [0.40, 0.40, 0.15, 0.05, 0.00, 0.00]
    },
    {
        level: 18,
        goals: [{ petLevel: 7, qty: 2 }],
        moves: 50,
        probabilities: [0.40, 0.40, 0.15, 0.05, 0.00, 0.00]
    },
    {
        level: 19,
        goals: [{ petLevel: 5, qty: 3 }],
        moves: 50,
        probabilities: [0.45, 0.40, 0.15, 0.00, 0.00, 0.00]
    },
    {
        level: 20,
        goals: [{ petLevel: 8, qty: 1 }, { petLevel: 5, qty: 2 }],
        moves: 40,
        probabilities: [0.45, 0.40, 0.10, 0.05, 0.00, 0.00]
    },
    {
        level: 21,
        goals: [{ petLevel: 7, qty: 1 }, { petLevel: 6, qty: 2 }],
        moves: 45,
        probabilities: [0.30, 0.20, 0.25, 0.10, 0.15, 0.00]
    },
    {
        level: 22,
        goals: [{ petLevel: 6, qty: 3 }],
        moves: 25,
        probabilities: [0.50, 0.20, 0.20, 0.10, 0.00, 0.00]
    },
    {
        level: 23,
        goals: [{ petLevel: 8, qty: 1 }],
        moves: 50,
        probabilities: [0.20, 0.30, 0.20, 0.10, 0.10, 0.10]
    },
    {
        level: 24,
        goals: [{ petLevel: 7, qty: 2 }],
        moves: 40,
        probabilities: [0.30, 0.25, 0.20, 0.10, 0.10, 0.00]
    },
    {
        level: 25,
        goals: [{ petLevel: 7, qty: 1 }, { petLevel: 8, qty: 1 }],
        moves: 50,
        probabilities: [0.30, 0.20, 0.15, 0.10, 0.10, 0.05]
    },
    {
        level: 26,
        goals: [{ petLevel: 6, qty: 4 }],
        moves: 45,
        probabilities: [0.30, 0.30, 0.20, 0.20, 0.00, 0.00]
    },
    {
        level: 27,
        goals: [{ petLevel: 5, qty: 3 }, { petLevel: 6, qty: 1 }, { petLevel: 7, qty: 1 }],
        moves: 35,
        probabilities: [0.40, 0.40, 0.10, 0.05, 0.05, 0.00]
    },
    {
        level: 28,
        goals: [{ petLevel: 8, qty: 1 }, { petLevel: 7, qty: 1 }],
        moves: 55,
        probabilities: [0.30, 0.30, 0.20, 0.10, 0.00, 0.00]
    },
    {
        level: 29,
        goals: [{ petLevel: 7, qty: 2 }],
        moves: 30,
        probabilities: [0.50, 0.40, 0.10, 0.00, 0.00, 0.00]
    },
    {
        level: 30,
        goals: [{ petLevel: 9, qty: 1 }], // Create a Cat!
        moves: 60,
        probabilities: [0.40, 0.40, 0.15, 0.05, 0.00, 0.00]
    }
];
