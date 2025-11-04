const icon = document.getElementById("calculatorIcon");  // 아이콘 클릭을 위해 델꾸옴
const calculator = document.getElementById("container"); // 클릭시 계산기 열어야하니까
const history = document.getElementById("history");      // 히스토리에 나타낼라고
const current = document.getElementById("current");      // 디스플레이 메인 숫자 나타낼라고
const button = document.querySelectorAll(".button");     // 버튼 클릭 이벤트를 위해
const cover = document.querySelector(".zzzzz");          // 잠금화면 해제를 위한 이벤트

let displayHistory = "";
let displayCurrent = "";
let lastOperator = "";
let lastValue = "";


//잠금 화면 해제
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    cover.classList.add("hide");
  }
});
//아이콘 -> 계산기
icon.addEventListener("click", () => {
  calculator.classList.remove("hidden");
  calculator.classList.add("show");
});


// 버튼 클릭해서 디스플레이에 출력
button.forEach(btn => {
  btn.addEventListener("click", () => {
    const v = btn.textContent.trim();
    console.log(v);

  // 자릿수 표시 함수
  function formatNumber(num) {
    return Number(num).toLocaleString("ko-KR");
  } //숫자나 날짜 같은 값을 “지역(언어/나라) 형식에 맞게 문자열로 바꿔주는 메서드( 계산기, 가격표, 쇼핑몰 가격표에서 거의 필수)


  // 소수점 10자리 반올림 함수
  function roundNumber(num) {
    return Math.round(num * 10000000000) / 10000000000;
  } 

    switch (v) {
      case "C":
        displayHistory = "";
        displayCurrent = "";
        history.textContent = "";
        current.textContent = "0";
        break;
      
      case "+":
      case "-":
      case "x":
      case "÷":
          // 현재 입력중인 숫자가 없고 이전 히스토리에는 값이 들어있다면
        if (displayCurrent === "" && displayHistory !== "") {
          //연속 클릭시 마지막 연산자만 뜨게 마지막연산자를 지우고 지금 클릭한 새 연산자로 바꿈
          displayHistory = displayHistory.slice(0, -1) + v;
          // 화면 history 영역에 방금 수정된 식을 출력.
          history.textContent = displayHistory;
          break;
        }
        displayHistory += displayCurrent + v;
        history.textContent = displayHistory;
        displayCurrent = "";
        current.textContent = "";
        break;

      case "=":
        const total = displayHistory + displayCurrent;
        if (displayHistory !== "" && displayCurrent !== "") {
          let result = eval(total.replace(/x/g, "*").replace(/÷/g, "/").replace(/%/g, "/100"));
          result = roundNumber(result);
        if (!isFinite(result)) { // 0으로 나누기 / Infinity / -Infinity / NaN 체크
          current.textContent = "ERROR";
          return;
        }
          history.textContent = total;
          current.textContent = formatNumber(result);
          
          // 반복 계산을 위해 마지막 연산자 + 마지막 숫자 저장
          const match = total.match(/([+\-x÷])([^+\-x÷]+)$/);
          if (match) {
            lastOperator = match[1];   // 마지막 연산자
            lastValue = match[2];      // 마지막 숫자
          }
          displayHistory = "";
          displayCurrent = String(result);
        }
        // 두번째 이후 = 반복 계산
        else if (lastOperator && lastValue) {
          let repeatExp = displayCurrent + lastOperator + lastValue;
          let repeatResult = eval(repeatExp.replace(/x/g, "*").replace(/÷/g, "/").replace(/%/g, "/100"));
          repeatResult = roundNumber(repeatResult);
          if (!isFinite(result)) { // 0으로 나누기 / Infinity / -Infinity / NaN 체크
            current.textContent = "ERROR";
            return;
          }

          current.textContent = repeatResult;
          history.textContent = repeatExp;
          displayCurrent = String(repeatResult);
        }
        break;

      case ".":
        if(displayCurrent.includes(".")) return;
        displayCurrent += ".";
        current.textContent = displayCurrent;
        break;

      case "±":
        if (displayCurrent !== "") {
          displayCurrent = String(displayCurrent * -1);
          current.textContent = formatNumber(displayCurrent);
        }
        break;
    
      case "%":
        if (displayCurrent !== "") {
          displayCurrent = String(Number(displayCurrent) / 100);
          current.textContent = formatNumber(displayCurrent);
        }
        break;

      case "←":
        if (displayCurrent !== "") {
          displayCurrent = displayCurrent.slice(0, -1);
          current.textContent = formatNumber(displayCurrent) || "0";
        }
        break;

      default:
        if (displayCurrent.length >= 12) return;
        displayCurrent += v;
        current.textContent = formatNumber(displayCurrent);
        break;

    }
  })
})

