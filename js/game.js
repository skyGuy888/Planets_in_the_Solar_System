const cursor = document.getElementById('cursor');
const trackingStatus = document.getElementById('tracking-status');
const handStateText = document.getElementById('hand-state');

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;

let targetX = cursorX;
let targetY = cursorY;

let grabbing = false;
let grabbedPlanet = null;

const planets = document.querySelectorAll('.planet');
const slots = document.querySelectorAll('.slot');

window.addEventListener('kinectData', (e) => {

    trackingStatus.innerText = 'PLAYER DETECTED';

    targetX = e.detail.x;
    targetY = e.detail.y;

    handStateText.innerText =
        'HAND : ' + e.detail.handState.toUpperCase();

    if (e.detail.handState === 'closed') {

        cursor.style.background = '#ff4444';

        if (!grabbing) {

            grabbing = true;

            planets.forEach(planet => {

                const rect = planet.getBoundingClientRect();

                const hit =
                    cursorX > rect.left &&
                    cursorX < rect.right &&
                    cursorY > rect.top &&
                    cursorY < rect.bottom;

                if (hit && !grabbedPlanet) {

                    grabbedPlanet = planet;

                }

            });

        }

    } else {

        cursor.style.background = '#00d9ff';

        if (grabbing && grabbedPlanet) {

            checkDrop(grabbedPlanet);

        }

        grabbing = false;
        grabbedPlanet = null;

    }

});






function animate() {

    cursorX += (targetX - cursorX) * 0.2;
    cursorY += (targetY - cursorY) * 0.2;

    if (cursor) {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
    }

    if (grabbedPlanet) {
        grabbedPlanet.style.left =
            (cursorX - 60) + 'px';

        grabbedPlanet.style.top =
            (cursorY - 60) + 'px';
    }

    requestAnimationFrame(animate);
}

animate();






function checkDrop(planet) {

    const planetOrder =
        planet.dataset.correct;

    slots.forEach(slot => {

        const rect = slot.getBoundingClientRect();

        const hit =
            cursorX > rect.left &&
            cursorX < rect.right &&
            cursorY > rect.top &&
            cursorY < rect.bottom;

        if (hit) {

            if (slot.dataset.order === planetOrder) {

                slot.classList.add('correct');

                planet.style.left =
                    rect.left + 15 + 'px';

                planet.style.top =
                    rect.top + 15 + 'px';

            }

        }

    });

}











class StarOrderGame {


    constructor() {

        this.orbitAnimationId = null;
        /*
        |--------------------------------------------------------------------------
        | DOM
        |--------------------------------------------------------------------------
        */

        this.planetLayer =
            document.querySelector(
                "#planet-layer"
            );


        this.slotLayer =
            document.querySelector(
                "#slot-layer"
            );


        this.cursor =
            document.querySelector(
                "#hand-cursor"
            );


        this.handState =
            document.querySelector(
                "#hand-state"
            );


        this.nextPlanetEl =
            document.querySelector(
                "#next-planet"
            );


        this.overlay =
            document.querySelector(
                "#overlay"
            );


        this.resultTitle =
            document.querySelector(
                "#result-title"
            );


        this.resultMessage =
            document.querySelector(
                "#result-message"
            );


        this.resultIcon =
            document.querySelector(
                "#result-icon"
            );



        /*
        |--------------------------------------------------------------------------
        | Game State
        |--------------------------------------------------------------------------
        */

        this.currentOrder = 1;


        this.draggedPlanet = null;


        this.dragOffset = {

            x: 0,

            y: 0

        };


        this.gameEnded = false;



        /*
        |--------------------------------------------------------------------------
        | Collections
        |--------------------------------------------------------------------------
        */

        this.planets =
            new Map();


        this.slots =
            new Map();



        /*
        |--------------------------------------------------------------------------
        | Timer
        |--------------------------------------------------------------------------
        */

        this.timer = new GameTimer(

            GAME_TIME_SECONDS,

            seconds => {

                this.updateTimer(
                    seconds
                );

            },

            () => {

                this.gameOver(
                    "TIMEOUT"
                );

            }

        );



        /*
        |--------------------------------------------------------------------------
        | Kinect
        |--------------------------------------------------------------------------
        */

        this.kinect = new KinectController();

        this.kinect.onHandUpdate(hand => {

            this.handleHandUpdate(hand);

        });



        /*
        |--------------------------------------------------------------------------
        | Restart Button
        |--------------------------------------------------------------------------
        */

        document
            .querySelector(
                "#restart-btn"
            )
            .addEventListener(
                "click",
                () => {

                    this.start();

                }
            );



        /*
        |--------------------------------------------------------------------------
        | Window Resize
        |--------------------------------------------------------------------------
        */

        window.addEventListener(
            "resize",
            () => {

                this.repositionSlots();

            }
        );



        /*
        |--------------------------------------------------------------------------
        | Create Game
        |--------------------------------------------------------------------------
        */

        this.createSlots();

        this.createPlanets();


        /*
        |--------------------------------------------------------------------------
        | Start
        |--------------------------------------------------------------------------
        */

        this.start();

    }



    /*
    |--------------------------------------------------------------------------
    | CREATE SLOTS
    |--------------------------------------------------------------------------
    */

    createSlots() {


        for (
            let i = 1;
            i <= PLANETS.length;
            i++
        ) {


            const slot =
                document.createElement(
                    "div"
                );


            slot.className =
                "slot";


            slot.dataset.order =
                i;



            const index =
                document.createElement(
                    "div"
                );


            index.className =
                "slot-index";


            index.textContent =
                i;



            const name =
                document.createElement(
                    "div"
                );


            name.className =
                "slot-name";


            name.textContent =
                PLANETS[
                    i - 1
                ].name;



            slot.appendChild(
                index
            );


            slot.appendChild(
                name
            );


            this.slotLayer.appendChild(
                slot
            );


            this.slots.set(
                i,
                slot
            );

        }


        this.repositionSlots();

    }





    hideSlots() {

        this.slots.forEach(slot => {

            slot.classList.add("hide-slot");

        });

    }


    /*
    |--------------------------------------------------------------------------
    | POSITION SLOTS
    |--------------------------------------------------------------------------
    */

    repositionSlots() {


        const count =
            PLANETS.length;


        const leftMargin = 24;

        const rightMargin = 76;



        for (
            let i = 1;
            i <= count;
            i++
        ) {


            const percent =

                leftMargin +

                (
                    (i - 1) /
                    (count - 1)
                ) *

                (
                    rightMargin -
                    leftMargin
                );



            this.slots
                .get(i)
                .style.left =
                `${percent}%`;

        }

    }



    /*
    |--------------------------------------------------------------------------
    | CREATE PLANETS
    |--------------------------------------------------------------------------
    */

    createPlanets() {


        PLANETS.forEach((planet, index) => {


            const el =
                document.createElement(
                    "div"
                );


            el.className =
                "planet";


            el.dataset.id =
                planet.id;


            el.dataset.order =
                planet.order;



            const visual =
                document.createElement(
                    "div"
                );


            visual.className =
                "planet-visual";


            // visual.textContent =
            //     planet.icon;

            visual.innerHTML = `<img src="${planet.icon}" alt="${planet.name}">`;


            const label =
                document.createElement(
                    "div"
                );


            label.className =
                "planet-name";


            label.textContent =
                planet.name;



            el.appendChild(
                visual
            );


            el.appendChild(
                label
            );


            this.planetLayer.appendChild(
                el
            );



            this.planets.set(

                planet.id,

                {

                    data: planet,

                    el: el

                }

            );



            this.setStartPosition(el, START_POSITIONS[index]);

        }
        );

    }



    /*
    |--------------------------------------------------------------------------
    | START POSITION
    |--------------------------------------------------------------------------
    */

    // setStartPosition(el, pos) {

    //     el.style.left = `${pos.x}%`;

    //     el.style.top = `${pos.y}%`;
    // }


    setStartPosition(el, pos) {

        const sunX = 50;
        const sunY = 5;

        const scale = 0.65;

        const x =
            sunX + (pos.x - sunX) * scale;

        const y =
            sunY + (pos.y - sunY) * scale;

        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
    }



    /*
    |--------------------------------------------------------------------------
    | START GAME
    |--------------------------------------------------------------------------
    */

    start() {


        // หยุด animation วงโคจรจากเกมรอบก่อน
        this.stopOrbitAnimation();

        this.gameEnded = false;

        this.currentOrder = 1;

        this.draggedPlanet = null;

        this.dragOffset = {
            x: 0,
            y: 0
        };

        this.overlay.classList.add("hidden");



        this.slots.forEach(slot => {

            slot.classList.remove("correct");
            slot.classList.remove("active-drop");

            // แสดง Slot กลับมา
            slot.classList.remove("hide-slot");

        });


        /*
        |--------------------------------------------------------------------------
        | Reset planets
        |--------------------------------------------------------------------------
        */

        this.planets.forEach(
            item => {

                item.el.classList.remove("dragging");

                item.el.classList.remove("placed");

                item.el.removeAttribute("data-placed-order");

                item.el.style.visibility = "visible";

                item.el.style.opacity = "1";

                item.el.style.transform = "";

            }
        );


        /*
        |--------------------------------------------------------------------------
        | Reset slots
        |--------------------------------------------------------------------------
        */

        this.slots.forEach(slot => {

            slot.classList.remove("correct");

            slot.classList.remove("active-drop");

        });



        /*
        |--------------------------------------------------------------------------
        | Randomize
        |--------------------------------------------------------------------------
        */

        this.createPlanetsRandomly();



        this.updateNextPlanet();



        /*
        |--------------------------------------------------------------------------
        | Start timer
        |--------------------------------------------------------------------------
        */

        this.timer.start();





        this.createOrbitRings();
    }



    /*
    |--------------------------------------------------------------------------
    | RANDOM PLANET POSITION
    |--------------------------------------------------------------------------
    */

    createPlanetsRandomly() {


        const positions =
            [
                ...START_POSITIONS
            ];





        /*
        |--------------------------------------------------------------------------
        | Fisher-Yates Shuffle
        |--------------------------------------------------------------------------
        */

        for (let i = positions.length - 10; i > 0; i--) {


            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                positions[i],
                positions[j]
            ] =
                [
                    positions[j],
                    positions[i]
                ];

        }



        PLANETS.forEach(
            (
                planet,
                index
            ) => {


                const item =
                    this.planets.get(
                        planet.id
                    );


                this.setStartPosition(

                    item.el,

                    positions[index]

                );

            }
        );

    }



    /*
    |--------------------------------------------------------------------------
    | TIMER UI
    |--------------------------------------------------------------------------
    */

    updateTimer(
        seconds
    ) {


        const timer =
            document.querySelector(
                "#timer"
            );


        timer.textContent =
            String(seconds)
                .padStart(
                    2,
                    "0"
                );



        if (
            seconds <= 10
        ) {


            timer.style.transform =
                "scale(1.08)";


            setTimeout(
                () => {

                    timer.style.transform =
                        "scale(1)";

                },

                100

            );

        }

    }



    /*
    |--------------------------------------------------------------------------
    | NEXT PLANET
    |--------------------------------------------------------------------------
    */

    updateNextPlanet() {


        const next =
            PLANETS[
            this.currentOrder - 1
            ];


        this.nextPlanetEl.textContent =

            next

                ? next.name

                : "DONE";

    }



    /*
    |--------------------------------------------------------------------------
    | HAND UPDATE
    |--------------------------------------------------------------------------
    */

    handleHandUpdate(hand) {


        const field =
            document.querySelector(
                "#playfield"
            );


        const rect =
            field.getBoundingClientRect();



        const x =
            hand.x *
            rect.width;


        const y =
            hand.y *
            rect.height;



        /*
        |--------------------------------------------------------------------------
        | Move hand cursor
        |--------------------------------------------------------------------------
        */

        if (this.cursor) {

            this.cursor.style.left =
                `${x}px`;

            this.cursor.style.top =
                `${y}px`;

        }



        this.handState.textContent =
            hand.state.toUpperCase();



        if (
            this.gameEnded
        ) {

            return;

        }



        /*
        |--------------------------------------------------------------------------
        | Grab
        |--------------------------------------------------------------------------
        */

        if (

            !this.draggedPlanet &&

            hand.state === "closed"

        ) {


            const planet =
                this.findPlanetAt(
                    x,
                    y
                );


            if (planet) {

                this.pickUp(
                    planet,
                    x,
                    y
                );

            }

        }



        /*
        |--------------------------------------------------------------------------
        | Drag
        |--------------------------------------------------------------------------
        */

        if (
            this.draggedPlanet
        ) {


            this.moveDraggedPlanet(
                x,
                y
            );



            /*
            |--------------------------------------------------------------------------
            | Release
            |--------------------------------------------------------------------------
            */

            if (
                hand.state === "open"
            ) {


                this.dropPlanet(
                    x,
                    y
                );

            }

        }

    }



    /*
    |--------------------------------------------------------------------------
    | FIND PLANET
    |--------------------------------------------------------------------------
    */

    findPlanetAt(x, y) {


        const fieldRect =
            document
                .querySelector(
                    "#playfield"
                )
                .getBoundingClientRect();



        for (
            const item
            of this.planets.values()
        ) {

            if (item.el.classList.contains("placed")) {
                continue;
            }


            const rect = item.el.getBoundingClientRect();



            const cx =

                rect.left -

                fieldRect.left +

                rect.width / 2;



            const cy =

                rect.top -

                fieldRect.top +

                rect.height / 2;



            const radius =
                rect.width / 2;



            const distance =
                Math.hypot(

                    x - cx,

                    y - cy

                );



            if (
                distance <= radius
            ) {

                return item;

            }

        }



        return null;

    }

































    wrongDrop(item, message) {

        /*
        |--------------------------------------------------------------------------
        | Remove dragging
        |--------------------------------------------------------------------------
        */

        item.el.classList.remove("dragging");

        /*
        |--------------------------------------------------------------------------
        | Return to previous position
        |--------------------------------------------------------------------------
        */

        const previousLeft =
            item.el.dataset.previousLeft;

        const previousTop =
            item.el.dataset.previousTop;

        if (previousLeft) {

            item.el.style.left =
                previousLeft;

        }

        if (previousTop) {

            item.el.style.top =
                previousTop;

        }

        /*
        |--------------------------------------------------------------------------
        | Penalty
        |--------------------------------------------------------------------------
        */

        this.timer.subtract(
            WRONG_PENALTY
        );

        /*
        |--------------------------------------------------------------------------
        | Visual feedback
        |--------------------------------------------------------------------------
        */

        Effects.flash(
            `${message}  -${WRONG_PENALTY}s`,
            "error"
        );

        /*
        |--------------------------------------------------------------------------
        | Clear active slot
        |--------------------------------------------------------------------------
        */

        this.slots.forEach(slot => {

            slot.classList.remove(
                "active-drop"
            );

        });

    }







    startFinalAnimation() {

        if (this.gameEnded) {
            return;
        }

        this.gameEnded = true;

        this.timer.stop();

        /*
        |--------------------------------------------------------------------------
        | Remove hand interaction
        |--------------------------------------------------------------------------
        */

        this.draggedPlanet = null;

        /*
        |--------------------------------------------------------------------------
        | Completion message
        |--------------------------------------------------------------------------
        */

        Effects.flash(
            "ALL PLANETS CORRECT!",
            "success"
        );


        // ซ่อน Slot
        this.hideSlots();


        /*
        |--------------------------------------------------------------------------
        | Start orbital animation
        |--------------------------------------------------------------------------
        */

        setTimeout(() => {

            this.animatePlanetsToOrbit();

        }, 1000);

    }







    animatePlanetsToOrbit() {

        const field = document.querySelector("#playfield");
        const fieldRect = field.getBoundingClientRect();

        const sun = document.querySelector("#sun");
        const sunRect = sun.getBoundingClientRect();

        const centerX =
            sunRect.left - fieldRect.left +
            sunRect.width / 2;

        const centerY =
            sunRect.top - fieldRect.top +
            sunRect.height / 2;

        // ระยะวงโคจรของดาวแต่ละดวง
        //const maxRadius = Math.min(fieldRect.width, fieldRect.height) * 0.38;
        const maxRadius = Math.min(fieldRect.width, fieldRect.height) * 0.42;

        const minRadius = 160;

        const orbitRadius = PLANETS.map((_, index) => {

            return minRadius +
                index *
                ((maxRadius - minRadius) /
                    (PLANETS.length - 1));

        });

        const orbitData = [];

        PLANETS.forEach((planet, index) => {

            const item = this.planets.get(planet.id);

            if (!item) return;

            const el = item.el;

            // ตำแหน่งปัจจุบันของดาว
            const rect = el.getBoundingClientRect();

            const startX =
                rect.left - fieldRect.left +
                rect.width / 2;

            const startY =
                rect.top - fieldRect.top +
                rect.height / 2;

            // จุดเริ่มต้นของวงโคจร
            const angle =
                (index / PLANETS.length) *
                Math.PI * 2;

            const targetX =
                centerX +
                Math.cos(angle) *
                orbitRadius[index];

            const targetY =
                centerY +
                Math.sin(angle) *
                orbitRadius[index];

            orbitData.push({

                el,

                startX,
                startY,

                targetX,
                targetY,

                radius: orbitRadius[index],

                angle,

                speed:
                    0.00025 +
                    index * 0.00004

            });

            el.classList.remove("placed");
            el.classList.add("orbiting");

        });


        // ==================================================
        // PHASE 1
        // ดาวเคลื่อนจากช่อง → เข้าหาวงโคจร
        // ==================================================

        const animationDuration = 1800;

        const startTime = performance.now();


        const moveToOrbit = (time) => {

            const elapsed =
                time - startTime;

            let progress =
                Math.min(
                    elapsed / animationDuration,
                    1
                );

            // Ease Out
            const ease =
                1 - Math.pow(1 - progress, 3);


            orbitData.forEach(data => {

                const x =
                    data.startX +
                    (data.targetX - data.startX) *
                    ease;

                const y =
                    data.startY +
                    (data.targetY - data.startY) *
                    ease;

                data.el.style.left =
                    `${x}px`;

                data.el.style.top =
                    `${y}px`;

            });


            if (progress < 1) {

                this.orbitAnimationId =
                    requestAnimationFrame(moveToOrbit);

            } else {

                // ถึงวงโคจรแล้ว
                this.startOrbitRotation(
                    orbitData,
                    centerX,
                    centerY
                );

            }

        };


        this.orbitAnimationId =
            requestAnimationFrame(moveToOrbit);
    }







    createOrbitRings() {

        const field = document.querySelector("#playfield");
        const sun = document.querySelector("#sun");

        // ลบวงโคจรเก่าก่อน
        document
            .querySelectorAll(".orbit-ring")
            .forEach(ring => ring.remove());

        const fieldRect = field.getBoundingClientRect();
        const sunRect = sun.getBoundingClientRect();


        // จุดศูนย์กลางดวงอาทิตย์
        const centerX =
            sunRect.left -
            fieldRect.left +
            sunRect.width / 2;

        const centerY =
            sunRect.top -
            fieldRect.top +
            sunRect.height / 2;


        const maxRadius =
            Math.min(
                fieldRect.width,
                fieldRect.height
            ) * 0.42;

        const minRadius = 100;


        PLANETS.forEach((planet, index) => {

            const radius =
                minRadius +
                index *
                ((maxRadius - minRadius) /
                    (PLANETS.length - 1));


            const ring =
                document.createElement("div");

            ring.className = "orbit-ring";


            ring.style.width =
                `${radius * 2}px`;

            ring.style.height =
                `${radius * 2}px`;


            ring.style.left =
                `${centerX - radius}px`;

            ring.style.top =
                `${centerY - radius}px`;


            ring.dataset.planet =
                planet.name;


            field.appendChild(ring);

        });
    }


















    showMissionComplete() {

        this.resultIcon.textContent =
            "★";

        this.resultTitle.textContent =
            "MISSION COMPLETE";

        this.resultMessage.textContent =
            "All planets are now orbiting the Sun.";

        this.overlay.classList.remove(
            "hidden"
        );

    }












    stopOrbitAnimation() {
        if (this.orbitAnimationId !== null) {
            cancelAnimationFrame(this.orbitAnimationId);
            this.orbitAnimationId = null;
        }

        this.planets.forEach(item => {
            item.el.classList.remove("orbiting");
        });
    }












    startOrbitRotation(orbitData, centerX, centerY) {

        let lastTime =
            performance.now();


        const orbitAnimation = (time) => {

            const delta =
                time - lastTime;

            lastTime = time;


            orbitData.forEach(data => {

                data.angle +=
                    data.speed * delta;


                const x =
                    centerX +
                    Math.cos(data.angle) *
                    data.radius;


                const y =
                    centerY +
                    Math.sin(data.angle) *
                    data.radius;


                data.el.style.left =
                    `${x}px`;

                data.el.style.top =
                    `${y}px`;

            });


            this.orbitAnimationId =
                requestAnimationFrame(
                    orbitAnimation
                );

        };


        this.orbitAnimationId =
            requestAnimationFrame(
                orbitAnimation
            );


        // แสดง Mission Complete หลังจากดาวเข้าวงโคจร
        setTimeout(() => {

            this.showMissionComplete();

        }, 10000);
    }










    returnPlanetToPreviousPosition(item) {

        const previousLeft =
            item.el.dataset.previousLeft;

        const previousTop =
            item.el.dataset.previousTop;


        if (previousLeft) {

            item.el.style.left =
                previousLeft;

        }


        if (previousTop) {

            item.el.style.top =
                previousTop;

        }

    }







    /*
    |--------------------------------------------------------------------------
    | PICK UP
    |--------------------------------------------------------------------------
    */

    pickUp(item, x, y) {

        this.draggedPlanet = item;

        const rect = item.el.getBoundingClientRect();

        const fieldRect =
            document
                .querySelector(
                    "#playfield"
                )
                .getBoundingClientRect();




        /*
        |--------------------------------------------------------------------------
        | จำตำแหน่งเดิม
        |--------------------------------------------------------------------------
        */

        item.el.dataset.previousLeft =
            item.el.style.left;

        item.el.dataset.previousTop =
            item.el.style.top;

        /*
        |--------------------------------------------------------------------------
        | Calculate drag offset
        |--------------------------------------------------------------------------
        */


        this.dragOffset.x =

            x -

            (
                rect.left -
                fieldRect.left +
                rect.width / 2
            );



        this.dragOffset.y =

            y -

            (
                rect.top -
                fieldRect.top +
                rect.height / 2
            );


        item.el.classList.add("dragging");

        Effects.flash(

            `GRABBED ${item.data.name}`,

            "info"

        );

    }



    /*
    |--------------------------------------------------------------------------
    | MOVE PLANET
    |--------------------------------------------------------------------------
    */

    moveDraggedPlanet(x, y) {


        const item =
            this.draggedPlanet;



        item.el.style.left =

            `${x - this.dragOffset.x}px`;



        item.el.style.top =

            `${y - this.dragOffset.y}px`;



        this.highlightDropSlot(
            x,
            y
        );

    }



    /*
    |--------------------------------------------------------------------------
    | HIGHLIGHT SLOT
    |--------------------------------------------------------------------------
    */

    highlightDropSlot(
        x,
        y
    ) {


        this.slots.forEach(
            slot => {

                slot.classList
                    .remove(
                        "active-drop"
                    );

            }
        );



        const slot =
            this.findClosestSlot(
                x,
                y
            );



        if (slot) {

            slot.classList
                .add(
                    "active-drop"
                );

        }

    }



    /*
    |--------------------------------------------------------------------------
    | FIND CLOSEST SLOT
    |--------------------------------------------------------------------------
    */

    findClosestSlot(
        x,
        y
    ) {


        const fieldRect =
            document
                .querySelector(
                    "#playfield"
                )
                .getBoundingClientRect();



        let closest = null;

        let minDistance =
            Infinity;



        this.slots.forEach(
            slot => {


                const rect =
                    slot.getBoundingClientRect();



                const cx =

                    rect.left -

                    fieldRect.left +

                    rect.width / 2;



                const cy =

                    rect.top -

                    fieldRect.top +

                    rect.height / 2;



                const distance =
                    Math.hypot(

                        x - cx,

                        y - cy

                    );



                if (
                    distance <
                    minDistance
                ) {


                    minDistance =
                        distance;


                    closest =
                        slot;

                }

            }
        );



        if (
            minDistance <=
            DROP_DISTANCE
        ) {

            return closest;

        }



        return null;

    }



    /*
    |--------------------------------------------------------------------------
    | DROP
    |--------------------------------------------------------------------------
    */

    dropPlanet(x, y) {

        const item = this.draggedPlanet;

        if (!item) return;

        this.draggedPlanet = null;

        item.el.classList.remove("dragging");

        // เอา highlight ของช่องออก
        this.slots.forEach(slot => {
            slot.classList.remove("active-drop");
        });


        // ==========================================
        // หา slot ที่ใกล้ที่สุด
        // ==========================================

        const slot = this.findClosestSlot(x, y);


        // ==========================================
        // ปล่อยไกลจากช่อง
        // ==========================================

        if (!slot) {

            this.returnPlanetToPreviousPosition(item);

            Effects.flash(
                "DROP CLOSER TO A SLOT",
                "info"
            );

            return;
        }


        // ==========================================
        // อยู่บริเวณช่องแล้ว
        // ==========================================

        const targetOrder =
            Number(slot.dataset.order);


        // ช่องผิด
        if (targetOrder !== this.currentOrder) {

            this.wrongDrop(
                item,
                "WRONG SLOT"
            );

            return;
        }


        // ดาวผิด
        if (item.data.order !== this.currentOrder) {

            this.wrongDrop(
                item,
                "WRONG PLANET"
            );

            return;
        }


        // ==========================================
        // ถูกต้อง
        // ==========================================

        this.placeCorrectly(
            item,
            slot
        );
    }


    /*
    |--------------------------------------------------------------------------
    | PLACE CORRECT PLANET
    |--------------------------------------------------------------------------
    */

    // placeCorrectly(item, slot) {


    //     const fieldRect = document.querySelector("#playfield").getBoundingClientRect();

    //     const slotRect = slot.getBoundingClientRect();


    //     item.el.style.left =

    //         `${slotRect.left -
    //         fieldRect.left +
    //         slotRect.width / 2
    //         }px`;



    //     item.el.style.top =

    //         `${slotRect.top -
    //         fieldRect.top +
    //         slotRect.height / 2
    //         }px`;



    //     /*
    //     |--------------------------------------------------------------------------
    //     | Hide planet
    //     |--------------------------------------------------------------------------
    //     */

    //     item.el.style.visibility = "hidden";


    //     slot.classList.add("correct");


    //     Effects.flash(`${item.data.name} CORRECT`, "success");


    //     /*
    //     |--------------------------------------------------------------------------
    //     | Next
    //     |--------------------------------------------------------------------------
    //     */

    //     this.currentOrder++;



    //     if (
    //         this.currentOrder >
    //         PLANETS.length
    //     ) {


    //         this.gameSuccess();


    //         return;

    //     }

    //     this.updateNextPlanet();

    // }




    placeCorrectly(item, slot) {

        const fieldRect =
            this.planetLayer.getBoundingClientRect();

        const slotRect =
            slot.getBoundingClientRect();

        /*
        |--------------------------------------------------------------------------
        | Move planet to slot center
        |--------------------------------------------------------------------------
        */

        const x =
            slotRect.left -
            fieldRect.left +
            slotRect.width / 2;

        const y =
            slotRect.top -
            fieldRect.top +
            slotRect.height / 2;

        item.el.style.left =
            `${x}px`;

        item.el.style.top =
            `${y}px`;

        item.el.style.visibility =
            "visible";

        /*
        |--------------------------------------------------------------------------
        | Mark placed
        |--------------------------------------------------------------------------
        */

        item.el.classList.remove(
            "dragging"
        );

        item.el.classList.add(
            "placed"
        );

        item.el.dataset.placedOrder =
            slot.dataset.order;

        /*
        |--------------------------------------------------------------------------
        | Slot correct
        |--------------------------------------------------------------------------
        */

        slot.classList.add(
            "correct"
        );

        Effects.flash(
            `${item.data.name} CORRECT`,
            "success"
        );

        /*
        |--------------------------------------------------------------------------
        | Next
        |--------------------------------------------------------------------------
        */

        this.currentOrder++;

        /*
        |--------------------------------------------------------------------------
        | All planets complete
        |--------------------------------------------------------------------------
        */

        if (
            this.currentOrder >
            PLANETS.length
        ) {

            this.startFinalAnimation();

            return;

        }

        this.updateNextPlanet();

    }






    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    gameSuccess() {


        this.gameEnded =
            true;


        this.timer.stop();



        this.resultIcon.textContent =
            "★";


        this.resultTitle.textContent =
            "MISSION COMPLETE";


        this.resultMessage.textContent =
            "All planets are in the correct order.";


        this.overlay
            .classList
            .remove(
                "hidden"
            );

    }



    /*
    |--------------------------------------------------------------------------
    | GAME OVER
    |--------------------------------------------------------------------------
    */

    gameOver(
        reason
    ) {


        if (
            this.gameEnded
        ) {

            return;

        }



        this.gameEnded =
            true;


        this.timer.stop();



        this.resultIcon.textContent =
            "×";


        this.resultTitle.textContent =
            "MISSION FAILED";



        if (
            reason ===
            "TIMEOUT"
        ) {


            this.resultMessage.textContent =

                "Time is up. Start again and try to complete the mission.";

        }

        else {


            this.resultMessage.textContent =

                "That was not the correct order. Start again and try once more.";

        }



        this.overlay
            .classList
            .remove(
                "hidden"
            );

    }

}



/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

window.addEventListener(
    "DOMContentLoaded",
    () => {

        window.starOrderGame =
            new StarOrderGame();

    }
);




window.kinectAPI.onData((data) => {

    console.log(
        "[GAME] KINECT DATA",
        data
    );


    const cursor = document.querySelector("#hand-cursor");
    const field = document.querySelector("#playfield");

    if (!cursor || !field) {
        return;
    }

    const rect = field.getBoundingClientRect();

    const x = data.x * rect.width;
    const y = data.y * rect.height;

    // -------------------------
    // Update Kinect Cursor
    // -------------------------

    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    // -------------------------
    // Send to StarOrderGame
    // -------------------------

    if (starOrderGame) {

        starOrderGame.handleHandUpdate({
            x: data.x,
            y: data.y,
            state: data.state
        });

    }



});
