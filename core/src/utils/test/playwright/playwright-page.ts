import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestInfo,
} from '@playwright/test';
import { test as base } from '@playwright/test';

import { initPageEvents } from './page/event-spy';
import {
  getSnapshotSettings,
  goto as goToPage,
  setContent,
  setIonViewport,
  spyOnEvent,
  waitForChanges,
  locator,
} from './page/utils';
import type { LocatorOptions } from './page/utils';
import type { E2EPage } from './playwright-declarations';

type CustomTestArgs = PlaywrightTestArgs &
  PlaywrightTestOptions &
  PlaywrightWorkerArgs &
  PlaywrightWorkerOptions & {
    page: E2EPage;
  };

type CustomFixtures = {
  page: E2EPage;
};

export const test = base.extend<CustomFixtures>({
  page: async ({ page }: CustomTestArgs, use: (r: E2EPage) => Promise<void>, testInfo: TestInfo) => {
    const originalGoto = page.goto.bind(page);
    const originalLocator = page.locator.bind(page);

    // Overridden Playwright methods
    page.goto = (url: string) => goToPage(page, url, testInfo, originalGoto);
    page.setContent = (html: string) => setContent(page, html);
    page.locator = (selector: string, options?: LocatorOptions) => locator(page, originalLocator, selector, options);
    // Custom Ionic methods
    page.getSnapshotSettings = () => getSnapshotSettings(page, testInfo);
    page.setIonViewport = () => setIonViewport(page);
    page.waitForChanges = (timeoutMs?: number) => waitForChanges(page, timeoutMs);
    page.spyOnEvent = (eventName: string) => spyOnEvent(page, eventName);

    // Custom event behavior
    await initPageEvents(page);

    await use(page);
  },
});
