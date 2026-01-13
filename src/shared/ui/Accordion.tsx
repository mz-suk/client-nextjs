'use client';

import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import * as React from 'react';

import styles from './Accordion.module.scss';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Helper to merge class names that can be strings or functions
function mergeClassNames<State>(baseClass: string | undefined, userClass: string | ((state: State) => string | undefined) | undefined) {
  return (state: State) => {
    const userClassName = typeof userClass === 'function' ? userClass(state) : userClass;
    return cn(baseClass, userClassName);
  };
}

const AccordionRoot = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAccordion.Root>>(({ className, ...props }, ref) => (
  <BaseAccordion.Root ref={ref} className={mergeClassNames(styles.root, className)} {...props} />
));
AccordionRoot.displayName = 'AccordionRoot';

const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAccordion.Item>>(({ className, ...props }, ref) => (
  <BaseAccordion.Item ref={ref} className={mergeClassNames(styles.item, className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionHeader = React.forwardRef<HTMLHeadingElement, React.ComponentProps<typeof BaseAccordion.Header>>(({ className, ...props }, ref) => (
  <BaseAccordion.Header ref={ref} className={mergeClassNames(styles.header, className)} {...props} />
));
AccordionHeader.displayName = 'AccordionHeader';

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof BaseAccordion.Trigger>>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Trigger ref={ref} className={mergeClassNames(styles.trigger, className)} {...props}>
    {children}
    <ChevronIcon className={styles.icon} />
  </BaseAccordion.Trigger>
));
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionPanel = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof BaseAccordion.Panel>>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Panel ref={ref} className={mergeClassNames(styles.panel, className)} {...props}>
    <div className={styles.content}>{children}</div>
  </BaseAccordion.Panel>
));
AccordionPanel.displayName = 'AccordionPanel';

function ChevronIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
};
