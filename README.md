# Quarks Web

Quarks Web is a website in which SuperCollider extensions (called Quarks) from the [official Quarks repository](https://github.com/supercollider-quarks/quarks) are listed and can be searched.

## Development

### Website development

Install Node.js (tested with version 18), check out the repo and run

```shell
npm install
npm run dev
```

### Update Quarks data

As this is a static website we need to update the website build from time to time.
We obtain the information from each Quark by downloading its repository and transforming its Quark file (if present) to a JSON file which then will all be written into a single JSON file which will be used as data for the website.

#### Locally

Be aware that we are executing a lot of quark files on your local machine, making it a security risk.
Install node and all necessary dependencies for the script via

```shell
npm install
```

After this make sure you have `sclang` available in your PATH variable.
If not, you can also specify it via an environment variable, for macOS e.g.

```shell
export SCLANG_PATH=/Applications/SuperCollider.app/Contents/MacOS/sclang
```

After this run in the same shell the command

```shell
make build_index
```

which will download or update all repos and build the updated JSON file into `src/assets/quarks.json`.

#### Using docker container

It is also possible to run the build process within a docker container by running

```shell
make build_index_docker
```

which will replace the file `/src/assets/quarks.json`.
Note that this process will take around 15 minutes because we need to compile SuperCollider and also download every Quark repository.

## License

GPL-2.0
