const PLANETS = [

    {
        id: "mercury",
        name: "MERCURY",
        order: 1,
        icon: "./media/planets/mercury.png"
    },

    {
        id: "venus",
        name: "VENUS",
        order: 2,
        icon: "./media/planets/venus.png"
    },

    {
        id: "earth",
        name: "EARTH",
        order: 3,
        icon: "./media/planets/earth.png"
    },

    {
        id: "mars",
        name: "MARS",
        order: 4,
        icon: "./media/planets/mars.png"
    },

    {
        id: "jupiter",
        name: "JUPITER",
        order: 5,
        icon: "./media/planets/jupiter.png"
    },

    {
        id: "saturn",
        name: "SATURN",
        order: 6,
        icon: "./media/planets/saturn.png"
    },

    {
        id: "uranus",
        name: "URANUS",
        order: 7,
        icon: "./media/planets/uranus.png"
    },

    {
        id: "neptune",
        name: "NEPTUNE",
        order: 8,
        icon: "./media/planets/neptune.png"
    }

];


// ตำแหน่งเริ่มต้นของดาว
// เป็น % ของพื้นที่เกม

const START_POSITIONS = [

    {
        x: 18,
        y: 29
    },

    {
        x: 34,
        y: 25
    },

    {
        x: 69,
        y: 27
    },

    {
        x: 83,
        y: 35
    },

    {
        x: 20,
        y: 56
    },

    {
        x: 37,
        y: 61
    },

    {
        x: 66,
        y: 58
    },

    {
        x: 84,
        y: 60
    }

];


// ระยะที่ยอมให้ Drop เข้า Slot

const DROP_DISTANCE = 115;


// เวลาเกม

const GAME_TIME_SECONDS = 60;
const WRONG_PENALTY = 5;