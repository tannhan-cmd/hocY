//global VAR
let data=''
let benhNhanIndex = 0;
let chanDoanDaChon = [];
		function loadData(){
			let script = document.createElement("script");
			script.src= "./dat"+benhNhanIndex+".js";
			document.body.appendChild(script);
		}


        function performAction(type, actionId) {
            //const resultText = data[actionId];
       		let str='';
            if (type === 'dauHieuSinhTon') {
            	str='<br>';
            	str+="Mạch: "+data["dauHieuSinhTon"].mach +`<br>`;
            	str+="Huyết áp: "+data["dauHieuSinhTon"].huyetAp +`<br>`;
            	str+="Nhịp thở: "+data["dauHieuSinhTon"].nhipTho +`<br>`;
            	str+="Nhiệt độ: "+data["dauHieuSinhTon"].nhietDo +`<br>`;
            	str+="SpO2: "+data["dauHieuSinhTon"].spo2;
                document.getElementById('kham-result').innerHTML = `<strong>Kết quả:</strong> ${str}`;
            } else if (type === 'cls') {
            	str='<br>';
            	index = data["canLamSang"].findIndex(item => item['id'] === actionId);
            	if(typeof data["canLamSang"][index]["ketQua"] == "object" || typeof data["canLamSang"][index]["ketLuan"] == "object"  ){
					Object.entries(data["canLamSang"][index]["ketQua"]).forEach(([key, value]) => {
					    str+= key + ": " +value+"<br>"
					});
            	}else if(typeof data["canLamSang"][index]["ketQua"] == "string" || typeof data["canLamSang"][index]["ketLuan"] == "string" ){
            		str +=  data["canLamSang"][index]["label"] +": "+(data["canLamSang"][index]["ketLuan"] ||data["canLamSang"][index]["ketQua"]);
          
            	}
                document.getElementById('cls-result').innerHTML = `<strong>Kết quả:</strong> ${str}`;
            } else if(type=== 'kham'){
            	str='<br>';
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
       
        function renderBenhNhan(){
        	let pHanhChinh = document.querySelector('#p-hanhChinh');        	
        	let pLyDoNhapVien = document.querySelector('#p-lyDoNhapVien');
			let pTienSu = document.querySelector('#p-tienSu');
   	     	let pBenhSu = document.querySelector('#p-benhSu');
   	     	pHanhChinh.innerHTML=`<strong>Họ tên:</strong> `+data.thongTinHanhChinh.hoTen+` | <strong>Tuổi:</strong> `+data.thongTinHanhChinh.tuoi+` | <strong>Giới tính:</strong>`+data.thongTinHanhChinh.gioiTinh;
   	     	pLyDoNhapVien.innerHTML=`<strong>Lý do vào viện: </strong>`+data.lyDoNhapVien;
   	     	pTienSu.innerHTML=`<strong>Tiền sử: </strong>`+data.tienSu.banThan;
   	     	pBenhSu.innerHTML=`<strong>Bệnh sử: </strong>`+data.benhSu.khoiPhat+ ` `+data.benhSu.dienTien;
   	     	pBenhSu.innerHTML+="<br><br><strong>Triệu chứng kèm theo:</strong> "
   	     	for (let i of data.benhSu.trieuChungKemTheo){
   	     		pBenhSu.innerHTML+= i +". ";
   	     	}
   	     	
        }
        function renderCLS(){
        	let divCLS = document.querySelector('#div-CLS');
        	for(let i = 0;i< data["canLamSang"].length;i++){
        		divCLS.innerHTML+=`<button onclick="performAction('cls', '`+data["canLamSang"][i].id+`')" class="cls">`+data["canLamSang"][i].label+`</button>`
    //     		let btn = document.createElement("button");
				// btn.textContent = data["canLamSang"][i].label;
				// btn.onclick= function(){
				// 	performAction('cls', data["canLamSang"][i].id)
				// }
				// btn.className = "cls";
				// divCLS.appendChild(btn);
        	}
        }
        function searchInputCLS(){
        document.getElementById('input-SearchCLS').addEventListener('input', function () {
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
	            block: 'nearest'    // Cuộn tới vị trí gần nhất đủ để nhìn thấy (tối ưu nhất cho ô overflow)
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
		function renderChanDoan(){
			let pChanDoan = document.querySelector("#p-ChanDoan");
			let str = "";
			for(let i of data["chanDoan"]["chanDoanXacDinh"]){
				str+=i+"<br>";
			}
			pChanDoan.style.filter= "blur(3px)";
			pChanDoan.onclick = function (){
					pChanDoan.style.filter= "blur(0px)";

					let checkChanDoan = chanDoanDaChon.filter(x => data.chanDoan.icd.includes(x));
					console.log("Chẩn đoán đúng " + checkChanDoan.length +"/"+data.chanDoan.icd.length)
					ketLuanChanDoan(checkChanDoan.length +"/"+data.chanDoan.icd.length);

			}
			pChanDoan.innerHTML=str;
		}
		function backToMainScreen(){
			 window.location.href = 'index0.html'; 
		}
		function getLocalStorage(){
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
		function inputCD(){
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
			            if(emChanDoan.textContent=="Chẩn đoán..."){
			            	emChanDoan.textContent="";
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

    let dieuTriDaChon = [];

    input.addEventListener("input", () => {

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

                input.value = "";
                suggestions.innerHTML = "";

                if (emDieuTri.textContent === "Điều trị...") {
                    emDieuTri.textContent = "";
                }

                emDieuTri.textContent += thuoc + "\n";
            });

            suggestions.appendChild(div);
        });
    });
}
		function ketLuanChanDoan(text){
			let h3 = document.querySelector("#h3-ketLuanChanDoan");
			h3.innerHTML =  "Kết Luận Chẩn Đoán "+`<span style="color:green">`+text+`</span>`;
		}
		function startApp(){
			getLocalStorage();
	        renderBenhNhan();
	        renderCLS();
	        searchInputCLS();
	        renderChanDoan();
	        inputCD();
        	inputDT();
		}
