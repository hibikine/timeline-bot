import { Robot, Adapter, Message } from "hubot";
import { WebClient, WebAPICallResult } from "@slack/client";
/* eslint-disable camelcase */
type SlackFile = {
  url_private: string;
};
interface SlackMessage extends Message {
  rawMessage: {
    files?: SlackFile[];
    channel: string;
    attachments: Attachment[];
    thread_ts: any;
    ts: string;
    user: {
      id: string;
      slack: {
        profile: {
          image_192: string;
        };
      };
      name: string;
      real_name: string;
    };
    icon_url: string;
    message: any;
    text: string;
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
/* eslint-enable camelcase */
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
  name_normalized: string;
}
interface ChannelsListResponse extends WebAPICallResult {
  channels: Channel[];
}

const getTimesChannel = async (robot: Robot<SlackAdapter>) => {
  const web = new WebClient(robot.adapter.options.token);
  const { channels } = (await web.conversations.list()) as ChannelsListResponse;
  robot.logger.info(channels.map(c=>c.name))
  robot.logger.info(channels.find(c=>c.name === 'times_kansei'))
  robot.logger.info(channels.filter((channel) => channel.name_normalized.startsWith('times_')).map((channel)=>channel.name))
  return channels
    .filter((channel) => channel.name_normalized.startsWith("times_"))
    .map((channel) => channel.id).concat(['C01E88RCTP1','C01RDPRGD2R']);
};
module.exports = async (robot: Robot<SlackAdapter>) => {
  try {
    const web = new WebClient(robot.adapter.options.token);
    const {
      channels,
    } = (await web.conversations.list({limit: 1000, exclude_archived: true})) as ChannelsListResponse;
    const timelineChannel: string = channels.find(
      (channel) => channel.name === "timeline"
    ).id;
    robot.logger.info(timelineChannel);

    robot.hear(/.*?/i, async (res) => {
      const { rawMessage } = (res.message as any) as SlackMessage;
      robot.logger.info(rawMessage);
      robot.logger.info(res);
      robot.logger.info(rawMessage.user.slack.profile);
      robot.logger.info('times')
      robot.logger.info(await getTimesChannel(robot));
      if ((await getTimesChannel(robot)).includes(rawMessage.channel)) {
        let files;
        if (rawMessage.files) {
          files = rawMessage.files.map((v) => ({
            fallback: "image",
            image_url: v.url_private,
            thumb_url: v.url_private,
          }));
        }
        robot.send(
          {
            room: timelineChannel,
          } as any,
          {
            as_user: false,
            channel: timelineChannel,
            username: rawMessage.user.real_name,
            icon_url: rawMessage.user.slack.profile.image_192,
            attachments: files,
            text: rawMessage.text,
          } as any
        );
      }
      });
  } catch (e) {
    robot.logger.error(e.massage);
  }
};

/* const USER_IMAGES = "userImages";
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
      const newUserImages = {...userImages, [userId]: user}
        robot.brain.set(USER_IMAGES, newUserImages);
    }
  }
} */
