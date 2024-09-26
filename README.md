# core

## Development Requirements

- Node.js >= 14
- Yarn >= 1.22
- Vagrant >= 2 (for generator)
- Github CLI (use for downloading optimizer for generator, optional)

## Development

1. run `yarn install` to install dependencies
2. goto the subproject under the `packges` directory

## Generator Development

### Prepare

1. run `yarn install`
2. run `git submodule update --init`
3. run `yarn build` under `packages/templates`
4. grab `Generator .env` content from 1Password and place it under `packages/generator`
5. run `gh release -R storipress/optimizer download --pattern optimizer-[arch]-unknown-linux-gnu` under `packages/generator`
   (optional, replace the `[arch]` based on your computer arch, for Intel CPU is `x86_64`, for Apple Silicon is `aarch64`)

### Start env

1. run `vagrant up --provider=docker` in the project root: it will start a docker env in background
2. run `vagrant docker-exec -t -- bash`: it will give you a shell to access dev env

## Some general rules:

### If you see `graphql.config.yml` at the subproject root

Execute the follow command before running the build script:

```shell
$ yarn gql-gen
```

This will generate the GraphQL type stub with [`graphql-code-generator`](https://graphql-code-generator.com)

### Start development server

Storipress' project is set up with either `vue-cli` or `nuxt`

- If you see `nuxt.config.js`, use `yarn dev`
- If you see `vue.config.js`, use `yarn serve`
- In all other cases, you should `yarn serve`. Please reference `README.md` under the subproject root for more info

## Subproject Overview

### Front-end Related

| name             | setup with | description                                                  |
| ---------------- | ---------- | ------------------------------------------------------------ |
| editor-component | N/A        | the core ProseMirror editor component                        |
| builder          | vite       | the builder front end                                        |
| elements         | N/A        | elements used in builder + generator for displaying articles |
| shared           | N/A        | shared codes                                                 |
| shared-typedefs  | N/A        | shared type definition of third-party code for TS            |

### Other Important Parts

- `generator`: the static site generator
