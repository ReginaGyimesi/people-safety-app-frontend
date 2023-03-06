import wdio from "webdriverio";
const jasmine = require("jasmine");
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

const opts = {
  path: "/wd/hub/",
  port: 4723,
  capabilities: {
    platformName: "android",
    deviceName: "emulator-5554",
    app: "/Users/gyimesiregina/people-safety-app-frontend/peoplesafetyapp.apk",
    automationName: "UiAutomator2",
    autoGrantPermissions: "true",
  },
};

describe("Expo test example", function () {
  let client;
  jest.setTimeout(100000);
  beforeAll(async function () {
    client = await wdio.remote(opts);
    await client.pause(3000);
    const pack = await client.getCurrentPackage();
    const activity = await client.getCurrentActivity();
    await client.startActivity(pack, activity); //Reload to force update
    await client.pause(3000);
  });

  it("should click dark mode button", async function () {
    // Arrange
    const button = await client.$("~dark-mode-button");
    const visible = await button.isDisplayed();
    // Act
    await button.click();
    // Assert
    expect(visible).toBeTruthy();
  });
});
