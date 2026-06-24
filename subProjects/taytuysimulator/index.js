import value from "./assets/thuocTinh.json" with { type: "json" };

let daTayTuy = false
let khoa = 0
let kimCuong = 0
let buiRong = 0
let danhSachThuocTinh = ["gold","exp","hungry","luck","damage"]
let saoRong = 9

const btnTayTuy = document.querySelector(".tayTuy")
const btnNhanTuy = document.querySelector(".nhanTuy")
const btnKhoaTuy = document.querySelectorAll(".khoaThuocTinh > input")
const btnChucPhuc = document.querySelectorAll(".nangSao")
const saoRongNum = document.querySelector(".dragon_stars_table > .dragon_stars > p")
const btnTangSao = document.querySelector(".tangSao")
const btnGiamSao = document.querySelector(".giamSao")
const kimCuongTong = document.querySelector(".kimCuong_cost_used p")
const buiRongTong = document.querySelector(".buiRong_cost_used p")
const kimCuongCost = document.querySelector(".kimCuong_cost p")
const buiRongCost = document.querySelector(".buiRong_cost p")

reset()

function tangSao() {
    if (saoRong < 30) {
        saoRong++
        reset()
    }
}

function giamSao() {
    if (saoRong > 9) {
        saoRong--
        reset()
    }
}

function reset() {
    tayTuy(true)
    nhanTuy()
    kimCuong = 0
    buiRong = 0
    kimCuongTong.innerHTML = 0
    buiRongTong.innerHTML = 0
    saoRongNum.innerHTML = saoRong
    kimCuongCost.innerHTML = saoRong*2*khoa
    buiRongCost.innerHTML = saoRong*2
}

function random() {
    let percents = Math.floor(Math.random() * 100)+1
    if (percents <= 40) return 0
    else if (percents > 40 && percents <= 70) return 1
    else if (percents > 70 && percents <= 95) return 2
    else if (percents > 95 && percents <= 98) return 3
    else return 4
}

function tayTuy(force) {
    daTayTuy = true
    let thuocTinh = document.querySelectorAll(".thuocTinh")
    let thuocTinhMoi = document.querySelectorAll(".thuocTinhMoi")
    for (let i = 0; i < thuocTinh.length; i++) {
        let star = random()
        let chiSoMoi = thuocTinhMoi[i].querySelector(".textNumber")
        let saoMoi = thuocTinhMoi[i].querySelector(".thuocTinh_starsNumber")
        let chucPhuc = thuocTinhMoi[i].querySelector(".nangSao")

        let checkChucPhuc = () => {
            if (saoMoi.innerHTML == "4") {
                chucPhuc.style.cssText=`visibility: visible`
                chucPhuc.setAttribute("visible","true")
            }
            else {
                chucPhuc.style.cssText=`visibility: hidden`
                chucPhuc.setAttribute("visible","false")
            }
        }

        if ((!thuocTinh[i].querySelector("input").checked)|| force) {
            if (danhSachThuocTinh[i] == "hungry") chiSoMoi.innerHTML = `- ${value[danhSachThuocTinh[i]][star]*saoRong}S`
            else if (danhSachThuocTinh[i] == "damage") chiSoMoi.innerHTML = `+ ${value[danhSachThuocTinh[i]][star]*saoRong}`
            else chiSoMoi.innerHTML = `+ ${value[danhSachThuocTinh[i]][star]*saoRong}%`

            saoMoi.innerHTML = star+1
            checkChucPhuc()
        }
        else if (thuocTinh[i].querySelector("input").checked && thuocTinh[i].querySelector(".thuocTinh_starsNumber").innerHTML == 6) {
            if (danhSachThuocTinh[i] == "hungry") chiSoMoi.innerHTML = `- ${value[danhSachThuocTinh[i]][4]*saoRong}S`
            else if (danhSachThuocTinh[i] == "damage") chiSoMoi.innerHTML = `+ ${value[danhSachThuocTinh[i]][4]*saoRong}`
            else chiSoMoi.innerHTML = `+ ${value[danhSachThuocTinh[i]][4]*saoRong}%`

            saoMoi.innerHTML = 5
        }
        else {
            chiSoMoi.innerHTML = thuocTinh[i].querySelector(".textNumber").innerHTML
            saoMoi.innerHTML = thuocTinh[i].querySelector(".thuocTinh_starsNumber").innerHTML
            checkChucPhuc()
        }
    }
    kimCuong = kimCuong + (khoa*saoRong*2)
    buiRong = buiRong + saoRong*2

    kimCuongTong.innerHTML = kimCuong
    buiRongTong.innerHTML = buiRong
    console.log("Kim cương đã tiêu: ",kimCuong)
    console.log("Bụi rồng đã tiêu: ",buiRong)
}

function nhanTuy() {
    let thuocTinh = document.querySelectorAll(".thuocTinh")
    let thuocTinhMoi = document.querySelectorAll(".thuocTinhMoi")
    let namSao = 0
    for (let i = 0; i < thuocTinh.length; i++) {
        if (thuocTinhMoi[i].querySelector(".thuocTinh_starsNumber").innerHTML == "5") namSao++
        if (daTayTuy) {
            thuocTinh[i].querySelector(".textNumber").innerHTML = thuocTinhMoi[i].querySelector(".textNumber").innerHTML
            thuocTinh[i].querySelector(".thuocTinh_starsNumber").innerHTML = thuocTinhMoi[i].querySelector(".thuocTinh_starsNumber").innerHTML
            thuocTinhMoi[i].querySelector(".textNumber").innerHTML = ""
            thuocTinhMoi[i].querySelector(".thuocTinh_starsNumber").innerHTML = "0"
        }
        btnChucPhuc[i].setAttribute("visible", "false")
        btnChucPhuc[i].style.cssText=`visibility: hidden`
    }
    if (namSao == 5) {
        for (let i = 0; i < thuocTinh.length; i++) {
            if (thuocTinh[i].getAttribute("tt") == danhSachThuocTinh[i]) {
                if (danhSachThuocTinh[i] == "hungry") thuocTinh[i].querySelector(".textNumber").innerHTML = `- ${value[danhSachThuocTinh[i]][5]*saoRong}S`
                else if (danhSachThuocTinh[i] == "damage") thuocTinh[i].querySelector(".textNumber").innerHTML = `+ ${value[danhSachThuocTinh[i]][5]*saoRong}`
                else thuocTinh[i].querySelector(".textNumber").innerHTML = `+ ${value[danhSachThuocTinh[i]][5]*saoRong}%`

                thuocTinh[i].querySelector(".thuocTinh_starsNumber").innerHTML = 6
            }
        }
    }
    daTayTuy = false
}

btnTayTuy.addEventListener("click", ()=>{
    tayTuy(false)
})

btnNhanTuy.addEventListener("click", nhanTuy)

btnGiamSao.addEventListener("click", giamSao)

btnTangSao.addEventListener("click", tangSao)

for (let i = 0; i < btnKhoaTuy.length; i++) {
    btnKhoaTuy[i].addEventListener("click", ()=> {
        if (khoa == 4) {
            if (btnKhoaTuy[i].checked) btnKhoaTuy[i].checked = false
            else if (!btnKhoaTuy[i].checked) {
                khoa--
                kimCuongCost.innerHTML = saoRong*2*khoa
            }
        }
        else if (!btnKhoaTuy[i].checked) {
            khoa--
            kimCuongCost.innerHTML = saoRong*2*khoa
        }
        else {
            khoa++
            kimCuongCost.innerHTML = saoRong*2*khoa
        }
        console.log("số tủy đã khóa: ",khoa)
    })
}

for (let i = 0; i < btnChucPhuc.length; i++) {
    btnChucPhuc[i].addEventListener("click", ()=> {
        if (btnChucPhuc[i].getAttribute("visible") == "true") {
            btnChucPhuc[i].setAttribute("visible", "false")
            btnChucPhuc[i].style.cssText=`visibility: hidden`

            let thuocTinhMoi = document.querySelectorAll(".thuocTinhMoi")

            if (danhSachThuocTinh[i] == "hungry") thuocTinhMoi[i].querySelector(".textNumber").innerHTML = `- ${value[danhSachThuocTinh[i]][4]*saoRong}S`
            else if (danhSachThuocTinh[i] == "damage") thuocTinhMoi[i].querySelector(".textNumber").innerHTML = `+ ${value[danhSachThuocTinh[i]][4]*saoRong}`
            else thuocTinhMoi[i].querySelector(".textNumber").innerHTML = `+ ${value[danhSachThuocTinh[i]][4]*saoRong}%`

            thuocTinhMoi[i].querySelector(".thuocTinh_starsNumber").innerHTML = 5

            kimCuong = kimCuong + saoRong*5
            kimCuongTong.innerHTML=kimCuong
            console.log("Kim cương đã tiêu: ",kimCuong)
            console.log("Bụi rồng đã tiêu: ",buiRong)
        }
    })
}