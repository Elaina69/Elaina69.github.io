document.addEventListener('DOMContentLoaded', () => {
    const sendOtp = document.getElementById('sendOtp');
    const changePassword = document.getElementById('changePassword');
    const countDown = document.getElementById('countdown');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const message = document.getElementById("message");

    sendOtp.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('newPassword').value;

        if (email === '') {
            message.style.color = "red";
            message.textContent = "Vui lòng nhập email"
            return;
        }
        else if (password === '') {
            message.style.color = "red";
            message.textContent = "Vui lòng nhập mật khẩu mới"
            return;
        }

        if (!emailRegex.test(email)) {
            message.style.color = "red";
            message.textContent = "Địa chỉ email không hợp lệ";
            return;
        }

        sendOtp.disabled = true;
        sendOtp.style.cursor = 'not-allowed';
        sendOtp.style.backgroundColor = 'gray';
        countDown.textContent = '60';

        window.setInterval(() => {
            let seconds = parseInt(countDown.textContent);
            seconds--;
            countDown.textContent = seconds;

            if (seconds <= 0) {
                clearInterval();
                sendOtp.disabled = false;
                sendOtp.style.cursor = 'pointer';
                sendOtp.style.backgroundColor = '#ff2020';
                countDown.textContent = '0';
            }
        }, 1000);

        try {
            const response = await fetch('/quanLyKTX/api/guiOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    text: 'Mã OTP đặt lại mật khẩu'
                })
            })

            const result = await response.json();
            alert(result.message);
        } 
        catch (error) {
            console.error('Đã xảy ra lỗi khi gửi OTP:', error);
            alert('Đã xảy ra lỗi khi gửi OTP.');
        }
    });

    changePassword.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const otp = document.getElementById('otp').value;
        const newPassword = document.getElementById('newPassword').value;

        const response = await fetch('/quanLyKTX/api/datLaiMatKhau', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                newPassword: newPassword,
                otp: otp
            })
        })

        const result = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = "Đổi mật khẩu thành công!";
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } 
        else {
            message.style.color = "red";
            message.textContent = result.message || "Đã xảy ra lỗi khi đặt lại mật khẩu!";
        }
    });
});