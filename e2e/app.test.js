describe('People Safety App tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should be able to see home screen', async () => {
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('should be able to switch on dark mode', async () => {
    await element(by.id('dark-mode-button')).tap();
  });

  it('should be able to switch off dark mode', async () => {
    await element(by.id('dark-mode-button')).tap();
  });

  it('should be able to search', async () => {
    await element(by.id('google-places')).typeText("Glasgow");
  });

  it('should be able to tap on suggested search', async () => {
    await element(by.id('google-places')).tap();
  });

  it('should be able to swipe bottom sheet up', async () => {
    await element(by.id('bottom-sheet')).swipe("up", "slow", 0.5);
  });

  it('should be able to tap See more button', async () => {
    await element(by.id('see-more')).tap();
  });

  it('should be able to swipe crimes over time diagram left', async () => {
    await element(by.id('crimes-over-time')).swipe("left");
  });


  it('should be able to swipe crimes over time diagram right', async () => {
    await element(by.id('crimes-over-time')).swipe("right");
  });
  

  it('should be able to swipe up on stats screen', async () => {
    await element(by.id('stats-screen')).swipe("up");
  });

  it('should be able to swipe most common crime types diagram right', async () => {
    await element(by.id('stats-most-common')).swipe("right");
  });

  it('should be able to swipe most common crime types diagram left', async () => {
    await element(by.id('stats-most-common')).swipe("left");
  });

  it('should be able to swipe most common crime types diagram left', async () => {
    await element(by.id('stats-neighbours')).swipe("left");
  });

  it('should be able to swipe most common crime types diagram right', async () => {
    await element(by.id('stats-neighbours')).swipe("right");
  });

  it('should be able to swipe down on stats screen', async () => {
    await element(by.id('stats-screen')).swipe("down");
  });

  it('should be able to go back to home screen', async () => {
    await element(by.id('go-back-button')).tap();
  });

  it('should be able to swipe bottom sheet down', async () => {
    await element(by.id('bottom-sheet')).swipe("down");
  });

  it('should be able to go back to current location', async () => {
    await element(by.id('current-location-button')).tap();
  });
});
