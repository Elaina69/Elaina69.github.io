class CustomFont {
    systemFonts = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    elainaFont = "'Elaina', " + this.systemFonts;
    seabornFont = "'IsharLmao', " + this.systemFonts;

    applyCustomFont() {
        if (Math.random() * 100 < 2) {
            document.body.style.fontFamily = this.seabornFont;
        }
        else if (Math.random() * 100 < 11) {
            document.body.style.fontFamily = this.elainaFont;
        }
        else {
            document.body.style.fontFamily = this.systemFonts;
        }
    }
}

export { CustomFont }