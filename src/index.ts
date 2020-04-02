import { Robot, Adapter } from "hubot";
namespace hubot {}
interface SlackAdapter extends Adapter {
  client: { rtm: any };
}

module.exports = (robot: Robot<SlackAdapter>) => {
  robot.hear(/.*?/i, (msg) => {
    const channel = msg.envelope.room;
    const room_name = robot.adapter.client.rtm;
  });
};

const USER_IMAGES = "userImages";
type UserImages = {
  [key: string]: string;
};
function reloadUserImages(robot: Robot, userId: number) {
  {
    const userImages: UserImages | null = robot.brain.get(USER_IMAGES);
    if (!userImages) {
      robot.brain.set(USER_IMAGES, {});
    }
  }
  {
    const userImages: UserImages = robot.brain.get(USER_IMAGES);
    if (userId in userImages) {
      const newUserImages = robot.brain.set(USER_IMAGES, newUserImages);
    }
  }
}
