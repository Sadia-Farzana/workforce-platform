# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj for caching
COPY AuditWorker/AuditWorker.csproj ./AuditWorker/
RUN dotnet restore ./AuditWorker/AuditWorker.csproj

# Copy rest of source
COPY . .

# Build + publish
WORKDIR /src/AuditWorker
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/runtime:10.0
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "AuditWorker.dll"]