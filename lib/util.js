
//센터 아이피인지 검사
function isCenterIp(ip){
    if(ip == null) return false;
    if(ip.equals("112.217.219.2")) return true;
    if(ip.equals("112.217.219.3")) return true;
    //2022-03-16 dbkang 7층 고객센터 대표IP 추가
    if(ip.equals("1.11.62.150")) return true;
    
    if(ip.matches("^192.168.10.1[0-9]{2}$")) return true;    
    return false;
}

// pm 생성하기 24자리: Java to JS by chatGPT
function getPassPM(martCode, empCode) {
    const cal = new Date();
    
    const iHint = cal.getSeconds() + 13;
    const iMart = martCode * iHint;
    const iMin = cal.getMinutes();
    const iEmp = empCode * iHint;
    const iHour = cal.getHours() * iHint;
    
    let pm = String(cal.getSeconds()).padStart(2, '0');
    pm += String(iMart).padStart(8, '0');
    pm += String(iMin).padStart(2, '0');
    pm += String(iEmp).padStart(8, '0');
    pm += String(iHour).padStart(4, '0');
    
    return pm;
}

// 24자리 pm 검증: Java to JS by gpt -> 휴먼로깅 및 디버깅
function isPMCode(str, martCode, empCode) {

  let iHint = 0;
  let iMart = 0;
  let iMin = 0;
  let iEmp = 0;
  let iHour = 0;
      
  try {
      if (str.length !== 24) {
      throw new Error("파라미터 길이가 맞지 않습니다.");
      }

      const martSeqno = martCode.length === 0 ? 0 : parseInt(martCode);
      const empSeqno = empCode.length === 0 ? 0 : parseInt(empCode);

      iHint = parseInt(str.substring(0, 2)) + 13;
      iMart = parseInt(str.substring(2, 10)) / iHint;
      iMin = parseInt(str.substring(10, 12));
      iEmp = parseInt(str.substring(12, 20)) / iHint;
      iHour = parseInt(str.substring(20)) / iHint;
      iHint -= 13;

      if (iMart !== martSeqno || iEmp !== empSeqno) {
      throw new Error("점포코드 또는 직원코드가 맞지 않습니다.");
      }


      if (iHint >= 0 && iHint <= 60 && iMin >= 0 && iMin <= 60 && iHour >= 0 && iHour <= 24) {
      const cal = new Date();
      const now = cal.getTime();
      const cal2 = new Date(cal.getFullYear(), cal.getMonth(), cal.getDate(), iHour, iMin, iHint);
      //cal.setDate(cal.getFullYear(), cal.getMonth(), cal.getDate(), iHour, iMin, iHint);
      const t = cal2.getTime();  
      const lTimespan = Math.floor((now - t) / (1000 * 60));
      
      //console.log("~~1> ",cal, lTimespan);
      
      if (lTimespan > -30 && lTimespan < 30) {
          return true;
      } else {          
          throw new Error("유효시간을 초과했습니다.");
      }
      } else {        
      throw new Error("시간 정보가 맞지 않습니다.");
      }
  } catch (e) {
      console.log(`[${Date.now()}] pm verification fail : ${str}, ${martCode}, ${empCode}`);
      console.error(e);
      return false;
  }
}

// 24자리 pm 검증: Java to JS by chatGPT (오류수정 피드백)
function isPM(str, strMartSeqno, strEmpSeqno) {
  try {
    if (str.length !== 24) {
      throw new Error("파라미터 길이가 맞지 않습니다.");
    }

    const martSeqno = strMartSeqno.length === 0 ? 0 : parseInt(strMartSeqno);
    const empSeqno = strEmpSeqno.length === 0 ? 0 : parseInt(strEmpSeqno);

    let iHint = parseInt(str.substring(0, 2)) + 13;
    const iMart = parseInt(str.substring(2, 10)) / iHint;
    const iMin = parseInt(str.substring(10, 12));
    const iEmp = parseInt(str.substring(12, 20)) / iHint;
    const iHour = parseInt(str.substring(20)) / iHint;
    iHint -= 13;

    if (iMart !== martSeqno || iEmp !== empSeqno) {
      throw new Error("점포코드 또는 직원코드가 맞지 않습니다.");
    }

    if (iHint >= 0 && iHint <= 60 && iMin >= 0 && iMin <= 60 && iHour >= 0 && iHour <= 24) {
      const now = new Date();
      const t = new Date(now.getFullYear(), now.getMonth(), now.getDate(), iHour, iMin, iHint);

      const lTimespan = Math.floor((now - t) / (1000 * 60));
      if (lTimespan > -30 && lTimespan < 30) {
        return true;
      } else {
        throw new Error("유효시간을 초과했습니다.");
      }
    } else {
      throw new Error("시간 정보가 맞지 않습니다.");
    }
  } catch (e) {
    console.log(`[${Date.now()}] pm verification fail : ${str}, ${strMartSeqno}, ${strEmpSeqno}`);
    console.error(e);
    return false;
  }
}
  
// pm키 생성하기 40자리 (문자발송시 사용함)
function getPassPM40(martSeqno, empSeqno) {
  const cal = new Date();

  const iHint = cal.getSeconds() + 13;
  const iMart = martSeqno * iHint;
  const iMin = cal.getMinutes() * iHint;
  const iEmp = empSeqno * iHint;
  const iHour = cal.getHours() * iHint;
  const iYear = cal.getFullYear() * iHint;
  const iMonth = (cal.getMonth() + 1) * iHint;
  const iDay = cal.getDate() * iHint;

  let pm = String(cal.getSeconds()).padStart(2, '0');
  pm += String(iMart).padStart(8, '0');
  pm += String(iMin).padStart(4, '0');
  pm += String(iEmp).padStart(8, '0');
  pm += String(iHour).padStart(4, '0');
  pm += String(iYear).padStart(6, '0');
  pm += String(iMonth).padStart(4, '0');
  pm += String(iDay).padStart(4, '0');

  return pm;
}

// 타임아웃,딜레이 타임 ms(3000 = 3초)
const delay = (time) => new Promise((resolve) => setTimeout(()=>resolve(),time));

export {
  isCenterIp,
  getPassPM,
  isPMCode,
  isPM,
  getPassPM40,
  delay
}