class WebTitles {
    titles = [
        "Elaina Da Catto",
        "Nyan~~~",
        "Meow~",
        "≽^- ˕ -^≼"
    ];
    
    randomWebTitle() {
        const randomIndex = Math.floor(Math.random() * this.titles.length);
        const title = this.titles[randomIndex];

        document.title = title;
    }
}

export { WebTitles };