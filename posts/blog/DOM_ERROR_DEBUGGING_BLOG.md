# React DOM insertBefore 에러와 에러 바운더리 구현기

## 🚨 문제 상황

React 애플리케이션에서 다음과 같은 DOM 조작 에러가 지속적으로 발생했습니다:

```
NotFoundError: Failed to execute 'insertBefore' on 'Node':
The node before which the new node is to be inserted is not a child of this node.
```

이 에러는 `UnselectedOptionIcon` 컴포넌트에서 발생하며, React가 DOM 노드를
조작하는 과정에서 발생하는 문제였습니다.

## 🔍 원인 분석

### 1. DOM 불일치 문제

- React가 Virtual DOM과 실제 DOM 사이의 차이를 조정하는 과정에서 발생
- 컴포넌트가 빠르게 마운트/언마운트되면서 DOM 참조가 무효화됨
- 조건부 렌더링이나 상태 변경이 빈번할 때 더 자주 발생

### 2. 컴포넌트 리렌더링 최적화 부족

- `OptionIcon` 컴포넌트가 불필요하게 자주 리렌더링
- 메모이제이션이 제대로 작동하지 않음
- 고유한 key 속성 부족으로 React가 컴포넌트를 정확히 추적하지 못함

### 3. 에러 전파 문제

- 개별 컴포넌트의 에러가 상위 `TokenErrorBoundary`까지 전파
- 컴포넌트별 격리된 에러 처리가 없어 전체 앱 안정성에 영향

## 💡 해결 방안

### 1단계: 컴포넌트별 에러 바운더리 구축

```tsx
// ComponentErrorBoundary.tsx - 범용 에러 바운더리
class ComponentErrorBoundary extends Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${componentName}:`, error);
    // 에러를 상위로 전파하지 않고 여기서 처리
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorMessage>{componentName}에서 오류가 발생했습니다.</ErrorMessage>
          <RetryButton onClick={this.handleRetry}>다시 시도</RetryButton>
        </ErrorContainer>
      );
    }
    return this.props.children;
  }
}
```

### 2단계: 전문화된 에러 바운더리 개발

```tsx
// PanoramaErrorBoundary.tsx - Panorama360 컴포넌트 전용
class PanoramaErrorBoundary extends Component<Props, State> {
  render() {
    if (this.state.hasError) {
      return (
        <PanoramaErrorContainer>
          <ErrorIcon>🏠</ErrorIcon>
          <ErrorTitle>파노라마 뷰 로딩 오류</ErrorTitle>
          <ErrorMessage>
            360도 파노라마 이미지를 불러오는 중 문제가 발생했습니다.
          </ErrorMessage>
          <RetryButton onClick={this.handleRetry}>다시 로딩</RetryButton>
        </PanoramaErrorContainer>
      );
    }
    return this.props.children;
  }
}

// NavigationErrorBoundary.tsx - 네비게이션 컴포넌트들 전용
class NavigationErrorBoundary extends Component<Props, State> {
  render() {
    if (this.state.hasError) {
      return (
        <NavErrorContainer componentType={componentType}>
          <ErrorMessage>{componentName} 로딩 오류</ErrorMessage>
          <RetryButton onClick={this.handleRetry}>다시시도</RetryButton>
        </NavErrorContainer>
      );
    }
    return this.props.children;
  }
}
```

### 3단계: OptionIcon 컴포넌트 안정화

```tsx
const OptionIcon = memo(
  ({ option }: OptionIconProps) => {
    // 안전장치: option 유효성 검사
    if (!option || !option.optid) {
      return <div style={{ width: iconSize, height: iconSize }} />;
    }

    try {
      // 고유한 key로 React의 정확한 DOM 추적 보장
      if (option.selected) {
        return (
          <div key={`selected-${option.optid}`}>
            <SelectedOptionIcon width={iconSize} height={iconSize} />
          </div>
        );
      }

      return (
        <div key={`unselected-${option.optid}`}>
          <UnselectedOptionIcon width={iconSize} height={iconSize} />
        </div>
      );
    } catch (error) {
      console.error('Error rendering OptionIcon:', error);
      return <div style={{ width: iconSize, height: iconSize }} />;
    }
  },
  // 메모이제이션 최적화로 불필요한 리렌더링 방지
  (prevProps, nextProps) => {
    if (!prevProps.option || !nextProps.option) return false;

    return (
      prevProps.option.optid === nextProps.option.optid &&
      prevProps.option.selected === nextProps.option.selected
    );
  }
);
```

### 4단계: 계층적 에러 바운더리 적용

```tsx
// PanoramaFrame.tsx
return (
  <ScreenContainer>
    <NavigationErrorBoundary componentType='top-nav'>
      <TopOptionNavBar />
    </NavigationErrorBoundary>

    <PanoramaWrapper>
      <PanoramaErrorBoundary onRetry={() => setImageQuality(imageQuality)}>
        <Panorama360
          key={imageQuality}
          hasValidToken={hasValidToken}
          tokenId={tokenId || ''}
        />
      </PanoramaErrorBoundary>

      <NavigationErrorBoundary componentType='location-nav'>
        <LocationNavBar />
      </NavigationErrorBoundary>

      {isShowToast && (
        <ComponentErrorBoundary componentName='NotificationToast'>
          <NotificationToast />
        </ComponentErrorBoundary>
      )}
    </PanoramaWrapper>

    <ComponentErrorBoundary componentName='PopupWrapper'>
      <PopupWrapper tokenId={tokenId} />
    </ComponentErrorBoundary>

    <NavigationErrorBoundary componentType='side-panel'>
      <SidePanel />
    </NavigationErrorBoundary>

    <NavigationErrorBoundary componentType='bottom-panel'>
      <BottomPanel
        isOpen={isOpenCart}
        onClose={handleClosePanel}
        onSubmit={handleSubmit}
      />
    </NavigationErrorBoundary>
  </ScreenContainer>
);
```

## ⚠️ 여전히 남은 문제

위의 모든 안전장치를 적용했음에도 불구하고 DOM insertBefore 에러가 지속되고
있습니다:

```
React will try to recreate this component tree from scratch using the error boundary you provided, TokenErrorBoundary.
Token Error Boundary caught an error: NotFoundError: Failed to execute 'insertBefore' on 'Node'...
```

## 🤔 추가 분석이 필요한 부분

### 1. React 18 Concurrent Features 관련

```tsx
// React 18의 Concurrent Rendering으로 인한 문제일 가능성
// StrictMode나 Suspense와의 상호작용 확인 필요
```

### 2. Styled Components와의 충돌

```tsx
// emotion/styled를 사용하는 컴포넌트들에서 CSS-in-JS 라이브러리와
// React DOM 조작 사이의 타이밍 이슈 가능성
```

### 3. 외부 라이브러리 간섭

```tsx
// 파노라마 뷰어나 기타 DOM을 직접 조작하는 라이브러리와의 충돌
```

## 🔧 향후 시도해볼 해결책

### 1. DOM 전용 에러 바운더리 구현 ✅ 완료

```tsx
// DOMErrorBoundary.tsx - DOM 에러만 포착하는 전문화된 에러 바운더리
class DOMErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    const isDOMError =
      error.name === 'NotFoundError' ||
      error.message.includes('insertBefore') ||
      error.message.includes('removeChild') ||
      error.message.includes('appendChild');

    return { hasError: isDOMError, error: isDOMError ? error : undefined };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (isDOMError) {
      // DOM 에러 전용 상세 디버깅 정보 수집
      console.group('🚨 DOM Error Detected');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);

      // 디버깅용 글로벌 정보 저장
      (window as any).__DOM_ERROR_DEBUG_INFO__ = {
        errorType: 'DOM_MANIPULATION_ERROR',
        timestamp: new Date().toISOString(),
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
      };
      console.groupEnd();
    } else {
      // DOM 에러가 아니면 상위로 전파
      throw error;
    }
  }
}
```

### 2. OptionIcon 컴포넌트 DOM 안정화 ✅ 완료

```tsx
const OptionIcon = memo(({ option }: OptionIconProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // DOM 조작 안정화를 위한 useLayoutEffect
  useLayoutEffect(() => {
    if (containerRef.current) {
      const isConnected = containerRef.current.isConnected;
      if (!isConnected) {
        console.warn('OptionIcon DOM node is not connected');
      }
    }
  }, [option.optid, option.selected]);

  // 각 아이콘을 개별 DOMErrorBoundary로 보호
  return (
    <DOMErrorBoundary
      fallback={<div style={{ width: iconSize, height: iconSize }} />}>
      <div ref={containerRef} key={`selected-icon-${option.optid}`}>
        <SelectedOptionIcon width={iconSize} height={iconSize} />
      </div>
    </DOMErrorBoundary>
  );
});
```

### 3. 계층적 DOM 에러 바운더리 적용 ✅ 완료

```tsx
// PanoramaFrame.tsx - 모든 주요 컴포넌트를 DOMErrorBoundary로 이중 보호
return (
  <ScreenContainer>
    <DOMErrorBoundary>
      <NavigationErrorBoundary componentType='top-nav'>
        <TopOptionNavBar />
      </NavigationErrorBoundary>
    </DOMErrorBoundary>

    <DOMErrorBoundary>
      <PanoramaErrorBoundary>
        <Panorama360 />
      </PanoramaErrorBoundary>
    </DOMErrorBoundary>

    {/* 기타 컴포넌트들도 동일하게 적용 */}
  </ScreenContainer>
);
```

### 4. React.StrictMode 비활성화 테스트

```tsx
// StrictMode가 개발 환경에서 의도적으로 컴포넌트를 두 번 렌더링하여
// 부작용을 찾아내는 기능이 DOM 에러와 관련있을 수 있음
```

### 5. Suspense Boundary 추가

```tsx
<Suspense fallback={<LoadingSpinner />}>
  <DOMErrorBoundary>
    <PanoramaErrorBoundary>
      <Panorama360 />
    </PanoramaErrorBoundary>
  </DOMErrorBoundary>
</Suspense>
```

### 6. DOM 조작 최소화

```tsx
// Portal을 사용하여 DOM 트리 밖에서 렌더링
// useLayoutEffect로 DOM 조작 타이밍 제어
```

### 7. React DevTools Profiler 활용

```tsx
// 컴포넌트 렌더링 패턴 분석
// 불필요한 리렌더링이나 메모리 누수 확인
```

## 🔍 추가 디버깅 정보

### 현재 적용된 에러 바운더리 계층

```
DOMErrorBoundary
├── NavigationErrorBoundary (top-nav)
│   └── TopOptionNavBar
│       └── OptionIcon (개별 DOMErrorBoundary 적용)
├── DOMErrorBoundary
│   └── PanoramaErrorBoundary
│       └── Panorama360
├── DOMErrorBoundary
│   └── NavigationErrorBoundary (location-nav)
│       └── LocationNavBar
└── ... (기타 컴포넌트들)
```

### 에러 디버깅 정보 수집

- 브라우저 콘솔에서 `window.__DOM_ERROR_DEBUG_INFO__` 확인 가능
- 에러 발생 시 상세한 컴포넌트 스택과 타임스탬프 기록
- 사용자 환경 정보 (UserAgent, URL) 포함

### 성능 최적화 적용사항

- `useLayoutEffect`로 DOM 연결 상태 체크
- `useRef`를 통한 안정적인 DOM 참조
- 고유한 key 속성으로 React reconciliation 최적화
- 메모이제이션으로 불필요한 리렌더링 방지

## 📚 교훈과 베스트 프랙티스

### 1. 에러 바운더리 계층화

- 컴포넌트별로 적절한 에러 바운더리 설정
- 에러의 영향 범위를 최소화
- 사용자 친화적인 복구 옵션 제공

### 2. 컴포넌트 안정화

- 메모이제이션으로 불필요한 리렌더링 방지
- 고유한 key 속성으로 React의 reconciliation 돕기
- 방어적 프로그래밍으로 예외 상황 처리

### 3. DOM 조작 주의사항

- React가 관리하는 DOM을 직접 조작하지 않기
- 외부 라이브러리 사용 시 React lifecycle과의 충돌 고려
- Concurrent Features 사용 시 추가적인 테스트 필요

## 🎯 결론

React DOM insertBefore 에러는 복합적인 원인으로 발생할 수 있는 까다로운
문제입니다. 에러 바운더리를 통한 격리와 컴포넌트 최적화를 통해 안정성을 높일 수
있지만, 근본적인 해결을 위해서는 더 깊은 분석이 필요합니다.

특히 React 18의 새로운 기능들과 CSS-in-JS 라이브러리, 외부 DOM 조작 라이브러리들
간의 상호작용을 면밀히 분석해야 할 것 같습니다.

---

**참고 자료:**

- [React Error Boundaries 공식 문서](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React 18 Concurrent Features](https://react.dev/blog/2022/03/29/react-v18#new-feature-concurrent-rendering)
- [DOM insertBefore 명세](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore)
