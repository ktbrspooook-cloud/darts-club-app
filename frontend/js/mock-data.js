const mockData = {
  currentUser: {
    userId: "usr_komatsuzaki",
    displayName: "小松崎",
    role: "admin",
  },

  users: [
    {
      userId: "usr_komatsuzaki",
      displayName: "小松崎",
    },
    {
      userId: "usr_mare",
      displayName: "mare",
    },
    {
      userId: "usr_sato",
      displayName: "佐藤",
    },
    {
      userId: "usr_suzuki",
      displayName: "鈴木",
    },
  ],

  events: [
    {
      eventId: "evt_20260620",
      eventDate: "2026-06-20",
      eventName: "2026年6月ダーツ部",
      startTime: "18:00",
      endTime: "21:00",
      location: "社内ダーツスペース",
      participantIds: [
        "usr_komatsuzaki",
        "usr_mare",
        "usr_sato",
        "usr_suzuki",
      ],
    },
    {
      eventId: "evt_20260718",
      eventDate: "2026-07-18",
      eventName: "2026年7月ダーツ部",
      startTime: "18:00",
      endTime: "21:00",
      location: "社内ダーツスペース",
      participantIds: [],
    },
    {
      eventId: "evt_20260725",
      eventDate: "2026-07-25",
      eventName: "7月練習会",
      startTime: "14:00",
      endTime: "17:00",
      location: "高田馬場ダーツバー",
      participantIds: [
        "usr_komatsuzaki",
        "usr_mare",
      ],
    },
  ],

  zeroOneGames: [
    {
      gameId: "game_20260620_01",
      eventId: "evt_20260620",
      gameType: "ZERO_ONE",
      gameFormat: "701",
      gameSequence: 1,
      participants: [
        {
          userId: "usr_komatsuzaki",
          zeroOneAvg: 74.1,
          isWinner: true,
        },
        {
          userId: "usr_mare",
          zeroOneAvg: 68.9,
          isWinner: false,
        },
        {
          userId: "usr_sato",
          zeroOneAvg: 71.5,
          isWinner: false,
        },
      ],
    },
    {
      gameId: "game_20260620_02",
      eventId: "evt_20260620",
      gameType: "ZERO_ONE",
      gameFormat: "501",
      gameSequence: 2,
      participants: [
        {
          userId: "usr_komatsuzaki",
          zeroOneAvg: 76.8,
          isWinner: false,
        },
        {
          userId: "usr_mare",
          zeroOneAvg: 72.4,
          isWinner: true,
        },
        {
          userId: "usr_suzuki",
          zeroOneAvg: 69.3,
          isWinner: false,
        },
      ],
    },
  ],
};