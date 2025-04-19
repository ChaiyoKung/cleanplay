import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { google } from "googleapis";

const playlistSchema = z.object({
  kind: z.literal("youtube#playlist"),
  etag: z.string(),
  id: z.string(),
  snippet: z.object({
    publishedAt: z.string(),
    channelId: z.string(),
    title: z.string(),
    description: z.string(),
    thumbnails: z.object({
      default: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      }),
      medium: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      }),
      high: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      }),
      standard: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      }),
      maxres: z.object({
        url: z.string(),
        width: z.number(),
        height: z.number(),
      }),
    }),
    channelTitle: z.string(),
    localized: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
  contentDetails: z.object({
    itemCount: z.number(),
  }),
});

const playlistListResponseSchema = z.object({
  kind: z.literal("youtube#playlistListResponse"),
  etag: z.string(),
  nextPageToken: z.string().optional(),
  prevPageToken: z.string().optional(),
  pageInfo: z.object({
    totalResults: z.number(),
    resultsPerPage: z.number(),
  }),
  items: z.array(playlistSchema),
});

export const playlistRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const youtube = google.youtube("v3");
    const response = await youtube.playlists.list({
      part: ["id", "snippet", "contentDetails"],
      mine: true,
      maxResults: 50,
      access_token: ctx.session.accessToken,
    });

    return playlistListResponseSchema.parse(response.data);
  }),
});
