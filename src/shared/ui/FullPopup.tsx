'use client';

import { Dialog } from '@base-ui/react/dialog';
import { ScrollArea } from '@base-ui/react/scroll-area';
import * as React from 'react';

import styles from './FullPopup.module.scss';
import { ClearIconSVG } from './icon';

export interface FullPopupProps {
  /** FullPopup 열림/닫힘 상태 (controlled) */
  open?: boolean;
  /** 상태 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
  /** 트리거 버튼 커스터마이징 */
  trigger?: React.ReactNode;
  /** 제목 */
  title?: React.ReactNode;
  /** 설명 */
  description?: React.ReactNode;
  /** 본문 콘텐츠 */
  children: React.ReactNode;
  /** 닫기 버튼 표시 여부 */
  showCloseButton?: boolean;
  /** 헤더 커스터마이징 (title, description 대신 사용) */
  header?: React.ReactNode;
  /** 푸터 영역 */
  footer?: React.ReactNode;
  /** 커스텀 클래스명 */
  className?: string;
  /** 애니메이션 방향 */
  direction?: 'right' | 'left';
}

/**
 * 우측에서 슬라이드되는 전체 화면 팝업
 *
 * @example
 * ```tsx
 * <FullPopup
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="팝업 제목"
 * >
 *   팝업 내용
 * </FullPopup>
 * ```
 */
export function FullPopup({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  showCloseButton = true,
  header,
  footer,
  className,
  direction = 'right',
}: FullPopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = React.useState(false);

  // Controlled vs Uncontrolled
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <Dialog.Trigger>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Viewport className={styles.Viewport}>
          <Dialog.Popup ref={popupRef} className={`${styles.Popup} ${styles[direction]} ${className || ''}`} initialFocus={popupRef}>
            <ScrollArea.Root className={styles.ScrollRoot}>
              <ScrollArea.Viewport className={styles.ScrollViewport}>
                <ScrollArea.Content className={styles.ScrollContent}>
                  {/* 헤더 영역 */}
                  {(header || title || showCloseButton) && (
                    <div className={styles.PopupHeader}>
                      {header ? (
                        header
                      ) : (
                        <>
                          {showCloseButton && (
                            <Dialog.Close className={styles.Close} aria-label="닫기">
                              <ClearIconSVG size={24} />
                            </Dialog.Close>
                          )}
                          {title && <Dialog.Title className={styles.Title}>{title}</Dialog.Title>}
                        </>
                      )}
                    </div>
                  )}

                  {/* 설명 영역 */}
                  {description && <Dialog.Description className={styles.Description}>{description}</Dialog.Description>}

                  {/* 본문 영역 */}
                  <div className={styles.Body}>{children}</div>

                  {/* 푸터 영역 */}
                  {footer && <div className={styles.Footer}>{footer}</div>}
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className={styles.Scrollbar}>
                <ScrollArea.Thumb className={styles.ScrollbarThumb} />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// 개별 컴포넌트 export (더 세밀한 제어가 필요한 경우)
FullPopup.Trigger = Dialog.Trigger;
FullPopup.Close = Dialog.Close;
