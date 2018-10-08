import { newE2EPage } from '@stencil/core/testing';

it('slides: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/slides/test/basic?ionic:_testing=true'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});
