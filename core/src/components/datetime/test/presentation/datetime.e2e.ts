import { Locator, expect } from '@playwright/test';
import { E2EPage, test } from '@utils/test/playwright';

test.describe('datetime: presentation', () => {

  test('should not have visual regressions', async ({ page }) => {
    await page.goto(`/src/components/datetime/test/presentation`);

    await page.setIonViewport();

    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`datetime-presentation-diff-${page.getSnapshotSettings()}.png`);
  });

});

test.describe('datetime: presentation: time', () => {

  let timePickerFixture: TimePickerFixture;

  test.beforeEach(async ({ page }) => {
    timePickerFixture = new TimePickerFixture(page);
    await timePickerFixture.goto();
  });

  test('changing value from AM to AM should update the text', async () => {
    await timePickerFixture.setValue('04:20:00');
    await timePickerFixture.expectTime('4', '20', 'AM');

    await timePickerFixture.setValue('11:03:00');
    await timePickerFixture.expectTime('11', '03', 'AM');
  });

  test('changing value from AM to PM should update the text', async () => {
    await timePickerFixture.setValue('04:20:00');
    await timePickerFixture.expectTime('4', '20', 'AM');

    await timePickerFixture.setValue('16:40:00');
    await timePickerFixture.expectTime('4', '40', 'PM');
  });

  test('changing the value from PM to AM should update the text', async () => {
    await timePickerFixture.setValue('16:40:00');
    await timePickerFixture.expectTime('4', '40', 'PM');

    await timePickerFixture.setValue('04:20:00');
    await timePickerFixture.expectTime('4', '20', 'AM');
  });

  test('changing the value from PM to PM should update the text', async () => {
    await timePickerFixture.setValue('16:40:00');
    await timePickerFixture.expectTime('4', '40', 'PM');

    await timePickerFixture.setValue('19:32:00');
    await timePickerFixture.expectTime('7', '32', 'PM');
  });

});

class TimePickerFixture {
  readonly page: E2EPage;

  private timePicker!: Locator;

  constructor(page: E2EPage) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(`/src/components/datetime/test/presentation`);
    this.timePicker = this.page.locator('ion-datetime[presentation="time"]');
    await this.timePicker.scrollIntoViewIfNeeded();
  }

  async setValue(value: string) {
    await this.timePicker.evaluate((el: HTMLIonDatetimeElement, newValue: string) => el.value = newValue, value);
    await this.page.waitForChanges();
  }

  async expectTime(hour: string, minute: string, ampm: string) {
    expect(await this.timePicker.locator('ion-picker-column-internal:nth-child(1) .picker-item-active').innerText()).toBe(hour);
    expect(await this.timePicker.locator('ion-picker-column-internal:nth-child(2) .picker-item-active').innerText()).toBe(minute);
    expect(await this.timePicker.locator('ion-picker-column-internal:nth-child(3) .picker-item-active').innerText()).toBe(ampm);
  }

}
