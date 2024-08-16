// 검색바와 버튼, 리스트 컨테이너 DOM 요소를 가져옵니다.
const searchBarInput = document.querySelector(".searchBar__input");
const searchBarBtn = document.querySelector(".searchBar__btn");
const listContainer = document.querySelector(".list-container");

// 초기화: 기존 리스트를 불러와 화면에 표시합니다.
reloadList();

// 검색바 버튼 클릭 시 할일을 추가합니다.
searchBarBtn.addEventListener("click", function () {
  const inputValue = searchBarInput.value;
  if (!inputValue) {
    return; // 입력값이 없을 경우, 함수 종료
  }
  addList(inputValue); // 할일 추가
  searchBarInput.value = ""; // 입력창 초기화
  reloadList(); // 리스트를 다시 로드하여 화면에 반영
  searchBarInput.focus(); // 입력창에 포커스를 다시 맞춥니다.
});

// 검색바에서 Enter 키를 눌렀을 때 버튼 클릭을 트리거합니다.
searchBarInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchBarBtn.click(); // Enter 키가 눌리면 버튼을 클릭
  }
});

// 리스트 항목의 삭제 버튼을 클릭했을 때 해당 항목을 삭제합니다.
listContainer.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("list-item__btn")) {
    const listItem = event.target.closest(".list-item");
    const listIdx = parseInt(listItem.dataset.index); // 데이터 인덱스를 가져옵니다.
    removeList(listIdx); // 해당 인덱스의 항목을 삭제
    reloadList(); // 리스트를 다시 로드하여 화면에 반영
  }
});

/**
 * 화면에 리스트를 다시 로드하여 표시합니다.
 * 기존의 리스트 내용을 지우고, 로컬스토리지에서 가져온 리스트로 갱신합니다.
 */
function reloadList() {
  listContainer.innerHTML = ""; // 기존 리스트 초기화
  const list = getList(); // 로컬스토리지에서 리스트를 가져옵니다.

  // 리스트를 순회하며 화면에 요소를 추가합니다.
  list.forEach((item, idx) => {
    listContainer.insertAdjacentElement("beforeend", createListItem(item, idx));
  });
}

/**
 * 주어진 이름과 인덱스를 기반으로 리스트 항목을 생성합니다.
 * @param {string} name - 리스트 항목의 이름
 * @param {number} idx - 리스트 항목의 인덱스
 * @returns {HTMLElement} - 생성된 리스트 항목 엘리먼트
 */
function createListItem(name, idx) {
  const div = document.createElement("div");
  div.className = "list-item";
  div.dataset.index = idx; // 인덱스를 데이터 속성으로 설정

  const span = document.createElement("span");
  span.className = "list-item__txt";
  span.textContent = `${idx + 1}. ${name}`; // 텍스트 설정

  const button = document.createElement("button");
  button.className = "list-item__btn";
  button.innerHTML = "&#10005;"; // 삭제 버튼 설정

  div.appendChild(span);
  div.appendChild(button); // span과 button을 div에 추가

  return div; // 생성된 리스트 항목을 반환
}

/**
 * 로컬스토리지에 리스트 데이터를 저장합니다.
 * @param {string | string[]} data - 저장할 리스트 데이터
 */
function saveList(data) {
  if (typeof data === "string") {
    localStorage.setItem("list", data);
  } else {
    localStorage.setItem("list", JSON.stringify(data));
  }
}

/**
 * 로컬스토리지에서 리스트 데이터를 가져옵니다.
 * @returns {string[]} - 저장된 리스트 데이터
 */
function getList() {
  const list = localStorage.getItem("list");
  return list ? JSON.parse(list) : []; // 저장된 리스트를 파싱하여 반환 (없으면 빈 배열 반환)
}

/**
 * 새로운 할일을 리스트에 추가하고 저장합니다.
 * @param {string} data - 추가할 리스트 항목
 */
function addList(data) {
  const list = getList() ?? [];
  const newList = [...list, data];
  saveList(newList); // 업데이트된 리스트를 저장
}

/**
 * 주어진 인덱스의 리스트 항목을 삭제하고 저장합니다.
 * @param {number} idx - 삭제할 항목의 인덱스
 */
function removeList(idx) {
  const list = getList();
  const newList = removeElementAtIndex(list, idx);
  saveList(newList); // 업데이트된 리스트를 저장
}

/**
 * 배열에서 특정 인덱스의 요소를 삭제하고 새로운 배열을 반환합니다.
 * @param {string[]} array - 원본 배열
 * @param {number} idx - 삭제할 인덱스
 * @returns {string[]} - 요소가 삭제된 새로운 배열
 */
function removeElementAtIndex(array, idx) {
  const filteredList = array.filter((_, i) => i !== idx);
  return filteredList;
}
