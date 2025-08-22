# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-08-22

### Added

- `geeklog init` 명령어 구현
  - 기본 프로젝트 구조 자동 생성:
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
  - `config.yml` 기본 설정 포함
- CLI 엔트리포인트 (`src/index.ts`) 및 초기화 로직 (`src/init.ts`) 추가
- `commander` 기반 CLI 프레임워크 도입
- 프로젝트 모노레포 구조 제안 (`packages/cli`, `packages/web`)

### Fixed

- `pnpm link --global` 실행 시 `ERR_PNPM_NO_GLOBAL_BIN_DIR` 문제 해결
  - `pnpm setup`으로 전역 bin 디렉토리 설정
- `ERR_MODULE_NOT_FOUND` 문제 해결
  - ESM 환경에서 import 경로에 `.js` 확장자 추가 (`./init.js`)

---

## [Unreleased]

### Planned

- `geeklog new <type> <title>` 명령어
  - 새 글 템플릿 자동 생성 (예: blog, portfolio, resume)
- `geeklog dev` → Vite 기반 Markdown 미리보기 서버
- `geeklog publish` → 정적 사이트 빌드 & GitHub Pages 배포
