//global VAR
let data = ''
let benhNhanIndex = 0;
let chanDoanDaChon = [];
let dieuTriDaChon = [];
let API_KEY='';
function startApp() {
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("focus", function() {
           // this.select();
           this.value="";
        });
    });
    getLocalStorage();
    renderBenhNhan();
    renderCLS();
    searchInputCLS();
    renderChanDoan();
    inputCD();
    inputDT();
    checkNullRender();
}
  getAPIKEY();
async function getAPIKEY(){
	let rs = await fetch("https://hook.eu2.make.com/lyuf25ki296f6aovkdanap1nyvwrcmpx", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    }
});
	 API_KEY = await rs.text();
    
}
function loadData() {
    let script = document.createElement("script");
    script.src = ".data/data" + benhNhanIndex + ".js";
    document.body.appendChild(script);
}


function performAction(type, actionId) {
    //const resultText = data[actionId];
    let str = '';
    if (type === 'dauHieuSinhTon') {
        str = '<br>';
        str += "Mạch: " + data["dauHieuSinhTon"].mach + `<br>`;
        str += "Huyết áp: " + data["dauHieuSinhTon"].huyetAp + `<br>`;
        str += "Nhịp thở: " + data["dauHieuSinhTon"].nhipTho + `<br>`;
        str += "Nhiệt độ: " + data["dauHieuSinhTon"].nhietDo + `<br>`;
        str += "SpO2: " + data["dauHieuSinhTon"].spo2;
        document.getElementById('kham-result').innerHTML = `<strong>Kết quả:</strong> ${str}`;
    } else if (type === 'cls') {
        str = '<br>';
        index = data["canLamSang"].findIndex(item => item['id'] === actionId);
        if (typeof data["canLamSang"][index]["ketQua"] == "object" || typeof data["canLamSang"][index]["ketLuan"] == "object") {
            Object.entries(data["canLamSang"][index]["ketQua"]).forEach(([key, value]) => {
                str += key + ": " + value + "<br>"
            });
        } else if (typeof data["canLamSang"][index]["ketQua"] == "string" || typeof data["canLamSang"][index]["ketLuan"] == "string") {
            str += data["canLamSang"][index]["label"] + ": " + (data["canLamSang"][index]["ketLuan"] || data["canLamSang"][index]["ketQua"]);

        }
        document.getElementById('cls-result').innerHTML = `<strong>Kết quả:</strong> ${str}`;
    } else if (type === 'kham') {
        str = '<br>';
        str += data["thamKhamLamSang"][actionId]
        document.getElementById('kham-result').innerHTML = `<strong>Kết quả:</strong> ${str}`;
    }
}
// Hàm xử lý khi chốt chẩn đoán
function submitDiagnosis() {
    const selectedDiag = document.getElementById('diagnosis').value;
    const resultBox = document.getElementById('final-result');

    if (selectedDiag === 'none') {
        resultBox.style.color = '#d9534f';
        resultBox.innerHTML = '⚠️ Vui lòng chọn một chẩn đoán trước khi ra phác đồ!';
        return;
    }

    if (selectedDiag === 'viem-phoi') {
        resultBox.style.color = '#28a745';
        resultBox.innerHTML = '✅ Chẩn đoán chính xác: Viêm phổi thùy!<br><span style="font-size: 14px; font-weight: normal; color: #333;">Phác đồ gợi ý: Nhập viện, Kháng sinh tiêm tĩnh mạch, Hạ sốt, Long đờm, Thở oxy hỗ trợ nếu SpO2 giảm. Bạn đã cứu sống bệnh nhân!</span>';
    } else {
        resultBox.style.color = '#d9534f';
        resultBox.innerHTML = '❌ Chẩn đoán sai! Hãy xem xét lại các dữ kiện lâm sàng (Sốt cao, rales nổ, bạch cầu tăng, X-quang có đám mờ) và thử lại.';
    }
}

function renderBenhNhan() {
    let pHanhChinh = document.querySelector('#p-hanhChinh');
    let pLyDoNhapVien = document.querySelector('#p-lyDoNhapVien');
    let pTienSu = document.querySelector('#p-tienSu');
    let pBenhSu = document.querySelector('#p-benhSu');
    pHanhChinh.innerHTML = `<strong>Họ tên:</strong> ` + data.thongTinHanhChinh.hoTen + ` | <strong>Tuổi:</strong> ` + data.thongTinHanhChinh.tuoi + ` | <strong>Giới tính:</strong>` + data.thongTinHanhChinh.gioiTinh;
    pLyDoNhapVien.innerHTML = `<strong>Lý do vào viện: </strong>` + data.lyDoNhapVien;
    pTienSu.innerHTML = `<strong>Tiền sử: </strong>` + data.tienSu.banThan;
    pBenhSu.innerHTML = `<strong>Bệnh sử: </strong>` + data.benhSu.khoiPhat + ` ` + data.benhSu.dienTien;
    pBenhSu.innerHTML += "<br><br><strong>Triệu chứng kèm theo:</strong> "
    for (let i of data.benhSu.trieuChungKemTheo) {
        pBenhSu.innerHTML += i + ". ";
    }

}
function checkNullRender(){
	console.log("dang chay");
	const tenBenhNhan = document.querySelector("#p-hanhChinh").childNodes[1]; // kiểm tra tên có phải là null không
	if(tenBenhNhan.textContent.includes("null")){
		alert(12)
		window.location.reload();

	}
}
function renderCLS() {
    let divCLS = document.querySelector('#div-CLS');
    for (let i = 0; i < data["canLamSang"].length; i++) {
        divCLS.innerHTML += `<button onclick="performAction('cls', '` + data["canLamSang"][i].id + `')" class="cls">` + data["canLamSang"][i].label + `</button>`
        //     		let btn = document.createElement("button");
        // btn.textContent = data["canLamSang"][i].label;
        // btn.onclick= function(){
        // 	performAction('cls', data["canLamSang"][i].id)
        // }
        // btn.className = "cls";
        // divCLS.appendChild(btn);
    }
}

function searchInputCLS() {
    document.getElementById('input-SearchCLS').addEventListener('input', function() {
        const keyword = removeAccents(this.value.trim().toLowerCase());
        const buttons = document.querySelectorAll('.cls');
        let firstMatchedButton = null;
        buttons.forEach(button => {
            const buttonText = removeAccents(button.textContent.toLowerCase());
            if (keyword === '') {
                button.classList.remove('highlight-search');
                button.style.opacity = '1'; // Trả về độ mờ bình thường
            } else if (buttonText.includes(keyword)) {
                button.classList.add('highlight-search');
                button.style.opacity = '1';
                // Ghi nhớ lại button đầu tiên khớp với từ khóa
                if (!firstMatchedButton) {
                    firstMatchedButton = button;
                }
            } else {
                button.classList.remove('highlight-search');
                // Thay vì ẩn (display:none) làm xáo trộn vị trí, ta nên làm mờ (opacity) 
                // để thấy rõ hiệu ứng scroll thanh cuộn cực đẹp mắt.
                button.style.opacity = '0.2';
            }
        });
        if (firstMatchedButton) {
            firstMatchedButton.scrollIntoView({
                behavior: 'smooth', // Cuộn mượt mà (smooth), không bị giật cục
                block: 'nearest' // Cuộn tới vị trí gần nhất đủ để nhìn thấy (tối ưu nhất cho ô overflow)
            });
        }
    });

}

function removeAccents(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d");
}

function renderChanDoan() {
    let pChanDoan = document.querySelector("#p-ChanDoan");
    let str = "";
    for (let i of data["chanDoan"]["chanDoanXacDinh"]) {
        str += i + "<br>";
    }
    pChanDoan.style.filter = "blur(3px)";
    pChanDoan.onclick = function() {
        pChanDoan.style.filter = "blur(0px)";

        let checkChanDoan = chanDoanDaChon.filter(x => data.chanDoan.icd.includes(x));
        console.log("Chẩn đoán đúng " + checkChanDoan.length + "/" + data.chanDoan.icd.length)
        ketLuanChanDoan(checkChanDoan.length + "/" + data.chanDoan.icd.length);
        chayGroq();

    }
    pChanDoan.innerHTML = str;
}

function backToMainScreen() {
    window.location.href = 'index0.html';
}

function getLocalStorage() {
    benhNhanIndex = localStorage.getItem("benhNhanIndex");
}

function removeVietnameseTones(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase();
}

function inputCD() {
    const dsBenh = Object.values(dataBenh).flat();
    const input = document.getElementById("input-SearchCD");
    const suggestions = document.getElementById("suggestionsCD");
    const emChanDoan = document.querySelector("#CD-result em");




    input.addEventListener("input", () => {
        const keyword = removeVietnameseTones(input.value.trim());

        if (!keyword) {
            suggestions.innerHTML = "";
            return;
        }

        const ketQua = dsBenh.filter(benh =>
            removeVietnameseTones(benh[0]).includes(keyword)
        );

        suggestions.innerHTML = "";

        ketQua.slice(0, 10).forEach(benh => {
            const div = document.createElement("div");
            div.className = "item";
            div.textContent = benh[0];

            div.addEventListener("click", () => {
                input.value = '';
                if (emChanDoan.textContent == "Chẩn đoán...") {
                    emChanDoan.textContent = "";
                }
                emChanDoan.textContent += benh[0] + "\n";
                suggestions.innerHTML = "";
                chanDoanDaChon.push(benh[1]);
            });

            suggestions.appendChild(div);
        });
    });
}

function inputDT() {

    const dsThuoc = dataThuoc;

    const input = document.getElementById("input-SearchDT");
    const suggestions = document.getElementById("suggestionsDT");
    const emDieuTri = document.querySelector("#DT-result em");

    dieuTriDaChon = [];

    input.addEventListener("input", () => {
        const SLThuoc = document.getElementById("input-SearchDT-SL");
        const btnNhap = document.getElementById("btnDieuTri");
        const DTResult = document.getElementById("DT-result");
        const parent = SLThuoc.parentNode;
        parent.appendChild(SLThuoc);
        parent.appendChild(btnNhap);
        parent.appendChild(DTResult);


        const keyword = removeVietnameseTones(input.value.trim());

        if (!keyword) {
            suggestions.innerHTML = "";
            return;
        }

        const ketQua = dsThuoc.filter(thuoc =>
            removeVietnameseTones(thuoc).includes(keyword)
        );

        suggestions.innerHTML = "";

        ketQua.slice(0, 10).forEach(thuoc => {

            const div = document.createElement("div");
            div.className = "item";
            div.textContent = thuoc;

            div.addEventListener("click", () => {

                dieuTriDaChon.push(thuoc);

                input.value = thuoc;
                suggestions.innerHTML = "";

                if (emDieuTri.textContent === "Điều trị...") {
                    emDieuTri.textContent = "";
                }

                // emDieuTri.textContent += thuoc + "\n";
            });

            suggestions.appendChild(div);
        });
    });
}

function clickBtnDieuTri() {
    let SLThuoc = document.querySelector("#input-SearchDT-SL");
    dieuTriDaChon[dieuTriDaChon.length - 1] += " x " + SLThuoc.value;
    let emDieuTri = document.querySelector("#DT-result em");
    emDieuTri.textContent += dieuTriDaChon[dieuTriDaChon.length - 1] + "\n";
}

function ketLuanChanDoan(text) {
    let h3 = document.querySelector("#h3-ketLuanChanDoan");
    h3.innerHTML = "Kết Luận Chẩn Đoán " + `<span style="color:green">` + text + `</span>`;
}


async function askGroq(prompt) {
    const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                response_format: {
                    type: "json_object"
                }
            })
        }
    );
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
        throw new Error(data.error.message);
    }
    return data.choices[0].message.content;
}

async function chayGroq() {
    const canLamSang = data.canLamSang.map(item => {
        let value = "";
        if (item.ketQua) {
            if (typeof item.ketQua === "object") {
                value = Object.entries(item.ketQua).map(([k, v]) => `${k}: ${v}`).join(", ");
            } else {
                value = item.ketQua;
            }
        } else if (item.ketLuan) {
            value = item.ketLuan;
        }
        return `${item.label}: ${value}`;
    }).join("\n");
    let chanDoan = '';
    for (let i = 0; i < data.chanDoan.chanDoanXacDinh.length; i++) {
        chanDoan += data.chanDoan.chanDoanXacDinh[i] + ",";
    }

    
    let prompt = `Bạn là giám khảo chấm thi lâm sàng ICU.

So sánh "Đáp án chuẩn" với "Thí sinh làm".

Quy tắc:
- So khớp theo ý nghĩa, không cần đúng từng từ.
- Chấp nhận tên gọi tương đương.
- Không trừ điểm nếu khác cách diễn đạt nhưng cùng bản chất.
- Chỉ đánh giá những gì thí sinh ghi.
- Không suy diễn hoặc tự bổ sung.

Chẩn đoán:
- Mỗi chẩn đoán chuẩn đúng: cộng điểm.
- Chẩn đoán sai hoặc không liên quan: ghi vào "sai".
- Chẩn đoán thiếu: ghi vào "thieu".

Điều trị:
- Đánh giá theo từng nhóm:
  + Hô hấp
  + Tuần hoàn
  + Kháng sinh
  + Lọc máu
  + Thuốc
  + Ngoại khoa/Can thiệp
- Điều trị đúng ý được tính đúng dù khác tên thuốc hoặc cách viết.
- Điều trị nguy hiểm hoặc chống chỉ định ghi vào "sai".
- Điều trị chuẩn chưa có ghi vào "thieu".

Điểm:
- chanDoan.diem: 0-10
- dieuTri.diem: 0-10

Chỉ trả về JSON đúng schema sau, không markdown, không giải thích ngoài JSON.

{
  "chanDoan":{
    "diem":0,
    "nhanXet":"",
    "thieu":[],
    "sai":[]
  },
  "dieuTri":{
    "diem":0,
    "nhanXet":"",
    "thieu":[],
    "sai":[]
  },
  "tongKet":""
}

Đáp án chuẩn
			 	Chẩn đoán:` + chanDoan + `
			 	Điều trị:` +
        JSON.stringify(data.dieuTri).replace(/^{"dieuTri":{/, "").replace(/}}$/, "").replace(/"/g, "").replace(/[{}]/g, "") + ` 
				=====================
				Thí sinh làm
				Chẩn đoán
				` + document.querySelector("#CD-result > em").innerHTML + `
				Điều trị:
				` + JSON.stringify(dieuTriDaChon).replace(/[{}]/g, "");
    console.log(prompt)
    let answer = await askGroq(prompt);
    // console.log(answer)
    renderGroq(answer);
}

function renderGroq(rp) {
    reponess = JSON.parse(rp);
    console.log(rp)
    let gameContainer = document.querySelector(".game-container");
    const html = `
			<b>🩺 Chẩn đoán (${reponess.chanDoan.diem} điểm)</b><br>
			- Nhận xét: ${reponess.chanDoan.nhanXet}<br>
			- Thiếu:
			<ul>
			    ${reponess.chanDoan.thieu.map(item => `<li>${item}</li>`).join("")}
			</ul>
			- Sai:
			<ul>
			    ${reponess.chanDoan.sai.map(item => `<li>${item}</li>`).join("")}
			</ul>

			<b>💊 Điều trị (${reponess.dieuTri.diem} điểm)</b><br>
			- Nhận xét: ${reponess.dieuTri.nhanXet}<br>
			- Thiếu:
			<ul>
			    ${reponess.dieuTri.thieu.map(item => `<li>${item}</li>`).join("")}
			</ul>
			- Sai:
			<ul>
			    ${reponess.dieuTri.sai.map(item => `<li>${item}</li>`).join("")}
			</ul>

			<b>📋 Tổng kết</b><br>
			${reponess.tongKet}
			`;
    let AIElement = ` <div class="section-box">
						<h3 id="h3-ketLuanChanDoan">Đánh giá</h3>
            			<p id="p-Groq" >` + html + `</p>
           				<div id="final-result-Groq"></div>
        				</div>`
    gameContainer.innerHTML += AIElement;
}