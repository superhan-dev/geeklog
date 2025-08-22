# GeekLog CLI를 npm에 배포하기까지의 여정

> 2025년 8월 23일

## 개요

Markdown 기반 블로그/포트폴리오 관리 도구인 **GeekLog CLI**를 개발하고 npm에 배포하는 과정을 정리해보았습니다. TypeScript로 CLI 도구를 만들고, ESM 환경에서 발생한 문제들을 해결하며, 최종적으로 npm 패키지로 배포하기까지의 전체 과정을 다룹니다.

## 프로젝트 소개

GeekLog CLI는 개발자들이 쉽게 블로그, 포트폴리오, 이력서 등을 관리할 수 있도록 도와주는 도구입니다.

### 주요 기능

- `geeklog init`: 기본 프로젝트 구조 자동 생성
- Markdown 기반 콘텐츠 관리
- YAML 기반 메타데이터 설정

### 생성되는 폴더 구조

```
blog/
portfolio/
resume/
career/
meta/
  ├─ tags.yml
  ├─ categories.yml
  └─ config.yml
```

## 개발 과정에서 마주한 문제들

### 1. ESM 환경에서의 Import 문제

첫 번째로 마주한 문제는 `ERR_MODULE_NOT_FOUND` 에러였습니다.

```bash
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/Users/.../dist/init'
imported from /Users/.../dist/index.js
```

**원인**: ESM 환경에서는 상대 경로 import 시 `.js` 확장자를 명시적으로 써야 합니다.

**해결**: TypeScript 소스에서도 `.js` 확장자를 포함하도록 수정

```typescript
// 수정 전
import { initProject } from "./init";

// 수정 후
import { initProject } from "./init.js";
```

### 2. package.json 설정

ESM을 제대로 사용하기 위해 `package.json`에 다음 설정이 필요했습니다:

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "bin": {
    "geeklog": "./bin/geeklog.js"
  }
}
```

## npm 배포 과정

### 1. package.json 최적화

npm 배포를 위해 `package.json`에 필수 메타데이터를 추가했습니다:

```json
{
  "name": "geeklog",
  "version": "0.1.0",
  "description": "GeekLog CLI - Markdown 기반 블로그/포트폴리오 관리 도구",
  "keywords": ["blog", "portfolio", "markdown", "cli", "static-site-generator"],
  "author": "superhan-dev",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/superhan-dev/geeklog.git"
  },
  "files": ["dist/**/*", "bin/**/*", "README.md"],
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

### 2. npm 계정 설정 및 로그인

```bash
npm login
```

브라우저를 통한 인증과 OTP 인증을 거쳐 로그인했습니다.

### 3. 패키지명 확인

```bash
npm view geeklog
```

`geeklog` 이름이 사용 가능함을 확인했습니다.

### 4. 배포 전 테스트

```bash
npm pack --dry-run
```

배포될 파일들을 미리 확인했습니다:

```
📦  geeklog@0.1.0
=== Tarball Contents ===
527B README.md
48B  bin/geeklog.js
428B dist/index.js
840B dist/init.js
847B package.json
```

### 5. 최종 배포

```bash
npm publish
```

성공적으로 배포되었습니다!

## 배포 결과

이제 전 세계 누구나 다음 명령어로 설치할 수 있습니다:

```bash
npm install -g geeklog
```

설치 후 사용법:

```bash
geeklog init
```

## 배운 점들

1. **ESM 환경의 특이점**: TypeScript에서도 `.js` 확장자를 명시해야 함
2. **npm 배포 준비**: `package.json`의 메타데이터가 중요함
3. **CLI 도구 배포**: `bin` 필드와 실행 권한 설정
4. **배포 자동화**: `prepublishOnly` 스크립트로 빌드 자동화

## 앞으로의 계획

- `geeklog new <type> <title>`: 새 글 템플릿 자동 생성
- `geeklog dev`: Vite 기반 Markdown 미리보기 서버
- `geeklog publish`: 정적 사이트 빌드 & GitHub Pages 배포

## 마무리

첫 npm 패키지 배포 경험이었는데, 생각보다 많은 설정과 고려사항들이 있었습니다. 특히 ESM 환경에서의 import 규칙이나 TypeScript 컴파일 설정 등은 실제로 해보지 않으면 알기 어려운 부분들이었습니다.

이제 GeekLog CLI의 기반이 마련되었으니, Markdown 기반 블로그 글과 나의 개발 컨텐츠를 관리할 수 있는 더 많은 기능들을 추가해서 실용적인 도구로 발전시켜나갈 예정입니다.
이후 서비스로 발전된다면 개발자 감성이 충만한 블로그 작성 플로우와 서비스를 만들어낼 수 있을 것이라 기대해봅니다.

---

**참고 링크**

- [npm 패키지](https://www.npmjs.com/package/geeklog)
- [GitHub 저장소](https://github.com/superhan-dev/geeklog)

**태그**: #npm #cli #typescript #esm #publishing #nodejs #markdown
