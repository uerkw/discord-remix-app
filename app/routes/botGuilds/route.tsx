import {
  LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { auth } from "@/auth.server";
import { REST, CDN } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import { z } from "zod";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";

const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);
const cdn = new CDN();

const GuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  owner: z.boolean(),
  permissions: z.string(),
  features: z.array(z.string()),
});

const GuildArraySchema = z.array(GuildSchema);

type Guild = z.infer<typeof GuildSchema>;

type GuildWithIconUrl = Guild & {
  iconUrl: string;
};

async function mapGuildsWithIconUrl(guilds: Guild[]) {
  const newArray = [];

  for (const guild of guilds) {
    const targetGuildId = guild.id;
    const targetGuildIconId = guild.icon || "";
    const iconUrl = await cdn.icon(targetGuildId, targetGuildIconId);
    const newObj: GuildWithIconUrl = {
      ...guild,
      iconUrl: iconUrl,
    };
    newArray.push(newObj);
  }
  return newArray;
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    const isAuthenticated = await auth.isAuthenticated(request, {
      failureRedirect: "/login",
    });


  const restApiData = await rest.get(Routes.userGuilds());

  console.log(restApiData);
  //const parsedData = parseGuildSchema(restApiData);
  const parsedData = GuildArraySchema.safeParse(restApiData);
  if (parsedData.success) {
    const processedGuilds = await mapGuildsWithIconUrl(parsedData.data);
    return json({ guilds: processedGuilds });
  }
  return json({ errors: parsedData.error.flatten() });
};

export default function Guilds() {
  const data = useLoaderData<typeof loader>();
  if("errors" in data){
    return (
      <div>
        <h1>Errors encountered:</h1>
        <pre>
          {JSON.stringify(data.errors, null, 2)}
        </pre>
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">Your Guilds</h1>
      {data.guilds && data.guilds.length > 0 ? (
        <ul className="flex flex-row gap-4">
          {data.guilds.map((guild: GuildWithIconUrl) => (
            <li key={guild.id}>
              <div className="flex flex-row">NAME: {guild.name}</div>
              {/* <div className="flex flex-row">ID: {guild.id}</div> */}
              <img
                alt="Guild logo"
                width="128px"
                height="128px"
                src={guild.iconUrl}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>None</p>
      )}
    </div>
  );
}
