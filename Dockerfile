# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Node.js is required to compile the TypeScript game client: the
# CompileTypeScript MSBuild target in Cartas.Web.csproj shells out to
# npm/tsc as part of `dotnet publish`.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY . .
RUN dotnet publish Cartas.Web/Cartas.Web.csproj -c Release -o /app/publish

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Azure Container Apps (and most container platforms) expect a single
# plain-HTTP port; TLS is terminated at the platform's ingress.
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

USER app
ENTRYPOINT ["dotnet", "Cartas.Web.dll"]
