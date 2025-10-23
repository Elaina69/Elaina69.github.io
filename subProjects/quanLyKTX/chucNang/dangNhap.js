document.addEventListener("DOMContentLoaded", async () => {
    const message = document.getElementById("message");
    
    document.getElementById("showPassword").addEventListener("change", function() {
        const passwordField = document.getElementById("password");
        if (this.checked) {
            passwordField.type = "text";
        } else {
            passwordField.type = "password";
        }
    });

    document.getElementById("login").addEventListener("click", async (event) => {
        event.preventDefault(); // Ngăn chặn form tải lại trang

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!username || !password) {
            message.style.color = "red";
            message.textContent = "Vui lòng nhập tên đăng nhập và mật khẩu!";
            return;
        }

        const response = await fetch("/quanLyKTX/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usernameOrEmail: username,
                password: password
            })
        })

        const result = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = "Đăng nhập thành công!";
            localStorage.setItem("authToken", result.token);
            setTimeout(() => {
                window.location.href = "trangChu.html"; // Chuyển hướng sau khi đăng nhập
            }, 1000);
        } else {
            message.style.color = "red";
            message.textContent = result.message || "Đăng nhập thất bại!";
        }
    });

    document.getElementById("register").addEventListener("click", () => {
        window.location.href = "dangKy.html";
    })

    document.getElementById("forgetPassword").addEventListener("click", () => {
        window.location.href = "quenMatKhau.html";
    })
})