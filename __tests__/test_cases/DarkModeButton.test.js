import { remote } from "webdriverio";

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
let driver;

beforeAll(async () => {
  driver = await remote({
    path: "/wd/hub",
    host: "localhost",
    port: 4723,
    capabilities: {
      appiumVersion: "1.22.3-4",
      platformName: "Android",
      deviceName: "emulator-5554",
      appium: { connectHardwareKeyboard: true },
    },
  });
});

afterAll(async () => {
  if (driver) {
    await driver.deleteSession();
  }
});
test("Dark mode button test", async () => {
  await driver.pause(2000);

  const darkModeButton = await driver.$("~dark-mode-button");
  await darkModeButton.waitForExist();
  darkModeButton.click();
  await driver.pause(3000);
});
