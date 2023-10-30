import { Bot } from '@/lib/types';
import { Schema, model, Model, models } from 'mongoose';

const BotSchema: Schema = new Schema<Bot>({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  discriminator: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  ownerID: {
    type: String,
    required: true,
  },
  config: {
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
    },
    links: {
      linkDiscordServer: {
        type: String,
        required: false,
      },
      linkWebSite: {
        type: String,
        required: false,
      },
      linkGithub: {
        type: String,
        required: false,
      },
    },
  },
  votes: {
    type: [
      {
        userID: String,
        timestamp: Number,
      },
    ],
    required: false,
    default: [],
  },
});

const BotModel = models['bot'] || model('bot', BotSchema);
export default BotModel as Model<Bot>;
