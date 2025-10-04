# syntax=docker/dockerfile:1
ARG BASE_IMAGE=node:22
ARG PNPM_VERSION=10.18.0

FROM "${BASE_IMAGE}" AS pnpm-stage

SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

ARG PNPM_VERSION
RUN <<EOF
  corepack enable pnpm
  corepack install --global "pnpm@${PNPM_VERSION}"
EOF


FROM pnpm-stage AS fetch-stage

WORKDIR /work
COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml /work/

ENV NPM_CONFIG_STORE_DIR=/pnpm-store
RUN pnpm fetch --prod


FROM pnpm-stage AS runtime-stage

ENV NPM_CONFIG_STORE_DIR=/pnpm-store
COPY --from=fetch-stage /pnpm-store /pnpm-store

RUN <<EOF
  mkdir -p /work
  chown -R 1000:1000 /work
EOF

WORKDIR /work
USER "1000:1000"

COPY ./package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml /work/
RUN pnpm install --recursive --offline --prod

COPY ./gatsby-config.ts ./gatsby-node.ts /work/
COPY ./static /work/static
COPY ./src /work/src

CMD [ "pnpm", "run", "build" ]
