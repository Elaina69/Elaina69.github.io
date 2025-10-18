function updateBackground(imageUrl) {
    const portfolioContainer = document.querySelector('.portfolio-container');
    portfolioContainer.style.backgroundImage = imageUrl;
} 

export { updateBackground }