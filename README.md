# DeepStation Helper

딥스 부이 예약에 어려움을 겪으시는 강사님들을 위해 개발된 웹 애플리케이션입니다.

## 📋 프로젝트 개요

DeepStation Helper는 딥스테이션 부이 예약 시스템의 일주일 일정을 한눈에 확인할 수 있도록 도와주는 도구입니다. 강사님들의 부이 예약 업무를 효율적으로 지원하여 더 안전하고 즐거운 다이빙 경험을 제공하는 것이 목표입니다.

## 🚀 주요 기능

- **로그인 시스템**: DeepStation 계정으로 안전한 로그인
- **일주일 일정 조회**: 내일부터 7일간의 부이 예약 현황을 한 번에 확인
- **부이 현황 표시**: 각 부이별 전반/후반 시간대별 예약 가능 여부 표시
- **반응형 디자인**: 모바일과 데스크톱에서 모두 최적화된 사용자 경험
- **세션 관리**: 자동 로그아웃 및 보안 세션 관리

## 🛠 기술 스택

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6 (HashRouter)
- **HTTP Client**: Axios
- **Package Manager**: Yarn
- **Deployment**: GitHub Pages

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.jsx    # 메인 페이지 (일주일 일정 조회)
│   └── LoginPage.jsx   # 로그인 페이지
├── utils/              # 유틸리티 함수
│   └── auth.js         # 인증 관련 함수
├── App.jsx             # 메인 앱 컴포넌트
├── main.jsx            # 앱 진입점
└── index.css           # 전역 스타일
```

## 🚀 시작하기

### 사전 요구사항

- Node.js (v16 이상)
- Yarn

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/[username]/deepstation-helper.git
   cd deepstation-helper
   ```

2. **의존성 설치**
   ```bash
   yarn install
   ```

3. **개발 서버 실행**
   ```bash
   yarn dev
   ```
   브라우저에서 `http://localhost:3000`으로 접속

4. **빌드**
   ```bash
   yarn build
   ```

5. **미리보기**
   ```bash
   yarn preview
   ```

## 🔧 API 엔드포인트

- **로그인**: `https://u9q3vta531.execute-api.ap-northeast-2.amazonaws.com/default/deepstation-login`
- **일정 조회**: `https://u9q3vta531.execute-api.ap-northeast-2.amazonaws.com/default/dayinfo`

## 🔐 보안 및 인증

- 로그인 정보는 서버에 저장되지 않으며, 세션 토큰만 로컬에 저장됩니다
- 세션은 1시간 후 자동 만료됩니다
- 모든 API 통신은 HTTPS를 통해 암호화됩니다

## 📱 반응형 디자인

- **모바일 우선**: 기본 스타일은 모바일 환경에 최적화
- **태블릿/데스크톱**: `sm:`, `md:`, `lg:` 브레이크포인트 활용
- **사용자 경험**: 모든 화면 크기에서 최적화된 사용자 경험 제공

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat(scope): add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 규칙

- `feat(scope): 새로운 기능 추가`
- `fix(scope): 버그 수정`
- `docs(scope): 문서 수정`
- `style(scope): 코드 스타일 변경`
- `refactor(scope): 코드 리팩토링`
- `test(scope): 테스트 추가`
- `chore(scope): 빌드 과정 또는 보조 도구 변경`

## ⚠️ 사용 주의사항

이 도구는 딥스 부이 예약에 어려움을 겪으시는 강사님들을 위해 개발되었습니다. 

- **악용 금지**: 이 도구를 악용하여 다른 사용자들에게 피해를 주는 행위는 금지됩니다
- **선한 목적**: 안전하고 즐거운 다이빙 경험을 위한 목적으로만 사용해주세요
- **책임감 있는 사용**: 모든 사용자는 자신의 행동에 대한 책임을 집니다

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트가 있으시면:
- GitHub 이슈를 생성해주세요
- 또는 인스타그램 DM으로 연락해주세요: [@yeoriyeori](https://instagram.com/yeoriyeori)

---

**항상 안전하고 행복한 다이빙 되세요! 🤿**
