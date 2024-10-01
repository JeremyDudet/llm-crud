import { initTRPC } from "@trpc/server";
import { z } from "zod";
import UserController from "./controllers/UserController";
import ItemController from "./controllers/ItemController";
import AuthController from "./controllers/AuthController";
import { processCommand } from "./controllers/ProcessCommandController";
import { transcribeAudioController } from "./controllers/TranscribeAudioController";
import { processTextCommand } from "./controllers/ProcessTextCommandController";
import { authenticateToken } from "./middleware/auth";

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(authenticateToken);

export const appRouter = router({
  // User routes
  createUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(({ input }) =>
      UserController.createUser({ body: input } as any, {} as any)
    ),

  getAllUsers: protectedProcedure.query(() =>
    UserController.getAllUsers({} as any, {} as any)
  ),

  getUser: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) =>
      UserController.getUser({ params: { id: input.id } } as any, {} as any)
    ),

  updateUser: protectedProcedure
    .input(z.object({ id: z.number(), updates: z.object({}).passthrough() }))
    .mutation(({ input }) =>
      UserController.updateUser(
        { params: { id: input.id }, body: input.updates } as any,
        {} as any
      )
    ),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) =>
      UserController.deleteUser({ params: { id: input.id } } as any, {} as any)
    ),

  // Item routes
  getAllItems: protectedProcedure.query(() =>
    ItemController.getAllItems({} as any, {} as any)
  ),

  getItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) =>
      ItemController.getItem({ params: { id: input.id } } as any, {} as any)
    ),

  createItem: protectedProcedure
    .input(z.object({}).passthrough())
    .mutation(({ input }) =>
      ItemController.createItem({ body: input } as any, {} as any)
    ),

  updateItem: protectedProcedure
    .input(z.object({ id: z.number(), updates: z.object({}).passthrough() }))
    .mutation(({ input }) =>
      ItemController.updateItem(
        { params: { id: input.id }, body: input.updates } as any,
        {} as any
      )
    ),

  deleteItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) =>
      ItemController.deleteItem({ params: { id: input.id } } as any, {} as any)
    ),

  // Auth routes
  register: publicProcedure
    .input(
      z.object({ email: z.string(), password: z.string(), name: z.string() })
    )
    .mutation(({ input }) =>
      AuthController.register({ body: input } as any, {} as any)
    ),

  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(({ input }) =>
      AuthController.login({ body: input } as any, {} as any)
    ),

  // Other routes...
  processCommand: protectedProcedure
    .input(z.object({ audio: z.instanceof(Buffer) }))
    .mutation(({ input }) =>
      processCommand({ file: { buffer: input.audio } } as any, {} as any)
    ),

  transcribeAudio: protectedProcedure
    .input(z.object({ audio: z.instanceof(Buffer) }))
    .mutation(({ input }) =>
      transcribeAudioController(
        { file: { buffer: input.audio } } as any,
        {} as any
      )
    ),

  processTextCommand: protectedProcedure
    .input(z.object({ command: z.string() }))
    .mutation(({ input }) =>
      processTextCommand({ body: input } as any, {} as any)
    ),
});

export type AppRouter = typeof appRouter;
