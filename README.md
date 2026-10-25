# CODE REPOSITORY

개발자가 코드 문서를 작성하고 서로 읽는 SNS 스타일의 정적 웹사이트입니다. 첨부된 화면처럼 얇은 테두리의 둥근 문서 카드, 왼쪽 코드 심볼 뒤로 번지는 블러, 검색 가능한 문서 피드와 넓은 코드 읽기 화면을 구성했습니다.

## 기능

- 문서 피드, 검색, 주제별 필터, 인기순·저장한 문서 보기
- 제목·소개·주제와 Markdown 본문을 작성하는 편집기, 실시간 미리보기
- ` ```python ` 같은 fenced code block, 코드 복사 버튼
- 문서 상세 화면, 좋아요, 저장, 댓글
- Google Identity Services 로그인 UI
- 작은 화면 대응 레이아웃
- GitHub Actions를 이용한 GitHub Pages 배포 (`.github/workflows/pages.yml`)

## 로컬 미리보기

폴더에서 정적 서버를 실행한 뒤 브라우저에서 `http://localhost:8000`을 엽니다.

```powershell
python -m http.server 8000
```

또는 Node.js가 있다면:

```powershell
npx serve .
```

## Google 로그인 연결

1. Google Cloud Console에서 프로젝트를 만들고 OAuth 동의 화면을 설정합니다.
2. OAuth 클라이언트 ID에서 애플리케이션 유형을 **웹 애플리케이션**으로 선택합니다.
3. 승인된 JavaScript 출처에 로컬 주소와 배포 주소를 추가합니다. 예: `http://localhost:8000`, `https://사용자명.github.io`.
4. OAuth 웹 Client ID를 `site-config.js`의 `googleClientId`에 입력하고 GitHub에 커밋합니다. 또는 사이트 로그인 창의 **Google 로그인 설정**에서 현재 브라우저에만 입력할 수 있습니다.
5. 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다. `main`에 push하면 workflow가 사이트를 배포합니다.

Client ID는 공개 식별자이며 정적 사이트에 둘 수 있습니다. Client Secret은 브라우저 코드에 넣지 마세요. Google 로그인 버튼은 Google Identity Services가 제공합니다.

## 정적 사이트의 저장 한계

현재 버전은 별도 서버나 데이터베이스 없이 GitHub Pages에서 실행됩니다. 게시글·좋아요·저장·댓글은 브라우저 `localStorage`에 저장되므로 다른 사람의 브라우저와 공유되지 않습니다. OAuth 로그인 정보도 이 브라우저에서만 프로필 표시용으로 사용합니다. 여러 사용자의 게시물을 함께 저장하고, 진짜 계정 인증/권한을 적용하려면 API와 데이터베이스를 별도로 연결해야 합니다. 특히 운영 서비스의 인증은 서버에서 Google ID token을 검증해야 합니다.

GitHub Pages 배포 설정은 준비되어 있지만 Google Client ID와 GitHub 저장소 소유자 설정은 배포 환경에서 직접 등록해야 합니다.
