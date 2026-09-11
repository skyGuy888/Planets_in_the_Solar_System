class GameTimer {

    constructor(
        duration,
        onTick,
        onEnd
    ) {

        this.duration = duration;

        this.remaining = duration;

        this.onTick = onTick;

        this.onEnd = onEnd;

        this.interval = null;

        this.running = false;

    }


    start() {

        this.stop();

        this.remaining = this.duration;

        this.running = true;

        this.onTick(
            this.remaining
        );


        this.interval = setInterval(() => {

            this.remaining--;

            this.onTick(
                Math.max(
                    0,
                    this.remaining
                )
            );


            if (
                this.remaining <= 0
            ) {

                this.stop();

                this.onEnd();

            }

        }, 1000);

    }


    stop() {

        if (this.interval) {

            clearInterval(
                this.interval
            );

            this.interval = null;

        }

        this.running = false;

    }








    subtract(seconds) {

        this.remaining -= seconds;

        if (this.remaining < 0) {
            this.remaining = 0;
        }

        if (this.onTick) {
            this.onTick(this.remaining);
        }

        if (this.remaining <= 0) {

            this.stop();

            if (this.onEnd) {
                this.onEnd();
            }

        }

    }



}