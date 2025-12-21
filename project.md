# 프로젝트 구조 문서 (Project Structure Documentation)

## 1. 프로젝트 개요 (Overview)
DeepStation Helper는 딥스테이션 부이 예약 시스템의 일정을 확인하고 예약을 돕기 위한 웹 애플리케이션입니다.

## 2. 기술 스택 (Tech Stack)
- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS
- **State/Routing**: React Router v6
- **HTTP Client**: Axios
- **Date Utility**: date-fns
- **Package Manager**: Yarn

## 3. 디렉토리 구조 (Directory Structure)

```
/
├── .github/                # GitHub Actions 및 설정
├── src/                    # 소스 코드
│   ├── components/         # UI 컴포넌트
│   │   ├── DateNavigator.jsx # 날짜 선택 및 이동, Date Picker
│   │   ├── Navbar.jsx        # 상단 내비게이션 바 (로그아웃 포함)
│   │   └── ReservationTable.jsx # 날짜별 예약 현황 테이블 렌더링
│   ├── config/             # 설정 파일
│   │   └── api.js         # API endpoint 및 기본 설정
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── HomePage.jsx   # 메인 페이지 (일정 조회 및 상태 관리)
│   │   └── LoginPage.jsx  # 로그인 페이지
│   ├── utils/              # 유틸리티 함수
│   │   ├── auth.js        # 인증 관련 로직 (세션 관리 등)
│   │   └── date.js        # 날짜 처리 관련 로직 (date-fns 래퍼)
│   ├── App.jsx             # 메인 앱 컴포넌트 & 라우팅 설정
│   ├── main.jsx            # 앱 엔트리 포인트
│   └── index.css           # 전역 스타일 (Tailwind directives 포함)
├── index.html              # Vite 앱 진입 HTML
├── package.json            # 의존성 및 스크립트
├── vite.config.js          # Vite 설정
├── tailwind.config.js      # Tailwind CSS 설정
└── postcss.config.js       # PostCSS 설정
```

## 4. 주요 파일 및 역할 (Key Files & Roles)

### Components (`src/components/`)
- **Navbar.jsx**: 애플리케이션 상단 헤더, 로고 및 로그아웃 버튼을 포함합니다.
- **DateNavigator.jsx**: 이전/다음 날짜 이동 버튼과 날짜 선택(Date Picker) 기능을 제공합니다.
- **ReservationTable.jsx**: 전달받은 일정 데이터를 기반으로 타임테이블 및 예약 가능 여부를 시각적으로 렌더링합니다.

### Pages (`src/pages/`)
- **LoginPage.jsx**: 사용자 인증 처리. DeepStation 계정으로 로그인하고 세션 토큰을 저장합니다.
- **HomePage.jsx**: 로그인 후 접근 가능한 메인 대시보드. 날짜 상태를 관리하고 API를 호출하여 데이터를 하위 컴포넌트에 전달합니다.

### Utils (`src/utils/`)
- **auth.js**: JWT 토큰 저장/삭제, 로그인 상태 확인, 세션 만료 체크 등 인증 관련 헬퍼 함수.
- **date.js**: `date-fns` 라이브러리를 사용하여 날짜 포맷팅, 날짜 연산(이전/다음 날), 날짜 비교 등의 기능을 제공하는 유틸리티 모듈.

### Configuration (`src/config/`)
- **api.js**: API Base URL 및 Endpoints (`LOGIN`, `DAY_INFO`) 정의. 이메일 유효성 검사 함수 포함.

### Configuration Files (Root)
- **vite.config.js**: React 플러그인 및 빌드 설정.
- **tailwind.config.js**: Tailwind CSS 경로 및 테마 설정.

## 5. API 정보
- **Base URL**: `https://u9q3vta531.execute-api.ap-northeast-2.amazonaws.com/default`
- **Login**: `/deepstation-login`
- **Day Info**: `/dayinfo`
