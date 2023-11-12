import { ApplicationCommandOptionType, REST, Routes } from "discord.js";
import { config } from "dotenv";
config();

function slashCommandCHData() {
  return {
    name: "check_history",
    description: "check my history",
  };
}
function slashCommandMRAData() {
  return {
    name: "mythic_run_assembler",
    description: "mythic run assembler",
    options: [
      {
        name: "quantity",
        description: "How much runs",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "level",
        description: "Key Level",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "faction",
        description: "faction",
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: "Horde", value: "horde" },
          { name: "Alliance", value: "alliance" },
        ],
        required: true,
      },
      {
        name: "price",
        description: "price for entire order",
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: "order_taker",
        description: "assign directly",
        type: ApplicationCommandOptionType.User,
      },
      {
        name: "title",
        description: "title, not required",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "description",
        description: "something important to know",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "express",
        description: "express order??",
        type: ApplicationCommandOptionType.Boolean,
      },
      {
        name: "start_date",
        description: "starting date",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "dead_line",
        description: "dead line",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "buyer_participations",
        description: "buyer participate??",
        type: ApplicationCommandOptionType.Boolean,
      },
      {
        name: "stack",
        description: "armor stack",
        type: ApplicationCommandOptionType.String,
        choices: [
          { name: "Cloth", value: "Cloth" },
          { name: "Leather", value: "Leather" },
          { name: "Mail", value: "Mail" },
          { name: "Plate", value: "Plate" },
        ],
      },
      {
        name: "traders",
        description: "quantity of traders",
        type: ApplicationCommandOptionType.Number,
        choices: [
          { name: "1", value: 1 },
          { name: "2", value: 2 },
          { name: "3", value: 3 },
          { name: "4", value: 4 },
        ],
      },
    ],
  };
}
export async function registComands(setting = true) {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  try {
    const commandsToDeploy = [slashCommandMRAData(), slashCommandCHData()];
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.APP_ID,
        process.env.MODE_BOOST_ID
      ),
      {
        body: setting ? commandsToDeploy : [],
      }
    );

    return setting ? "Commands Has Been Setted" : "Commands Has Been Removed";
  } catch (error) {
    console.log(error);
  }
}
export const refreshCommands = () => {
  registComands(false).then(() => {
    registComands();
  });
};
