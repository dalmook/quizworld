# 두근두근 어린이 퀴즈

아이와 가족이 함께 즐길 수 있는 **GitHub Pages용 정적 퀴즈 웹앱**입니다.  
객관식/점수/채점 없이, 문제를 듣고 힌트와 정답을 순서대로 확인하는 놀이형 구성입니다.

## 파일 구조

```
/
├─ index.html
├─ css/
│  └─ style.css
├─ js/
│  └─ app.js
└─ data/
   └─ quizzes.json
```

## GitHub Pages 배포 방법

1. 이 저장소를 GitHub에 푸시합니다.
2. GitHub 저장소의 **Settings → Pages**로 이동합니다.
3. **Build and deployment**에서 Source를 `Deploy from a branch`로 선택합니다.
4. Branch를 `main`(또는 배포 브랜치), 폴더를 `/ (root)`로 선택하고 저장합니다.
5. 잠시 후 발급된 URL에서 앱을 바로 사용할 수 있습니다.

## 문제 추가 방법

1. `data/quizzes.json`을 엽니다.
2. 마지막 객체 뒤에 쉼표 규칙을 지켜 새 문제를 추가합니다.
3. `id`는 중복되지 않게 증가시킵니다.
4. `category`, `level`, `question`, `hint`, `answer`, `funFact`를 모두 입력합니다.

## quizzes.json 데이터 구조

```json
[
  {
    "id": 1,
    "category": "동물",
    "level": "쉬움",
    "question": "문제",
    "hint": "힌트",
    "answer": "정답",
    "funFact": "짧은 설명"
  }
]
```

## 음성 읽기 기능 주의사항

- Web Speech API(`speechSynthesis`)를 사용합니다.
- 브라우저/OS에 따라 한국어 음성(`ko-KR`) 품질과 종류가 달라질 수 있습니다.
- 자동 재생은 하지 않으며, 반드시 **문제 듣기** 버튼으로만 읽습니다.

## 로컬 테스트 방법

### 1) VS Code Live Server
- 프로젝트 폴더를 연 뒤 `Go Live` 실행

### 2) Python HTTP 서버
```bash
python -m http.server 8000
```
- 브라우저에서 `http://localhost:8000` 접속
