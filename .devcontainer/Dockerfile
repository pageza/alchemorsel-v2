FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install additional development tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    wget \
    postgresql-client \
    redis-tools \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install Docker CLI
RUN curl -fsSL https://get.docker.com/builds/Linux/x86_64/docker-latest.tgz | tar -xzC /usr/local/bin --strip=1 docker/docker

# Install Docker Compose
RUN curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose 