# CODO Mock API Server

React 앱에서 API 연결을 테스트하기 위한 목업 서버입니다.

## 🚀 빠른 시작

### 1. 서버 실행
```bash
# Windows
run_server.bat

# 또는 직접 실행
python mock_server.py
```

### 2. 서버 접속
- **서버 주소**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs
- **테스트**: http://localhost:8000

## 📝 테스트 케이스

### 기본 테스트
- **"단축키 안내"** → GUIDE 모드, 단축키 정보 표시
- **"자동 실행"** → EXECUTION 모드, 파라미터 입력 요청
- **"파일 복사"** → GUIDE 모드, 복사 방법 안내
- **"파일 삭제"** → EXECUTION 모드, 확인 요청

### 고급 테스트
- **"파일 실행"** → EXECUTION 모드, 실행 계획 생성
- **"도움말"** → 기본 응답

## 🔧 API 엔드포인트

### POST /api/v1/userInput
사용자 입력을 받아 AI 응답을 반환합니다.

**요청 예시:**
```json
{
  "text": "단축키 안내",
  "method": "GUIDE",
  "parameters": {},
  "interaction_id": null
}
```

**응답 예시:**
```json
{
  "intent": "단축키 안내",
  "method": "GUIDE",
  "status": "guide_completed",
  "message": "자주 사용하는 단축키들을 알려드릴게요!",
  "shortcut": "Ctrl+C, Ctrl+V, F12",
  "parameter_schema": {
    "required": [],
    "optional": []
  }
}
```

### GET /api/v1/frequent-functions
자주 사용하는 기능 목록을 반환합니다.

### GET /api/v1/recent-functions
최근 사용한 기능 목록을 반환합니다.

## 🎯 상태 코드

- **guide_completed**: 가이드 완료, 파라미터 스키마 표시
- **info_required**: 추가 정보 필요, 누락 파라미터 입력 폼 표시
- **confirm_required**: 실행 확인 필요, 확인 모달 표시
- **ready_to_execute**: 실행 준비 완료, 실행 계획 표시
- **executed**: 실행 완료
- **cancelled**: 사용자 취소
- **execution_failed**: 실행 실패
- **unknown_method**: 지원되지 않는 메서드

## 🛠️ 개발 환경

- **Python**: 3.7+
- **FastAPI**: 0.104.1
- **Uvicorn**: 0.24.0
- **Pydantic**: 2.5.0

## 📁 파일 구조

```
├── mock_server.py          # 메인 서버 파일
├── requirements.txt        # Python 패키지 목록
├── run_server.bat         # Windows 실행 배치 파일
└── README_MOCK_SERVER.md  # 이 파일
```

## 🔄 React 앱과 연동

1. React 앱에서 `http://localhost:8000`으로 API 호출
2. 목업 서버가 실제 API 응답과 동일한 형태로 응답
3. UI 상태 변화 테스트 가능

## 🧪 테스트 시나리오

### 시나리오 1: 가이드 모드
1. "단축키 안내" 입력
2. GUIDE 카드 표시 확인
3. 단축키 정보 확인

### 시나리오 2: 실행 모드
1. "자동 실행" 입력
2. 누락 파라미터 폼 표시 확인
3. 파라미터 입력 후 제출
4. 실행 계획 생성 확인

### 시나리오 3: 확인 모드
1. "파일 삭제" 입력
2. 확인 모달 표시 확인
3. 확인/취소 버튼 동작 테스트

## 🚨 주의사항

- 이 서버는 개발/테스트 목적으로만 사용하세요
- 실제 프로덕션 환경에서는 사용하지 마세요
- CORS가 모든 origin을 허용하도록 설정되어 있습니다



