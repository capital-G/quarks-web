npm_setup:
	npm install

local: npm_setup
	npm run dev

build:
	npm run build

build_index:
	npm run buildIndex

build_index_docker:
	docker build -t quarks-web .
	$(eval DOCKER_ID := $(shell docker create quarks-web))
	@echo hi $(DOCKER_ID)
	docker cp $(DOCKER_ID):/home/quark-web/src/assets/quarks.json ./src/assets/quarks.json
	docker rm -v $(DOCKER_ID)

clean:
	rm -rf ./node_modules
	rm -rf ./dist
	rm ./src/assets/quarks.json
