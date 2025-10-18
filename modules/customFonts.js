class CustomFont {
    systemFonts = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    elainaFont = "'Elaina', " + this.systemFonts;

    applyCustomFont() {
        // Apply font directly to root so existing CSS font rules are overridden
        if (Math.random() < 0.05) { // 5% chance
            document.body.style.fontFamily = this.elainaFont;
        }
        else {
            document.body.style.fontFamily = this.systemFonts;
        }
    }
}

export { CustomFont }