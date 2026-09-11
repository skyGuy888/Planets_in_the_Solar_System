const Effects = {


    flash(
        message,
        type = "info"
    ) {

        const el =
            document.createElement("div");


        el.textContent = message;


        el.style.position = "absolute";

        el.style.zIndex = "400";

        el.style.left = "50%";

        el.style.top = "45%";

        el.style.transform =
            "translate(-50%, -50%) scale(.9)";


        el.style.padding =
            "18px 30px";


        el.style.borderRadius =
            "999px";


        el.style.background =
            type === "error"

                ? "rgba(255,60,80,.85)"

                : "rgba(60,220,150,.85)";


        el.style.color = "#fff";


        el.style.fontSize =
            "20px";


        el.style.letterSpacing =
            "2px";


        el.style.pointerEvents =
            "none";


        el.style.opacity = "0";


        document
            .querySelector("#playfield")
            .appendChild(el);


        requestAnimationFrame(() => {

            el.style.transition =
                "all .22s ease";


            el.style.opacity = "1";


            el.style.transform =
                "translate(-50%, -50%) scale(1)";

        });


        setTimeout(() => {

            el.style.opacity = "0";

            el.style.transform =
                "translate(-50%, -65%) scale(.95)";


            setTimeout(() => {

                el.remove();

            }, 250);

        }, 650);

    },


    pulse(
        element
    ) {

        element.animate(

            [

                {
                    transform:
                        "translateX(-50%) scale(1)"
                },

                {
                    transform:
                        "translateX(-50%) scale(1.08)"
                },

                {
                    transform:
                        "translateX(-50%) scale(1)"
                }

            ],

            {
                duration: 300,
                easing: "ease-out"
            }

        );

    }

};