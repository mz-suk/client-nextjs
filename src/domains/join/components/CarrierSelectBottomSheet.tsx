'use client';

import { BottomSheet } from '@shared/ui';

import type { JoinFormData } from '../types';
import styles from './CarrierSelectBottomSheet.module.scss';

interface CarrierSelectBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (carrier: JoinFormData['carrier']) => void;
  selectedCarrier?: string;
}

const CARRIERS = [
  { value: 'SKT', label: 'SKT' },
  { value: 'KT', label: 'KT' },
  { value: 'LGU+', label: 'LG U+' },
  { value: 'SKT_BUDGET', label: 'SKT 알뜰폰' },
  { value: 'KT_BUDGET', label: 'KT 알뜰폰' },
  { value: 'LGU_BUDGET', label: 'LG U+ 알뜰폰' },
] as const;

export function CarrierSelectBottomSheet({ open, onOpenChange, onSelect, selectedCarrier }: CarrierSelectBottomSheetProps) {
  const handleSelect = (carrier: JoinFormData['carrier']) => {
    onSelect(carrier);
    onOpenChange(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="통신사 선택">
      <div className={styles.carrierList}>
        {CARRIERS.map(carrier => (
          <button
            key={carrier.value}
            type="button"
            className={`${styles.carrierItem} ${selectedCarrier === carrier.value ? styles.selected : ''}`}
            onClick={() => handleSelect(carrier.value)}
          >
            <span className={styles.carrierLabel}>{carrier.label}</span>
          </button>
        ))}
      </div>
    </BottomSheet>
  );
}
