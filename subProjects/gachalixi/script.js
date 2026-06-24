// Wheel Configuration
const DEFAULT_PRIZES = [
    { name: '100.000đ', color: '#FF6B6B' },
    { name: '50.000đ', color: '#4ECDC4' },
    { name: '20.000đ', color: '#FFD93D' },
    { name: '10.000đ', color: '#95E1D3' },
    { name: 'Chúc may mắn', color: '#F38181' },
    { name: '5.000đ', color: '#AA96DA' },
    { name: '200.000đ', color: '#FCBAD3' },
    { name: '30.000đ', color: '#A8D8EA' }
];

let prizes = [];

let currentRotation = 0;
let isSpinning = false;
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDisplay = document.getElementById('resultDisplay');
const prizeInput = document.getElementById('prizeInput');
const colorInput = document.getElementById('colorInput');
const addPrizeBtn = document.getElementById('addPrizeBtn');
const prizeListContainer = document.getElementById('prizeListContainer');
const keepWonPrizesCheckbox = document.getElementById('keepWonPrizes');
const resetBtn = document.getElementById('resetBtn');

// LocalStorage functions
function savePrizesToLocalStorage() {
    try {
        localStorage.setItem('gachaLiXiPrizes', JSON.stringify(prizes));
        console.log('✅ Đã lưu danh sách phần quà vào localStorage');
    } catch (error) {
        console.error('❌ Lỗi khi lưu vào localStorage:', error);
    }
}

function loadPrizesFromLocalStorage() {
    try {
        const savedPrizes = localStorage.getItem('gachaLiXiPrizes');
        if (savedPrizes) {
            prizes = JSON.parse(savedPrizes);
            console.log('✅ Đã load danh sách phần quà từ localStorage:', prizes.length, 'phần quà');
            return true;
        }
    } catch (error) {
        console.error('❌ Lỗi khi đọc từ localStorage:', error);
    }
    return false;
}

function resetToDefaultPrizes() {
    prizes = JSON.parse(JSON.stringify(DEFAULT_PRIZES));
    savePrizesToLocalStorage();
    console.log('🔄 Đã reset về danh sách phần quà mặc định');
}

// Initialize
function init() {
    // Load prizes from localStorage or use default
    if (!loadPrizesFromLocalStorage()) {
        prizes = JSON.parse(JSON.stringify(DEFAULT_PRIZES));
        savePrizesToLocalStorage();
        console.log('📋 Sử dụng danh sách phần quà mặc định');
    }
    
    drawWheel();
    updatePrizeList();
    
    spinBtn.addEventListener('click', spinWheel);
    addPrizeBtn.addEventListener('click', addPrize);
    resetBtn.addEventListener('click', () => {
        if (isSpinning) {
            alert('Không thể reset khi đang quay!');
            return;
        }
        if (confirm('🔄 Bạn có chắc muốn khôi phục về danh sách phần quà mặc định?\n\nTất cả phần quà hiện tại sẽ bị xóa!')) {
            resetToDefaultPrizes();
            currentRotation = 0;
            resultDisplay.textContent = '';
            drawWheel();
            updatePrizeList();
        }
    });
    prizeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPrize();
    });
}

// Draw Wheel
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (prizes.length === 0) {
        // Draw empty wheel message
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#666';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Thêm phần quà để bắt đầu!', centerX, centerY);
        return;
    }
    
    const anglePerPrize = (2 * Math.PI) / prizes.length;
    
    // Draw prize segments
    prizes.forEach((prize, index) => {
        const startAngle = index * anglePerPrize + currentRotation;
        const endAngle = (index + 1) * anglePerPrize + currentRotation;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = prize.color;
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerPrize / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Adjust font size based on text length
        const fontSize = prize.name.length > 15 ? 14 : 18;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        
        // Draw text with outline
        const textRadius = radius * 0.65;
        ctx.strokeText(prize.name, textRadius, 0);
        ctx.fillText(prize.name, textRadius, 0);
        
        ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 5;
    ctx.stroke();
    
    // Draw center text
    ctx.fillStyle = '#D32F2F';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TẾT', centerX, centerY);
    
    // DEBUG: Draw line from center to pointer position (top)
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    const pointerAngle = (3 * Math.PI) / 2;
    const lineLength = radius;
    const lineX = centerX + Math.cos(pointerAngle) * lineLength;
    const lineY = centerY + Math.sin(pointerAngle) * lineLength;
    ctx.lineTo(lineX, lineY);
    ctx.stroke();
    ctx.restore();
}

// Spin Wheel
function spinWheel() {
    if (isSpinning || prizes.length === 0) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDisplay.textContent = '🎊 Đang quay... 🎊';
    resultDisplay.classList.add('prize-won-animation');
    
    // Random spin: 5-8 full rotations + random angle
    const minRotations = 5;
    const maxRotations = 8;
    const rotations = minRotations + Math.random() * (maxRotations - minRotations);
    const randomAngle = Math.random() * 2 * Math.PI;
    const totalRotation = rotations * 2 * Math.PI + randomAngle;
    
    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    const startRotation = currentRotation;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        currentRotation = startRotation + totalRotation * easeOut;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Normalize rotation
            currentRotation = currentRotation % (2 * Math.PI);
            
            // Determine winner
            const winningIndex = getWinningPrizeIndex();
            const winningPrize = prizes[winningIndex];
            
            // Debug logging
            console.log('🎯 Debug Info:');
            console.log('   currentRotation:', currentRotation, '(', (currentRotation * 180 / Math.PI).toFixed(2), '°)');
            console.log('   winningIndex:', winningIndex);
            console.log('   winningPrize:', winningPrize.name);
            
            // Display result
            resultDisplay.textContent = `🎉 Chúc mừng! Bạn trúng: ${winningPrize.name} 🎉`;
            resultDisplay.classList.remove('prize-won-animation');
            setTimeout(() => {
                resultDisplay.classList.add('prize-won-animation');
            }, 10);
            
            // Remove prize if option is unchecked
            if (!keepWonPrizesCheckbox.checked) {
                setTimeout(() => {
                    prizes.splice(winningIndex, 1);
                    savePrizesToLocalStorage();
                    if (prizes.length === 0) {
                        currentRotation = 0;
                        resultDisplay.textContent = '🎊 Đã hết phần quà! Thêm phần quà mới để tiếp tục. 🎊';
                    }
                    drawWheel();
                    updatePrizeList();
                }, 1000);
            }
            
            isSpinning = false;
            spinBtn.disabled = false;
        }
    }
    
    animate();
}

// Get Winning Prize Index
function getWinningPrizeIndex() {
    // Mũi tên ở vị trí top (12 giờ) = 3π/2 hoặc -π/2
    const pointerAngle = (3 * Math.PI) / 2;
    
    const anglePerPrize = (2 * Math.PI) / prizes.length;
    
    // Helper function to normalize angle to [0, 2π)
    function normalizeAngle(angle) {
        let normalized = angle % (2 * Math.PI);
        if (normalized < 0) normalized += 2 * Math.PI;
        return normalized;
    }
    
    // Helper function to check if angle is in range [start, end)
    function isAngleInRange(angle, start, end) {
        angle = normalizeAngle(angle);
        start = normalizeAngle(start);
        end = normalizeAngle(end);
        
        if (start < end) {
            return angle >= start && angle < end;
        } else {
            // Range wraps around 0/2π
            return angle >= start || angle < end;
        }
    }
    
    // Duyệt qua từng prize và kiểm tra xem pointer có nằm trong segment đó không
    for (let i = 0; i < prizes.length; i++) {
        const startAngle = i * anglePerPrize + currentRotation;
        const endAngle = (i + 1) * anglePerPrize + currentRotation;
        
        if (isAngleInRange(pointerAngle, startAngle, endAngle)) {
            console.log('   Prize', i, ':', prizes[i].name);
            console.log('   startAngle:', (normalizeAngle(startAngle) * 180 / Math.PI).toFixed(2), '°');
            console.log('   endAngle:', (normalizeAngle(endAngle) * 180 / Math.PI).toFixed(2), '°');
            console.log('   pointerAngle:', (normalizeAngle(pointerAngle) * 180 / Math.PI).toFixed(2), '°');
            return i;
        }
    }
    
    // Fallback - không nên xảy ra
    console.warn('⚠️ No prize found at pointer position, returning 0');
    return 0;
}

// Add Prize
function addPrize() {
    const prizeName = prizeInput.value.trim();
    const prizeColor = colorInput.value;
    
    if (!prizeName) {
        alert('Vui lòng nhập tên phần quà!');
        return;
    }
    
    if (prizes.length >= 20) {
        alert('Số lượng phần quà tối đa là 20!');
        return;
    }
    
    prizes.push({
        name: prizeName,
        color: prizeColor
    });
    
    // Save to localStorage
    savePrizesToLocalStorage();
    
    prizeInput.value = '';
    colorInput.value = getRandomColor();
    
    drawWheel();
    updatePrizeList();
}

// Delete Prize
function deletePrize(index) {
    if (isSpinning) {
        alert('Không thể xóa phần quà khi đang quay!');
        return;
    }
    
    if (confirm(`Bạn có chắc muốn xóa "${prizes[index].name}"?`)) {
        prizes.splice(index, 1);
        
        // Save to localStorage
        savePrizesToLocalStorage();
        
        if (prizes.length === 0) {
            currentRotation = 0;
            resultDisplay.textContent = '';
        }
        
        drawWheel();
        updatePrizeList();
    }
}

// Update Prize List Display
function updatePrizeList() {
    prizeListContainer.innerHTML = '';
    
    if (prizes.length === 0) {
        prizeListContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Chưa có phần quà nào</p>';
        return;
    }
    
    prizes.forEach((prize, index) => {
        const prizeItem = document.createElement('div');
        prizeItem.className = 'prize-item';
        
        prizeItem.innerHTML = `
            <div class="prize-info">
                <div class="prize-color" style="background-color: ${prize.color}"></div>
                <span class="prize-name">${prize.name}</span>
            </div>
            <button class="delete-btn" onclick="deletePrize(${index})">🗑️ Xóa</button>
        `;
        
        prizeListContainer.appendChild(prizeItem);
    });
}

// Get Random Color
function getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3',
        '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA',
        '#FF8C42', '#6A4C93', '#FF6F61', '#42B883',
        '#E91E63', '#9C27B0', '#2196F3', '#00BCD4'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Make deletePrize available globally
window.deletePrize = deletePrize;

// Initialize on load
window.addEventListener('load', init);

// Handle window resize for responsive canvas
window.addEventListener('resize', () => {
    drawWheel();
});
