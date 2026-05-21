# ── Build stage ──────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files first (NuGet restore cache-friendly)
COPY SkinVision.slnx .
COPY SkinVision.API/SkinVision.API.csproj SkinVision.API/
COPY SkinVision.Application/SkinVision.Application.csproj SkinVision.Application/
COPY SkinVision.Domain/SkinVision.Domain.csproj SkinVision.Domain/
COPY SkinVision.Infrastructure/SkinVision.Infrastructure.csproj SkinVision.Infrastructure/

RUN dotnet restore SkinVision.API/SkinVision.API.csproj

# Copy everything else and publish
COPY SkinVision.API/ SkinVision.API/
COPY SkinVision.Application/ SkinVision.Application/
COPY SkinVision.Domain/ SkinVision.Domain/
COPY SkinVision.Infrastructure/ SkinVision.Infrastructure/

RUN dotnet publish SkinVision.API/SkinVision.API.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# ── Runtime stage ────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Create uploads directory for local file storage
RUN mkdir -p /app/wwwroot/uploads

EXPOSE 5163
ENV ASPNETCORE_URLS=http://+:5163
ENV ASPNETCORE_ENVIRONMENT=Docker

ENTRYPOINT ["dotnet", "SkinVision.API.dll"]
