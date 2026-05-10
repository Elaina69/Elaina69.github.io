let eConsole = "%c ElainaV4 "
let eCss = "color: #ffffff; background-color: #f77fbe"

function main() {
    let url = new URL(".", import.meta.url).href
    return url
}

async function register(id, name) {
    const response = await fetch(`${main()}api/elainatheme/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            summonerID: `${id}`,
            summonerName: name
        })
    })
    return await response.json()
}

async function login(id, name) {
    const response = await fetch(`${main()}api/elainatheme/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            summonerID: `${id}`,
            summonerName: name
        })
    })
    return await response.json()
}

async function readBackup(token, id) {
    const response = await fetch(`${main()}api/elainatheme/data`, {
        method: 'POST',
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            summonerID: `${id}`,
            type: "GET",
        })
    })
    let result = await response.json()
    return result
}

async function writeBackup(token, id, data) {
    if (ElainaData.get("backup-datastore")) {
        let backupDataToCloud = new Promise(async (resolve, reject) => {
            const response = await fetch(`${main()}api/elainatheme/data`, {
                method: 'POST',
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    summonerID: `${id}`,
                    type: "BACKUP",
                    data: data
                })
            })
            let result = await response.json()
    
            if (result.success) {
                console.log(eConsole + '%c Backup successfully.', eCss, "")
                resolve()
            }
            else {
                console.log(eConsole + '%c Backup failed.', eCss, "")
                reject()
            }
        })
          
        Toast.promise(backupDataToCloud, {
            loading: 'Backing up settings to cloud...',
            success: 'Backup successfully!!',
            error: 'Backup failed.'
        })
    }
    else Toast.error("You have to turn on cloud backup first!!")
}

async function deleteBackup(token, id) {
    let deleteData = new Promise(async (resolve, reject) => {
        const response = await fetch(`${main()}api/elainatheme/data`, {
            method: 'POST',
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                summonerID: `${id}`,
                type: "DELETE"
            })
        })
        let result = await response.json()

        if (result.success) {
            console.log(eConsole + '%c Delete backup successfully.', eCss, "")
            resolve()
        }
        else reject()
    })
      
    Toast.promise(deleteData, {
        loading: 'Deleting file...',
        success: 'Delete backup successfully!!',
        error: ''
    })
}

async function totalUsers() {
    return (await(await fetch(`${main()}api/elainatheme/totalUsers`)).json()).total
}

export async function getLatestRelease() {
    let response = await (await fetch(`${main()}api/elainatheme/latest-release`)).json()
    return response.tag_name
}

async function getImageHash(id, imageType) {
    try {
        const response = await fetch(`${main()}api/elainatheme/image/getImageHash`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                summonerID: `${id}`,
                type: imageType
            })
        })
        if (!response.ok) return null

        const result = await response.json()
        return result.hash || null
    } catch (err) {
        console.log(eConsole + `%c getImageHash failed: ${err.message}`, eCss, "")
        return null
    }
}

async function getImage(id, imageType) {
    try {
        const response = await fetch(`${main()}api/elainatheme/image/getImage`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                summonerID: `${id}`,
                type: imageType
            })
        })
        if (!response.ok) {
            return null
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (err) {
        console.log(eConsole + `%c getImage failed: ${err.message}`, eCss, "")
        return null
    }
}

async function uploadImage(token, id, imageType, imageFile) {
    const formData = new FormData();
    formData.append("summonerID", id);
    formData.append("type", imageType);
    formData.append("image", imageFile);

    const response = await fetch(`${main()}api/elainatheme/image/uploadImage`, {
        method: 'POST',
        headers: {
            "Authorization": token
        },
        body: formData
    });

    const result = await response.json();

    if (result.success) {
        console.log(eConsole + '%c Image uploaded successfully', eCss, "");
    } else {
        console.log(eConsole + '%c Image upload failed.', eCss, "");
    }
}

async function deleteImage(token, id, imageType) {
    const response = await fetch(`${main()}api/elainatheme/image/deleteImage`, {
        method: 'POST',
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            summonerID: `${id}`,
            type: imageType
        })
    })
    let result = await response.json()

    if (result.success) {
        console.log(eConsole + '%c Delete backup successfully.', eCss, "")
    }
}
async function getFriendsImage(friends) {
    const response = await fetch(`${main()}api/elainatheme/image/getFriendsImage`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            friendsList: friends
        })
    })

    if (!response.ok) {
        console.log(eConsole + `%c getFriendsImage failed: ${response.status}`, eCss, "")
        return []
    }

    let result = await response.json()
    return Array.isArray(result) ? result : []
}

const elainathemeApi = {
    register,
    login,
    readBackup,
    writeBackup,
    deleteBackup,
    totalUsers,
    getLatestRelease,
    getImage,
    getImageHash,
    uploadImage,
    deleteImage,
    getFriendsImage
}

window.elainathemeApi = elainathemeApi