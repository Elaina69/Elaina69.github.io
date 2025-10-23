import { verifyToken } from "./kiemTraToken.js";

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function roleFormat(role) {
    switch (role) {
        case "sinh_vien":
            return "Sinh viên";
        case "quan_ly":
            return "Quản lý";
        case "nhan_vien":
            return "Nhân viên";
        default:
            return role;
    }
}

async function loadContent(userData) {
    // Muc Profile
    let profileContent = `
        <div class="profile-section">
            <h2>Thông tin cá nhân</h2>
            <div class="profile-card">
                <div class="profile-info">
                    <p><strong>Họ và tên:</strong> ${userData.hoTen}</p>
                    <p><strong>Số điện thoại:</strong> ${userData.phone}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                    <p><strong>Vai trò:</strong> ${roleFormat(userData.role)}</p>
    `;
    if (userData.role === "sinh_vien") {
        profileContent += `
            <p><strong>Mã sinh viên:</strong> ${userData.maSV.toUpperCase()}</p>
            <p><strong>Lớp:</strong> ${userData.lop.toUpperCase()}</p>
            <p><strong>Khoa:</strong> ${userData.khoa}</p>
            <p><strong>Quốc tịch:</strong> ${userData.quocTich}</p>
            <p><strong>Ngày sinh:</strong> ${formatDate(userData.ngaySinh)}</p>
            <p><strong>Giới tính:</strong> ${userData.gioiTinh}</p>
        `;
        if (userData.soPhong) {
            profileContent += `
                <p><strong>Số phòng:</strong> ${userData.soPhong}</p>
                <p><strong>Thời gian thuê:</strong> ${userData.thoiGianThue || "Chưa cập nhật"} tháng</p>
            `;
        }
    } 
    else if (userData.role === "nhan_vien") {
        profileContent += `
            <p><strong>Mã nhân viên:</strong> ${userData.maNV.toUpperCase()}</p>
            <p><strong>Phòng ban:</strong> ${userData.phongban}</p>
            <p><strong>Chức vụ:</strong> ${userData.chucVu}</p>
        `;
    } 
    else if (userData.role === "quan_ly") {
        profileContent += `
            <p><strong>Mã quản lý:</strong> ${userData.maQL.toUpperCase()}</p>
            <p><strong>Chức vụ:</strong> ${userData.chucVu}</p>
        `;
    }
    profileContent += `
                </div>
                <button id="updateProfileButton">Cập nhật thông tin</button>
            </div>
        </div>
    `;



    // Mục Thông báo
    let notificationContent = `
        <div class="notification-section">
            <h2>Thông báo</h2>
            <div style="display: ruby;">
                ${userData.role === "nhan_vien" || userData.role === "quan_ly" ? `
                <button id="createNotificationButton">Tạo thông báo</button>
                ` : ""}
                <div class="search-bar">
                    <input type="text" id="searchNotificationInput" placeholder="Tìm kiếm thông báo..." />
                    <button id="searchNotificationButton">Tìm kiếm</button>
                </div>
            </div>
            <div class="notification-buttons">
                <button id="publicNotificationButton">Thông báo chung</button>
                <button id="personalNotificationButton">Thông báo cá nhân</button>
            </div>
            <ul id="notificationList">
                <li>Đang tải thông báo...</li>
            </ul>
        </div>
    `;

    

    // Muc Tra cuu phong
    let roomSearchContent = `
        <div class="room-management-section">
            <h2>Tra cứu phòng</h2>
            <div id="roomListDiv">
                ${userData.role === "quan_ly" ? `
                    <button id="addRoomButton">Thêm phòng</button>
                ` : ""}
                <div class="filter-section">
                    <div class="filter-group">
                        <div>
                            <label for="filterByPrice">Lọc theo giá:</label>
                            <select id="filterByPrice">
                                <option value="">Tất cả</option>
                                <option value="500000">500,000</option>
                                <option value="600000">600,000</option>
                                <option value="700000">700,000</option>
                            </select>
                        </div>

                        <div>
                            <label for="filterByStatus">Lọc theo trạng thái:</label>
                            <select id="filterByStatus">
                                <option value="">Tất cả</option>
                                <option value="Trống">Trống</option>
                                <option value="Bảo trì">Bảo trì</option>
                                <option value="Đầy">Đầy</option>
                            </select>
                        </div>

                        <div>
                            <label for="filterByType">Lọc theo loại phòng:</label>
                            <select id="filterByType">
                                <option value="">Tất cả</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>
                    </div>
                    <div class="filter-button">
                        <button id="applyFiltersButton">Áp dụng bộ lọc</button>
                    </div>
                </div>
                <table class="roomList">
                    <thead>
                        <tr>
                            <th>Số phòng</th>
                            <th>Số lượng SV</th>
                            <th>Trạng thái</th>
                            <th>Giá</th>
                            <th>Loại phòng</th>
                            ${userData.role === "quan_ly" ? "<th>Hành động</th>" : ""}
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Đang tải danh sách phòng...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;



    // Muc Dang ki phong
    let roomRegistrationContent = `
        <div class="room-registration-form">
            <h2>Đăng ký phòng</h2>
            <form id="registerRoomForm">
                <div class="register-room-form-group">
                    <div>
                        <label for="maPhong">Mã phòng:</label>
                        <input type="text" id="maPhong" placeholder="Nhập mã phòng" required />
                    </div>
                    <div>
                        <label for="thoiGianThue">Thời gian thuê:</label>
                        <select id="thoiGianThue" required>
                            <option value="3" selected>3 tháng</option>
                            <option value="6">6 tháng</option>
                        </select>
                    </div>
                    <button type="submit">Đăng ký</button>
                </div>
            </form>
        </div>
        <div class="student-registrations">
            <h2>Danh sách đơn đăng ký của bạn</h2>
            <table class="registrationList">
                <thead>
                    <tr>
                        <th>Mã ĐK</th>
                        <th>Số phòng</th>
                        <th>Thời gian thuê</th>
                        <th>Ngày đăng ký</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Đang tải danh sách đăng ký...</td></tr>
                </tbody>
            </table>
        </div>
    `



    // Muc Thanh toan
    let paymentContent = `
        <div class="payment-section">
            <h2>Hóa đơn của bạn</h2>
            <table class="paymentList">
                <thead>
                    <tr>
                        <th>Tháng/Năm</th>
                        <th>Phòng</th>
                        <th>Số tiền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Đang tải hóa đơn...</td></tr>
                </tbody>
            </table>
        </div>
    `



    // Muc Quan ly sinh vien
    let studentManagementContent = `
        <div class="student-management-section">
            <h2>Quản lý sinh viên</h2>
            <div class="search-bar">
                <label for="searchStudentInput">Tìm kiếm sinh viên:</label>
                <input type="text" id="searchStudentInput" placeholder="Tìm kiếm theo tên hoặc mã sinh viên..." />
            </div>
            <table class="studentList">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Tên sinh viên</th>
                        <th>Mã sinh viên</th>
                        <th>Lớp</th>
                        <th>Khoa</th>
                        <th>Giới tính</th>
                        <th>Số phòng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Đang tải danh sách sinh viên...</td></tr>
                </tbody>
            </table>
        </div>
    `;



    // Muc Quan ly tai khoan
    let accountManagementContent = `
        <div class="account-management-section">
            <h2>Quản lý tài khoản</h2>
            <div id="accountListDiv">
                <table class="accountList">
                    <thead>
                        <tr>
                            <th>ID người dùng</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Đang tải danh sách tài khoản...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
    


    // Muc quan ly dang ki phong
    let roomRegistrationManagementContent = `
        <div class="room-registration-management-section">
            <h2>Quản lý đăng ký phòng</h2>
            <table class="registrationList">
                <thead>
                    <tr>
                        <th>Mã ĐK</th>
                        <th>Mã SV</th>
                        <th>Họ tên</th>
                        <th>Số phòng</th>
                        <th>Thời gian thuê</th>
                        <th>Ngày đăng ký</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Đang tải danh sách đăng ký...</td></tr>
                </tbody>
            </table>
        </div>
    `



    // Muc quan ly thanh toan
    let paymentManagementContent = `
        <div class="payment-management-section">
            <h2>Quản lý hóa đơn</h2>
            <div class="payment-buttons">
                <button id="roomBillsButton">Hóa đơn phòng</button>
                <button id="studentBillsButton">Hóa đơn sinh viên</button>
            </div>
            <div id="billListContainer">
                <h3>Danh sách hóa đơn</h3>
                <table class="billList">
                    <thead>
                        <tr>
                            <th>Mã hóa đơn</th>
                            <th>Phòng</th>
                            <th>Tháng/Năm</th>
                            <th>Tổng tiền</th>
                            <th>Ngày tạo</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Đang tải hóa đơn...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;



    // Muc Phan quyen
    let permissionContent = `
        <div class="permission-section">
            <h2>Phân quyền</h2>
            <div class="permission-form">
                <div class="permission-form-group">
                    <div>
                        <label for="userId">ID người dùng:</label>
                        <input type="text" id="userId" placeholder="Nhập ID người dùng" />
                    </div>
                    <div>
                        <label for="newRole">Vai trò mới:</label>
                        <select id="newRole">
                            <option value="sinh_vien">Sinh viên</option>
                            <option value="nhan_vien">Nhân viên</option>
                            <option value="quan_ly">Quản lý</option>
                        </select>
                    </div>
                    <div>
                        <label for="identifier">Mã định danh (maSV, maNV, maQL):</label>
                        <input type="text" id="identifier" placeholder="Nhập mã định danh" />
                    </div>
                    <button id="updateRoleButton">Cập nhật vai trò</button>
                </div>
                <div id="permissionMessage"></div>
            </div>
        </div>
    `

    return {
        "Profile": profileContent,
        "Thông báo": notificationContent,
        "Tra cứu phòng": roomSearchContent,
        "Đăng kí phòng": roomRegistrationContent,
        "Thanh toán": paymentContent,
        "Quản lý sinh viên": studentManagementContent,
        "Quản lý tài khoản": accountManagementContent,
        "Quản lý đăng ký phòng": roomRegistrationManagementContent,
        "Quản lý thanh toán": paymentManagementContent,
        "Phân quyền": permissionContent,
    };
}



// Chuc nang muc Profile
async function getUserInfo() {
    let checkToken = await verifyToken();
    if (!checkToken) {
        alert("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "./index.html";
        return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
        return null;
    }

    try {
        const response = await fetch("/quanLyKTX/api/getProfile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

async function updateUserInfo(userData) {
    let updatedData = {
        hoTen: document.getElementById("hoTen").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    // Add role-specific fields and validate them
    if (userData.role === "sinh_vien") {
        updatedData = {
            ...updatedData,
            ngaySinh: document.getElementById("ngaySinh").value.trim(),
            lop: document.getElementById("lop").value.trim(),
            khoa: document.getElementById("khoa").value.trim(),
            quocTich: document.getElementById("quocTich").value.trim(),
            gioiTinh: document.getElementById("gioiTinh").value,
        };
    } else if (userData.role === "nhan_vien") {
        updatedData = {
            ...updatedData,
            phongban: document.getElementById("phongban").value.trim(),
            chucVu: document.getElementById("chucVu").value.trim()
        };
    } else if (userData.role === "quan_ly") {
        updatedData = {
            ...updatedData,
            chucVu: document.getElementById("chucVu").value.trim()
        };
    }

    // Send the validated data to the server
    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/quanLyKTX/api/updateProfile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Cập nhật thông tin thành công!");
            userData = { ...userData, ...updatedData }; // Update local userData
            let contentMap = await loadContent(userData);
            let mainContent = document.querySelector(".main-content");
            mainContent.innerHTML = contentMap["Profile"]; // Reload profile view
            await updateButtonHandler(); // Re-attach event handler
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Đã xảy ra lỗi khi cập nhật thông tin.");
    }
}

async function updateButtonHandler() {
    const updateButton = document.getElementById("updateProfileButton");
    const mainContent = document.querySelector(".main-content");
    let userData = await getUserInfo()

    if (updateButton) {
        updateButton.addEventListener("click", () => {
            mainContent.innerHTML = renderEditableProfile(userData);

            // Add event listener for "Save" button
            const saveButton = document.getElementById("saveProfileButton");
            saveButton.addEventListener("click", async () => {
                await updateUserInfo(userData);
            });
            const cancelButton = document.getElementById("cancelProfileButton");
            cancelButton.addEventListener("click", async () => {
                let contentMap = await loadContent(userData);
                mainContent.innerHTML = contentMap["Profile"]; // Reload profile view
                await updateButtonHandler(); // Re-attach event handler
            });
        });
    }
}

function renderEditableProfile(userData, isManager = false) {
    let editableContent = `
        <div class="profile-section">
            <h2>Cập nhật thông tin</h2>
            <div class="profile-card">
                <div class="profile-info">
                    <p>
                        <strong>Họ và tên:</strong>
                        <input type="text" id="hoTen" value="${userData.hoTen}" />
                    </p>
                    <p><strong>Số điện thoại:</strong>
                    <input type="text" id="phone" value="${userData.phone}" />
                    </p>
                    <p><strong>Email:</strong>
                    <input type="email" id="email" value="${userData.email}" />
                    </p>
    `;

    // Add role-specific fields
    if (userData.role === "sinh_vien") {
        editableContent += `
            <p>
                <strong>Mã sinh viên:</strong>
                <input type="text" id="maSV" value="${userData.maSV.toUpperCase()}" disabled />
            </p>
            <p>
                <strong>Lớp:</strong>
                <input type="text" id="lop" value="${userData.lop.toUpperCase()}" />
            </p>
            <p>
                <strong>Khoa:</strong>
                <input type="text" id="khoa" value="${userData.khoa}" />
            </p>
            <p>
                <strong>Quốc tịch:</strong>
                <input type="text" id="quocTich" value="${userData.quocTich}" />
            </p>
            <p>
                <strong>Ngày sinh:</strong>
                <input type="date" id="ngaySinh" value="${userData.ngaySinh.split('T')[0]}" />
            </p>
            <p>
                <strong>Giới tính:</strong>
                <select id="gioiTinh">
                    <option value="Nam" ${userData.gioiTinh === "Nam" ? "selected" : ""}>Nam</option>
                    <option value="Nữ" ${userData.gioiTinh === "Nữ" ? "selected" : ""}>Nữ</option>  
                </select>
            </p>
        `;
    } else if (userData.role === "nhan_vien") {
        editableContent += `
            <p>
                <strong>Mã nhân viên:</strong>
                <input type="text" id="maNV" value="${userData.maNV.toUpperCase()}" ${isManager?"":"disabled"} />
            </p>
            <p>
                <strong>Phòng ban:</strong>
                <input type="text" id="phongban" value="${userData.phongban}" />
            </p>
            <p>
                <strong>Chức vụ:</strong>
                <input type="text" id="chucVu" value="${userData.chucVu}" />
            </p>
        `;
    } else if (userData.role === "quan_ly") {
        editableContent += `
            <p>
                <strong>Mã quản lý:</strong>
                <input type="text" id="maQL" value="${userData.maQL.toUpperCase()}" />
            </p>
            <p>
                <strong>Chức vụ:</strong>
                <input type="text" id="chucVu" value="${userData.chucVu}" />
            </p>
        `;
    }
    editableContent += `
                    <button id="saveProfileButton">Lưu</button>
                    <button id="cancelProfileButton">Hủy</button>
                </div>
            </div>
        </div>
    `;

    return editableContent;
}

async function capNhatSoPhong() {
    await fetch("/quanLyKTX/api/phong/capNhatThongTin", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("authToken")
        }
    })

    await fetch("/quanLyKTX/api/phong/xoaThongTinHetHan", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("authToken")
        }
    })
}



// Chuc nang muc Thong bao
async function loadNotifications(type = "chung", isStudentNotification = false, searchQuery = "") {
    let userData = await getUserInfo();

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/quanLyKTX/api/thongBao/lietKe?type=${type}&search=${encodeURIComponent(searchQuery)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                maSV: isStudentNotification ? null : (type === "ca_nhan" ? userData.maSV || "" : "")
            })
        });

        if (response.ok) {
            const notifications = await response.json();
            const notificationList = notifications.map(notification => `
                <li>
                    <h3>${notification.tieuDe}</h3>
                    <p>${notification.noiDung}</p>
                    <small>Gửi vào ${new Date(notification.ngayTaoTB).toLocaleString()}</small>
                    ${notification.loaiThongBao === "ca_nhan" ? `<p><strong>Đến:</strong> ${notification.maSV}</p>` : ""}
                    ${(userData.role === "quan_ly" || userData.role === "nhan_vien") ? `
                        <div class="notification-actions">
                            <button class="editNotificationButton" onclick="editNotification(${notification.maTB})">Chỉnh sửa</button>
                            <button class="deleteNotificationButton" onclick="deleteNotification(${notification.maTB})">Xóa</button>
                        </div>
                    ` : ""}
                </li>`).join('');
            document.getElementById("notificationList").innerHTML = notificationList;
        } else {
            document.getElementById("notificationList").innerHTML = "<li>Không thể tải thông báo.</li>";
        }
    } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
        document.getElementById("notificationList").innerHTML = "<li>Đã xảy ra lỗi khi tải thông báo.</li>";
    }
}

function renderNotificationForm() {
    return `
        <div class="notification-form">
            <h2>Tạo Thông Báo</h2>
            <form id="notificationForm">
                <div class="notification-form-group">
                    <div>
                        <label for="notificationType">Loại thông báo:</label>
                        <select id="notificationType" required>
                            <option value="chung">Thông báo chung</option>
                            <option value="ca_nhan">Thông báo cá nhân</option>
                        </select>
                    </div>
                    <div>
                        <label for="notificationTitle">Tiêu đề:</label>
                        <input type="text" id="notificationTitle" placeholder="Nhập tiêu đề thông báo" required />
                    </div>
                    <div>
                        <label for="notificationContent">Nội dung:</label>
                        <textarea id="notificationContent" placeholder="Nhập nội dung thông báo" required></textarea>
                    </div>
                    <div id="maSVField" style="display: none;">
                        <label for="maSV">Mã sinh viên:</label>
                        <input type="text" id="maSV" placeholder="Nhập mã sinh viên" />
                    </div>
                    <div class="form-buttons">
                        <button type="submit" id="submitNotificationButton">Gửi Thông Báo</button>
                        <button type="button" id="cancelNotificationButton">Hủy</button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

function renderEditNotificationForm(notification) {
    return `
        <div class="notification-form">
            <h2>Chỉnh sửa Thông Báo</h2>
            <form id="notificationForm">
                <div class="notification-form-group">
                    <div>
                        <label for="notificationTitle">Tiêu đề:</label>
                        <input type="text" id="notificationTitle" value="${notification.tieuDe}" required />
                    </div>
                    <div>
                        <label for="notificationContent">Nội dung:</label>
                        <textarea id="notificationContent" required>${notification.noiDung}</textarea>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" id="submitNotificationButton">Lưu</button>
                        <button type="button" id="cancelNotificationButton">Hủy</button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

async function handleNotificationFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const loaiThongBao = document.getElementById("notificationType").value;
    const title = document.getElementById("notificationTitle").value;
    const content = document.getElementById("notificationContent").value;
    const maSV = loaiThongBao === "ca_nhan" ? document.getElementById("maSV").value : null;

    if (title && content && loaiThongBao) {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/quanLyKTX/api/thongBao/gui", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ tieuDe: title, noiDung: content, loaiThongBao, maSV })
            });

            if (response.ok) {
                alert("Thông báo đã được tạo thành công!");
                document.querySelector(".thongBao").click();
            } else {
                const errorData = await response.json();
                alert(`Lỗi: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi tạo thông báo:", error);
            alert("Đã xảy ra lỗi khi tạo thông báo.");
        }
    } else {
        alert("Vui lòng nhập đầy đủ thông tin.");
    }
}

async function editNotification(maTB) {
    const mainContent = document.querySelector(".main-content");
    const token = localStorage.getItem("authToken");

    try {
        // Lấy thông tin chi tiết thông báo
        const response = await fetch(`/quanLyKTX/api/thongBao/chiTiet/${maTB}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            const notification = await response.json();
            mainContent.innerHTML = renderEditNotificationForm(notification);

            // Gắn sự kiện cho nút "Lưu" và "Hủy"
            const saveButton = document.getElementById("submitNotificationButton");
            saveButton.addEventListener("click", async (event) => {
                event.preventDefault();
                await saveEditedNotification(maTB);
            });

            const cancelButton = document.getElementById("cancelNotificationButton");
            cancelButton.addEventListener("click", () => {
                document.querySelector(".thongBao").click(); // Quay lại danh sách thông báo
            });
        } else {
            alert("Không thể tải thông tin thông báo.");
        }
    } catch (error) {
        console.error("Lỗi khi tải thông tin thông báo:", error);
        alert("Đã xảy ra lỗi khi tải thông tin thông báo.");
    }
}
window.editNotification = editNotification; // Gắn hàm vào global scope

async function saveEditedNotification(maTB) {
    const title = document.getElementById("notificationTitle").value.trim();
    const content = document.getElementById("notificationContent").value.trim();
    const token = localStorage.getItem("authToken");

    if (!title || !content) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    try {
        const response = await fetch(`/quanLyKTX/api/thongBao/capNhat/${maTB}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ tieuDe: title, noiDung: content })
        });

        if (response.ok) {
            alert("Cập nhật thông báo thành công!");
            document.querySelector(".thongBao").click(); // Quay lại danh sách thông báo
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật thông báo:", error);
        alert("Đã xảy ra lỗi khi cập nhật thông báo.");
    }
}

function attachNotificationFormListeners() {
    const notificationTypeDropdown = document.getElementById("notificationType");
    const maSVField = document.getElementById("maSVField");

    // Show or hide the maSV field based on the selected notification type
    notificationTypeDropdown.addEventListener("change", () => {
        if (notificationTypeDropdown.value === "ca_nhan") {
            maSVField.style.display = "block";
        } else {
            maSVField.style.display = "none";
        }
    });

    // Attach form submission handler
    const notificationForm = document.getElementById("notificationForm");
    notificationForm.addEventListener("submit", handleNotificationFormSubmit);

    // Attach cancel button handler
    const cancelNotificationButton = document.getElementById("cancelNotificationButton");
    cancelNotificationButton.addEventListener("click", () => {
        document.querySelector(".thongBao").click();
    });
}

function createNotificationButtonHandler() {
    const createNotificationButton = document.getElementById("createNotificationButton");
    if (createNotificationButton) {
        createNotificationButton.addEventListener("click", () => {
            const mainContent = document.querySelector(".main-content");
            mainContent.innerHTML = renderNotificationForm(); // Render the form
            attachNotificationFormListeners(); // Attach event listeners
        });
    }
}

function attachNotificationButtonListeners() {
    const publicNotificationButton = document.getElementById("publicNotificationButton");
    const personalNotificationButton = document.getElementById("personalNotificationButton");

    // Load public notifications khi nhấn "Thông báo chung"
    publicNotificationButton.addEventListener("click", async () => {
        await loadNotifications("chung");
    });

    // Load personal notifications khi nhấn "Thông báo cá nhân"
    personalNotificationButton.addEventListener("click", async () => {
        await loadNotifications("ca_nhan", false);
    });
}

async function deleteNotification(maTB) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/quanLyKTX/api/thongBao/xoa/${maTB}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token
            }
        });

        if (response.ok) {
            alert('Thông báo đã được xóa thành công!');
            await loadNotifications(); // Reload notifications after deletion
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Lỗi khi xóa thông báo:', error);
        alert('Đã xảy ra lỗi khi xóa thông báo.');
    }
}
window.deleteNotification = deleteNotification; // Expose the function to the global scope

function addSearchNotificationHandler() {
    const searchInput = document.getElementById("searchNotificationInput");
    const searchButton = document.getElementById("searchNotificationButton");
    const publicNotificationButton = document.getElementById("publicNotificationButton");
    const personalNotificationButton = document.getElementById("personalNotificationButton");

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const searchQuery = searchInput.value.trim();
            const activeButton = document.querySelector(".notification-buttons button.active");
            const type = activeButton && activeButton.id === "personalNotificationButton" ? "ca_nhan" : "chung";
            loadNotifications(type, false, searchQuery); // Gọi hàm loadNotifications với từ khóa tìm kiếm
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                const searchQuery = searchInput.value.trim();
                const activeButton = document.querySelector(".notification-buttons button.active");
                const type = activeButton && activeButton.id === "personalNotificationButton" ? "ca_nhan" : "chung";
                loadNotifications(type, false, searchQuery); // Gọi hàm loadNotifications khi nhấn Enter
            }
        });
    }

    // Đánh dấu nút đang hoạt động
    publicNotificationButton.addEventListener("click", () => {
        publicNotificationButton.classList.add("active");
        personalNotificationButton.classList.remove("active");
    });

    personalNotificationButton.addEventListener("click", () => {
        personalNotificationButton.classList.add("active");
        publicNotificationButton.classList.remove("active");
    });
}



// Chuc nang muc Tra cuu phong
async function loadRooms(filters = {}) {
    const roomList = document.querySelector(".roomList tbody");
    const token = localStorage.getItem("authToken");
    const userData = await getUserInfo();

    const queryParams = new URLSearchParams(filters).toString(); // Chuyển bộ lọc thành query string

    try {
        const response = await fetch(`/quanLyKTX/api/phong/danhSach?${queryParams}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            const rooms = await response.json();
            if (rooms.length > 0) {
                roomList.innerHTML = rooms.map(room => `
                    <tr>
                        <td>${room.soPhong}</td>
                        <td>${room.currentSoLuongSV}/${room.maxSoLuongSV}</td>
                        <td>${room.trangThai}</td>
                        <td>${room.gia}</td>
                        <td>${room.loaiPhong}</td>
                        ${userData.role === "quan_ly" ? `
                            <td>
                                <button onclick="editRoom(
                                    ${room.maPhong}, 
                                    '${room.soPhong}', 
                                    ${room.currentSoLuongSV}, 
                                    ${room.maxSoLuongSV}, 
                                    '${room.trangThai}', 
                                    ${room.gia}, 
                                    '${room.loaiPhong}'
                                )">Sửa</button>
                                <button onclick="deleteRoom(${room.maPhong})">Xóa</button>
                            </td>
                        ` : ""}
                    </tr>
                `).join('');
            } else {
                roomList.innerHTML = "<tr><td>Không có phòng nào.</td></tr>";
            }
        } else {
            roomList.innerHTML = "<tr><td>Không thể tải danh sách phòng.</td></tr>";
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
        roomList.innerHTML = "<tr><td>Đã xảy ra lỗi khi tải danh sách phòng.</td></tr>";
    }
}

function renderAddRoomForm() {
    return `
        <div class="room-form">
            <h2>Thêm Phòng</h2>
            <form id="addRoomForm">
                <div class="room-form-group">
                    <div>
                        <label for="soPhong">Số phòng:</label>
                        <input type="text" id="soPhong" placeholder="Nhập số phòng" required />
                    </div>
                    <div>
                        <label for="soLuongSV">Số lượng SV:</label>
                        <input type="number" id="soLuongSV" placeholder="Nhập số lượng sinh viên" min="0" max="10" />
                    </div>
                    <div>
                        <label for="gia">Giá:</label>
                        <input type="number" id="gia" placeholder="Nhập giá phòng" min="0" step="0.01" required />
                    </div>
                    <div>
                        <label for="loaiPhong">Loại phòng:</label>
                        <select id="loaiPhong" required>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="submit" id="submitAddRoomButton">Thêm Phòng</button>
                        <button type="button" id="cancelAddRoomButton">Hủy</button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

function addFilterHandlers() {
    const filterByPrice = document.getElementById("filterByPrice");
    const filterByStatus = document.getElementById("filterByStatus");
    const filterByType = document.getElementById("filterByType");
    const applyFiltersButton = document.getElementById("applyFiltersButton");

    if (applyFiltersButton) {
        applyFiltersButton.addEventListener("click", () => {
            const filters = {
                price: filterByPrice.value,
                status: filterByStatus.value,
                type: filterByType.value
            };
            loadRooms(filters); // Gọi hàm loadRooms với các bộ lọc
        });
    }
}

async function handleAddRoomFormSubmit(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const soPhong = document.getElementById("soPhong").value.trim();
    const soLuongSV = document.getElementById("soLuongSV").value.trim() || 0;
    const gia = document.getElementById("gia").value.trim();
    const loaiPhong = document.getElementById("loaiPhong").value;

    if (!soPhong || !gia || !loaiPhong) {
        alert("Vui lòng nhập đầy đủ thông tin.");
        return;
    }

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/quanLyKTX/api/phong/themPhong", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ soPhong, soLuongSV, gia, loaiPhong })
        });

        if (response.ok) {
            alert("Thêm phòng thành công!");
            document.querySelector(".traCuuPhong").click(); // Quay lại danh sách phòng
        } else {
            const errorData = await response.json();
            if (errorData.message === "Số phòng đã tồn tại.") {
                alert("Lỗi: Số phòng đã tồn tại. Vui lòng nhập số phòng khác.");
            } else {
                alert(`Lỗi: ${errorData.message}`);
            }
        }
    } catch (error) {
        console.error("Lỗi khi thêm phòng:", error);
        alert("Đã xảy ra lỗi khi thêm phòng.");
    }
}

function addRoomButtonHandler() {
    const addRoomButton = document.getElementById("addRoomButton");
    if (addRoomButton) {
        addRoomButton.addEventListener("click", () => {
            const mainContent = document.querySelector(".main-content");
            mainContent.innerHTML = renderAddRoomForm(); // Hiển thị form thêm phòng

            // Gắn sự kiện cho form
            const addRoomForm = document.getElementById("addRoomForm");
            addRoomForm.addEventListener("submit", handleAddRoomFormSubmit);

            // Gắn sự kiện cho nút "Hủy"
            const cancelAddRoomButton = document.getElementById("cancelAddRoomButton");
            cancelAddRoomButton.addEventListener("click", async () => {
                document.querySelector(".traCuuPhong").click(); // Quay lại danh sách phòng
            });
        });
    }
}

function renderEditRoomForm(maPhong, soPhong, currentSoLuongSV, maxSoLuongSV, trangThai, gia, loaiPhong) {
    return `
        <div class="room-edit-form">
            <h2>Sửa Phòng</h2>
            <form id="editRoomForm">
                <div class="room-form-group">
                    <div>
                        <label for="editSoPhong">Số phòng:</label>
                        <input type="text" id="editSoPhong" value="${soPhong}" required />
                    </div>
                    <div>
                        <label for="editCurrentSoLuongSV">Số lượng SV đã đăng ký:</label>
                        <input type="number" id="editCurrentSoLuongSV" value="${currentSoLuongSV}" readonly />
                    </div>
                    <div>
                        <label for="editMaxSoLuongSV">Số lượng SV tối đa:</label>
                        <input type="number" id="editMaxSoLuongSV" value="${maxSoLuongSV}" min="0" max="10" required />
                    </div>
                    <div>
                        <label for="editTrangThai">Trạng thái:</label>
                        <select id="editTrangThai" required>
                            <option value="Trống" ${trangThai === "Trống" ? "selected" : ""}>Trống</option>
                            <option value="Đầy" ${trangThai === "Đầy" ? "selected" : ""}>Đầy</option>
                            <option value="Bảo trì" ${trangThai === "Bảo trì" ? "selected" : ""}>Bảo trì</option>
                        </select>
                    </div>
                    <div>
                        <label for="editGia">Giá:</label>
                        <input type="number" id="editGia" value="${gia}" min="0" step="0.01" required />
                    </div>
                    <div>
                        <label for="editLoaiPhong">Loại phòng:</label>
                        <select id="editLoaiPhong" required>
                            <option value="Nam" ${loaiPhong === "Nam" ? "selected" : ""}>Nam</option>
                            <option value="Nữ" ${loaiPhong === "Nữ" ? "selected" : ""}>Nữ</option>
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="submit">Lưu</button>
                        <button type="button" id="cancelEditRoomButton">Hủy</button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

function editRoom(maPhong, soPhong, currentSoLuongSV, maxSoLuongSV, trangThai, gia, loaiPhong) {
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = renderEditRoomForm(maPhong, soPhong, currentSoLuongSV, maxSoLuongSV, trangThai, gia, loaiPhong);

    // Gắn sự kiện cho form sửa phòng
    const editRoomForm = document.getElementById("editRoomForm");
    editRoomForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const updatedSoPhong = document.getElementById("editSoPhong").value.trim();
        const updatedMaxSoLuongSV = document.getElementById("editMaxSoLuongSV").value.trim();
        const updatedTrangThai = document.getElementById("editTrangThai").value;
        const updatedGia = document.getElementById("editGia").value.trim();
        const updatedLoaiPhong = document.getElementById("editLoaiPhong").value;

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(`/quanLyKTX/api/phong/capNhatPhong`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    maPhong,
                    soPhong: updatedSoPhong,
                    soLuongSV: updatedMaxSoLuongSV, // Cập nhật số lượng SV tối đa
                    trangThai: updatedTrangThai,
                    gia: updatedGia,
                    loaiPhong: updatedLoaiPhong
                })
            });

            if (response.ok) {
                alert("Cập nhật phòng thành công!");
                document.querySelector(".traCuuPhong").click(); // Quay lại danh sách phòng
            } else {
                const errorData = await response.json();
                alert(`Lỗi: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật phòng:", error);
            alert("Đã xảy ra lỗi khi cập nhật phòng.");
        }
    });

    // Gắn sự kiện cho nút "Hủy"
    const cancelEditRoomButton = document.getElementById("cancelEditRoomButton");
    cancelEditRoomButton.addEventListener("click", async () => {
        document.querySelector(".traCuuPhong").click(); // Quay lại danh sách phòng
    });
}

async function deleteRoom(maPhong) {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`/quanLyKTX/api/phong/xoaPhong/${maPhong}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            alert("Xóa phòng thành công!");
            loadRooms(); // Reload danh sách phòng
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa phòng:", error);
        alert("Đã xảy ra lỗi khi xóa phòng.");
    }
}
window.addRoom = addRoomButtonHandler; // Expose the function to the global scope
window.editRoom = editRoom;
window.deleteRoom = deleteRoom; // Expose the function to the global scope



// Chuc nang muc Dang ki phong
async function handleRegisterRoomFormSubmit(event) {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form

    const soPhong = document.getElementById("maPhong").value.trim();
    const thoiGianThue = document.getElementById("thoiGianThue").value.trim();
    const userData = await getUserInfo();

    if (!soPhong) {
        alert("Vui lòng nhập số phòng.");
        return;
    }

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/quanLyKTX/api/phong/dangKyPhong", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ maSV: userData.maSV, soPhong, thoiGianThue }) // Gửi soPhong thay vì maPhong
        });

        if (response.ok) {
            alert("Đăng ký phòng thành công. Vui lòng chờ duyệt.");
            document.querySelector(".dangKyPhong").click();
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi đăng ký phòng:", error);
        alert("Đã xảy ra lỗi khi đăng ký phòng.");
    }
}

async function loadStudentRoomRegistrations() {
    const registrationList = document.querySelector(".registrationList tbody");
    const userData = await getUserInfo();
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`/quanLyKTX/api/phong/dangKyPhong/danhSachCuaSinhVien?maSV=${userData.maSV}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            const registrations = await response.json();
            if (registrations.length > 0) {
                registrationList.innerHTML = registrations.map(registration => `
                    <tr>
                        <td>${registration.maDK}</td>
                        <td>${registration.soPhong}</td>
                        <td>${registration.thoiGianThue} tháng</td>
                        <td>${new Date(registration.ngayDK).toLocaleDateString()}</td>
                        <td>${registration.trangThai}</td>
                    </tr>
                `).join('');
            } else {
                registrationList.innerHTML = "<tr><td>Không có đơn đăng ký nào.</td></tr>";
            }
        } else {
            registrationList.innerHTML = "<tr><td>Không thể tải danh sách đăng ký.</td></tr>";
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách đăng ký:", error);
        registrationList.innerHTML = "<tr><td>Đã xảy ra lỗi khi tải danh sách đăng ký.</td></tr>";
    }
}



// Chuc nang muc thanh toan
async function loadStudentBills() {
    const tbody = document.querySelector('.paymentList tbody');
    const token = localStorage.getItem("authToken");
    try {
        const res = await fetch("/quanLyKTX/api/hoaDon/hoaDonSinhVien", {
            headers: { "Authorization": token }
        });
        if (res.ok) {
            const bills = await res.json();
            if (bills.length > 0) {
                tbody.innerHTML = bills.map(bill => `
                    <tr>
                        <td>${bill.thangNam}</td>
                        <td>${bill.soPhong}</td>
                        <td>${bill.soTien}</td>
                        <td>${bill.trangThai}</td>
                        <td>
                            ${bill.trangThai === "Chờ thanh toán" ? `<button onclick="payBill(${bill.maHD})">Thanh toán</button>` : ""}
                            <button onclick="viewBillDetails(${bill.maHD})">Xem chi tiết</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = "<tr><td>Không có hóa đơn nào.</td></tr>";
            }
        } else {
            tbody.innerHTML = "<tr><td>Không thể tải hóa đơn.</td></tr>";
        }
    } catch (e) {
        tbody.innerHTML = "<tr><td>Đã xảy ra lỗi khi tải hóa đơn.</td></tr>";
    }
}

async function viewBillDetails(maHD) {
    const token = localStorage.getItem("authToken");
    try {
        const res = await fetch(`/quanLyKTX/api/hoaDon/chiTiet/${maHD}`, {
            headers: { "Authorization": token }
        });
        if (res.ok) {
            const bill = await res.json();
            const mainContent = document.querySelector(".main-content");
            mainContent.innerHTML = `
                <div class="bill-details">
                    <h2>Chi tiết hóa đơn</h2>
                    <div class="bill-info">
                        <div class="bill-info-item">
                            <div>
                                <p><strong>Mã hóa đơn:</strong> ${bill.maHD}</p>
                            </div>
                            <div>
                                <p><strong>Phòng:</strong> ${bill.soPhong}</p>
                            </div>
                            <div>
                                <p><strong>Tháng/Năm:</strong> ${bill.thangNam}</p>
                            </div>
                            <div>
                                <p><strong>Tổng tiền:</strong> ${bill.tongTien}</p>
                            </div>
                            <div>
                                <p><strong>Tiền phòng:</strong> ${bill.tienPhong}</p>
                            </div>
                            <div>
                                <p><strong>Tiền điện:</strong> ${bill.tienDien}</p>
                            </div>
                            <div>
                                <p><strong>Tiền nước:</strong> ${bill.tienNuoc}</p>
                            </div>
                            <div>
                                <p><strong>Phụ phí:</strong> ${bill.phuPhi}</p>
                            </div>
                            <div>
                                <p><strong>Mô tả phụ phí:</strong> ${bill.moTaPhuPhi || "Không có"}</p>
                            </div>
                            <div>
                                <p><strong>Trạng thái:</strong> ${bill.trangThai}</p>
                            </div>
                            <button onclick="try {document.querySelector('.thanhToan').click()} catch {document.querySelector('.quanLyThanhToan').click()}">Quay lại</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            alert("Không thể tải chi tiết hóa đơn.");
        }
    } catch (e) {
        console.error("Lỗi khi tải chi tiết hóa đơn:", e);
        alert("Đã xảy ra lỗi khi tải chi tiết hóa đơn.");
    }
}
window.viewBillDetails = viewBillDetails;

async function payBill(maHD) {
    const token = localStorage.getItem("authToken");
    const res = await fetch("/quanLyKTX/api/hoaDon/thanhToan", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ maHD })
    });
    const data = await res.json();
    alert(data.message);
    loadStudentBills();
}
window.payBill = payBill;

function updateBillTableHeader(isStudentBill = false) {
    const tableHeader = document.querySelector('.billList thead');
    if (isStudentBill) {
        // Cấu trúc bảng cho hóa đơn sinh viên
        tableHeader.innerHTML = `
            <tr>
                <th>Mã hóa đơn</th>
                <th>Phòng</th>
                <th>Tháng/Năm</th>
                <th>Số tiền</th>
                <th>Tên sinh viên</th>
                <th>Ngày thanh toán</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        `;
    } else {
        // Cấu trúc bảng cho hóa đơn phòng
        tableHeader.innerHTML = `
            <tr>
                <th>Mã hóa đơn</th>
                <th>Phòng</th>
                <th>Tháng/Năm</th>
                <th>Tổng tiền</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
        `;
    }
}

async function loadBillList() {
    const tbody = document.querySelector('.billList tbody');
    const token = localStorage.getItem("authToken");
    try {
        const res = await fetch("/quanLyKTX/api/hoaDon/danhSachHoaDonPhong", {
            headers: { "Authorization": token }
        });
        if (res.ok) {
            const bills = await res.json();
            if (bills.length > 0) {
                tbody.innerHTML = bills.map(bill => `
                    <tr>
                        <td>${bill.maHD}</td>
                        <td>${bill.soPhong}</td>
                        <td>${bill.thangNam}</td>
                        <td>${bill.tongTien}</td>
                        <td>${new Date(bill.ngayTao).toLocaleDateString()}</td>
                        <td>${bill.trangThai}</td>
                        <td>
                            <button class="viewBillDetails" onclick="viewBillDetails(${bill.maHD})">Xem chi tiết</button>
                            <button class="deleteBill" onclick="deleteBill(${bill.maHD})" class="delete-bill-button">Xóa</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = "<tr><td>Không có hóa đơn nào.</td></tr>";
            }
        } else {
            tbody.innerHTML = "<tr><td>Không thể tải hóa đơn.</td></tr>";
        }
    } catch (e) {
        tbody.innerHTML = "<tr><td>Đã xảy ra lỗi khi tải hóa đơn.</td></tr>";
    }
}

async function loadStudentBillList() {
    const tbody = document.querySelector('.billList tbody');
    const token = localStorage.getItem("authToken");
    try {
        const res = await fetch("/quanLyKTX/api/hoaDon/danhSachHoaDonSinhVien", {
            headers: { "Authorization": token }
        });
        if (res.ok) {
            const bills = await res.json();
            if (bills.length > 0) {
                tbody.innerHTML = bills.map(bill => `
                    <tr>
                        <td>${bill.maHD}</td>
                        <td>${bill.soPhong}</td>
                        <td>${bill.thangNam}</td>
                        <td>${bill.soTien}</td>
                        <td>${bill.hoTen}</td>
                        <td>${bill.ngayThanhToan ? new Date(bill.ngayThanhToan).toLocaleDateString() : "Chưa thanh toán"}</td>
                        <td>${bill.trangThai}</td>
                        <td>
                            <button class="viewBillDetails" onclick="viewStudentBillDetails(${bill.maHD}, '${bill.maSV}')">Xem chi tiết</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = "<tr><td>Không có hóa đơn nào.</td></tr>";
            }
        } else {
            tbody.innerHTML = "<tr><td>Không thể tải hóa đơn.</td></tr>";
        }
    } catch (e) {
        tbody.innerHTML = "<tr><td>Đã xảy ra lỗi khi tải hóa đơn.</td></tr>";
    }
}

function createBillFormHandler() {
    const form = document.getElementById("createBillForm");
    if (form) {
        form.onsubmit = async function (e) {
            e.preventDefault();

            // Lấy từng trường dữ liệu từ form
            const soPhong = form.querySelector('input[name="maPhong"]').value.trim();
            const thangNam = form.querySelector('input[name="thangNam"]').value.trim();
            const tienPhong = form.querySelector('input[name="tienPhong"]').value.trim();
            const tienDien = form.querySelector('input[name="tienDien"]').value.trim() || 0;
            const tienNuoc = form.querySelector('input[name="tienNuoc"]').value.trim() || 0;
            const phuPhi = form.querySelector('input[name="phuPhi"]').value.trim() || 0;
            const moTaPhuPhi = form.querySelector('input[name="moTaPhuPhi"]').value.trim() || "";

            // Tạo đối tượng dữ liệu để gửi request
            const requestData = {
                soPhong: soPhong,
                thangNam: thangNam,
                tienPhong: parseInt(tienPhong),
                tienDien: parseInt(tienDien),
                tienNuoc: parseInt(tienNuoc),
                phuPhi: parseInt(phuPhi),
                moTaPhuPhi: moTaPhuPhi
            };

            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch("/quanLyKTX/api/hoaDon/taoHoaDonPhong", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    },
                    body: JSON.stringify(requestData)
                });

                const result = await res.json();

                if (res.ok) {
                    alert(result.message);
                    form.reset(); // Reset form sau khi tạo hóa đơn thành công
                    loadBillList(); // Tải lại danh sách hóa đơn
                } else {
                    alert(`Lỗi: ${result.message}`);
                }
            } catch (error) {
                console.error("Lỗi khi tạo hóa đơn:", error);
                alert("Đã xảy ra lỗi khi tạo hóa đơn.");
            }
        };
    }
}

async function viewStudentBillDetails(maHD, maSV) {
    const token = localStorage.getItem("authToken");
    try {
        const res = await fetch(`/quanLyKTX/api/hoaDon/chiTietHoaDonSinhVien/${maHD}/${maSV}`, {
            headers: { "Authorization": token }
        });
        if (res.ok) {
            const bill = await res.json();
            const mainContent = document.querySelector(".main-content");
            mainContent.innerHTML = `
                <div class="bill-details">
                    <h2>Chi tiết hóa đơn</h2>
                    <div class="bill-info">
                        <p><strong>Mã hóa đơn:</strong> ${bill.maHD}</p>
                        <p><strong>Tên sinh viên:</strong> ${bill.hoTen}</p>
                        <p><strong>Mã sinh viên:</strong> ${bill.maSV}</p>
                        <p><strong>Phòng:</strong> ${bill.soPhong}</p>
                        <p><strong>Tháng/Năm:</strong> ${bill.thangNam}</p>
                        <p><strong>Tiền phòng:</strong> ${bill.tienPhong.toFixed(2)}</p>
                        <p><strong>Tiền điện (chia theo đầu người):</strong> ${bill.tienDienChia}</p>
                        <p><strong>Tiền nước (chia theo đầu người):</strong> ${bill.tienNuocChia}</p>
                        <p><strong>Phụ phí (chia theo đầu người):</strong> ${bill.phuPhiChia}</p>
                        <p><strong>Mô tả phụ phí:</strong> ${bill.moTaPhuPhi || "Không có"}</p>
                        <p><strong>Tổng tiền:</strong> ${bill.tongTien}</p>
                        <p><strong>Trạng thái:</strong> ${bill.trangThai}</p>
                        <button onclick="document.querySelector('.quanLyThanhToan').click()">Quay lại</button>
                    </div>
                </div>
            `;
        } else {
            alert("Không thể tải chi tiết hóa đơn.");
        }
    } catch (e) {
        console.error("Lỗi khi tải chi tiết hóa đơn:", e);
        alert("Đã xảy ra lỗi khi tải chi tiết hóa đơn.");
    }
}
window.viewStudentBillDetails = viewStudentBillDetails;

async function deleteBill(maHD) {
    const token = localStorage.getItem("authToken");
    if (!confirm("Bạn có chắc chắn muốn xóa hóa đơn này?")) return;

    try {
        const res = await fetch(`/quanLyKTX/api/hoaDon/xoa/${maHD}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        if (res.ok) {
            alert("Xóa hóa đơn thành công!");
            loadBillList(); // Tải lại danh sách hóa đơn sau khi xóa
        } else {
            const errorData = await res.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa hóa đơn:", error);
        alert("Đã xảy ra lỗi khi xóa hóa đơn.");
    }
}
window.deleteBill = deleteBill;

function attachBillButtonHandlers() {
    const roomBillsButton = document.getElementById("roomBillsButton");
    const studentBillsButton = document.getElementById("studentBillsButton");

    if (roomBillsButton) {
        roomBillsButton.addEventListener("click", () => {
            updateBillTableHeader(false); // Cập nhật cấu trúc bảng cho hóa đơn phòng
            loadBillList(); // Tải danh sách hóa đơn phòng
        });
    }

    if (studentBillsButton) {
        studentBillsButton.addEventListener("click", () => {
            updateBillTableHeader(true); // Cập nhật cấu trúc bảng cho hóa đơn sinh viên
            loadStudentBillList(); // Tải danh sách hóa đơn sinh viên
        });
    }
}



// Chuc nang muc quan ly sinh vien
async function loadStudents(searchQuery = "") {
    const studentList = document.querySelector(".studentList tbody");
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`/quanLyKTX/api/sinhVien/danhSach?search=${encodeURIComponent(searchQuery)}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            const students = await response.json();
            if (students.length > 0) {
                studentList.innerHTML = students.map(student => `
                    <tr>
                        <td>${student.userId}</td>
                        <td>${student.hoTen}</td>
                        <td>${student.maSV}</td>
                        <td>${student.lop}</td>
                        <td>${student.khoa}</td>
                        <td>${student.gioiTinh}</td>
                        <td>${student.soPhong || "Chưa thuê"}</td>
                        <td>
                            <button onclick="viewDisciplinaryActions('${student.maSV}')">Kỷ luật</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                studentList.innerHTML = "<tr><td>Không tìm thấy sinh viên nào.</td></tr>";
            }
        } else {
            studentList.innerHTML = "<tr><td>Không thể tải danh sách sinh viên.</td></tr>";
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách sinh viên:", error);
        studentList.innerHTML = "<tr><td>Đã xảy ra lỗi khi tải danh sách sinh viên.</td></tr>";
    }
}

function addSearchStudentHandler() {
    const searchInput = document.getElementById("searchStudentInput");

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const searchQuery = searchInput.value.trim();
            loadStudents(searchQuery); // Gọi hàm loadStudents với từ khóa tìm kiếm
        });
    }
}

async function viewDisciplinaryActions(maSV) {
    const mainContent = document.querySelector(".main-content");
    const token = localStorage.getItem("authToken");
    const userData = await getUserInfo();

    try {
        const response = await fetch(`/quanLyKTX/api/sinhVien/kyLuat/danhSach?maSV=${maSV}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            const disciplinaryActions = await response.json();
            mainContent.innerHTML = `
                <div class="disciplinary-section">
                    <h2>Danh sách kỷ luật của sinh viên: ${maSV}</h2>
                    <button onclick="addDisciplinaryAction('${maSV}')">Thêm kỷ luật</button>
                    <table class="disciplinaryList">
                        <thead>
                            <tr>
                                <th>Mã kỷ luật</th>
                                <th>Ngày kỷ luật</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${disciplinaryActions.map(action => `
                                <tr>
                                    <td>${action.maKL}</td>
                                    <td>${new Date(action.ngayKL).toLocaleDateString()}</td>
                                    <td>${action.trangThai}</td>
                                    <td>
                                        <button onclick="viewDisciplinaryDetails(${action.maKL})">Xem chi tiết</button>
                                        ${action.trangThai === "Đang xử lý" && userData.role === "quan_ly" ? `
                                            <button onclick="approveDisciplinaryAction(${action.maKL})">Duyệt</button>
                                            <button onclick="rejectDisciplinaryAction(${action.maKL})">Từ chối</button>
                                        ` : ""}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <button onclick="document.querySelector('.quanLySinhVien').click()">Quay lại</button>
                </div>
            `;
        } else {
            alert("Không thể tải danh sách kỷ luật.");
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách kỷ luật:", error);
        alert("Đã xảy ra lỗi khi tải danh sách kỷ luật.");
    }
}

async function addDisciplinaryAction(maSV) {
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = `
        <div class="add-disciplinary-section">
            <h2>Thêm kỷ luật cho sinh viên: ${maSV}</h2>
            <form id="addDisciplinaryForm">
                <div class="add-disciplinary-form-group">
                    <div>
                        <label for="noiDung">Nội dung:</label>
                        <textarea id="noiDung" placeholder="Nhập nội dung kỷ luật" required></textarea>
                    </div>
                    <button type="submit">Thêm</button>
                    <button type="button" onclick="viewDisciplinaryActions('${maSV}')">Hủy</button>
                </div>
            </form>
        </div>
    `;

    const form = document.getElementById("addDisciplinaryForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const noiDung = document.getElementById("noiDung").value.trim();

        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch("/quanLyKTX/api/sinhVien/kyLuat/them", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({ maSV, noiDung })
            });

            if (response.ok) {
                alert("Thêm kỷ luật thành công!");
                viewDisciplinaryActions(maSV);
            } else {
                const errorData = await response.json();
                alert(`Lỗi: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi thêm kỷ luật:", error);
            alert("Đã xảy ra lỗi khi thêm kỷ luật.");
        }
    });
}

async function approveDisciplinaryAction(maKL) {
    const token = localStorage.getItem("authToken");

    try {
        // Lay noi dung ky luat
        const danhSachKyLuat = await fetch(`/quanLyKTX/api/sinhVien/kyLuat/chiTiet/${maKL}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });
        if (!danhSachKyLuat.ok) {
            alert("Không thể tải chi tiết kỷ luật.");
            return;
        }
        const disciplinaryAction = await danhSachKyLuat.json();
        const noiDung = disciplinaryAction.noiDung;

        const response = await fetch(`/quanLyKTX/api/sinhVien/kyLuat/duyet/${maKL}`, {
            method: "PUT",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            alert("Duyệt kỷ luật thành công!");
            const { maSV } = await response.json();
            viewDisciplinaryActions(maSV);
            sendNotificationToStudent(maSV, 
                "Kỷ luật sinh viên", 
                `Mã KL: ${maKL}, <br>NoiDung: ${noiDung}`
            );
        } else {
            alert("Không thể duyệt kỷ luật.");
        }
    } catch (error) {
        console.error("Lỗi khi duyệt kỷ luật:", error);
        alert("Đã xảy ra lỗi khi duyệt kỷ luật.");
    }
}

async function rejectDisciplinaryAction(maKL) {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`/quanLyKTX/api/sinhVien/kyLuat/tuChoi/${maKL}`, {
            method: "PUT",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            alert("Từ chối kỷ luật thành công!");
            const { maSV } = await response.json();
            viewDisciplinaryActions(maSV);
        } else {
            alert("Không thể từ chối kỷ luật.");
        }
    } catch (error) {
        console.error("Lỗi khi từ chối kỷ luật:", error);
        alert("Đã xảy ra lỗi khi từ chối kỷ luật.");
    }
}

async function viewDisciplinaryDetails(maKL) {
    const mainContent = document.querySelector(".main-content");
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`/quanLyKTX/api/sinhVien/kyLuat/chiTiet/${maKL}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            const disciplinaryAction = await response.json();
            mainContent.innerHTML = `
                <div class="disciplinary-details">
                    <h2>Chi tiết kỷ luật</h2>
                    <div class="disciplinary-info">
                        <div class="disciplinary-info-item">
                            <p><strong>Mã kỷ luật:</strong> ${disciplinaryAction.maKL}</p>
                            <p><strong>Mã sinh viên:</strong> ${disciplinaryAction.maSV}</p>
                            <p><strong>Ngày kỷ luật:</strong> ${new Date(disciplinaryAction.ngayKL).toLocaleDateString()}</p>
                            <p><strong>Trạng thái:</strong> ${disciplinaryAction.trangThai}</p>
                            <p><strong>Nội dung:</strong> ${disciplinaryAction.noiDung}</p>
                            <button onclick="viewDisciplinaryActions('${disciplinaryAction.maSV}')">Quay lại</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            alert("Không thể tải chi tiết kỷ luật.");
        }
    } catch (error) {
        console.error("Lỗi khi tải chi tiết kỷ luật:", error);
        alert("Đã xảy ra lỗi khi tải chi tiết kỷ luật.");
    }
}

async function sendNotificationToStudent(maSV, title, content) {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch("/quanLyKTX/api/thongBao/gui", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                maSV,
                tieuDe: title,
                noiDung: content,
                loaiThongBao: "ca_nhan"
            })
        });

        if (response.ok) {
            console.log("Thông báo đã được gửi thành công.");
        } else {
            console.error("Không thể gửi thông báo.");
        }
    } catch (error) {
        console.error("Lỗi khi gửi thông báo:", error);
    }
}
window.viewDisciplinaryActions = viewDisciplinaryActions; // Expose the function to the global scope
window.addDisciplinaryAction = addDisciplinaryAction; // Expose the function to the global scope
window.approveDisciplinaryAction = approveDisciplinaryAction; // Expose the function to the global scope
window.rejectDisciplinaryAction = rejectDisciplinaryAction; // Expose the function to the global scope
window.viewDisciplinaryDetails = viewDisciplinaryDetails; // Expose the function to the global scope



// Chuc nang muc Quan ly tai khoan
async function loadAccounts() {
    const accountList = document.querySelector(".accountList tbody");
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch("/quanLyKTX/api/taiKhoan", {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            const accounts = await response.json();
            accountList.innerHTML = accounts.map(account => `
                <tr>
                    <td>${account.userId}</td>
                    <td>${account.email}</td>
                    <td>${roleFormat(account.role)}</td>
                    <td>
                        <button id="viewAccountDetailsButton" onclick="viewAccountDetails('${account.userId}','${account.role}')">Xem chi tiết</button>
                        <button id="deleteAccountButton" onclick="deleteAccount('${account.userId}')">Xóa</button>
                    </td>
                </tr>
            `).join('');
        } else {
            accountList.innerHTML = "<tr><td>Không thể tải danh sách tài khoản.</td></tr>";
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách tài khoản:", error);
        accountList.innerHTML = "<tr><td>Đã xảy ra lỗi khi tải danh sách tài khoản.</td></tr>";
    }
}

async function viewAccountDetails(userId, role) {
    const mainContent = document.querySelector(".main-content");
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`/quanLyKTX/api/taiKhoan/chiTietTaiKhoan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ userId: userId, role: role })
        });

        if (response.ok) {
            let userData = await response.json();

            mainContent.innerHTML = renderEditableProfile(userData, true);
            const saveButton = document.getElementById("saveProfileButton");
            saveButton.addEventListener("click", async () => {
                await updateAccountInfo(userData);
            });
            const cancelButton = document.getElementById("cancelProfileButton");
            cancelButton.addEventListener("click", async () => {
                document.querySelector(".quanLyTaiKhoan").click();
            })
        } else {
            alert("Không thể tải thông tin tài khoản.");
        }
    } catch (error) {
        console.error("Lỗi khi tải thông tin tài khoản:", error);
        alert("Đã xảy ra lỗi khi tải thông tin tài khoản.");
    }
}

async function updateAccountInfo(userData) {
    let updatedData = {
        role: userData.role,
        userId: userData.userId,
        hoTen: document.getElementById("hoTen").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim()
    };

    // Add role-specific fields and validate them
    if (userData.role === "sinh_vien") {
        updatedData = {
            ...updatedData,
            maSV: document.getElementById("maSV").value.trim(),
            ngaySinh: document.getElementById("ngaySinh").value.trim(),
            lop: document.getElementById("lop").value.trim(),
            khoa: document.getElementById("khoa").value.trim(),
            quocTich: document.getElementById("quocTich").value.trim(),
            gioiTinh: document.getElementById("gioiTinh").value.trim(),
        };
    } else if (userData.role === "nhan_vien") {
        updatedData = {
            ...updatedData,
            maNV: document.getElementById("maNV").value.trim(),
            phongban: document.getElementById("phongban").value.trim(),
            chucVu: document.getElementById("chucVu").value.trim()
        };
    } else if (userData.role === "quan_ly") {
        updatedData = {
            ...updatedData,
            maQL: document.getElementById("maQL").value.trim(),
            chucVu: document.getElementById("chucVu").value.trim()
        };
    }

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/quanLyKTX/api/taiKhoan/capNhat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Cập nhật thông tin tài khoản thành công!");
            document.querySelector(".quanLyTaiKhoan").click();
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin tài khoản:", error);
        alert("Đã xảy ra lỗi khi cập nhật thông tin tài khoản.");
    }
}

async function deleteAccount(userId) {
    const token = localStorage.getItem("authToken");

    // Hiển thị hộp thoại xác nhận
    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa tài khoản với ID: ${userId}?`);
    if (!confirmDelete) return;

    try {
        const response = await fetch(`/quanLyKTX/api/taiKhoan/xoa/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            alert("Xóa tài khoản thành công!");
            loadAccounts(); // Tải lại danh sách tài khoản sau khi xóa
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa tài khoản:", error);
        alert("Đã xảy ra lỗi khi xóa tài khoản.");
    }
}
window.deleteAccount = deleteAccount;
window.viewAccountDetails = viewAccountDetails;
window.updateAccountInfo = updateAccountInfo;



// Chuc nang quan ly dang ki phong
async function loadRoomRegistrations() {
    const registrationList = document.querySelector(".registrationList tbody");
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch("/quanLyKTX/api/phong/dangKyPhong/danhSach", {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            const registrations = await response.json();
            registrationList.innerHTML = registrations.map(registration => `
                <tr>
                    <td>${registration.maDK}</td>
                    <td>${registration.maSV}</td>
                    <td>${registration.hoTen}</td>
                    <td>${registration.soPhong}</td>
                    <td>${registration.thoiGianThue} tháng</td>
                    <td>${new Date(registration.ngayDK).toLocaleDateString()}</td>
                    <td>${registration.trangThai}</td>
                    <td>
                        ${registration.trangThai === "Chờ duyệt" ? `
                            <button class="thuePhong_duyet" onclick="updateRegistrationStatus(${registration.maDK}, 'Đã duyệt')">Duyệt</button>
                            <button class="thuePhong_tuChoi" onclick="updateRegistrationStatus(${registration.maDK}, 'Từ chối')">Từ chối</button>
                        ` : ""}
                        <button class="thuePhong_xoa" onclick="deleteRegistration(${registration.maDK})">Xóa</button>
                    </td>
                </tr>
            `).join('');
        } else {
            registrationList.innerHTML = "<tr><td>Không thể tải danh sách đăng ký.</td></tr>";
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách đăng ký:", error);
        registrationList.innerHTML = "<tr><td>Đã xảy ra lỗi khi tải danh sách đăng ký.</td></tr>";
    }
}

async function updateRegistrationStatus(maDK, trangThai) {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch("/quanLyKTX/api/phong/dangKyPhong/capNhatTrangThai", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ maDK, trangThai })
        });

        if (response.ok) {
            alert("Cập nhật trạng thái đơn đăng ký thành công!");
            loadRoomRegistrations(); // Reload danh sách đăng ký
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn đăng ký:", error);
        alert("Đã xảy ra lỗi khi cập nhật trạng thái đơn đăng ký.");
    }
}

async function deleteRegistration(maDK) {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(`/quanLyKTX/api/phong/dangKyPhong/xoa/${maDK}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        if (response.ok) {
            alert("Xóa đơn đăng ký thành công!");
            loadRoomRegistrations(); // Reload danh sách đăng ký
        } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi xóa đơn đăng ký:", error);
        alert("Đã xảy ra lỗi khi xóa đơn đăng ký.");
    }
}
window.updateRegistrationStatus = updateRegistrationStatus;
window.deleteRegistration = deleteRegistration;



// Chuc nang muc Phan quyen
async function handleRoleUpdate() {
    const userId = document.getElementById("userId").value.trim();
    const newRole = document.getElementById("newRole").value;
    const identifier = document.getElementById("identifier").value.trim();
    const messageDiv = document.getElementById("permissionMessage");

    if (!userId || !newRole || !identifier) {
        messageDiv.style.color = "red";
        messageDiv.textContent = "Vui lòng nhập đầy đủ thông tin.";
        return;
    }

    try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/quanLyKTX/api/updateRole", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ userId, newRole, identifier })
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.style.color = "green";
            messageDiv.textContent = "Cập nhật vai trò thành công.";
        } else {
            messageDiv.style.color = "red";
            messageDiv.textContent = result.message || "Cập nhật vai trò thất bại.";
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật vai trò:", error);
        messageDiv.style.color = "red";
        messageDiv.textContent = "Đã xảy ra lỗi khi cập nhật vai trò.";
    }
}



// Chuc nang khac
function logoutButtonHandler() {
    document.getElementById("logoutButton").addEventListener("click", () => {
        localStorage.removeItem("authToken"); // Remove the token
        alert("Bạn đã đăng xuất thành công!");
        window.location.href = "./index.html"; // Redirect to login page
    });
}

function sidebarToggleButtonHandler() {
    const toggleSidebarButton = document.getElementById("toggleSidebarButton");
    const sidebar = document.querySelector(".sidebar");

    toggleSidebarButton.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
    });
}



// Nap noi dung trang chu
document.addEventListener("DOMContentLoaded",async () => {
    const sidebarMenu = document.getElementById("sidebarMenu");
    const mainContent = document.querySelector(".main-content");

    let userData = await getUserInfo();

    const menu = `
        <li class="active"><i class="Profile"></i> Profile</li>
        <li><i class="thongBao"></i> Thông báo</li>
        <li><i class="traCuuPhong"></i> Tra cứu phòng</li>
        ${userData.role === "sinh_vien" 
            ? `
                <li><i class="dangKyPhong"></i> Đăng kí phòng</li>
                <li><i class="thanhToan"></i> Thanh toán</li>
            ` 
            : ""
        }
        ${userData.role === "quan_ly" || userData.role === "nhan_vien"
            ? `
                <li><i class="quanLySinhVien"></i> Quản lý sinh viên</li>
            ` 
            : ""
        }
        ${userData.role === "quan_ly"
            ? ` 
                <li><i class="quanLyTaiKhoan"></i> Quản lý tài khoản</li>
                <li><i class="quanLyDangKyPhong"></i> Quản lý đăng ký phòng</li>
                <li><i class="quanLyThanhToan"></i> Quản lý thanh toán</li>
                <li><i class="phanQuyen"></i> Phân quyền</li>
                <li><i class="thongKe"></i> Bao cao</li>
                <li><i class="saoLuuKhoiPhuc"></i> Sao lưu & Khôi phục</li>
            ` 
            : ""
        }
    `

    sidebarMenu.innerHTML = menu;

    const sidebarItems = document.querySelectorAll(".sidebar ul li");

    // Add click event listeners to sidebar items
    sidebarItems.forEach(item => {
        item.addEventListener("click",async () => {
            // Remove 'active' class from all items
            sidebarItems.forEach(i => i.classList.remove("active"));
            // Add 'active' class to the clicked item
            item.classList.add("active");

            // Content for each menu item
            let contentMap = await loadContent(userData);

            // Update main content based on the clicked item
            const itemText = item.textContent.trim();
            mainContent.innerHTML = contentMap[itemText] || "<p>Nội dung đang được cập nhật.</p>";

            // Add event listener for "Update Profile" button
            if (itemText === "Profile") {
                await capNhatSoPhong()
                userData = await getUserInfo();
                contentMap = await loadContent(userData);
                mainContent.innerHTML = contentMap[itemText]

                await updateButtonHandler();
            }
            if (itemText === "Thông báo") {
                createNotificationButtonHandler();
                attachNotificationButtonListeners();
                await loadNotifications();
                addSearchNotificationHandler()
            }
            if (itemText === "Tra cứu phòng") {
                await loadRooms(); // Gọi hàm loadRooms khi nhấn vào "Tra cứu phòng"
                addRoomButtonHandler()
                addFilterHandlers()
            }
            if (itemText === "Đăng kí phòng") {
                const registerRoomForm = document.getElementById("registerRoomForm");
                if (registerRoomForm) {
                    registerRoomForm.addEventListener("submit", handleRegisterRoomFormSubmit);
                }
                await loadStudentRoomRegistrations();
            }
            if (itemText === "Thanh toán") {
                await loadStudentBills();
            }
            if (itemText === "Quản lý sinh viên") {
                await loadStudents();
                addSearchStudentHandler()
            }
            if (itemText === "Quản lý tài khoản") {
                loadAccounts();
            }
            if (itemText === "Quản lý đăng ký phòng") {
                await loadRoomRegistrations();
            }
            if (itemText === "Quản lý thanh toán") {
                await loadBillList(); // Mặc định hiển thị hóa đơn phòng
                attachBillButtonHandlers(); // Gắn sự kiện cho các nút
                createBillFormHandler();
            }
            if (itemText === "Phân quyền") {
                const updateRoleButton = document.getElementById("updateRoleButton");
                if (updateRoleButton) {
                    updateRoleButton.addEventListener("click", handleRoleUpdate);
                }
            }
        });
    });

    sidebarToggleButtonHandler(); // Attach sidebar toggle button handler
    logoutButtonHandler(); // Attach logout button handler

    sidebarItems[0].click(); // Trigger click on the first item to load default content
});