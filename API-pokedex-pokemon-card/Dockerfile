FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000
EXPOSE 5001

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["API-pokedex-pokemon-card.csproj", "./"]
RUN dotnet restore "./API-pokedex-pokemon-card.csproj"
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
# COPY --from=build /src/Assets ./Assets
ENTRYPOINT ["dotnet", "API-pokedex-pokemon-card.dll"]
