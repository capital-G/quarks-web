npm_setup:
	npm install

local: npm_setup
	npm run dev

build:
	npm run build

build_index:
	npm run buildIndex

build_index_docker:
	./build_json_in_docker.sh

clean:
	rm -rf ./node_modules
	rm -rf ./dist
	rm ./src/assets/quarks.json
