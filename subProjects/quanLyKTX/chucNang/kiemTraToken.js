export async function verifyToken() {
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch("/quanLyKTX/api/verifyToken", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        if (!response.ok) {
            throw new Error("Token không hợp lệ hoặc đã hết hạn");
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}