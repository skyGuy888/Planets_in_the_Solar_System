class KinectController {


    constructor() {


        this.hand = {

            x: 0.5,

            y: 0.5,

            state: "open"

        };


        this.listeners = [];


        this.enabled = false;


        this.simulation = true;


        this.cursor =
            document.querySelector(
                "#hand-cursor"
            );


        this.status =
            document.querySelector(
                "#kinect-status"
            );


        /*
        |--------------------------------------------------------------------------
        | ตอนนี้ใช้ Mouse จำลอง Kinect
        |--------------------------------------------------------------------------
        */

        this.setupMouseSimulation();

    }



    onHandUpdate(
        callback
    ) {

        this.listeners.push(
            callback
        );

    }



    updateHand(
        data
    ) {


        this.hand = {

            x: Math.max(
                0,
                Math.min(
                    1,
                    data.x
                )
            ),

            y: Math.max(
                0,
                Math.min(
                    1,
                    data.y
                )
            ),

            state:
                data.state === "closed"

                    ? "closed"

                    : "open"

        };


        /*
        |--------------------------------------------------------------------------
        | ส่งข้อมูลไป Game
        |--------------------------------------------------------------------------
        */

        this.listeners.forEach(
            callback => {

                callback(
                    this.hand
                );

            }
        );

    }



    /*
    |--------------------------------------------------------------------------
    | Mouse Simulation
    |--------------------------------------------------------------------------
    */

    setupMouseSimulation() {


        window.addEventListener(
            "mousemove",
            event => {


                const x =
                    event.clientX /
                    window.innerWidth;


                const y =
                    event.clientY /
                    window.innerHeight;


                this.updateHand({

                    x: x,

                    y: y,

                    state:
                        this.hand.state

                });

            }
        );



        window.addEventListener(
            "mousedown",
            () => {


                this.updateHand({

                    ...this.hand,

                    state: "closed"

                });

            }
        );



        window.addEventListener(
            "mouseup",
            () => {


                this.updateHand({

                    ...this.hand,

                    state: "open"

                });

            }
        );



        this.status.textContent =
            "MOUSE SIM";


        this.cursor.style.display =
            "block";

    }

}