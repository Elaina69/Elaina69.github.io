document.addEventListener("DOMContentLoaded", () => {
    const sendOtp = document.getElementById('sendOtp');
    const countDown = document.getElementById('countdown');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const message = document.getElementById("message");

    sendOtp.addEventListener('click', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;

        if (email === '') {
            message.style.color = "red";
            message.textContent = "Vui lòng nhập email"
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
                    text: 'Mã OTP đăng ký tài khoản'
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

    document.getElementById("register").addEventListener("click", async (event) => {
        event.preventDefault(); // Ngăn chặn form tải lại trang

        const email = document.getElementById("email").value;
        const otp = document.getElementById('otp').value;
        const password = document.getElementById("password").value;
        const rePassword = document.getElementById("rePassword").value;
        const phone = document.getElementById("phone").value;
        const hoTen = document.getElementById("hoTen").value;
        const day = document.getElementById('day').value;
        const month = document.getElementById('month').value;
        const year = document.getElementById('year').value;
        const quocTich = document.getElementById("quocTich").value;
        const maSinhVien = document.getElementById("maSV").value;
        const lop = document.getElementById("lop").value;
        const khoa = document.getElementById("khoa").value;
        const gioiTinh = document.getElementById("gioiTinh").value; // Lấy giá trị của radio button
        

        if (!day || !month || !year) {
            message.style.color = "red";
            message.textContent = "Vui lòng nhập ngày sinh!";
            return;
        }
        else if (password !== rePassword) {
            message.style.color = "red";
            message.textContent = "Mật khẩu không khớp!";
            return;
        }
        else {
            const ngaySinh = `${year}-${month}-${day}`; // Định dạng ngày sinh theo YYYY-MM-DD
            const response = await fetch("/quanLyKTX/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    role: "sinh_vien",
                    phone: phone,
                    maSV: maSinhVien,
                    hoTen: hoTen,
                    lop: lop,
                    ngaySinh: ngaySinh,
                    quocTich: quocTich,
                    khoa: khoa,
                    otp: otp,
                    gioiTinh: gioiTinh
                })
            })
    
            const result = await response.json();
    
            if (response.ok) {
                message.style.color = "green";
                message.textContent = "Đăng ký thành công!";

                setTimeout(() => {
                    window.location.href = "index.html"; // Chuyển hướng sau khi đăng ký
                }, 1000);
            } else {
                message.style.color = "red";
                message.textContent = result.message || "Đăng ký thất bại!";
            }
        }
    });

    document.getElementById("login").addEventListener("click", () => {
        window.location.href = "index.html";
    })

    // Force maSinhVien and lop to be uppercase
    document.getElementById("maSinhVien").addEventListener("input", (event) => {
        event.target.value = event.target.value.toUpperCase();
    });

    document.getElementById("lop").addEventListener("input", (event) => {
        event.target.value = event.target.value.toUpperCase();
    });
})