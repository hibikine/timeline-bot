import { Robot, Adapter } from "hubot";
import { WebClient, WebAPICallResult } from "@slack/client";
namespace hubot {}
interface SlackAdapter extends Adapter {
  options: {
    token: string;
  };
  client: { rtm: any };
}
interface Channel {
  id: string;
  name: string;
}
interface ChannelsListResponse extends WebAPICallResult {
  channels: Channel[];
}

module.exports = async (robot: Robot<SlackAdapter>) => {
  /*robot.hear(/.*?/i, (msg) => {
    const channel = msg.envelope.room;
    const room_name = robot.adapter.client.rtm;
  });*/
  const web = new WebClient(robot.adapter.options.token);
  try {
    const timesChannels = ((await web.channels.list()) as ChannelsListResponse).channels.find(
      (channel) => channel.name.startsWith("times_")
    );
  } catch (e) {
    robot.logger.error(e.massage);
  }
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
