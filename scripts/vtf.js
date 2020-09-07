let selectedSessionInfo = [];
var selecteSessionId;
var checkId;
var uid;
var streamingIp;
var streamingPort = 70;
var streamingUrl;
var requestServerInfoURL = 'http://192.168.10.119:8080/';
var listSession = [];
// var requestURL = 'http://192.168.10.119:8080/servers';
var requestURL = 'http://192.168.10.119:8080';

/**
 *  세션 목록을 테이블로 전시
 *  sessionTable : 칼럼이 생성 될 테이블 객체
 */
function getData() {

    axios.get(requestURL + "/sessions").then(res => {

        console.log(res);
        if (res.data.length === 0) {
            console.log("데이터 베이스에 조회되는 데이터가 없습니다");
            document.getElementById('displayState').innerHTML = "열려 있는 세션이 없습니다";
            document.getElementById('displayState').style.display = "inline";
            document.getElementById('btn-stream').style.display = "none";
        }
        else {
            for (var i = 0; i < res.data.length; i++) {
                listSession.push(res.data[i]);
                console.log(res.data[i]);
            }
            var sessionTable = document.getElementById('session-table');
            var cell = document.getElementById('session-name');
            var cell1 = document.getElementById('session-ip');
            var cell2 = document.getElementById('session-info');

            for (var item of listSession) {
                var header = sessionTable.createTHead();
                var row = sessionTable.insertRow();
                // // 그 컬럼으로 데이터 값을 읽어온다
                for (var value in item) {

                    if (value === "title") {
                        var cell = row.insertCell();
                        cell.innerHTML = item[value];
                        cell.parentElement.className = "sessionValue";
                        cell.className = "title";
                    }
                    else if (value === "description") {

                        var cell1 = row.insertCell();
                        cell1.innerHTML = item[value];
                        cell1.className = "description";
                    }
                    else if (value === "streamingUrl") {
                        var cell2 = row.insertCell();
                        if (item[value] === null) {
                            cell2.innerHTML = "스트리밍 접속 불가";
                        }
                        else {
                            cell2.innerHTML = "스트리밍 접속 가능";
                        }
                    }
                    else if (value === "id") {
                        cell.parentElement.id = item[value];
                    }
                }
            }

            var table = document.getElementById('session-table'),
                cells = table.getElementsByTagName('tr');

            for (var i = 0, len = cells.length; i < len; i++) {
                cells[i].onclick = function () {
                    var selectedCell = [];
                    console.log("세션의 id :" + this.id);
                    selecteSessionId = this.id;

                    for (var j = 1; j < cells.length; j++) {
                        if (cells[j] === this) {
                            this.style.backgroundColor = "black";
                            this.style.color = "white";
                        }
                        else {
                            cells[j].style.backgroundColor = "white";
                            cells[j].style.color = "black";
                        }
                    }
                    selectedCell.push(this.getElementsByTagName("td"));
                    selectedSessionInfo = selectedCell;
                }
            }
        }
    });
}

/**
 * 선택한 페이지로 스트리밍 접속을 요청
 * selectedSessionInfo[0][0] : 선택된 세의 세션 이름
 * selectedSessionInfo[0][1] : 선택된 세의 세션 정보
 * selectedSessionInfo[0][2] : 선택된 세의 세션 IP
 * selectedSessionId : 선택된 세의 세션 Id
 * url : WebServer 주소
 * connectedUrl : 접속할 훈련 url 의 주소
 */
function streammingConnection() {
    console.log("==============streammingConnection==========");

    if (selectedSessionInfo.length === 0) {

        console.log("==============스트리밍에 참여할수 있는 선택된 세션 정보가 없습니다==========");
        alert("스트리밍에 참여 할 수 있는 선택된 세션 정보가 없습니다.");

    }
    else {
        var connectedUrl = encodeURI("http://");
        var selectedUid;

        axios.get(requestURL+ "/sessions/" + selecteSessionId).then(response => {

            // 나중에 streamingUrl로 이동
          selectedUid = response.data.uid;
          console.log(response.data);
          console.log(response.data.uid);

        // // 서버로 열기 열기
        axios.post("http://192.168.10.119:8080/streaming", {

            uid: selectedUid
        
        }).then(function (response) {
            console.log("web streaming 실행 : " + JSON.stringify(response.data));

            console.log("streamingUrl : " + response.data.streamingUrl);
            //window.location = connectedUrl;
        
        }).catch(function (error) {
        
            console.log(error);
        });

        }).catch(function (error) {
            console.log();

        });

    }
}

/**
 * 입력한 정보로 세션 생성
 * requestServerInfoURL : 요청 할 web 주소
 * sessionNameValue : 세션DB에 저장 될 세션 이름
 * sessionDescriptionValue : 세션DB에 저장 될 세션 설명
 * selectedTrainingSession : 데티케이티드 서버 Ip
 */
function createSession() {
    //server request url
    var sessionNameValue = document.getElementById('sessionName-input');
    var sessionDescriptionValue = document.getElementById('sessionDescription-input');

    var temUid = Math.floor(Math.random() * (0 - 3000)) + 3000;
    if (sessionNameValue.value === "") {
        console.log("sessionNameValue is null");
        noticeAlret( "세션 이름을 입력해 주세요", "warning", 1500);
    }
    else if (sessionDescriptionValue.value === "") {
        console.log("sessionDescriptionValue is null");
        noticeAlret( "세션 정보를 입력해 주세요", "warning", 1500);
    }
    else {
        console.log("세션 이름 : " + sessionNameValue.value + "세션 정보 : " + sessionDescriptionValue.value);
        // console.log("데디케이티드 서버")
        axios.post(requestURL + "/sessions", {

            title: sessionNameValue.value,
            description: sessionDescriptionValue.value,
            uid : sessionNameValue.value + temUid,
            ipAddress : "192.168.10.88"

        }).then(function (response) {
            
            console.log(response);
            checkId = response.data.id;
            console.log("현재 등록된 ip :" + checkId);
            noticeAlret( "세션이 생성 되었습니다", "success", 1800);
            sessionNameValue.value = null;
            sessionDescriptionValue.value = null;

        }).catch(function (error) {
            console.log();
        });
    }
}

/**
 * 선택 할 세션을 삭제
 * selectedSessionInfo : 현재 선택된 세션의 id 정보
 * deleteRequestUrl : 데이터 삭제 요청 할 webServer 주소
 * selectedSessionInfo : 삭제를 요청할 데이터 
 */
function sessionDelete() {
    console.log("===== delete =====");
    if (selectedSessionInfo.length === 0) {

        console.log("============== 삭제 할 수 있는 세션이 없습니다 ==========");
        noticeAlret( "삭제 할 세션을 선택해 주세요", "warning", 1500);
    }
    else {

        console.log("삭제 : " + selecteSessionId);
        axios.delete( requestURL + "/sessions/" + selecteSessionId, {

        }).then(function (response) {
            
            console.log("삭제된 세션 데이터 정보 : " + response);
            location.reload();

        }).then(function (error) {
            
            console.log();

        });
    }
}

/**
 *  Notice Alret 스타일 적용
 *  noticeMessage (string) :  노티스때 표시할 메세지
 *  iconType (string) : 어떤 아이콘을 전시 할지
 *  iconType 종류 : "warning" , "info" , "success" , "error"
 *  timer (integer) : 몇초간 전시해 자동으로 사라지게 할지
 */
function noticeAlret( noticeMessage, iconType, timer){
    swal( noticeMessage , {
        icon: iconType,
        buttons: false,
        timer: timer,
    });
}

//test
function postStreamingUrl(newStreamingIp, newUid, newStreamingUrl) {

    axios.post("http://192.168.10.119:8080/start/streaming", {

        streamingIp: newStreamingIp,
        uid: newUid,
        streamingUrl: newStreamingUrl

    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log();
    });
}

//test
function getuidInfo() {
    console.log(checkId);

    axios.get(requestServerInfoURL + "/servers/" + checkId, {
    }).then(function (response) {
        console.log(response);
        uid = response.data.uid;
        streamingIp = response.data.computer.streamingIp;
        console.log("uid : " + uid + " streamingIp : " + streamingIp);

    }).then(function (error) {
        console.error();
    });
}