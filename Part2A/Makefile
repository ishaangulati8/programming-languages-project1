.PHONY: clean run install build
run: 
	@node index.js $(json)
clean:
	rm -rf *.sql *.dsl node_modules

node_modules: package.json
	npm install --silent

install: node_modules

build: install
