import { Robot, Adapter, Message } from "hubot";
import { WebClient, WebAPICallResult } from "@slack/client";
interface SlackMessage extends Message {
  rawmessage: {
    channel: Channel;
    attachments: Attachment[];
    thread_ts: any;
    ts: string;
  };
}
interface SlackAdapter extends Adapter {
  options: {
    token: string;
  };
  customMessage(data: CustomMessageData): void;
  client: { rtm: any };
}
interface CustomMessageData {
  attachments?: Attachment[];
  content?: Attachment[];
  text?: string;
  username?: string;
  channel?: string;
  message?: CustomMessage;
  icon_url?: string;
  icon_emoji?: string;
}
interface CustomMessage {
  envelope?: {
    room: string;
  };
  room?: string;
}
interface Attachment {}

interface Channel {
  id: string;
  name: string;
}
interface ChannelsListResponse extends WebAPICallResult {
  channels: Channel[];
}

module.exports = async (robot: Robot<SlackAdapter>) => {
  try {
    const web = new WebClient(robot.adapter.options.token);
    const channels = ((await web.channels.list()) as ChannelsListResponse)
      .channels;
    const timesChannels: string[] = channels
      .filter((channel) => channel.name.startsWith("times_"))
      .map((channel) => channel.id);
    const timelineChannel: string = channels.find(
      (channel) => channel.name === "timeline"
    ).id;

    robot.hear(/.*?/i, (res) => {
      const { rawmessage } = (res.message as any) as SlackMessage;
      if (timesChannels.includes(rawmessage.channel.id)) {
        robot.adapter.customMessage({
          channel: timelineChannel,
          username: rawmessage.attachments,
        });
      }
    });
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
