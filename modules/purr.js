class Purr {
    purr() {
        let RR = 0;

        document.querySelector("#purr").addEventListener("click", function() {
            RR++;

            switch (RR) {
                case 1:
                    alert("Nyaa~~ Don't do that!!");
                    break;
                case 2:
                    alert("Nyaa~~ Stop it!!");
                    break;
                case 3:
                    // Imma rickroll then
                    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
                    RR = 0;
                    break;
                default:
                    break;
            }
        })
    }
}

export { Purr };