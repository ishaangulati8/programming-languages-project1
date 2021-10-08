.PHONY: clean run install build delete
run: 
	@node index.js $(json)
clean:
	rm -rf *sql *.dsl node_modules

node_modules: package.json
	npm install

install: node_modules

build: install

delete: 
	@node delete.js $(file)
