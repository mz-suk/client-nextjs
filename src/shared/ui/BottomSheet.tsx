'use client';
import { Dialog } from '@base-ui/react/dialog';
import { ScrollArea } from '@base-ui/react/scroll-area';
import * as React from 'react';

import styles from './BottomSheet.module.scss';
import { ClearIconSVG } from './icon';

export interface BottomSheetProps {
  /** BottomSheet 열림/닫힘 상태 (controlled) */
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
  /** 바텀시트 높이 설정 */
  height?: 'auto' | 'full' | string;
  /** 커스텀 클래스명 */
  className?: string;
}

export function BottomSheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  showCloseButton = true,
  header,
  footer,
  height = 'auto',
  className,
}: BottomSheetProps) {
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
          <ScrollArea.Root style={{ position: undefined }} className={styles.ScrollViewport}>
            <ScrollArea.Viewport className={styles.ScrollViewport}>
              <ScrollArea.Content className={styles.ScrollContent}>
                <Dialog.Popup
                  ref={popupRef}
                  className={`${styles.Popup} ${className || ''}`}
                  style={{ height: height === 'full' ? '90vh' : height === 'auto' ? 'auto' : height }}
                  initialFocus={popupRef}
                >
                  {/* 헤더 영역 */}
                  {(header || title || showCloseButton) && (
                    <div className={styles.PopupHeader}>
                      {header ? (
                        header
                      ) : (
                        <>
                          {title && <Dialog.Title className={styles.Title}>{title}</Dialog.Title>}
                          {showCloseButton && (
                            <Dialog.Close className={styles.Close} aria-label="닫기">
                              <ClearIconSVG size={24} />
                            </Dialog.Close>
                          )}
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
                </Dialog.Popup>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className={styles.Scrollbar}>
              <ScrollArea.Thumb className={styles.ScrollbarThumb} />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// 개별 컴포넌트 export (더 세밀한 제어가 필요한 경우)
BottomSheet.Trigger = Dialog.Trigger;
BottomSheet.Close = Dialog.Close;

// Example 컴포넌트 (사용 예시)
export function BottomSheetExample() {
  const [open, setOpen] = React.useState(false);

  // XIcon 제거됨 - 사용하지 않음

  return (
    <div>
      {/* 예시 1: 기본 사용 (Uncontrolled) */}
      <BottomSheet trigger={<button className={styles.Button}>바텀시트 열기</button>} title="바텀시트 제목" description="바텀시트 설명입니다.">
        <div>
          <p>여기에 원하는 콘텐츠를 넣으세요.</p>
        </div>
      </BottomSheet>

      {/* 예시 2: Controlled 방식 */}
      <button onClick={() => setOpen(true)}>Controlled 바텀시트 열기</button>
      <BottomSheet open={open} onOpenChange={setOpen} title="Controlled 바텀시트">
        <p>외부 상태로 제어되는 바텀시트입니다.</p>
      </BottomSheet>

      {/* 예시 3: 커스텀 헤더 & 푸터 */}
      <BottomSheet
        trigger={<button className={styles.Button}>커스텀 바텀시트</button>}
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>커스텀 헤더</h2>
            <BottomSheet.Close>
              <button>닫기</button>
            </BottomSheet.Close>
          </div>
        }
        footer={
          <div style={{ padding: '1rem', borderTop: '1px solid #eee' }}>
            <button style={{ width: '100%' }}>확인</button>
          </div>
        }
        height="70vh"
      >
        <p>커스텀 헤더와 푸터가 있는 바텀시트입니다.</p>
      </BottomSheet>
    </div>
  );
}
