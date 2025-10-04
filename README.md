# aoirint-blog-gatsby2

## Dependencies

- Node 22
- pnpm 10

```shell
pnpm install --frozen-lockfile
```

## Usage

### Add articles from another repository

Create `contents` directory on the repository root.
Then add markdown files to the `contents/src` directory.

```shell
git clone https://github.com/aoirint/aoirint-blog-contents.git contents
```

### Preview

```shell
pnpm run develop
```

### Deploy

```shell
pnpm run clean && pnpm run build && pnpm run deploy
```
