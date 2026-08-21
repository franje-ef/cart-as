# Cartas.Web

A real-time card game ("Romi") built with ASP.NET Core MVC + SignalR, PIXI.js on the client.

## Stack

- **.NET 10**, SDK-style project (`Cartas.Web/Cartas.Web.csproj`), ASP.NET Core MVC + SignalR.
- Migrated 2026-08-21 from .NET Framework 4.6.1 (ASP.NET MVC 5 + classic `Microsoft.AspNet.SignalR`). This was a full rewrite, not a retarget — `System.Web` and `Microsoft.AspNet.SignalR` don't exist on modern .NET.
- TypeScript client (`Scripts_ts/`) compiled to `wwwroot/js/game/*.js`.
- PIXI.js for the game board/canvas rendering, GSAP for animation, `@microsoft/signalr` for real-time transport, jQuery + Bootstrap for the surrounding chrome (lobby, registration forms, modals).

## Structure

```
Cartas.Web/
  Program.cs                 # hosting, routing, SignalR mapping — no Startup.cs/Global.asax
  Controllers/                # GameController, PlayerController, ErrorController
  Domain/
    Logic/App.cs              # static in-memory list of active Game objects — no persistence layer
    Logic/Game.cs              # core game rules (pure C#, no framework deps)
    PlayerService.cs           # reads/writes the player identity cookie
  Hubs/GameHub.cs              # SignalR hub — one hub method per client action
  Models/                      # MVC view models
  Views/                       # Razor views (Game/Index, Game/Play, Player/Register)
  wwwroot/                     # static assets: Content/ (css, img, fonts), Scripts/ (vendored JS libs), js/game/ (compiled TS, gitignored)
  Scripts_ts/                  # TypeScript source for the game client
```

## Game state

`Domain/Logic/App.cs` holds `Games` as a plain `static List<Game>` — no database, no DI-registered singleton. This is intentional: the app never had a persistence layer, and the game state doesn't need to survive a process restart. Don't introduce a database or convert this to DI-managed state unless a real requirement shows up; it'd be a bigger change than the app currently needs.

**Deployment implication**: this state (and SignalR's connection groups) lives in a single process's memory with no backplane. If this ever runs as more than one container replica, requests/connections landing on different replicas won't see each other's games or players. See "Containers / deployment" below.

## Building the TypeScript client

`Cartas.Web.csproj` has an MSBuild target that runs `npm install` then `npx tsc -p Scripts_ts` before every build, emitting to `wwwroot/js/game/*.js` (gitignored — regenerated on build, not committed).

**Do not** switch this to the `Microsoft.TypeScript.MSBuild` NuGet package — it was tried during the migration and silently compiled nothing on this SDK-style project (build succeeded, zero JS emitted). The npm/tsc target is the one that's actually verified to work.

`Views/Game/Play.cshtml` references each compiled `~/js/game/*.js` file individually via `<script>` tags (in a fixed order) since there's no bundler in ASP.NET Core equivalent to the old `System.Web.Optimization`. None of the game TS classes have top-level side effects or cross-file inheritance, so the exact tag order among them doesn't matter — but if that ever changes, order will start to matter.

## SignalR

- Hub is mapped at `/hubs/game` (`Program.cs`); the TS client connects via `new signalR.HubConnectionBuilder().withUrl(...)`, passing `PlayerId`/`GameId` as query string params (mirrors the old `Context.QueryString` pattern — read server-side via `Context.GetHttpContext().Request.Query[...]`).
- `@microsoft/signalr`'s browser build is vendored at `wwwroot/Scripts/signalr.min.js` (copied from `node_modules/@microsoft/signalr/dist/browser/`, loaded as a plain global-exposing `<script>` tag — not consumed as an npm/ES module). Re-copy it if the `@microsoft/signalr` version in `package.json` changes.
- **Property casing gotcha**: ASP.NET Core SignalR's default JSON hub protocol camelCases property names, but the TS client reads PascalCase fields inherited from the pre-migration code (`card.Num`, `card.Suit`, `player.PlayerId`, `player.PlayerName`, `player.Avatar`, `player.Seat`, `player.WinCount`). This is fixed in `Program.cs`:
  ```csharp
  builder.Services.AddSignalR().AddJsonProtocol(options =>
  {
      options.PayloadSerializerOptions.PropertyNamingPolicy = null;
  });
  ```
  Don't remove this — without it, every hub-delivered object comes back with lowercase-first properties and client code silently reads `undefined`.
- Hub methods that broadcast to other clients are `async Task` and use `Clients.X.SendAsync("methodName", args)` (Core SignalR has no dynamic `Clients.X.methodName(args)` like the old library).

## Cookies

`PlayerService` stores player identity (name, avatar, generated player ID) as a single JSON-encoded value in one cookie (`Username_avatar`), via `System.Text.Json`. This replaces the old .NET Framework `HttpCookie`'s multi-value `cookie.Values[key]` sub-dictionary, which doesn't exist in ASP.NET Core (`IResponseCookies`/`IRequestCookieCollection` cookies are single string values). Same cookie name and effective data as before — just a different encoding on the wire.

## Dropped in the migration

- Application Insights (`Microsoft.ApplicationInsights.*`) — was unconfigured template boilerplate with no instrumentation key, confirmed unused before removal. Not migrated to `Microsoft.ApplicationInsights.AspNetCore`.
- `System.Web.Optimization` bundling/minification — dropped in favor of plain `<script>`/`<link>` tags; app is small enough that this doesn't matter for load time.

## Containers / deployment

`Dockerfile` (repo root) is a multi-stage build:
- **Build stage** (`mcr.microsoft.com/dotnet/sdk:10.0`): installs Node.js 20 via NodeSource (needed because `dotnet publish` triggers the `CompileTypeScript` MSBuild target, which shells out to `npm`/`tsc`), then runs `dotnet publish Cartas.Web/Cartas.Web.csproj -c Release -o /app/publish`.
- **Runtime stage** (`mcr.microsoft.com/dotnet/aspnet:10.0`): just the published output, no SDK/Node/npm. Listens on plain HTTP port `8080` (`ASPNETCORE_HTTP_PORTS=8080` — Azure Container Apps and most platforms terminate TLS at their own ingress, so the container itself only needs HTTP). Runs as the image's built-in non-root `app` user.

`.dockerignore` excludes `bin/`/`obj/`/`wwwroot/js/`/`node_modules/` so the build context doesn't ship stale host-platform build output into the image — the container does its own restore/publish/TS-compile from source.

**Build and run locally:**
```bash
docker build -t cartas-web .
docker run -p 8080:8080 cartas-web
```

**Deploying to Azure Container Apps**: the deploy itself (`az acr build`, `az containerapp create/update`) needs to be run by a human with the right Azure context — it wasn't run as part of this setup. Roughly:
```bash
az acr build --registry <registry> --image cartas-web:latest .
az containerapp create \
  --name cartas-web --resource-group <rg> --environment <env> \
  --image <registry>.azurecr.io/cartas-web:latest \
  --target-port 8080 --ingress external \
  --min-replicas 1 --max-replicas 1
```

**Important**: keep `--min-replicas`/`--max-replicas` at `1` (no autoscaling) unless the in-memory game state described above is moved to something shared across instances (e.g. Redis + a SignalR backplane via `Microsoft.AspNetCore.SignalR.StackExchangeRedis`). Scaling this out today would silently split games/players across replicas that can't see each other.

The Dockerfile has not been build-tested — this sandbox has no Docker daemon available. Run `docker build .` locally before deploying to catch anything environment-specific (proxy/network access to NodeSource and npm registry during build, etc.).

**Visual Studio Docker Compose project**: `docker-compose.dcproj`, `docker-compose.yml`, and `docker-compose.override.yml` (repo root, referenced from `Cartas.sln`) replicate what VS's own "Add > Container Orchestrator Support > Docker Compose" wizard generates, so F5-with-Docker debugging works from the IDE. They point at the same root `Dockerfile`. `docker-compose.override.yml` just sets `ASPNETCORE_ENVIRONMENT=Development` and publishes port `8080` — it doesn't add HTTPS/dev-cert mounting like the VS default template does, to stay consistent with the HTTP-only container described above. `dotnet build`/CLI builds silently skip the `.dcproj` (it uses a VS-only MSBuild SDK); it only matters when opened in Visual Studio. After adding it, open the solution in VS and right-click `docker-compose` → **Set as Startup Project** if it isn't already.

## Verification note

The game's PIXI.js canvas gameplay (card dragging, animations, reactions) has not been visually verified by an agent — canvas rendering can't be inspected via DOM/text tools, and this environment's browser pane can't produce screenshots. Registration, lobby, game creation/joining, and the SignalR WebSocket connection were all verified end-to-end. Do a manual click-through of actual card play if you touch `Hubs/GameHub.cs` or `Scripts_ts/game/gameHub*.ts` again.
