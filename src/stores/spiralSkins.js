import { NaturalDate } from "natural-time-js";

let now = new NaturalDate(new Date().setUTCHours(12,0,0,0), 0);

export const spiralSkins = {
  full: {
    default: {
      animationSpeed: 0.4,
      showDaysNumber: true,
      showDisplay: true,
      singleMoonView: false,
      showAnimation: true,
    },
    welcome: {
      context: {
        currentTime: new Date(1356091200000),
        latitude: 42.42,
        longitude: 0,
      },
      animationSpeed: 0.4,
      descriptionTextKey: "tutorials.spiral.welcome.description",
      showDaysNumber: false,
      showDisplay: false,
      singleMoonView: false,
      showAnimation: false,
    },
    tutorial: [
      {
        context: {
          currentTime: new Date(1326974400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step1.title",
        descriptionTextKey: "tutorials.spiral.step1.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
      },
      {
        context: {
          currentTime: new Date(1325160000000 + 28 * 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step2.title",
        descriptionTextKey: "tutorials.spiral.step2.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1325160000000 + 86400000 * 29),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step3.title",
        descriptionTextKey: "tutorials.spiral.step3.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1325160000000 + 86400000 * 35),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step4.title",
        descriptionTextKey: "tutorials.spiral.step4.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
        singleMoonView: true,
      },
      {
        context: {
          currentTime: new Date(1325764800000 + 28 * 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step5.title",
        descriptionTextKey: "tutorials.spiral.step5.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true,
      },
      {
        context: {
          currentTime: new Date(1329480000000 + 60 * 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step6.title",
        descriptionTextKey: "tutorials.spiral.step6.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1349697600000),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step7.title",
        descriptionTextKey: "tutorials.spiral.step7.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356004800000),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step8.title",
        descriptionTextKey: "tutorials.spiral.step8.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356004800000 + 86400000),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step9.title",
        descriptionTextKey: "tutorials.spiral.step9.description",
        animationSpeed: 0.4,
        showAnimation: true,
        showDaysNumber: false,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356004800000 + 86400000 * 367),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step10.title",
        descriptionTextKey: "tutorials.spiral.step10.description",
        animationSpeed: 0.4,
        showAnimation: true,
        showDaysNumber: false,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date().setUTCHours(12,0,0,0),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step11.title",
        descriptionTextKey: "tutorials.spiral.step11.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356177600000),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step12.title",
        descriptionTextKey: "tutorials.spiral.step12.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
      {
        context: {
          currentTime: new Date(1356177600000 + 86400000 * 27),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.step13.title",
        descriptionTextKey: "tutorials.spiral.step13.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        singleMoonView: true,
        showDisplay: true, // Keep it
      },
      /////END OF TUTORIAL/////
      {
        context: {
          currentTime: new Date().setUTCHours(12,0,0,0),
          latitude: 42.42,
          longitude: 0,
        },
        titleTextKey: "tutorials.spiral.end.title",
        descriptionTextKey: "tutorials.spiral.end.description",
        animationSpeed: 0.4,
        showDaysNumber: true,
        showDisplay: true, // Keep it
      },
    ]
  }
}