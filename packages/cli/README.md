# GeekLog CLI

GeekLog CLI는 Markdown 기반 블로그/포트폴리오 관리 도구입니다.

## 설치

```bash
npm install -g geeklog
```

## 사용법

### 프로젝트 초기화

```bash
geeklog init
```

이 명령어는 다음과 같은 폴더 구조를 생성합니다:

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

## 개발

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 빌드
npm run build
```

## 라이센스

MIT
